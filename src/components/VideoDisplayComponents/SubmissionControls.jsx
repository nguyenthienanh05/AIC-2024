import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCheck, FaTimes, FaPaperPlane } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';

const SubmissionControls = ({
  range,
  setRange,
  handleSubmit,
  handleQnASubmit,
  submissionStatus,
  qnaSubmissionStatus,
  videoName,
  currentVideoTime
}) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState('range');
  const [answer, setAnswer] = useState('');

  const openConfirmation = (type) => {
    setSubmissionType(type);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const confirmSubmit = () => {
    closeConfirmation();
    if (submissionType === 'range') {
      handleSubmit();
    } else {
      handleQnASubmit(answer);
    }
  };

  const calculatedStartTime = Math.max(0, currentVideoTime * 1000 - range);
  const calculatedEndTime = currentVideoTime * 1000 + range;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4 transition-all duration-300 ease-in-out">
      <div className="flex items-center mb-4">
        <label htmlFor="range" className="text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">
          Range: {range} ms
        </label>
        <div className="relative flex-grow">
          <input
            type="range"
            id="range"
            min="0"
            max="10000"
            step="100"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>0</span>
            <span>10000</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          rows="2"
          placeholder="Type your answer here..."
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => openConfirmation('range')}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          disabled={submissionStatus === 'submitting'}
        >
          <FaPaperPlane className="mr-2" />
          Submit Range
        </button>
        <button
          onClick={() => openConfirmation('qna')}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          disabled={qnaSubmissionStatus === 'submitting' || !answer.trim()}
        >
          <FaPaperPlane className="mr-2" />
          Submit Q&A
        </button>
      </div>
      {(submissionStatus || qnaSubmissionStatus) && (
        <div className={`mt-3 p-2 rounded-md text-sm ${(submissionStatus === 'success' || qnaSubmissionStatus === 'success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center animate-fade-in`}>
          {(submissionStatus === 'success' || qnaSubmissionStatus === 'success') ? (
            <>
              <FaCheck className="mr-2" />
              Submission successful!
            </>
          ) : (
            <>
              <FaTimes className="mr-2" />
              Submission failed. Please try again.
            </>
          )}
        </div>
      )}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        onConfirm={confirmSubmit}
        videoName={videoName}
        startTime={calculatedStartTime}
        endTime={calculatedEndTime}
        answer={answer}
        submissionType={submissionType}
      />
    </div>
  );
};

SubmissionControls.propTypes = {
  range: PropTypes.number.isRequired,
  setRange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleQnASubmit: PropTypes.func.isRequired,
  submissionStatus: PropTypes.string,
  qnaSubmissionStatus: PropTypes.string,
  videoName: PropTypes.string.isRequired,
  currentVideoTime: PropTypes.number.isRequired,
};

export default SubmissionControls;
