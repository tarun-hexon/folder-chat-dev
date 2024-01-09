// MultiSelectDropdown.js
import React from 'react';
import Select from 'react-select';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  // Add more options as needed
];

const AllContext = ({ selectedOptions, onChange }) => {
  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={onChange}
      className="basic-multi-select text-ellipsis text-emphasis"
      classNamePrefix="select"
      
    />
  );
};

export default AllContext;
