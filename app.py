from flask import Flask, request, jsonify
from google.cloud import storage
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

from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app, resources={r"/query": {
    "origins": ["http://localhost:5173"],
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

# Load the saved index
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


def cors_configuration(bucket_name):
    # """Set a bucket's CORS policies configuration."""
    # bucket_name = "your-bucket-name"

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    bucket.cors = [
        {
            "origin": ["*"],
            "responseHeader": [
                "Content-Type",
                "x-goog-resumable"],
            "method": ['PUT', 'POST'],
            "maxAgeSeconds": 3600
        }
    ]
    bucket.patch()

    print(f"Set CORS policies for bucket {bucket.name} is {bucket.cors}")
    return bucket


def extract_fused_results(result_string):
    start_marker = "Fused and reranked results:\n"
    end_marker = "Top-k Document Contents:\n"
    
    start_index = result_string.find(start_marker)
    if start_index == -1:
        return "Start marker not found"
    
    start_index += len(start_marker)
    
    end_index = result_string.find(end_marker, start_index)
    if end_index == -1:
        return "End marker not found"
    
    extracted_content = result_string[start_index:end_index].strip()
    return extracted_content


@app.route('/query', methods=['POST'])
def perform_query():
    data = request.get_json()
    query = data.get('query')
    
    print(f"Received query: {query}")

    # Process the query here...
    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Step 1: Capture the stdout
        buffer = io.StringIO()
        with redirect_stdout(buffer):
            # Step 2: Call query_engine.query
            response = query_engine.query(query)

        # Step 3: Get the captured output as a string
        output = buffer.getvalue()

        # Step 4: Extract the relevant part of the output
        start_marker = "Fused and reranked results:"
        end_marker = "Top-k Document Contents:"
        start_index = output.find(start_marker)
        end_index = output.find(end_marker, start_index)

        if start_index != -1 and end_index != -1:
            fused_results = output[start_index + len(start_marker):end_index].strip()
        else:
            fused_results = "Fused results not found in the output."

        return jsonify(fused_results)
    except Exception as e:
        app.logger.error(f"An error occurred while processing the query: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred. Please check the logs for more details."}), 500



if __name__ == '__main__':
    app.run(debug=True)
