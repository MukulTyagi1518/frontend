"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  placeholder?: string;
  onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  placeholder = "Select...",
  onChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   onChange(selectedOptions);
  // }, [selectedOptions, onChange]);

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions, onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSelection = (item: string) => {
    setSelectedOptions((prev) =>
      prev.includes(item) ? prev.filter((opt) => opt !== item) : [...prev, item]
    );
  };

  // Filter and sort options based on search term
  const filteredOptions = options
    .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aSelected: any = selectedOptions.includes(a);
      const bSelected: any = selectedOptions.includes(b);
      return bSelected - aSelected; // Show selected items at the top
    });

  return (
    <div className="space-y-2 relative multi-select-dropdown" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-400">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Custom Select Button */}
      <div
        className="w-full bg-[#171717] text-gray-400 border border-[#A3A3A3] px-3 py-2 rounded-[8px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1 bg-[#262626] px-[6px] py-[2px] rounded-lg"
              >
                <span className="text-[#FAFAFA] text-xs font-medium leading-[18px]">{`<${item}>`}</span>
                <X
                  className="w-3 h-3 cursor-pointer text-[#FAFAFA] hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(item);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="absolute right-4 bottom-4">
          <ChevronDown className="w-3 h-3 cursor-pointer text-[#FAFAFA] hover:text-white" />
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-[#171717] text-white border border-gray-600 rounded-md shadow-lg z-50">
          {/* Search Input */}
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#262626] text-gray-400 border border-[#525252] px-4 py-2 rounded outline-none"
            />
          </div>

          {/* Scrollable Options List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className="hover:bg-gray-700 flex items-center px-4 py-2 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => toggleSelection(option)}
                    className="mr-2"
                  />
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;