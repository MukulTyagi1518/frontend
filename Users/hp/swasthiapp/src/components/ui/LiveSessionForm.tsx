"use client";

import React, { useReducer, ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface LiveSessionFormProps {
  breadcrumb: string[];
  breadcrumbLinks?: string[];
  breadcrumbIcons: React.ReactNode[];
  statusBarSteps?: React.ReactNode[];
  statusBarColorOverride?: { [index: number]: string };
  children: ReactNode;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  actionButtonLabel?: string;
  actionButtonIcon?: React.ReactNode;
  onActionButtonClick?: () => void;
  onDeleteClick?: () => void; // New optional prop for Delete
  onCopyClick?: () => void; // New optional prop for Create a Copy
  onSaveChanges?: () => void;
  showButton?: boolean;
  headerTitle?: string;
  showDropdown?: boolean;
  showBackArrow?: boolean;
}

type ToggleAction = { type: "TOGGLE" } | { type: "SET"; payload: boolean };

const toggleReducer = (state: boolean, action: ToggleAction): boolean => {
  switch (action.type) {
    case "TOGGLE":
      return !state;
    case "SET":
      return action.payload;
    default:
      return state;
  }
};

const LiveSessionForm: React.FC<LiveSessionFormProps> = ({
  breadcrumb,
  breadcrumbLinks,
  breadcrumbIcons,
  statusBarSteps,
  statusBarColorOverride,
  children,
  isEditable,
  setIsEditable,
  actionButtonLabel,
  actionButtonIcon,
  onActionButtonClick,
  onDeleteClick, // New prop
  onCopyClick, // New prop
  onSaveChanges,
  showButton = true,
  headerTitle,
  showDropdown = true,
  showBackArrow = false,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useReducer(toggleReducer, false);
  const [dropdownOpen, setDropdownOpen] = useReducer(toggleReducer, false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEditClick = () => {
    if (isEditable && onSaveChanges) {
      onSaveChanges(); // Call the save handler when saving changes
    } else {
      setIsEditable((prev) => !prev); // Toggle edit mode
    }
    setDropdownOpen({ type: "SET", payload: false });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen({ type: "SET", payload: false });
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="container mx-auto py-10 pt-10 pr-10 pl-[60px]">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500 flex items-center space-x-2">
        {breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            {/* Divider for breadcrumbs */}
            {index > 0 && <span className="text-lg text-white">›</span>}

            {/* Breadcrumb with or without an icon */}
            <div className="flex items-center space-x-2">
              {breadcrumbIcons[index] && (
                <span className="text-lg">{breadcrumbIcons[index]}</span>
              )}
              {breadcrumbLinks && breadcrumbLinks[index] ? (
                <button
                  className="text-lg text-white hover:underline focus:outline-none"
                  onClick={() => router.push(breadcrumbLinks[index])}
                >
                  {item}
                </button>
              ) : (
                <span className="text-lg text-white">{item}</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Main Component */}
      <div className="border border-[#525252] rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#525252]">
          <div className="flex items-center space-x-2">
            {showBackArrow && (
              <ChevronLeft
                className="h-6 w-6 text-white cursor-pointer"
                onClick={() => router.back()}
              />
            )}
            <h1 className="text-xl font-bold text-white">
              {headerTitle || "Live Session Details"}
            </h1>
          </div>
          <div className="flex items-center space-x-4 relative">
            {actionButtonLabel && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-neutral-700 bg-neutral-800 flex items-center w-auto px-4 py-2 rounded-lg"
                onClick={onActionButtonClick}
              >
                {actionButtonIcon && (
                  <span className="flex items-center">{actionButtonIcon}</span>
                )}
                <span className="text-white">{actionButtonLabel}</span>
              </Button>
            )}

            {/* Conditional Dropdown */}
            {showDropdown && (
              <>
                <Button
                  aria-expanded={dropdownOpen}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-neutral-700 bg-neutral-800"
                  onClick={() => setDropdownOpen({ type: "TOGGLE" })}
                >
                  <MoreHorizontal className="h-6 w-6 text-white" />
                </Button>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-40 bg-[#262626] border border-gray-600 rounded-md shadow-lg text-white z-50"
                    style={{
                      top: "100%",
                      marginTop: "0.5rem",
                    }}
                  >
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-700"
                      onClick={handleEditClick}
                      style={{
                        borderBottom: "1px solid var(--Neutral-600, #525252)",
                      }}
                    >
                      {isEditing ? "Save Changes" : "Edit"}
                    </button>
                    {onCopyClick && (
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-700"
                        onClick={onCopyClick}
                        style={{
                          borderBottom: "1px solid var(--Neutral-600, #525252)",
                        }}
                      >
                        Create a Copy
                      </button>
                    )}
                    {onDeleteClick && (
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-700"
                        onClick={onDeleteClick}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="relative flex items-center px-6 py-4">
          {(statusBarSteps ?? []).map((step, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <div
                  className="flex-grow h-px mx-4"
                  style={{
                    backgroundColor:
                      statusBarColorOverride?.[index] || "#525252",
                  }}
                ></div>
              )}
              <div
                className={`flex items-center space-x-2 text-sm ${
                  index === 0 ? "text-[#0E9F6E]" : "text-gray-400"
                }`}
              >
                {step}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Form Fields */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4">
          {showButton && (
            <Button
              onClick={handleEditClick}
              className="bg-[#A3A3A3] px-4 py-2"
            >
              {isEditable ? "Save Changes" : "Edit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSessionForm;
