import requests

# Set vector weight
response = requests.post(
    'http://localhost:8080/set_vector_weight',
    json={'weight': 1}
)
print(response.json())

# Set BM25 weight
response = requests.post(
    'http://localhost:8080/set_bm25_weight',
    json={'weight': 0}
)
print(response.json())