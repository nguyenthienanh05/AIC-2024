import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const VideoPlayer = ({ src, startTime }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        controls
        width="640"
        height="360"
        className="rounded-lg shadow-lg"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
};

export default VideoPlayer;