import React from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const ResultModal = ({ isOpen, onClose, status, submission, description }) => {
  if (!isOpen) return null;

  let backgroundColor, title, icon;
  if (status === 'error') {
    backgroundColor = 'bg-red-50';
    title = 'Error';
    icon = <FaTimesCircle className="text-red-500 text-4xl mb-2" />;
  } else if (submission === 'WRONG') {
    backgroundColor = 'bg-yellow-50';
    title = 'Submission Wrong';
    icon = <FaExclamationTriangle className="text-yellow-500 text-4xl mb-2" />;
  } else {
    backgroundColor = 'bg-green-50';
    title = 'Submission Successful';
    icon = <FaCheckCircle className="text-green-500 text-4xl mb-2" />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${backgroundColor} p-8 rounded-lg max-w-md w-full shadow-lg transform transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col items-center text-center">
          {icon}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="mb-6 text-gray-700">{description}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ResultModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  status: PropTypes.string,
  submission: PropTypes.string,
  description: PropTypes.string,
};

export default ResultModal;
