"use client";
import React, { useReducer, ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReportFormProps {
  statusBarSteps?: React.ReactNode[];
  statusBarColorOverride?: { [index: number]: string };
  stepNameColorOverride?: { [index: number]: string };
  children: ReactNode;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  buttons: ButtonConfig[];
  onDeleteClick?: () => void; // New optional prop for Delete
  onCopyClick?: () => void; // New optional prop for Create a Copy
  onSaveChanges?: () => void;
  showButton?: boolean;
  headerTitle?: string;
  showDropdown?: boolean;
  showBackArrow?: boolean;
}

interface ButtonConfig {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    isDisabled?: boolean;
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

const ReportForm: React.FC<ReportFormProps> = ({
  statusBarSteps,
  statusBarColorOverride,
  stepNameColorOverride,
  children,
  isEditable,
  setIsEditable,
  buttons,
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
    <div className="container mx-auto py-10 pt-6 pr-10 pl-[60px]">

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
           {buttons.map((btn, index) =>(
                <Button
                variant="ghost"
                size="icon"
                disabled={btn.isDisabled}
                className={`hover:bg-[#cdcccc] ${btn.isDisabled ? "bg-[#A3A3A3] cursor-not-allowed" : "bg-[#FAFAFA]"} flex items-center w-auto px-4 py-2 rounded-lg`}
                onClick={btn.onClick}
              >
                {btn.icon && (
                  <span className="flex items-center">{btn.icon}</span>
                )}
                <span className="text-[#404040] text-sm font-medium leading-[21px]">{btn.label}</span>
              </Button>
            ))
            }
          </div>
        </div>

        {/* Status Bar */}
        <div className="relative flex items-center px-6 py-4">
        {statusBarSteps ? statusBarSteps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className="flex-grow h-px mx-4"
                style={{ backgroundColor: statusBarColorOverride ? statusBarColorOverride[index - 1] : "##0E9F6E"}}
              ></div>
            )}
            <div
              className="flex items-center space-x-2 text-sm"
              style={{ color: stepNameColorOverride ? stepNameColorOverride[index] : "##0E9F6E" }}
            >
              {step}
            </div>
          </React.Fragment>
        )):""}
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

export default ReportForm;