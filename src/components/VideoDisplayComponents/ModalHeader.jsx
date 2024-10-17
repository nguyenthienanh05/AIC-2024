import React from 'react';
import PropTypes from 'prop-types';
import CopiedIcon from './CopiedIcon';
import CopyIcon from './CopyIcon';

const ModalHeader = ({ videoName, tempFrameIndex, currentVideoTime, fusedScore, isCopied, copyVideoInfo, isQueryAndQnA, handleGetSceneAnswer, handleGetVideoAnswer }) => {
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Video {videoName}
          </h2>
          <p className="text-gray-600">
            Frame: {tempFrameIndex}, Time: {formatTime(currentVideoTime)},
            Score: {fusedScore.toFixed(4) || "N/A"}
          </p>
        </div>
        <button
          onClick={copyVideoInfo}
          className="ml-4 p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          title="Copy video information"
        >
          {isCopied ? <CopiedIcon /> : <CopyIcon />}
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
  );
};

ModalHeader.propTypes = {
  videoName: PropTypes.string.isRequired,
  tempFrameIndex: PropTypes.number.isRequired,
  currentVideoTime: PropTypes.number.isRequired,
  fusedScore: PropTypes.number.isRequired,
  isCopied: PropTypes.bool.isRequired,
  copyVideoInfo: PropTypes.func.isRequired,
  isQueryAndQnA: PropTypes.bool.isRequired,
  handleGetSceneAnswer: PropTypes.func.isRequired,
  handleGetVideoAnswer: PropTypes.func.isRequired,
};

export default ModalHeader;