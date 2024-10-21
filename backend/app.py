from utils.retrieval_load_index import FusionRetriever, set_vector_weight, set_bm25_weight
from tqdm import tqdm
from llama_index.core.schema import TextNode, Document
from flask import Flask, request, jsonify
import time
# from elasticsearch import Elasticsearch
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
from llama_index.vector_stores.milvus import MilvusVectorStore
# from llama_index.vector_stores.elasticsearch import ElasticsearchStore
from llama_index.core.storage.docstore import SimpleDocumentStore
from collections import defaultdict
import re
from flask_cors import CORS
from dotenv import load_dotenv
import asyncio
from asgiref.wsgi import WsgiToAsgi
from hypercorn.config import Config
from hypercorn.asyncio import serve
from groq import Groq
from elasticsearch import Elasticsearch
import google.generativeai as genai


load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],  # Add your frontend URL
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})


# Set your Google API key
GOOGLE_API_KEY = "AIzaSyBKE1DyZA-Eh_FBYc0D-cptJyGqHxljBl8"

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

# Initialize Milvus vector store
vector_store = MilvusVectorStore(
    uri="https://in01-6bc09d4d9f744a7.gcp-asia-southeast1.vectordb.zillizcloud.com:443",
    token="dec231063ca5597f1d08c044014f913f90d33081321531cc927284191475e57ed630784faa08ce8afacbdcac5fd76959a4b0574b",
    collection_name="ke_giet_chet_aic2024"
)

# Create StorageContext with vector store
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Create VectorStoreIndex
index = VectorStoreIndex.from_vector_store(
    vector_store,
    storage_context=storage_context,
)

def load_index_ownData_fusion():
    global loaded_index, query_engine, fusion_retriever
    # print("Loading the saved index from Milvus...")
    # Load the document store from the saved directory
    print("Loading document store for ownData_fusion...")
    docstore = SimpleDocumentStore.from_persist_dir("./utils/saved_index_ownData_fusion")

    print("Loading vector store for ownData_fusion...")
    vector_store = MilvusVectorStore(uri="https://in01-6bc09d4d9f744a7.gcp-asia-southeast1.vectordb.zillizcloud.com:443",
                                     token="dec231063ca5597f1d08c044014f913f90d33081321531cc927284191475e57ed630784faa08ce8afacbdcac5fd76959a4b0574b",
                                     overwrite=False,
                                     collection_name="ke_giet_chet_aic2024")

    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    loaded_index = VectorStoreIndex.from_vector_store(vector_store, storage_context=storage_context)

    print(f"Number of documents in loaded index: {len(docstore.docs)}")

    # Create retrievers
    print("Creating retrievers for ownData_fusion...")
    vector_retriever = loaded_index.as_retriever(similarity_top_k=200)
    bm25_retriever = BM25Retriever.from_defaults(docstore=docstore, similarity_top_k=200)

    # Create FusionRetriever and QueryEngine
    print("Creating FusionRetriever for ownData_fusion...")
    fusion_retriever = FusionRetriever([vector_retriever, bm25_retriever], similarity_top_k=200)
    # query_engine = RetrieverQueryEngine(retriever=fusion_retriever)

def load_index_orgData_fusion():
    global loaded_index2, query_engine2, fusion_retriever2
    print("Loading document store for orgData_fusion...")
    docstore = SimpleDocumentStore.from_persist_dir("./utils/saved_index_orgData_fusion")

    print("Loading vector store for orgData_fusion...")
    vector_store = MilvusVectorStore(uri="https://in01-6bc09d4d9f744a7.gcp-asia-southeast1.vectordb.zillizcloud.com:443",
                                     token="dec231063ca5597f1d08c044014f913f90d33081321531cc927284191475e57ed630784faa08ce8afacbdcac5fd76959a4b0574b",
                                     overwrite=False,
                                     collection_name="ke_giet_chet_aic2024")

    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    loaded_index2 = VectorStoreIndex.from_vector_store(vector_store, storage_context=storage_context)

    print(f"Number of documents in loaded index: {len(docstore.docs)}")

    # Create retrievers
    print("Creating retrievers for orgData_fusion...")
    vector_retriever = loaded_index2.as_retriever(similarity_top_k=200)
    bm25_retriever = BM25Retriever.from_defaults(docstore=docstore, similarity_top_k=200)

    # Create FusionRetriever and QueryEngine
    print("Creating FusionRetriever for orgData_fusion...")
    fusion_retriever2 = FusionRetriever([vector_retriever, bm25_retriever], similarity_top_k=200)
    # query_engine2 = RetrieverQueryEngine(retriever=fusion_retriever2)

