import React from "react";
import PropTypes from "prop-types";

const QueryButton = ({ text, onClick, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : `${className} hover:shadow-md active:transform active:scale-95`
      }`}
    >
      {text}
    </button>
  );
};

QueryButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default QueryButton;
