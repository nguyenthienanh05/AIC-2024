import React, { useState, useCallback } from "react";
import InputBar from "./InputBar";
import QueryButton from "./QueryButton";
import EndpointMenu from "./EndpointMenu";
import InputWeight from "./InputWeight";
import PropTypes from "prop-types";
import KeywordModal from "./KeywordModal";

const sortDataByFirstFrameScore = (data) => {
  return Object.fromEntries(
    Object.entries(data).sort((a, b) => {
      const scoreA = a[1][0]?.fusedScore || 0;
      const scoreB = b[1][0]?.fusedScore || 0;
      return scoreB - scoreA;
    })
  );
};

const InputQueryForm = ({ onQueryResponse, setIsLoading }) => {
  const [currentSceneQuery, setCurrentSceneQuery] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState("ownData-Fusion");
  const [vectorWeight, setVectorWeight] = useState(0.5);
  const [bm25Weight, setBm25Weight] = useState(0.5);
  const [keywords, setKeywords] = useState([]);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);

  const isCurrentSceneQueryValid = currentSceneQuery.trim() !== "";

  const handleCurrentSceneQueryChange = useCallback((e) => {
    setCurrentSceneQuery(e.target.value);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && currentSceneQuery.trim() !== "") {
        e.preventDefault();
        handleQuery(e);
      }
    },
    [currentSceneQuery]
  );

  const handleTranslate = useCallback(
    async (e) => {
      e.preventDefault();
      if (currentSceneQuery.trim() === "") {
        alert("Please input the query for the current scene to translate.");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: currentSceneQuery }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCurrentSceneQuery(data.translatedText);
      } catch (error) {
        console.error("Error translating text:", error);
        alert("An error occurred while translating. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentSceneQuery, setIsLoading]
  );

  const handleQuery = useCallback(
    async (e) => {
      e.preventDefault();
      if (currentSceneQuery.trim() === "") {
        alert("Please input the query for the current scene.");
        return;
      }

      console.log("Query being sent:", currentSceneQuery);

      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8080/${selectedEndpoint}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: currentSceneQuery }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const sortedData = sortDataByFirstFrameScore(data);
        sortedData.isQueryAndQnA = false;
        console.log(sortedData)
        onQueryResponse(sortedData);
      } catch (error) {
        console.error("Error submitting query:", error);
        alert(
          "An error occurred while submitting the query. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [currentSceneQuery, selectedEndpoint, setIsLoading, onQueryResponse]
  );

  const toggleFormVisibility = useCallback(() => {
    setIsFormVisible((prev) => !prev);
  }, []);

  const handleVectorWeightChange = useCallback((value) => {
    setVectorWeight(value);
    fetch("http://localhost:8080/set_vector_weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: value }),
    }).catch((error) => console.error("Error setting vector weight:", error));
  }, []);

  const handleBm25WeightChange = useCallback((value) => {
    setBm25Weight(value);
    fetch("http://localhost:8080/set_bm25_weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: value }),
    }).catch((error) => console.error("Error setting BM25 weight:", error));
  }, []);

  const handleElasticSearch = async (keywords) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/elastic-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords, query: currentSceneQuery }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const processedData = processElasticSearchResults(data);
      console.log(processedData)
      onQueryResponse({
        isQueryAndQnA: false,
        ...processedData,
      });
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while performing the elastic search. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const processElasticSearchResults = (results) => {
    const processedResults = {};
    results.forEach((result) => {
      const sourceParts = result.source.split('/');
      const fileNameParts = sourceParts[sourceParts.length - 1].split('_');
      const videoName = `${fileNameParts[1]}_${fileNameParts[2]}`;
      const time = fileNameParts[5];
      const fps = fileNameParts[7].substring(0, 2);
      const path = `${videoName}/scene/${videoName}_frame_${fileNameParts[4]}_${fileNameParts[5]}_${fileNameParts[6]}_${fileNameParts[7].substring(0, 4)}.png`
      const frameIndex = Math.floor(fps * time / 1000);
      console.log(videoName, path, frameIndex)
      if (!processedResults[videoName]) {
        processedResults[videoName] = [];
      }
      processedResults[videoName].push({
        fusedScore: result.score,
        path: path,

        frameIndex: frameIndex,
        fps: fps
      });
    });
    return processedResults;
  };

  const handleGenerateKeywords = async (e) => {
    e.preventDefault(); 
    if (currentSceneQuery.trim() === "") {
      alert("Please input a query before generating keywords.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Generating keywords...");
      console.log("Query:", currentSceneQuery);

      const response = await fetch("http://localhost:8080/generate-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ query: currentSceneQuery }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();

      if (!data.keywords || data.keywords.length === 0) {
        throw new Error("No keywords generated");
      }

      console.log("Generated keywords:", data.keywords);

      setKeywords(data.keywords);
      setIsKeywordModalOpen(true);
    } catch (error) {
      console.error("Error generating keywords:", error);
      alert(`Failed to generate keywords. ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-md border-2 border-blue-800 rounded-lg">
      {isFormVisible && (
        <form className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <InputBar
              placeholder="Input the query for Fusion/ Elastic Search"
              value={currentSceneQuery}
              onChange={handleCurrentSceneQueryChange}
              onKeyDown={handleKeyPress}
              required
              className="flex-grow shadow-sm bg-white border-2"
            />
            <QueryButton
              text="Translate"
              onClick={handleTranslate}
              disabled={!isCurrentSceneQueryValid}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
            />
            <QueryButton
              text="Query"
              onClick={handleQuery}
              disabled={!isCurrentSceneQueryValid}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
            />
            <QueryButton
              text="Generate Keywords"
              onClick={handleGenerateKeywords}
              disabled={!isCurrentSceneQueryValid}
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-sm"
            />
          </div>
          <div className="flex items-center justify-start space-x-4 p-4">
            <EndpointMenu
              selectedEndpoint={selectedEndpoint}
              onEndpointChange={setSelectedEndpoint}
            />
            <div className="flex items-center space-x-6">
              <InputWeight
                label="Vector Weight"
                initialValue={vectorWeight}
                onSubmit={handleVectorWeightChange}
                min={0}
                max={1}
                step={0.1}
              />
              <InputWeight
                label="BM25 Weight"
                initialValue={bm25Weight}
                onSubmit={handleBm25WeightChange}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          </div>
        </form>
      )}
      {isKeywordModalOpen && (
        <KeywordModal
          keywords={keywords}
          onClose={() => setIsKeywordModalOpen(false)}
          onElasticSearch={(newKeywords) => {
            setKeywords(newKeywords);
            handleElasticSearch(newKeywords);
            setIsKeywordModalOpen(false);
          }}
          query={currentSceneQuery}
        />
      )}
      <button
        onClick={toggleFormVisibility}
        className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        {isFormVisible ? "−" : "+"}
      </button>
    </div>
  );
};

InputQueryForm.propTypes = {
  onQueryResponse: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  setIsElasticSearchLoading: PropTypes.func,
};

export default InputQueryForm;
