from tqdm import tqdm
from llama_index.core.schema import TextNode, Document
import time
from elasticsearch import Elasticsearch
from llama_index.core import StorageContext
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.core import VectorStoreIndex, Settings
import os
from llama_index.vector_stores.elasticsearch import ElasticsearchStore
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.retrievers.bm25 import BM25Retriever
from dotenv import load_dotenv
import glob

load_dotenv()

# Set your Google API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print(GOOGLE_API_KEY)
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize Gemini LLM and Embedding models
llm = Gemini(model="models/gemini-1.5-flash", api_key=GOOGLE_API_KEY)
embed_model = GeminiEmbedding(model_name="models/text-embedding-004", api_key=GOOGLE_API_KEY)

# Create ElasticSearch vector store
es_url = os.getenv("ELASTICSEARCH_URL")
es_user = os.getenv("ELASTICSEARCH_USER")
es_password = os.getenv("ELASTICSEARCH_PASSWORD")

es_client = Elasticsearch(
    es_url,
    basic_auth=(es_user, es_password) if es_user and es_password else None,
    verify_certs=False  # Note: In production, you should verify certificates
)

# Modify the ElasticsearchStore initialization
vector_store = ElasticsearchStore(
    es_url=es_url,
    index_name="aic_index_test",
    es_user=es_user,
    es_password=es_password,
    distance_strategy="COSINE",
    content_field="content",  # Specify the field to store document content
    metadata_field="metadata"  # Specify the field to store metadata
)

# Set the Gemini LLM as the default LLM in Settings
Settings.llm = llm
Settings.embed_model = embed_model


# Function to read files from a directory
def read_files_from_directory(directory_path):
    documents = []
    files = [f for f in os.listdir(directory_path) if f.endswith(".txt")]
    for filename in tqdm(files, desc=f"Reading files from {os.path.basename(directory_path)}"):
        file_path = os.path.join(directory_path, filename)
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            # Extracting the desired format for node_source
            node_source = f"{filename}"
            documents.append(Document(text=content, metadata={"source": node_source}))
    return documents


# def read_all_description_files(base_directory):
#     documents = []
#     # Recursively find all "description" directories
#     pattern = os.path.join(base_directory, 'L0*_V00*', 'description')
#     description_dirs = glob.glob(pattern)
#     print(description_dirs)
#
#     for description_dir in tqdm(description_dirs, desc="Processing directories"):
#         # Read all text files from the current description directory
#         dir_documents = read_files_from_directory(description_dir)
#         documents.extend(dir_documents)
#
#     return documents

print("Reading documents...")
documents = []
for i in range(1, 32):
    documents += read_files_from_directory(f'/Users/albuscorleone/Documents/Schoolwork/Major/AI/URA/BKInnovation/AIC-2024/backend/downloaded/L01_V0{i:02}/description')


# TODO: Change dir
print("Reading documents...")
# documents = read_files_from_directory(dir1) + read_files_from_directory(dir2) + read_files_from_directory(dir3)

# print(f"Number of documents loaded: {len(documents)}")

# Create nodes
print("Creating nodes...")
nodes = [TextNode(text=doc.text, id_=f"node_{i + 1}", metadata=doc.metadata) for i, doc in
         tqdm(enumerate(documents), total=len(documents), desc="Creating nodes")]

print(f"Number of nodes created: {len(nodes)}")

start = time.time()

# Create VectorStoreIndex
print("Creating VectorStoreIndex...")

# Create Docstore
docstore = SimpleDocumentStore()
docstore.add_documents(nodes)
docstore.persist('./saved_index/docstore.json')

storage_context = StorageContext.from_defaults(vector_store=vector_store)

index = VectorStoreIndex(nodes=nodes, storage_context=storage_context)

index.storage_context.persist()
print("Index metadata saved locally.")

print("Index created and stored in ElasticSearch.")
print("Saving the index...")
# No need to save the index locally as it's now in Elasticsearch
print("Index saved successfully in Elasticsearch.")
end = time.time()
print(f"Time taken: {end - start} seconds")
