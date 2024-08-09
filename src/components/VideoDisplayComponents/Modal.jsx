import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Modal = ({
  children,
  onClose,
  bgColor,
  videoName,
  frameNumber,
  frameTime,
  fusedScore,
  allFrames,
  currentIndex,
  isQueryAndQnA = false,
}) => {
  const [currentModalIndex, setCurrentModalIndex] = useState(currentIndex);
  const [sceneAnswer, setSceneAnswer] = useState("");
  const [newSceneAnswer, setNewSceneAnswer] = useState("");
  const [videoAnswer, setVideoAnswer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("Final");

  const handleSubmit = () => {
    console.log(
      `Submitted for video ${videoName}, frame ${frameNumber}, time ${frameTime}, score ${fusedScore}`
    );
  };

  const handleNext = () => {
    setCurrentModalIndex((prevIndex) => (prevIndex + 1) % allFrames.length);
  };

  const handlePrevious = () => {
    setCurrentModalIndex(
      (prevIndex) => (prevIndex - 1 + allFrames.length) % allFrames.length
    );
  };

  const handleGetSceneAnswer = () => {
    // Implement logic to get scene answer
    setSceneAnswer("Scene answer placeholder");
  };

  const handleGetVideoAnswer = () => {
    // Implement logic to get video answer
    setVideoAnswer("Video answer placeholder");
  };

  const handleGetNewSceneAnswer = () => {
    // Implement logic to get new scene answer
    setNewSceneAnswer("New scene answer placeholder");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.shiftKey) {
        if (event.key === "ArrowRight") {
          handleNext();
        } else if (event.key === "ArrowLeft") {
          handlePrevious();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const currentFrame = allFrames[currentModalIndex];
  const currentFrameNumber = currentFrame.path.match(/frame_(\d{4})_/)[1];
  const currentTimestamp =
    parseInt(currentFrame.path.match(/_(\d+)\.png/)[1]) / 1000;
  const currentFrameMinute = Math.floor(currentTimestamp / 60);
  const currentFrameSecond = Math.floor(currentTimestamp % 60);
  const currentFrameTime = `${currentFrameMinute}:${currentFrameSecond
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${bgColor} p-6 rounded-lg relative max-w-5xl w-full`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Video {videoName}
          </h2>
          <p className="text-gray-600">
            Frame: {currentFrameNumber}, Time: {currentFrameTime}, Score:{" "}
            {currentFrame.fusedScore.toFixed(4)}
          </p>
        </div>
        <div className="flex">
          <div className="w-2/3 pr-4">
            {React.cloneElement(children, { startTime: currentTimestamp })}
          </div>
          {isQueryAndQnA && (
            <div className="w-1/3 space-y-4">
              <div className="border border-gray-300 p-4 rounded bg-white">
                <h3 className="font-bold mb-2">Scene Answer</h3>
                <p className="min-h-[60px]">{sceneAnswer}</p>
                <button
                  onClick={handleGetSceneAnswer}
                  className="mt-2 px-4 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
                >
                  Get SCENE answer
                </button>
              </div>
              <div className="border border-gray-300 p-4 rounded bg-white">
                <h3 className="font-bold mb-2">Video Answer</h3>
                <p className="min-h-[60px]">{videoAnswer}</p>
                <button
                  onClick={handleGetVideoAnswer}
                  className="mt-2 px-4 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
                >
                  Get VIDEO answer
                </button>
              </div>
            </div>
          )}
        </div>
        {isQueryAndQnA && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4 rounded bg-white">
              <h3 className="font-bold mb-2">New Scene Answer</h3>
              <p className="min-h-[60px]">{newSceneAnswer}</p>
              <button
                onClick={handleGetNewSceneAnswer}
                className="mt-2 px-4 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                Get NEW SCENE answer
              </button>
            </div>
            <div className="border border-gray-300 p-4 rounded bg-yellow-200">
              <h3 className="font-bold mb-2">Final Answer</h3>
              <p className="min-h-[60px]">{finalAnswer}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  bgColor: PropTypes.string.isRequired,
  videoName: PropTypes.string.isRequired,
  frameNumber: PropTypes.string.isRequired,
  frameTime: PropTypes.string.isRequired,
  fusedScore: PropTypes.number.isRequired,
  allFrames: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired,
  isQueryAndQnA: PropTypes.bool.isRequired,
};

export default Modal;
