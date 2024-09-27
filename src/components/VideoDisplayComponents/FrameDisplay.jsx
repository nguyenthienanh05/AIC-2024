import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import VideoPlayer from "./VideoPlayer";

const FrameDisplay = ({ framePath, bgColor, videoName, fusedScore, allFrames, index, isQueryAndQnA }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BASE_URL_FRAME = "https://storage.googleapis.com/aic_videos_data/";
  const BASE_URL_VIDEO = "https://storage.googleapis.com/aic_videos_2024/";

  const extractNumbers = (path) => {
    const match = path.match(/frame_(\d{4})_(\d+)_(\d+)_(\d{4})\.png/);
    return match ? {
      frameNumber: match[1],
      timestamp: parseInt(match[2]) / 1000,
      frameIndex: match[3],
      fps: parseInt(match[4]) / 100
    } : null;
  };

  const { frameNumber, timestamp, frameIndex, fps } = extractNumbers(framePath) || {};
  const videoSrc = `${BASE_URL_VIDEO}${videoName}/${videoName}.mp4`;
  // const videoSrc = `videos/${videoName}.mp4`;

  const frameMinute = Math.floor(timestamp / 60);
  const frameSecond = Math.floor(timestamp % 60);
  const frameTime = `${frameMinute}:${frameSecond.toString().padStart(2, '0')}`;

  const roundedFusedScore = fusedScore.toFixed(4);

  return (
    <div className="w-24 flex flex-col items-center">
      <img
        src={`${BASE_URL_FRAME}${framePath}`}
        alt={`Frame ${frameNumber}`}
        className="w-full h-auto object-cover rounded border-[1px] border-black cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      />
      <p className="text-xs mt-1">{frameNumber} | {roundedFusedScore}</p>
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          bgColor={bgColor}
          videoName={videoName}
          frameNumber={frameNumber}
          frameTime={frameTime}
          fusedScore={fusedScore}
          allFrames={allFrames}
          currentIndex={index}
          timestamp={timestamp}
          frameIndex={frameIndex} // Truyền frameIndex vào Modal
          fps={fps}
          isQueryAndQnA={isQueryAndQnA}
        >
          <VideoPlayer src={videoSrc} startTime={timestamp} frameIndex={frameIndex} onTimeUpdate={() => {}} />
        </Modal>
      )}
    </div>
  );
};

FrameDisplay.propTypes = {
  framePath: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  videoName: PropTypes.string.isRequired,
  fusedScore: PropTypes.number.isRequired,
  allFrames: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  isQueryAndQnA: PropTypes.bool,
};

export default FrameDisplay;