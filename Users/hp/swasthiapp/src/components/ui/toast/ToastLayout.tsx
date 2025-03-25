"use client";

import { ToastProvider } from "@/components/ui/toast/toast-context";
import Toast from "@/components/ui/toast/Toast";

const ToastLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      {children}
      <Toast />
    </ToastProvider>
  );
};

export default ToastLayout;