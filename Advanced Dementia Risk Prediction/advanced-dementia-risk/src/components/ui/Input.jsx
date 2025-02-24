import React from "react";

const Input = ({ type = "text", name, value, onChange, required }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border p-2 rounded-md w-full"
    />
  );
};

export default Input;