def semantic_search(query_text, top_k=16000):
    retriever = index.as_retriever(similarity_top_k=top_k)
    nodes = retriever.retrieve(query_text)
    return nodes

def enhanced_search_v1(scene_description, keywords, index_name="docstore"):
    query = {
        "query": {
            "bool": {
                "should": [
                    {"match_phrase": {"text": keyword}} for keyword in keywords
                ] + [
                    {"match": {"text": keyword}} for keyword in keywords
                ],
                "minimum_should_match": 3  # Giảm số lượng từ khóa cần thiết
            }
        },
        "highlight": {
            "fields": {
                "text": {"number_of_fragments": 3}
            }
        }
    }
    
    response = es.search(index=index_name, body=query, size=10)
    
    structured_results = []
    for hit in response['hits']['hits']:
        structured_results.append({
            'source': hit['_source']['metadata']['source'],
            'score': hit['_score'],
            'highlight': ' ... '.join(hit['highlight']['text']) if 'highlight' in hit else hit['_source']['text'][:200]
        })
    
    return structured_results

def enhanced_search_v2(keyword_groups, allowed_sources, index_name="docstore"):
    query = {
        "query": {
            "bool": {
                "must": [],
                "should": []
            }
        },
        "highlight": {
            "fields": {
                "text": {"number_of_fragments": 3}
            }
        }
    }
    
    for group in keyword_groups:
        if len(group) == 1:
            query["query"]["bool"]["should"].extend([
                {"match_phrase": {"text": group[0]}},
                {"match": {"text": group[0]}}
            ])
        else:
            synonym_query = {
                "bool": {
                    "should": [
                        {"match_phrase": {"text": word}} for word in group
                    ] + [
                        {"match": {"text": word}} for word in group
                    ]
                }
            }
            query["query"]["bool"]["should"].append(synonym_query)
    
    query["query"]["bool"]["minimum_should_match"] = 1
    
    if allowed_sources:
        query["query"]["bool"]["must"].append({
            "terms": {"metadata.source.keyword": allowed_sources}
        })
    
    response = es.search(index=index_name, body=query, size=100)
    return response['hits']['hits']

@app.route("/")
def hello_world():
    """Example Hello World route."""
    return f"Hello World!!!!!!!!!!!!"

@app.route('/ownData-Fusion', methods=['POST'])
async def perform_query_ownDatsa_Fusion():
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
        final_results = fusion_retriever._retrieve(query_bundle)
        fused_results = ""

        # print("response")

        for final_result in final_results:
            fused_results += f"Node Source: {final_result.node.metadata.get('source')}, Fused Score: {final_result.score}\n"

        # print(fused_results)
        end_time = time.time()
        print(f"Time taken to execute query: {end_time - start_time:.2f} seconds")
        print("OWNDATA-FUSION SUCCESSFUL")
        # pattern = r'Node ID: \S+, Source: response_(L\d+_V\d+)_frame_(\d{4})_(\d{8})_(\d+)_(\d{4})\.png\.txt, Fused Score: (\d+\.\d+)'
        pattern = r'(?:Node ID: \S+, Source: )?(?:([\w\d]+/description/))?response_(L\d+_V\d+)_frame_(\d{4})_(\d{8})_(\d+)_(\d{4})\.png\.txt, Fused Score: (\d+\.\d+)'
        data = defaultdict(list)

        # Extract matches using the regex pattern
        matches = re.findall(pattern, fused_results)

        # Process matches and populate the data dictionary
        for match in matches:
            video_id = match[1]
            frame_id = f"{video_id}_frame_{match[2]}_{match[3]}"
            frame_index = match[4]
            fps = int(match[5]) / 100  # Convert fps to float
            fused_score = float(match[6])
            path = f"{video_id}/scene/{frame_id}_{frame_index}_{match[5]}.png"

            data[video_id].append({
                "path": path,
                "fusedScore": fused_score,
                "frameIndex": frame_index,
                "fps": fps
            })

        # Sort videos based on the fused score of the first frame
        sorted_data = dict(
            sorted(data.items(), key=lambda item: item[1][0]['fusedScore'], reverse=True)
        )

        output_object = dict(sorted_data)
        # print(output_object)
        return jsonify(output_object)
    except Exception as e:
        app.logger.error(f"An error occurred while processing the query: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred. Please check the logs for more details."}), 500

