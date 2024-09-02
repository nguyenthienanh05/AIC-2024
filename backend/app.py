from utils.retrieval_load_index import FusionRetriever
from tqdm import tqdm
from llama_index.core.schema import TextNode, Document
from flask import Flask, request, jsonify
import time
from elasticsearch import Elasticsearch
from llama_index.core import StorageContext
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.core import VectorStoreIndex, Settings
from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core import QueryBundle
import os
import traceback
import sys
from llama_index.vector_stores.elasticsearch import ElasticsearchStore
from llama_index.core.storage.docstore import SimpleDocumentStore
from collections import defaultdict
import re
from flask_cors import CORS
from dotenv import load_dotenv
import asyncio
from asgiref.wsgi import WsgiToAsgi
from hypercorn.config import Config
from hypercorn.asyncio import serve


load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/query": {
    "origins": ["http://localhost:5173", "http://localhost:1", "https://ai-challenge-2024-431017.web.app"],
    "methods": ["POST"],
    "allow_headers": ["Content-Type"]
}})

# Set your Google API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print(GOOGLE_API_KEY)
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize Gemini LLM and Embedding models
llm = Gemini(model="models/gemini-1.5-flash", api_key=GOOGLE_API_KEY)
embed_model = GeminiEmbedding(model_name="models/text-embedding-004", api_key=GOOGLE_API_KEY)

# Set the Gemini LLM as the default LLM in Settings
Settings.llm = llm
Settings.embed_model = embed_model

# Global variables to hold the loaded index and retrievers
loaded_index = None
query_engine = None
fusion_retriever = None


def load_index():
    global loaded_index, query_engine, fusion_retriever
    print("Loading the saved index from Elasticsearch...")

    # Create ElasticSearch vector store
    es_url = os.getenv("ELASTICSEARCH_URL")
    es_user = os.getenv("ELASTICSEARCH_USER")
    es_password = os.getenv("ELASTICSEARCH_PASSWORD")

    # Modify the ElasticsearchStore initialization
    vector_store = ElasticsearchStore(
        # es_client=es_client,
        es_url=es_url,
        index_name="aic_index_test",
        es_user=es_user,
        es_password=es_password,
        distance_strategy="COSINE",
        content_field="content",  # Specify the field to store document content
        metadata_field="metadata"  # Specify the field to store metadata
    )

    docstore = SimpleDocumentStore.from_persist_dir("./utils/saved_index")

    storage_context = StorageContext.from_defaults(
        persist_dir="./utils/storage",
        vector_store=vector_store
    )

    loaded_index = VectorStoreIndex.from_vector_store(vector_store, storage_context=storage_context)

    print(loaded_index.vector_store)

    print(f"Number of documents in loaded index: {len(docstore.docs)}")

    # Create retrievers
    print("Creating retrievers...")
    vector_retriever = loaded_index.as_retriever(similarity_top_k=50)
    bm25_retriever = BM25Retriever.from_defaults(docstore=docstore, similarity_top_k=50)

    # Create FusionRetriever and QueryEngine
    print("Creating FusionRetriever and QueryEngine...")
    fusion_retriever = FusionRetriever([vector_retriever, bm25_retriever], similarity_top_k=50)
    query_engine = RetrieverQueryEngine(retriever=fusion_retriever)

    print("Index loaded successfully from Elasticsearch.")


@app.route("/")
def hello_world():
    """Example Hello World route."""
    try:
        load_index()  # Load the index once when the application starts
    except Exception as e:
        app.logger.error(f"Failed to load index: {str(e)}")
        app.logger.error(traceback.format_exc())
    name = os.environ.get("NAME", "Worldsdklcvgj")
    return f"Hellosdfasd {name}!!!!!!!!!!!!"


@app.route('/query', methods=['POST'])
async def perform_query():
    data = request.get_json()
    query = data.get('query')
    print(query)

    print(f"Received query: {query}")

    # Process the query here...
    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        start_time = time.time()
        query_bundle = QueryBundle(query)
        final_results = await fusion_retriever._aretrieve(query_bundle)
        fused_results = ""

        print("response")

        for final_result in final_results:
            fused_results += f"Node ID: {final_result.id_}, Source: {final_result.node.metadata.get('source')}, Fused Score: {final_result.score}\n"

        print(fused_results)
        end_time = time.time()
        print(f"Time taken to execute query: {end_time - start_time:.2f} seconds")

        pattern = r'Node ID: \S+, Source: response_(L0\d_V\d+)_frame_(\d{4})_(\d{8})_(\d+)_(\d+)\.png\.txt, Fused Score: (\d+\.\d+)'
        data = defaultdict(list)

        matches = re.findall(pattern, fused_results)

        for match in matches:
            video_id = match[0]
            frame_id = f"{video_id}_frame_{match[1]}_{match[2]}"
            fused_score = float(match[5])
            path = f"{video_id}/scene/{frame_id}.png"

            data[video_id].append({
                "path": path,
                "fusedScore": fused_score,
            })

        # Sort videos based on the fused score of the first frame
        sorted_data = dict(
            sorted(data.items(), key=lambda item: item[1][0]['fusedScore'], reverse=True)
        )

        output_object = dict(sorted_data)
        print(output_object)
        return jsonify(output_object)
    except Exception as e:
        app.logger.error(f"An error occurred while processing the query: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred. Please check the logs for more details."}), 500


if __name__ == '__main__':
    try:
        load_index()  # Load the index once when the application starts
    except ValueError as ve:
        print(f"Error: {str(ve)}")
        print("Please run the data ingestion process to populate Elasticsearch before starting the application.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred while loading the index: {str(e)}")
        print(traceback.format_exc())
        sys.exit(1)
    
    asgi_app = WsgiToAsgi(app)
    config = Config()
    config.bind = ["0.0.0.0:8080"]
    asyncio.run(serve(asgi_app, config))