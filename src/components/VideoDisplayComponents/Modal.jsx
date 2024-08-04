import React from "react";
import PropTypes from "prop-types";

const Modal = ({ children, onClose, bgColor, videoName, frameNumber, frameTime, fusedScore }) => {
  const handleSubmit = () => {
    console.log(`Submitted for video ${videoName}, frame ${frameNumber}, time ${frameTime}, score ${fusedScore}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${bgColor} p-6 rounded-lg relative max-w-3xl w-full`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Video {videoName}</h2>
          <p className="text-gray-600">Frame: {frameNumber}, Time: {frameTime}, Score: {fusedScore}</p>
        </div>
        {children}
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  bgColor: PropTypes.string.isRequired,
  videoName: PropTypes.string.isRequired,
  frameNumber: PropTypes.string.isRequired,
  frameTime: PropTypes.string.isRequired,
  fusedScore: PropTypes.number.isRequired,
};

export default Modal;