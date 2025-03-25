"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type PopupProps = {
  title: string; // Popup title
  confirmText?: string; // Text for confirm button
  cancelText?: string; // Text for cancel button
  showCancel?: boolean; // Show cancel button (default: false)
  onConfirm: () => void; // Confirm button action
  onCancel?: () => void; // Cancel button action
};

const Popup: React.FC<PopupProps> = ({
  title,
  confirmText = "Okay",
  cancelText = "Cancel",
  showCancel = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#262626] rounded-md w-[350px] p-5 relative text-white">
        {/* Close Button (Top Right) */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
        >
          <X size={18} />
        </button>

        {/* Centered SVG Icon with Padding */}
        <div className="flex justify-center mb-4 pt-4">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 0.5C14.5388 0.5 11.1554 1.52636 8.27753 3.44928C5.39967 5.37221 3.15665 8.10533 1.83212 11.303C0.507582 14.5007 0.161024 18.0194 0.836265 21.4141C1.51151 24.8087 3.17822 27.9269 5.62564 30.3744C8.07306 32.8218 11.1913 34.4885 14.5859 35.1637C17.9806 35.839 21.4993 35.4924 24.697 34.1679C27.8947 32.8433 30.6278 30.6003 32.5507 27.7225C34.4736 24.8446 35.5 21.4612 35.5 18C35.4949 13.3603 33.6495 8.91204 30.3687 5.63126C27.088 2.35048 22.6397 0.505095 18 0.5ZM18 26.75C17.6539 26.75 17.3155 26.6474 17.0278 26.4551C16.74 26.2628 16.5157 25.9895 16.3832 25.6697C16.2508 25.3499 16.2161 24.9981 16.2836 24.6586C16.3512 24.3191 16.5178 24.0073 16.7626 23.7626C17.0073 23.5178 17.3191 23.3511 17.6586 23.2836C17.9981 23.2161 18.3499 23.2508 18.6697 23.3832C18.9895 23.5157 19.2628 23.74 19.4551 24.0277C19.6474 24.3155 19.75 24.6539 19.75 25C19.75 25.4641 19.5656 25.9092 19.2374 26.2374C18.9093 26.5656 18.4641 26.75 18 26.75ZM19.75 19.75C19.75 20.2141 19.5656 20.6592 19.2374 20.9874C18.9093 21.3156 18.4641 21.5 18 21.5C17.5359 21.5 17.0908 21.3156 16.7626 20.9874C16.4344 20.6592 16.25 20.2141 16.25 19.75V11C16.25 10.5359 16.4344 10.0907 16.7626 9.76256C17.0908 9.43437 17.5359 9.25 18 9.25C18.4641 9.25 18.9093 9.43437 19.2374 9.76256C19.5656 10.0907 19.75 10.5359 19.75 11V19.75Z"
              fill="#A3A3A3"
            />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
          >
            {confirmText}
          </Button>
          {showCancel && (
            <Button
              onClick={onCancel}
              className="bg-[#525252] hover:bg-[#4B4B4B] text-[#A3A3A3] px-4 py-2"
            >
              {cancelText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
