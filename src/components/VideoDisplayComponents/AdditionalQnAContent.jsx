import React from 'react';
import PropTypes from 'prop-types';

const AdditionalQnAContent = ({
  newSceneAnswer,
  handleGetNewSceneAnswer,
  finalAnswer
}) => {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <button 
          onClick={handleGetNewSceneAnswer} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get NEW SCENE answer
        </button>
        <p className="mt-2 bg-gray-100 p-2 rounded">{newSceneAnswer}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Final Answer:</h3>
        <p className="bg-gray-100 p-2 rounded">{finalAnswer}</p>
      </div>
    </div>
  );
};

AdditionalQnAContent.propTypes = {
  newSceneAnswer: PropTypes.string.isRequired,
  handleGetNewSceneAnswer: PropTypes.func.isRequired,
  finalAnswer: PropTypes.string.isRequired
};

export default AdditionalQnAContent;