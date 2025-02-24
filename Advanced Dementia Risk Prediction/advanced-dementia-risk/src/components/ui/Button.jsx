import React from "react";

const Button = ({ children, type = "button", onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      {children}
    </button>
  );
};

export default Button;
