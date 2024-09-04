import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Modal = ({
  children,
  onClose,
  bgColor,
  videoName,
  frameNumber,
  // frameTime,
  fusedScore,
  allFrames,
  currentIndex,
  timestamp,
  frameIndex, // Nhận frameIndex
  fps,
  isQueryAndQnA = false,
}) => {
  const [currentModalIndex, setCurrentModalIndex] = useState(currentIndex);
  const [sceneAnswer, setSceneAnswer] = useState(
    "a;sdlkfja;sdlfkjasldkjfalksjdfhalksjfghalksfjhvildfbhvljakdefbvliudefbhvhlkjdfshgvjufdeghbviyufrgfyurdifgf"
  );
  const [newSceneAnswer, setNewSceneAnswer] = useState("");
  const [videoAnswer, setVideoAnswer] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [finalAnswer, setFinalAnswer] = useState("Final");
  const [isCopied, setIsCopied] = useState(false);

  const [currentVideoTime, setCurrentVideoTime] = useState(timestamp);
  const [tempFrameIndex, setTempFrameIndex] = useState(frameIndex);

  const handleSubmit = () => {
    // const fps = 25; // Giả sử 30 khung hình/giây, điều chỉnh nếu khác
    const calculatedFrameIndex = Math.floor(currentVideoTime * fps);
    console.log(`Current frame index: ${calculatedFrameIndex}`);
    console.log(
      `Submitted for video ${videoName}, frame ${frameNumber}, time ${formatTime(currentVideoTime)}, temp_frame_index ${tempFrameIndex}, original_frame_index ${frameIndex}, score ${fusedScore}`
    );
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = (newTime) => {
    setCurrentVideoTime(newTime);
    setTempFrameIndex(Math.floor(newTime * fps).toString().padStart(4, '0'));
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
      } else if (event.shiftKey && !event.metaKey && !event.ctrlKey) {
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
  const currentFrameNumber =
    currentFrame?.path?.match(/frame_(\d{4})_/)[1] || frameNumber;
  const currentTimestamp =
    timestamp + 0.1 ||
    parseInt(currentFrame?.path?.match(/_(\d+)\.png/)[1]) / 1000 + 0.1;
  const currentFrameMinute = Math.floor(currentTimestamp / 60);
  const currentFrameSecond = Math.floor(currentTimestamp % 60);
  const currentFrameTime = `${currentFrameMinute}:${currentFrameSecond
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`${bgColor} p-6 rounded-lg relative ${
          isQueryAndQnA ? "max-w-5xl" : "max-w-3xl"
        } w-full`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Video {videoName}
              </h2>
              <p className="text-gray-600">
              Frame: {tempFrameIndex}, Time: {formatTime(currentVideoTime)}, Score:{" "}
              {fusedScore.toFixed(4) || "N/A"}
              </p>
            </div>
            <button
              onClick={() => {
                const info = `Video ${videoName} Frame: ${currentFrameNumber} Time: ${formatTime(currentVideoTime)} FPS: ${fps}`;
                navigator.clipboard.writeText(info);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
              }}
              className="ml-4 p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              title="Copy video information"
            >
              {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
          </div>
          {isQueryAndQnA && (
            <div className="flex space-x-2">
              <button
                onClick={handleGetSceneAnswer}
                className="px-4 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                Get SCENE answer
              </button>
              <button
                onClick={handleGetVideoAnswer}
                className="px-4 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                Get VIDEO answer
              </button>
            </div>
          )}
        </div>
        {isQueryAndQnA ? (
          <div className="flex">
            <div className="w-2/3 pr-4">
            {React.cloneElement(children, { startTime: timestamp, frameIndex: frameIndex, onTimeUpdate: handleTimeUpdate })}
            </div>
            <div className="w-1/3 space-y-4">
              <div className="border border-gray-300 rounded bg-white">
                <h3 className="font-bold">Scene Answer</h3>
                <p className="min-h-[60px]">{sceneAnswer}</p>
              </div>
              <div className="border border-gray-300 rounded bg-white">
                <h3 className="font-bold">Video Answer</h3>
                <p className="min-h-[60px]">{videoAnswer}</p>
              </div>
            </div>
          </div>
        ) : (
          React.cloneElement(children, { startTime: timestamp, frameIndex: frameIndex, onTimeUpdate: handleTimeUpdate })
        )}
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
  timestamp: PropTypes.number,
  frameIndex: PropTypes.string, // Thêm prop frameIndex
  fps: PropTypes.number, // Thêm fps vào đây
  isQueryAndQnA: PropTypes.bool,
};

export default Modal;