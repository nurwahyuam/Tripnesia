import React from "react";

const Button = ({ type = "button", disabled = false, className = "", color ="bg-primary text-white", children }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full py-2 px-4 ${color} rounded-lg hover:bg-primary transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
