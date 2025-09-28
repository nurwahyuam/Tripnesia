import React from "react";

const InputForm = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
  return (
    <>
      {label && (
        <label className="block mb-1 text-gray-600">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 text-gray-600 ring ring-gray-500 rounded-xl focus:outline-none focus:ring focus:ring-[#29D9C2]"
      />
    </>
  );
};

export default InputForm;