@app.route('/orgData-Fusion', methods=['POST'])
async def perform_query_orgData_Fusion():
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
        final_results = fusion_retriever2._retrieve(query_bundle)
        fused_results = ""

        # print("response")

        for final_result in final_results:
            fused_results += f"Node Source: {final_result.node.metadata.get('source')}, Fused Score: {final_result.score}\n"

        # print(fused_results)
        end_time = time.time()
        print(f"Time taken to execute query: {end_time - start_time:.2f} seconds")
        print("ORGDATA-FUSION SUCCESSFUL")
        # pattern = r'Node ID: \S+, Source: response_(L\d+_V\d+)_frame_(\d{4})_(\d{8})_(\d+)_(\d{4})\.png\.txt, Fused Score: (\d+\.\d+)'
        pattern = r'(?:Node ID: \S+, Source: )?(?:([\w\d]+/description/))?response_(L\d+_V\d+)_frame_(\d{4})_(\d{8})_(\d+)_(\d{4})\.png\.txt, Fused Score: (\d+\.\d+)'
        data = defaultdict(list)

        # Extract matches using the regex pattern
        matches = re.findall(pattern, fused_results)

        # Process matches and populate the data dictionary
        for match in matches:
            video_id = match[1]
            frame_id = f"{video_id}_frame_{match[2]}_{match[3]}"
            frame_index = match[4]
            fps = int(match[5]) / 100  # Convert fps to float
            fused_score = float(match[6])
            path = f"{video_id}/scene/{frame_id}_{frame_index}_{match[5]}.png"

            data[video_id].append({
                "path": path,
                "fusedScore": fused_score,
                "frameIndex": frame_index,
                "fps": fps
            })

        # Sort videos based on the fused score of the first frame
        sorted_data = dict(
            sorted(data.items(), key=lambda item: item[1][0]['fusedScore'], reverse=True)
        )

        output_object = dict(sorted_data)
        # print(output_object)
        return jsonify(output_object)
    except Exception as e:
        app.logger.error(f"An error occurred while processing the query: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred. Please check the logs for more details."}), 500

@app.route('/set_vector_weight', methods=['POST'])
def set_vector_weight_endpoint():
    data = request.get_json()
    weight = data.get('weight')
    if weight is None:
        return jsonify({"error": "No weight provided"}), 400
    try:
        set_vector_weight(float(weight))
        return jsonify({"message": "Vector weight updated successfully"}), 200
    except Exception as e:
        app.logger.error(f"An error occurred while setting vector weight: {str(e)}")
        return jsonify({"error": "An error occurred while setting vector weight"}), 500

@app.route('/set_bm25_weight', methods=['POST'])
def set_bm25_weight_endpoint():
    data = request.get_json()
    weight = data.get('weight')
    if weight is None:
        return jsonify({"error": "No weight provided"}), 400
    try:
        set_bm25_weight(float(weight))
        return jsonify({"message": "BM25 weight updated successfully"}), 200
    except Exception as e:
        app.logger.error(f"An error occurred while setting BM25 weight: {str(e)}")
        return jsonify({"error": "An error occurred while setting BM25 weight"}), 500
    
