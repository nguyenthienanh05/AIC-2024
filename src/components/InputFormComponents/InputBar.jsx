import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const InputBar = ({ placeholder, bgColor, value, onChange, required }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const handleInputChange = (event) => {
    onChange(event);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  return (
    <div className="relative mb-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e);
          handleInputChange(e);
        }}
        placeholder={placeholder}
        aria-label="Query input"
        className={`w-full min-h-[80px] px-6 py-4 text-lg ${bgColor} rounded-[30px] border-[3px] border-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 resize-none overflow-hidden pr-10`}
        required={required}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Clear input"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

InputBar.propTypes = {
  placeholder: PropTypes.string,
  bgColor: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default InputBar;
