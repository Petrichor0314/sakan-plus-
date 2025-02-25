import React from "react";

export default function CustomSelect({
  value,
  options,
  onChange,
  isOpen,
  setIsOpen,
  label,
}) {
  return (
    <>
      <div className="relative">
        <label className="text-gray-900 text-sm block mb-2">{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white rounded-full py-2.5 px-4 text-sm text-left flex items-center justify-between cursor-pointer border border-gray-200 focus:outline-none"
        >
          {value}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="#1F2937"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-50">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm cursor-pointer text-gray-900 hover:text-[#1D4ED8]"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
