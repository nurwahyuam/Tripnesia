import React, { Children } from "react";

const Table = ({ children , title, src}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-3 border border-gray-300">
      <div className="flex items-center gap-4 px-5 pt-2 pb-1">
        <img src={src} alt="All Users Icon" className="w-8 h-8" />
        <h2 className="text-gray-800 font-semibold text-xl flex items-center gap-2">{title}</h2>
      </div>

      <table className="w-full">
        {children}
      </table>
    </div>
  );
};

export default Table;
