from typing import List
from llama_index.core.schema import NodeWithScore, TextNode
from llama_index.core.retrievers import BaseRetriever
from llama_index.core import QueryBundle
import time


# Define global weights
VECTOR_WEIGHT = 0.5
BM25_WEIGHT = 0.5


# Define the function to fuse results
# Define the function to fuse results
# Define the function to fuse results with full weight for vector retriever and 0 for BM25
def fuse_results(results_list, similarity_top_k: int = 3, weights: List[float] = None):
    print("THIS IS WEIGHT: ",VECTOR_WEIGHT)
    print("THIS IS WEIGHT: ",BM25_WEIGHT)
    if weights is None:
        weights = [1.0] * len(results_list)  # Nếu không cung cấp trọng số, mặc định là 1.0 cho tất cả
    k = 60.0
    fused_scores = {}
    text_to_node = {}

    for i, nodes_with_scores in enumerate(results_list):
        weight = weights[i]  # Lấy trọng số cho retriever hiện tại
        for rank, node_with_score in enumerate(
                sorted(nodes_with_scores, key=lambda x: x.score or 0.0, reverse=True)
        ):
            if weight == 0:
                continue  # Bỏ qua nếu trọng số là 0 (BM25)
                
            text = node_with_score.node.get_content()
            text_to_node[text] = node_with_score
            if text not in fused_scores:
                fused_scores[text] = 0.0
            fused_scores[text] += weight * (1.0 / (rank + k))

    reranked_results = dict(sorted(fused_scores.items(), key=lambda x: x[1], reverse=True))

    reranked_nodes: List[NodeWithScore] = []
    for text, score in reranked_results.items():
        reranked_nodes.append(text_to_node[text])
        reranked_nodes[-1].score = score

    print("\nFused and reranked results:")
    for node in reranked_nodes[:similarity_top_k]:
        print(f"Node Source: {node.node.metadata['source']}, Fused Score: {node.score}")

    return reranked_nodes[:similarity_top_k]


class FusionRetriever(BaseRetriever):
    def __init__(
            self,
            retrievers: List[BaseRetriever],
            similarity_top_k: int = 3,
    ) -> None:
        self._retrievers = retrievers
        self._similarity_top_k = similarity_top_k
        super().__init__()

    def _retrieve(self, query_bundle: QueryBundle) -> List[NodeWithScore]:
        results_list = []
        # Measure time for retriever results
        start_time = time.time()
        for i, retriever in enumerate(self._retrievers):
            print(f"\nRetriever {i + 1} results:")
            results = retriever.retrieve(query_bundle)
            for node in results:
                print(f"Node Source: {node.node.metadata['source']}, Score: {node.score}")
            results_list.append(results)
        
        end_time = time.time()
        print(f"Total retrieval execution time: {end_time - start_time:.4f} seconds")

        final_results = fuse_results(results_list, similarity_top_k=self._similarity_top_k, weights=[VECTOR_WEIGHT, BM25_WEIGHT])
        return final_results

    async def _aretrieve(self, query_bundle: QueryBundle) -> List[NodeWithScore]:
        results_list = []
        start_time = time.time()
        for i, retriever in enumerate(self._retrievers):
            print(retriever, i)
            print(f"\nRetriever {i + 1} results:")
            results = retriever.retrieve(query_bundle)
            for node in results:
                print(f"Node Source: {node.node.metadata['source']}, Score: {node.score}")
            results_list.append(results)

        end_time = time.time()
        print(f"Total retrieval execution time: {end_time - start_time:.4f} seconds")

        final_results = fuse_results(results_list, similarity_top_k=self._similarity_top_k, weights=[VECTOR_WEIGHT, BM25_WEIGHT])

        return final_results

    # async def _scroll_retrieve(self, retriever, query_bundle):
    #     all_results = []
    #     scroll_id = None
    #     while True:
    #         if scroll_id:
    #             results = retriever.vector_store.client.scroll(scroll_id=scroll_id, scroll="2m")
    #         else:
    #             results = retriever.retrieve(query_bundle)
    #             scroll_id = results.get("_scroll_id")
    #
    #         if not results["hits"]["hits"]:
    #             break
    #
    #         for hit in results["hits"]["hits"]:
    #             node = TextNode(
    #                 text=hit["_source"]["content"],
    #                 id_=hit["_id"],
    #                 metadata=hit["_source"]["metadata"]
    #             )
    #             all_results.append(NodeWithScore(node=node, score=hit["_score"]))
    #
    #     return all_results

def set_vector_weight(weight: float):
    global VECTOR_WEIGHT
    VECTOR_WEIGHT = weight
    print(f"Vector weight set to: {VECTOR_WEIGHT}")

def set_bm25_weight(weight: float):
    global BM25_WEIGHT
    BM25_WEIGHT = weight
    print(f"BM25 weight set to: {BM25_WEIGHT}")