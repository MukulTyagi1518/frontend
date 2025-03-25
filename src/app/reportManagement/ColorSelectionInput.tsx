"use client";

import { useState } from "react";

interface ColorPickerProps {
  label: string;
  defaultColor?: string;
  onChange: (color: string) => void;
}

const ColorSelectionInput: React.FC<ColorPickerProps> = ({ label, defaultColor = "#000000", onChange }) => {
  const [color, setColor] = useState(defaultColor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-400">
        {label} <span className="text-red-500">*</span>
    </label>

      {/* Input Field with Color Picker */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={color}
          readOnly
          className="w-full bg-[#171717] text-gray-400 border border-gray-600 px-3 py-2 rounded"
        />
        <input
          type="color"
          value={color}
          onChange={handleChange}
          className="absolute right-3 w-5 h-5 cursor-pointer"
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            border: "none",
            padding: 0,
            width: "20px",
            height: "20px",
            backgroundColor: color,
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default ColorSelectionInput;
