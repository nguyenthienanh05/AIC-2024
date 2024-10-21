from tqdm import tqdm
from llama_index.core.schema import TextNode, Document
import time
from elasticsearch import Elasticsearch
from llama_index.core import StorageContext
from llama_index.llms.gemini import Gemini
from llama_index.core import VectorStoreIndex, Settings
import os
from llama_index.vector_stores.elasticsearch import ElasticsearchStore
from llama_index.core.storage.docstore import SimpleDocumentStore
from dotenv import load_dotenv


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
#
# base_directory = '/Users/albuscorleone/Documents/Schoolwork/Major/AI/URA/BKInnovation/AIC-2024/backend/downloaded/'  # Replace with your base directory path
#
#
# batch_start_index = 1
# batch_end_index = 3
# start_index = 1
# end_index = 10
#
# # Loop through all directories that match the pattern L01_V*, L02_V*, ..., L31_V*
# for i in range(1, 3):  # From 1 to 31 inclusive
#     for j in range(1, 35):  # Up to 99, assuming there are subdirectories like L01_V001 to L31_V099
#         dir_name = f"L{i:02d}_V{j:03d}"  # Format directory name as L01_V001, L01_V002, ..., L31_V099
#         directory_path = os.path.join(base_directory, dir_name, "description")
#
#         # Check if the directory exists
#         if not os.path.exists(directory_path):
#             continue  # Skip if the directory does not exist
#         documents += read_files_from_directory(
#             f'/Users/albuscorleone/Documents/Schoolwork/Major/AI/URA/BKInnovation/AIC-2024/backend/downloaded/L01_V0{i:02}/description')


# Create nodes
print("Creating nodes...")
nodes = [TextNode(text=doc.text, id_=f"node_{i + 1}", metadata=doc.metadata) for i, doc in
         tqdm(enumerate(documents), total=len(documents), desc="Creating nodes")]

print(f"Number of nodes created: {len(nodes)}")

# Create Docstore
docstore = SimpleDocumentStore()
docstore.add_documents(nodes)
docstore.persist('./saved_index/docstore.json')