@app.route('/elastic-search-v1', methods=['POST'])
def perform_elastic_search_v1():
    data = request.get_json()
    scene_description = data.get('query')
    keywords = data.get('keywords')
    print(keywords)
    print(scene_description)
    if not keywords:
        return jsonify({"error": "No keywords provided"}), 400
    try:
        results = enhanced_search_v1(scene_description, keywords)
        print(results)
        return jsonify(results)
    except Exception as e:
        app.logger.error(f"An error occurred while processing the elastic search: {str(e)}")
        return jsonify({"error": "An internal server error occurred."}), 500


@app.route('/elastic-search-v2', methods=['POST'])
def perform_elastic_search_v2():
    data = request.get_json()
    query = data.get('query')
    keywords = data.get('keywords', [])

    if not query or not keywords:
        return jsonify({"error": "No query or keywords provided"}), 400

    try:
        # Perform semantic search
        milvus_results = semantic_search(query)
        allowed_sources = [f"downloaded/description/{node.metadata['source']}" for node in milvus_results if 'source' in node.metadata]

        # Prepare keyword groups
        keyword_groups = [[keyword] for keyword in keywords]

        # Perform enhanced search
        results = enhanced_search_v2(keyword_groups, allowed_sources)

        # Process and format the results
        formatted_results = []
        for hit in results:
            formatted_result = {
                "source": hit['_source']['metadata']['source'],
                "score": hit['_score'],
                "highlight": ' ... '.join(hit['highlight']['text']) if 'highlight' in hit else hit['_source']['text'][:200]
            }
            formatted_results.append(formatted_result)

        return jsonify(formatted_results)

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/generate-keywords', methods=['POST'])
def generate_keywords():
    data = request.get_json()
    query = data.get('query')
    if not query:
        return jsonify({"error": "No query provided"}), 400
    try:
        print(f"Received query: {query}")
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-pro-002")
        response = model.generate_content(f"""
Given the following description, generate a list of 10-15 highly relevant and diverse keywords for use in Elastic Search. Analyze the query deeply, considering both explicit and implicit meanings, context, and potential search intents.

Guidelines:
1. Provide a mix of specific, unique terms and more general concepts that capture the essence of the scene, action, or topic.
2. Include a balanced variety of nouns, verbs, adjectives, and short phrases (2-3 words).
3. Capture semantic meanings, not just literal matches, considering synonyms and related terms.
4. If describing a visual scene, include keywords related to visual attributes, colors, or spatial relationships.
5. Include keywords for any actions, emotions, or atmosphere implied in the description.
6. Consider domain-specific or technical terms if applicable to the context.
7. Think about why someone might be searching for this content and include relevant terms.
8. Prioritize keywords that are most likely to appear in relevant documents.
9. Avoid overly generic terms unless they are crucial to the description.
10. Rank the keywords by relevance, listing the most important ones first.

Description: {query}

Respond with a comma-separated list of 10-15 keywords, ordered by relevance, without any additional text or explanation.
""")
        keywords = [keyword.strip() for keyword in response.text.split(',')]
        
        if not keywords:
            raise ValueError("No keywords generated")
        
        return jsonify({"keywords": keywords})
    except Exception as e:
        print(f"Error in generate_keywords: {str(e)}")
        app.logger.error(f"An error occurred while generating keywords: {str(e)}")
        return jsonify({"error": f"An error occurred while generating keywords: {str(e)}"}), 500



if __name__ == '__main__':
    try:
        load_index_ownData_fusion()  # Load the index once when the application starts
        # load_index_orgData_fusion()  # Load the second index once when the application starts
        es = Elasticsearch(
            cloud_id="aic:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQwYzdmODhhM2IwOTU0YzMzYThlOWQ5MDk5NDFkYzMyZiRmZDE5NzE3NzM1NDQ0ZmFiOTc0MGQ3M2RmM2MwNjM5OQ==",
            http_auth=("elastic", "Mt53bRFWhcLw3owm9twkfjSD")
        )
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

















