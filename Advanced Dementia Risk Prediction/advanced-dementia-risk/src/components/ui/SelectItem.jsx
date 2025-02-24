import React from "react";

const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

export default SelectItem;
