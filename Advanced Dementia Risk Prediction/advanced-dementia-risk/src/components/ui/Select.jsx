import React from "react";

const Select = ({ name, value, onChange, children, required }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border p-2 rounded-md w-full"
    >
      {children}
    </select>
  );
};

export default Select;
