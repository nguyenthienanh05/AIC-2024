import React, { useState } from 'react';
import Modal from '../VideoDisplayComponents/Modal';
import VideoPlayer from '../VideoDisplayComponents/VideoPlayer';

const SearchVideoButton = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const regex = /Video (\w+) Frame: (\d+) Time: (\d+):(\d+) FPS: (\d+)/;
    const match = searchInput.match(regex);

    if (match) {
      const [, videoName, frameNumber, minutes, seconds, fps] = match;
      const timestamp = parseInt(minutes) * 60 + parseInt(seconds);
      const videoSrc = `https://storage.googleapis.com/demo100vid/${videoName}/${videoName}.mp4`;

      setVideoDetails({
        videoName,
        frameNumber,
        timestamp,
        videoSrc,
        frameTime: `${minutes}:${seconds.padStart(2, '0')}`,
        frameIndex: frameNumber,
        fps: parseInt(fps)
      });
      setIsModalOpen(true);
    } else {
      alert('Invalid input format. Please use the format: Video L01_V002 Frame: 0279 Time: 15:57 FPS: 30');
    }
  };

  const handleTimeUpdate = (currentTime) => {
    if (videoDetails) {
      const calculatedFrameIndex = Math.floor(currentTime * videoDetails.fps);
      console.log(`Current time: ${currentTime}, Frame index: ${calculatedFrameIndex}`);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Video L01_V002 Frame: 0279 Time: 15:57 FPS: 30"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
      {isModalOpen && videoDetails && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          bgColor="bg-gray-100"
          videoName={videoDetails.videoName}
          frameNumber={videoDetails.frameNumber}
          frameTime={videoDetails.frameTime}
          fusedScore={0}
          allFrames={[videoDetails]}
          currentIndex={0}
          timestamp={videoDetails.timestamp}
          frameIndex={videoDetails.frameIndex}
          fps={videoDetails.fps}
          isQueryAndQnA={false}
        >
          <VideoPlayer 
            src={videoDetails.videoSrc} 
            startTime={videoDetails.timestamp} 
            frameIndex={videoDetails.frameIndex} 
            onTimeUpdate={handleTimeUpdate} 
          />
        </Modal>
      )}
    </div>
  );
};

export default SearchVideoButton;