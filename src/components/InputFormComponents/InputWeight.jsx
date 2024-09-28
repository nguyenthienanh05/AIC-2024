import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputWeight = ({ 
  label, 
  initialValue, 
  onSubmit, 
  min = 0, 
  max = 1, 
  step = 0.1 
}) => {
  const [value, setValue] = useState(initialValue);

  const handleWeightChange = (e) => {
    setValue(parseFloat(e.target.value));
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={label} className="text-sm">{label}:</label>
      <div className="flex space-x-2">
        <input
          type="number"
          id={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleWeightChange}
          className="border rounded p-1 w-20"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Set
        </button>
      </div>
    </div>
  );
};

InputWeight.propTypes = {
  label: PropTypes.string.isRequired,
  initialValue: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

export default InputWeight;