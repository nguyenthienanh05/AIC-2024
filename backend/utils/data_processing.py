import os
from tqdm import tqdm
from llama_index.core.schema import TextNode, Document
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.core import VectorStoreIndex, Settings


# Set your Google API key
GOOGLE_API_KEY = "AIzaSyBhJO0pCWWtobW17U2L5QX3avujp0Vf9DM"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize Gemini LLM and Embedding models
llm = Gemini(model="models/gemini-1.5-flash", api_key=GOOGLE_API_KEY)
embed_model = GeminiEmbedding(model_name="models/text-embedding-004", api_key=GOOGLE_API_KEY)

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

# TODO: Change dir
dir1 = "/Users/vinhvu/thienanh1"
dir2 = "/Users/vinhvu/thienanh2"
dir3 = "/Users/vinhvu/thienanh3"

print("Reading documents...")
documents = read_files_from_directory(dir1) + read_files_from_directory(dir2) + read_files_from_directory(dir3)

# Create nodes
print("Creating nodes...")
nodes = [TextNode(text=doc.text, id_=f"node_{i+1}", metadata=doc.metadata) for i, doc in tqdm(enumerate(documents), total=len(documents), desc="Creating nodes")]

# Create VectorStoreIndex
print("Creating VectorStoreIndex...")
index = VectorStoreIndex(nodes=nodes)

# Save the index
print("Saving the index...")
index.storage_context.persist(persist_dir="./saved_index")