import React, { useState } from 'react';
import PropTypes from 'prop-types';

const KeywordModal = ({ keywords, onClose, onElasticSearch, query }) => {
  const [editedKeywords, setEditedKeywords] = useState(keywords);

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...editedKeywords];
    newKeywords[index] = value;
    setEditedKeywords(newKeywords);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Keywords</h2>
        <div className="mb-4">
          {editedKeywords.map((keyword, index) => (
            <input
              key={index}
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onElasticSearch(editedKeywords, query)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Elastic Search
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

KeywordModal.propTypes = {
  keywords: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onElasticSearch: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default KeywordModal;
