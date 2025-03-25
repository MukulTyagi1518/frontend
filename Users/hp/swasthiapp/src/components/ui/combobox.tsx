"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Search } from "lucide-react";

interface ComboboxProps {
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  placeholderBgColor?: string;
  disabled?: boolean; // New prop for disabled state
}

export function Combobox({
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = "Search...",
  className = "",
  placeholderBgColor = "bg-neutral-950",
  disabled = false, // Default to enabled
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const filteredOptions = query
    ? options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // Close dropdown if disabled state changes to true
  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled]);

  const handleDropdownToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const toggleOption = (option: string) => {
    if (!disabled) {
      const updatedSelections = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];
      onSelectionChange(updatedSelections);
    }
  };

  return (
    <div className={`combobox-root relative ${className}`}>
      {/* Dropdown button */}
      <div
        className={`flex items-center justify-between p-1.5 
          ${placeholderBgColor} 
          ${disabled ? " cursor-not-allowed " : "cursor-pointer"} 
          text-gray-400 border border-neutral-600 rounded-md`}
        onClick={handleDropdownToggle}
      >
        <span className={`text-[15px] ${disabled ? "" : ""}`}>
          {selectedOptions.length > 0
            ? selectedOptions.join(", ")
            : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 ${disabled ? "" : ""}`}
        />
      </div>

      {/* Dropdown content */}
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-md bg-[#262626] text-white shadow-lg ring-1 ring-black ring-opacity-5">
          {/* Search Input */}
          <div className="flex items-center px-4 py-2 bg-[#171717]">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <Input
              placeholder={placeholder}
              className="w-full text-gray-400 bg-transparent border-none focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Options list */}
          <ul className="divide-y divide-gray-600">
            {filteredOptions.map((option) => (
              <li
                key={option}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-neutral-700"
              >
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={() => toggleOption(option)}
                />
                <span className="ml-2">{option}</span>
              </li>
            ))}
          </ul>

          {/* No options message */}
          {filteredOptions.length === 0 && (
            <div className="px-4 py-2 text-center text-gray-500">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
