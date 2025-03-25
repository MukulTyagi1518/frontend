"use client";

import React from "react";
import { useToast } from "@/components/ui/toast/toast-context";

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 space-y-4 z-50">
      {toasts.map(({ id, type, title, description, actionText, onAction }) => (
        <div
          key={id}
          className={`flex items-start p-4 rounded-md shadow-lg w-[300px] bg-[#262626]`}
        >
          {/* Icon */}
          <div className="mt-1">
            {type === "success" && (
              <svg
                className="w-6 h-6 text-[#31C48D]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="10" fill="#31C48D" />
                <path
                  d="M9 12.5l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {type === "error" && (
              <svg
                className="w-6 h-6 text-[#F05252]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="10" fill="#F05252" />
                <path
                  d="M15 9l-6 6M9 9l6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {type === "draft" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 2.25C7.66498 2.25 6.35994 2.64588 5.2499 3.38758C4.13987 4.12928 3.27471 5.18348 2.76382 6.41689C2.25292 7.65029 2.11925 9.00749 2.3797 10.3169C2.64015 11.6262 3.28303 12.829 4.22703 13.773C5.17104 14.717 6.37377 15.3598 7.68314 15.6203C8.99251 15.8807 10.3497 15.7471 11.5831 15.2362C12.8165 14.7253 13.8707 13.8601 14.6124 12.7501C15.3541 11.6401 15.75 10.335 15.75 9C15.748 7.21039 15.0362 5.49464 13.7708 4.2292C12.5054 2.96375 10.7896 2.25197 9 2.25ZM11.5022 8.12722L8.80223 10.8272C8.67565 10.9538 8.50399 11.0249 8.325 11.0249C8.14602 11.0249 7.97436 10.9538 7.84778 10.8272L6.49778 9.47722C6.37482 9.34992 6.30678 9.17941 6.30832 9.00243C6.30986 8.82545 6.38085 8.65615 6.506 8.531C6.63115 8.40585 6.80045 8.33486 6.97743 8.33332C7.15441 8.33178 7.32492 8.39982 7.45223 8.52277L8.325 9.39555L10.5478 7.17277C10.6751 7.04982 10.8456 6.98178 11.0226 6.98332C11.1996 6.98486 11.3689 7.05585 11.494 7.181C11.6192 7.30615 11.6901 7.47545 11.6917 7.65243C11.6932 7.82941 11.6252 7.99992 11.5022 8.12722Z"
                  fill="#FAFAFA"
                />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            <h3
              className={`text-sm font-semibold ${
                type === "success"
                  ? "text-[#31C48D]"
                  : type === "draft"
                  ? "text-white"
                  : "text-[#F05252]"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-xs font-Lato mt-1 ${
                type === "success"
                  ? "text-[#A3E4D7]"
                  : type === "draft"
                  ? "text-gray-400"
                  : "text-[#F8BABA]"
              }`}
            >
              {description}
            </p>

            {/* Action Button */}
            {actionText && (
              <button
                onClick={() => {
                  if (onAction) onAction();
                  removeToast(id);
                }}
                className={`mt-2 px-4 py-1 font-Lato text-sm font-medium rounded-md ${
                  type === "success"
                    ? "bg-[#057A55] text-white border border-[#057A55] hover:bg-[#056346]"
                    : type === "draft"
                    ? "border border-gray-400 text-white hover:bg-gray-600"
                    : "bg-[#E02424] text-white border border-[#E02424] hover:bg-[#B91C1C]"
                }`}
              >
                {actionText}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => removeToast(id)}
            className={`ml-4 hover:text-gray-300 ${
              type === "success"
                ? "text-[#057A55]"
                : type === "draft"
                ? "text-gray-400"
                : "text-[#E02424]"
            }`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;