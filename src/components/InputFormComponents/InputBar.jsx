import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const InputBar = ({ placeholder, value, onChange, onKeyDown, required, className }) => {
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
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e);
          handleInputChange(e);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Query input"
        className={`w-full min-h-[60px] px-4 py-3 text-lg bg-white rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 ease-in-out placeholder-gray-400 resize-none overflow-hidden pr-10 ${className}`}
        required={required}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 ease-in-out"
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
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
};

export default InputBar;
