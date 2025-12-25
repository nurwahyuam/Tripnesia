import { Minus, Plus, Users } from "lucide-react";
import React, { useState } from "react";

const GuestSelector = ({ value, onChange, welcome = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full md:w-auto">
      <div className="flex items-center border border-gray-300 hover:border-gray-400 rounded-xl px-3 py-2.5 gap-2 bg-white cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Users className="text-gray-400 w-5 h-5" />
        <span className="text-gray-400 ml-2">{value !== null ? value : "Select Number of Guest"}</span>
        {welcome && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`absolute top-3.5 right-5 h-5 w-5 transition-transform ${isOpen ? "rotate-180 text-gray-700" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-lg shadow-xl p-4 z-10">
          <div className="flex justify-between items-center mb-2 pb-2">
            <span className="font-medium text-gray-600">Guests</span>
            <div className="flex items-center gap-2 border border-gray-400 rounded-md p-2">
              <button onClick={() => onChange(Math.max(1, value - 1))} className="w-6 h-6 flex items-center justify-center border-2 border-gray-500 rounded hover:bg-gray-100">
                <Minus className="text-gray-600 w-4 h-4" />
              </button>
              <span className="min-w-8 text-center font-medium text-gray-600">{value !== null ? value : 0}</span>
              <button onClick={() => onChange(value + 1)} className="w-6 h-6 flex items-center justify-center border-2 border-gray-500 rounded hover:bg-gray-100">
                <Plus className="text-gray-600 h-4 w-4" />
              </button>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-full py-2 bg-primary text-white rounded-lg hover:opacity-90 cursor-pointer transition">
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
