import React from "react";
import PropTypes from "prop-types";

const QueryButton = ({ text, bgColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 cursor-pointer text-lg font-semibold ${bgColor} rounded-[30px] border-[3px] border-black focus:outline-none focus:ring-2 focus:ring-blue-500 hover:opacity-90 transition-opacity`}
    >
      {text}
    </button>
  );
};

QueryButton.propTypes = {
  text: PropTypes.string,
  bgColor: PropTypes.string,
  onClick: PropTypes.func,
};

export default QueryButton;
