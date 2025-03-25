"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Toast types
type ToastType = "success" | "error" | "draft";

// Toast Data Structure
interface ToastProps {
  id: number;
  type: ToastType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, "id">) => void;
  toasts: ToastProps[];
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (toast: Omit<ToastProps, "id">) => {
    const newToast = { ...toast, id: Date.now() };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};