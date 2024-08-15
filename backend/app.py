from flask import Flask, request, jsonify
# from google.cloud import storage
from typing import List
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.core import VectorStoreIndex, Settings
from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core import QueryBundle
from llama_index.core.schema import NodeWithScore
from llama_index.core.retrievers import BaseRetriever
from llama_index.core.schema import TextNode, Document, NodeWithScore
from utils.retrieval_load_index import FusionRetriever
import os
import traceback
import logging
import io
import sys
from contextlib import redirect_stdout
from collections import defaultdict
import re
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app, resources={r"/query": {
    "origins": ["http://localhost:5173", "http://localhost:1", "https://ai-challenge-2024-431017.web.app" ],
    "methods": ["POST"],
    "allow_headers": ["Content-Type"]
}})

# Set your Google API key
GOOGLE_API_KEY = "AIzaSyBhJO0pCWWtobW17U2L5QX3avujp0Vf9DM"
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
    print("Loading the saved index...")
    storage_context = StorageContext.from_defaults(persist_dir="./utils/saved_index")
    loaded_index = load_index_from_storage(storage_context)

    # Create retrievers 
    print("Creating retrievers...")
    vector_retriever = loaded_index.as_retriever(similarity_top_k=50)
    bm25_retriever = BM25Retriever.from_defaults(docstore=loaded_index.docstore, similarity_top_k=50)

    # Create FusionRetriever and QueryEngine
    print("Creating FusionRetriever and QueryEngine...")
    fusion_retriever = FusionRetriever([vector_retriever, bm25_retriever], similarity_top_k=50)
    query_engine = RetrieverQueryEngine(retriever=fusion_retriever)


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
def perform_query():
    data = request.get_json()
    query = data.get('query')
    
    print(f"Received query: {query}")

    # Process the query here...
    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # # Step 1: Capture the stdout
        # buffer = io.StringIO()
        # with redirect_stdout(buffer):
        #     # Step 2: Call query_engine.query
        #     response = query_engine.query(query)

        query_bundle = QueryBundle(query)
        final_results = fusion_retriever._retrieve(query_bundle)
        fused_results = ""

        for final_result in final_results:
            fused_results += f"Node ID: {final_result.id_}, Source: {final_result.node.metadata.get('source')}, Fused Score: {final_result.score}\n"

        # Step 3: Get the captured output as a string
        # output = buffer.getvalue()

        # Step 4: Extract the relevant part of the output
        # start_marker = "Fused and reranked results:"
        # end_marker = "Top-k Document Contents:"
        # start_index = output.find(start_marker)
        # end_index = output.find(end_marker, start_index)

        # if start_index != -1 and end_index != -1:
        #     fused_results = output[start_index + len(start_marker):end_index].strip()
        # else:
        #     fused_results = "Fused results not found in the output."

        print(fused_results)
        pattern = r'Node ID: \S+, Source: response_(L02_V\d+)_frame_(\d{4})_(\d{8})\.png\.txt, Fused Score: (\d+\.\d+)'
        data = defaultdict(list)
        
        matches = re.findall(pattern, fused_results)

        for match in matches:
            video_id = match[0]
            frame_id = f"{video_id}_frame_{match[1]}_{match[2]}"
            fused_score = float(match[3])
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
    except Exception as e:
        app.logger.error(f"Failed to load index: {str(e)}")
        app.logger.error(traceback.format_exc())
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))