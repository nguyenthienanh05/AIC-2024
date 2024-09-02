from typing import List
from llama_index.core.schema import NodeWithScore
from llama_index.core.retrievers import BaseRetriever
from llama_index.core import QueryBundle


# Define the function to fuse results
def fuse_results(results_list, similarity_top_k: int = 3):
    k = 60.0
    fused_scores = {}
    text_to_node = {}

    # print("Input results_list:")
    # for i, nodes_with_scores in enumerate(results_list):
    #     print(f"Retriever {i + 1} results:")
    #     for node_with_score in nodes_with_scores:
    #         print(f"  Node ID: {node_with_score.node.id_}, Score: {node_with_score.score}")

    for nodes_with_scores in results_list:
        for rank, node_with_score in enumerate(
                sorted(nodes_with_scores, key=lambda x: x.score or 0.0, reverse=True)
        ):
            text = node_with_score.node.get_content()
            text_to_node[text] = node_with_score
            if text not in fused_scores:
                fused_scores[text] = 0.0
            fused_scores[text] += 1.0 / (rank + k)

    reranked_results = dict(sorted(fused_scores.items(), key=lambda x: x[1], reverse=True))

    reranked_nodes: List[NodeWithScore] = []
    for text, score in reranked_results.items():
        reranked_nodes.append(text_to_node[text])
        reranked_nodes[-1].score = score

    print("\nFused and reranked results:")
    for node in reranked_nodes[:similarity_top_k]:
        print(f"Node ID: {node.node.id_}, Source: {node.node.metadata['source']}, Fused Score: {node.score}")

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
        for i, retriever in enumerate(self._retrievers):
            print(retriever, i)
            print(f"\nRetriever {i + 1} results:")
            results = retriever.retrieve(query_bundle)
            for node in results:
                print(f"Node ID: {node.node.id_}, Score: {node.score}")
            results_list.append(results)

        final_results = fuse_results(results_list, similarity_top_k=self._similarity_top_k)
    
    async def _aretrieve(self, query_bundle: QueryBundle) -> List[NodeWithScore]:
        # Implement your asynchronous retrieval logic here
        results_list = []
        for i, retriever in enumerate(self._retrievers):
            # print(retriever, i)
            # print(f"\nRetriever {i + 1} results:")
            results = retriever.retrieve(query_bundle)
            # for node in results:
            #     print(f"Node ID: {node.node.id_}, Score: {node.score}")
            results_list.append(results)

        final_results = fuse_results(results_list, similarity_top_k=self._similarity_top_k)


        # Display content of top-k documents
        # print("\nTop-k Document Contents:")
        # for i, node in enumerate(final_results):
        #     print(f"\nDocument {i + 1}:")
        #     print(f"Source: {node.node.metadata['source']}")
        #     print(f"Score: {node.score}")
        #     print("Content:")
        #     print(node.node.get_content())
        #     print("-" * 50)

        return final_results
