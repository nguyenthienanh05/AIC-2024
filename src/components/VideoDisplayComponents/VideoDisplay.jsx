import React from "react";
import PropTypes from "prop-types";
import FrameDisplay from "./FrameDisplay";

const VideoDisplay = ({ videoName, frames, bgColor, isQueryAndQnA }) => {
  return (
    <div className={`mt-4 w-full ${bgColor} rounded-[30px] border-[3px] border-black`}>
      <h2 className="text-xl font-bold text-[#B91C1C] mb-2 ml-4">
        Video {videoName}
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {frames && frames.map((frame, index) => (
          <FrameDisplay 
            key={index} 
            framePath={frame.path} 
            bgColor={bgColor} 
            videoName={videoName} 
            fusedScore={frame.fusedScore}
            allFrames={frames}
            index={index}
            isQueryAndQnA={isQueryAndQnA}
          />
        ))}
      </div>
    </div>
  );
};

VideoDisplay.propTypes = {
  frames: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      fusedScore: PropTypes.number.isRequired,
    })
  ).isRequired,
  videoName: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  isQueryAndQnA: PropTypes.bool,
};

export default VideoDisplay;