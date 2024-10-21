from oss2.exceptions import InvalidArgument
from tqdm import tqdm
from llama_index.core.schema import TextNode, Document
import time
from llama_index.core import StorageContext
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.core import VectorStoreIndex, Settings
import os
from elasticsearch import Elasticsearch
from llama_index.vector_stores.elasticsearch import ElasticsearchStore
from dotenv import load_dotenv


load_dotenv()

start = time.time()

# Initialize Gemini LLM and Embedding models
llm = Gemini(model="models/gemini-1.5-flash", api_key="AIzaSyDHalZZmUNwOG6RvQ5jedfI1ku_FYUitoM")
embed_model = GeminiEmbedding(model_name="models/text-embedding-004", api_key="AIzaSyDHalZZmUNwOG6RvQ5jedfI1ku_FYUitoM")

# Create ElasticSearch vector store
es_user = "elastic"
es_password = "NzQe2JxZSNKfAJSWaqUxvU19"

es_client = Elasticsearch(
    cloud_id="aic_index"
             ":YXNpYS1zb3V0aGVhc3QxLmdjcC5lbGFzdGljLWNsb3VkLmNvbTo0NDMkYjU0ZWM3MDNhMTIwNDdkZDlkYWFiY2NjZjA4MjhjNTkkMTRhMDgzMTBlMGNlNDdjYmE0ODlmMDgyMWE5NjdmY2I=",
    basic_auth=("elastic", es_password)
)

# Elasticsearch configuration
vector_store = ElasticsearchStore(
    es_cloud_id="aic_index"
                ":YXNpYS1zb3V0aGVhc3QxLmdjcC5lbGFzdGljLWNsb3VkLmNvbTo0NDMkYjU0ZWM3MDNhMTIwNDdkZDlkYWFiY2NjZjA4MjhjNTkkMTRhMDgzMTBlMGNlNDdjYmE0ODlmMDgyMWE5NjdmY2I=",
    index_name="aic_index",
    es_user=es_user,
    es_password=es_password,
    distance_strategy="COSINE",
    content_field="content",
    metadata_field="metadata",
)

es_client.indices.put_settings(index="aic_index",
                               settings={
                                   "index": {
                                       "max_result_window": 100000
                                   }
                               })

# Set the Gemini LLM as the default LLM in Settings
Settings.llm = llm
Settings.embed_model = embed_model

# Load existing index
# print("Loading existing index...")
# existing_index = VectorStoreIndex.from_vector_store(vector_store=vector_store)


# Function to read files from a directory
def read_files_from_directory(directory_path):
    documents = []
    files = [f for f in os.listdir(directory_path) if f.endswith(".txt")]
    for filename in tqdm(files, desc=f"Reading files from {os.path.basename(directory_path)}"):
        file_path = os.path.join(directory_path, filename)
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            node_source = f"{filename}"
            documents.append(Document(text=content, metadata={"source": node_source}))
    return documents


# Function to batch nodes
def batch_nodes(nodes, batch_size):
    for i in range(0, len(nodes), batch_size):
        yield nodes[i:i + batch_size]


# Read documents
print("Reading documents...")
documents = []
for i in range(1, 4):
    for j in range(1, 50):
        directory_path = (f'/Users/albuscorleone/Documents/Schoolwork/Major/AI/URA/BKInnovation/AIC-2024/backend'
                          f'/downloaded/L{i:02}_V0{j:02}/description')
        # Check if the directory exists
        if not os.path.exists(directory_path):
            continue  # Skip if the directory does not exist
        documents += read_files_from_directory(directory_path)

# Create nodes
print("Creating nodes...")
nodes = [TextNode(text=doc.text, id_=f"node_{i + 1}", metadata=doc.metadata) for i, doc in
         tqdm(enumerate(documents), total=len(documents), desc="Creating nodes")]

print(f"Number of nodes created: {len(nodes)}")

end = time.time()
print(f"Time taken: {end - start} seconds")
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Update VectorStoreIndex in batches
print("Updating VectorStoreIndex in batches...")
batch_size = 10  # Điều chỉnh kích thước batch để phù hợp với giới hạn của API

for batch in tqdm(batch_nodes(nodes, batch_size), total=len(nodes) // batch_size + 1, desc="Processing batches"):
    # Tạo chỉ mục cho từng batch nhỏ
    try:
        index = VectorStoreIndex(nodes=batch, storage_context=storage_context)
        # existing_index.insert_nodes(batch)
        index.storage_context.persist()
    except InvalidArgument as e:
        if "Request payload size exceeds the limit" in str(e):
            print(f"Error: {e}. Skipping batch {batch}.")
        else:
            raise e

print("Index metadata saved locally.")
print("Index created and stored in Elasticsearch.")
print("Saving the index...")
print("Index saved successfully in Elasticsearch.")
