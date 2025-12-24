"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastType, ToastContainer } from "./toast-notification";

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration = 4000) => {
      addToast(message, "success", duration);
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string, duration = 4000) => {
      addToast(message, "error", duration);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, duration = 4000) => {
      addToast(message, "info", duration);
    },
    [addToast]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{ addToast, showSuccess, showError, showInfo }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
