import React, { useState } from "react";
import InputBar from "./InputBar";
import QueryButton from "./QueryButton";
import PropTypes from "prop-types";

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
  const [nextScenesQuery, setNextScenesQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isCurrentSceneQueryValid, setIsCurrentSceneQueryValid] =
    useState(false);
  const [isQuestionValid, setIsQuestionValid] = useState(false);

  const handleCurrentSceneQueryChange = (e) => {
    setCurrentSceneQuery(e.target.value);
    setIsCurrentSceneQueryValid(e.target.value.trim() !== "");
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    setIsQuestionValid(e.target.value.trim() !== "");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isCurrentSceneQueryValid) {
        if (isQuestionValid) {
          handleQueryAndQnA(e);
        } else {
          handleQuery(e);
        }
      }
    }
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (isCurrentSceneQueryValid) {
      console.log("Query submitted:", {
        currentSceneQuery,
        nextScenesQuery,
        question,
      });
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: currentSceneQuery,
            nextScenesQuery: nextScenesQuery,
            question: question,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const sortedData = sortDataByFirstFrameScore(data);
        sortedData.isQueryAndQnA = false;
        console.log("Query response:", sortedData);
        console.log(sortedData.isQueryAndQnA);
        onQueryResponse(sortedData);
      } catch (error) {
        console.error("Error submitting query:", error);
        alert(
          "An error occurred while submitting the query. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please input the query for the current scene.");
    }
  };

  const handleQueryAndQnA = async (e) => {
    e.preventDefault();
    if (isCurrentSceneQueryValid && isQuestionValid) {
      console.log("Query and QnA submitted:", {
        currentSceneQuery,
        nextScenesQuery,
        question,
      });
      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:5000/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: currentSceneQuery,
            nextScenesQuery: nextScenesQuery,
            question: question,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const sortedData = sortDataByFirstFrameScore(data);
        sortedData.isQueryAndQnA = true;
        console.log("Query response:", sortedData);
        console.log(sortedData.isQueryAndQnA);
        onQueryResponse(sortedData);
      } catch (error) {
        console.error("Error submitting query:", error);
        alert(
          "An error occurred while submitting the query. Please try again."
        );
        setIsLoading(false);
      }
    } else {
      alert(
        "Please input both the query for the current scene and the question."
      );
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="top-0 z-50">
      {isFormVisible && (
        <form
          className={`max-w-[1342px] mx-auto p-4 bg-white shadow-md rounded-b-lg`}
        >
          <div className="flex flex-col space-y-1">
            <InputBar
              placeholder="Input the query for the current scene (required)"
              bgColor="bg-[#FFFED8]"
              value={currentSceneQuery}
              onChange={handleCurrentSceneQueryChange}
              onKeyDown={handleKeyPress}
              required
            />
            <InputBar
              placeholder="Input the query for the next scenes (optional)"
              bgColor="bg-[#D3F2FF]"
              value={nextScenesQuery}
              onChange={(e) => setNextScenesQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <InputBar
              placeholder="Input the question (required for Query and QnA)"
              bgColor="bg-[#FFDDBB]"
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleKeyPress}
            />
            <div className="flex justify-center space-x-4 mt-2">
              <QueryButton
                text="Query"
                bgColor="bg-[#8CFF84]"
                onClick={handleQuery}
                disabled={!isCurrentSceneQueryValid}
              />
              <QueryButton
                text="Query and QnA"
                bgColor="bg-[#FF7375]"
                onClick={handleQueryAndQnA}
                disabled={!isCurrentSceneQueryValid || !isQuestionValid}
              />
            </div>
          </div>
        </form>
      )}
      <button
        onClick={toggleFormVisibility}
        className={`fixed top-2 right-2 cursor-pointer bg-blue-500 text-white px-2 py-1 text-sm rounded-full shadow-lg hover:bg-blue-600 transition-colors`}
      >
        {isFormVisible ? "−" : "+"}
      </button>
    </div>
  );
};

InputQueryForm.propTypes = {
  onQueryResponse: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default InputQueryForm;