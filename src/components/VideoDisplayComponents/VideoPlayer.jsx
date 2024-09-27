import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";


const VideoPlayer = ({ src, startTime, onTimeUpdate  }) => {
  const videoRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
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
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const changePlaybackSpeed = () => {
    const speeds = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Chỉ gọi onTimeUpdate nếu nó là một hàm
      if (typeof onTimeUpdate === 'function') {
        onTimeUpdate(videoRef.current.currentTime);
      }
    }
  };

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        controls
        width="640"
        height="360"
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
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  frameIndex: PropTypes.string,
  onTimeUpdate: PropTypes.func.isRequired,
};

export default VideoPlayer;
