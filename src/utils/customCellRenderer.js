// CustomCellRenderer.js
import React, { useState, useEffect } from 'react';

const CustomCellRenderer = (props) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValue(value);
    props.onCellValueChanged({ ...props.data, [name]: value });
  };

  return (
    <input
      type="text"
      name={props.colDef.field}
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default CustomCellRenderer;
