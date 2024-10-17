import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, videoName, startTime, endTime, answer, submissionType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
        <p className="mb-2"><strong>Video ID:</strong> {videoName}</p>
        {submissionType === 'range' ? (
          <>
            <p className="mb-2"><strong>Start Time:</strong> {startTime} ms</p>
            <p className="mb-4"><strong>End Time:</strong> {endTime} ms</p>
          </>
        ) : (
          <>
            <p className="mb-2"><strong>Time:</strong> {startTime} ms</p>
            <p className="mb-4"><strong>Answer:</strong> {answer}</p>
          </>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  videoName: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number,
  answer: PropTypes.string,
  submissionType: PropTypes.oneOf(['range', 'qna']).isRequired,
};

export default ConfirmationModal;
