import React from 'react';
import PropTypes from 'prop-types';

const VideoControls = ({ children, timestamp, frameIndex, handleTimeUpdate, videoRef }) => {
  return React.cloneElement(children, {
    startTime: timestamp,
    frameIndex: frameIndex,
    onTimeUpdate: handleTimeUpdate,
    ref: videoRef,
  });
};

VideoControls.propTypes = {
  children: PropTypes.node.isRequired,
  timestamp: PropTypes.number.isRequired,
  frameIndex: PropTypes.string.isRequired,
  handleTimeUpdate: PropTypes.func.isRequired,
  videoRef: PropTypes.object.isRequired,
};

export default VideoControls;