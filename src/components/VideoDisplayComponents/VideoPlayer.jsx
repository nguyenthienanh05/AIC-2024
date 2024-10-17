import React, { useRef, useEffect, useState, forwardRef } from "react";
import PropTypes from "prop-types";


// eslint-disable-next-line no-unused-vars
const VideoPlayer = forwardRef(({ src, startTime, onTimeUpdate }, ref) => {
  const innerRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.currentTime = startTime;
    }
  }, [startTime]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.metaKey || e.ctrlKey)) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          // e.preventDefault();
          // setPlaybackSpeed((prevSpeed) => {
          //   const newSpeed =
          //     e.key === "ArrowRight"
          //       ? Math.min(prevSpeed + 0.5, 2)
          //       : Math.max(prevSpeed - 0.5, 1);
          //   return newSpeed;
          // });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const changePlaybackSpeed = () => {
    const speeds = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const handleTimeUpdate = () => {
    if (innerRef.current) {
      // Chỉ gọi onTimeUpdate nếu nó là một hàm
      if (typeof onTimeUpdate === 'function') {
        onTimeUpdate(innerRef.current.currentTime);
      }
    }
  };

  return (
    <div className="video-player-container">
      <video
        ref={innerRef}
        controls
        width="100%"
        height="100%"
        className="rounded-lg shadow-lg"
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="mt-2 flex justify-between items-center">
        <button
          onClick={changePlaybackSpeed}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Speed: {playbackSpeed.toFixed(1)}x
        </button>
      </div>
    </div>
  );
});

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  frameIndex: PropTypes.string,
  onTimeUpdate: PropTypes.func.isRequired,
};

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
