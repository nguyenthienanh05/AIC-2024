import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Modal = ({ children, onClose, bgColor, videoName, frameNumber, frameTime, fusedScore, allFrames, currentIndex }) => {
  const [currentModalIndex, setCurrentModalIndex] = useState(currentIndex);

  const handleSubmit = () => {
    console.log(`Submitted for video ${videoName}, frame ${frameNumber}, time ${frameTime}, score ${fusedScore}`);
  };

  const handleNext = () => {
    setCurrentModalIndex((prevIndex) => (prevIndex + 1) % allFrames.length);
  };

  const handlePrevious = () => {
    setCurrentModalIndex((prevIndex) => (prevIndex - 1 + allFrames.length) % allFrames.length);
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
  const currentTimestamp = parseInt(currentFrame.path.match(/_(\d+)\.png/)[1]) / 1000;
  const currentFrameMinute = Math.floor(currentTimestamp / 60);
  const currentFrameSecond = Math.floor(currentTimestamp % 60);
  const currentFrameTime = `${currentFrameMinute}:${currentFrameSecond.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${bgColor} p-6 rounded-lg relative max-w-3xl w-full`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Video {videoName}</h2>
          <p className="text-gray-600">Frame: {currentFrameNumber}, Time: {currentFrameTime}, Score: {currentFrame.fusedScore.toFixed(4)}</p>
        </div>
        {React.cloneElement(children, { startTime: currentTimestamp })}
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
};

export default Modal;