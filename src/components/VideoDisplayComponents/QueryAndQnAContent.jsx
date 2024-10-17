import React from 'react';
import PropTypes from 'prop-types';

const QueryAndQnAContent = ({
  children,
  timestamp,
  frameIndex,
  handleTimeUpdate,
  videoRef,
  sceneAnswer,
  videoAnswer
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {React.cloneElement(children, { 
        startTime: timestamp, 
        frameIndex: frameIndex, 
        onTimeUpdate: handleTimeUpdate,
        ref: videoRef
      })}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Scene Answer:</h3>
          <p className="bg-gray-100 p-2 rounded">{sceneAnswer}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Video Answer:</h3>
          <p className="bg-gray-100 p-2 rounded">{videoAnswer}</p>
        </div>
      </div>
    </div>
  );
};

QueryAndQnAContent.propTypes = {
  children: PropTypes.node.isRequired,
  timestamp: PropTypes.number.isRequired,
  frameIndex: PropTypes.string.isRequired,
  handleTimeUpdate: PropTypes.func.isRequired,
  videoRef: PropTypes.object.isRequired,
  sceneAnswer: PropTypes.string.isRequired,
  videoAnswer: PropTypes.string.isRequired
};

export default QueryAndQnAContent;