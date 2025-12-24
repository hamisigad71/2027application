"use client";

import React, { useState, useEffect } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastNotificationProps extends Toast {
  onClose: (id: string) => void;
}

function ToastNotification({
  id,
  message,
  type,
  duration = 4000,
  onClose,
}: ToastNotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const styleConfig = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200/60 dark:border-emerald-800/60",
      icon: "text-emerald-600 dark:text-emerald-400",
      text: "text-emerald-900 dark:text-emerald-100",
      progressBar: "bg-emerald-400/50 dark:bg-emerald-600/50",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950/40",
      border: "border-red-200/60 dark:border-red-800/60",
      icon: "text-red-600 dark:text-red-400",
      text: "text-red-900 dark:text-red-100",
      progressBar: "bg-red-400/50 dark:bg-red-600/50",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200/60 dark:border-blue-800/60",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-900 dark:text-blue-100",
      progressBar: "bg-blue-400/50 dark:bg-blue-600/50",
    },
  }[type];

  const icon = {
    success: <Check className={`w-5 h-5 ${styleConfig.icon}`} />,
    error: <AlertCircle className={`w-5 h-5 ${styleConfig.icon}`} />,
    info: <Info className={`w-5 h-5 ${styleConfig.icon}`} />,
  }[type];

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isExiting ? "scale-90 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div
        className={`${styleConfig.bg} ${styleConfig.border} border rounded-lg shadow-md backdrop-blur-sm overflow-hidden px-5 py-4 max-w-md`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 mt-0.5">{icon}</div>

          {/* Message */}
          <div className="flex-1">
            <p className={`${styleConfig.text} font-medium text-sm`}>
              {message}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`${styleConfig.progressBar} h-0.5 mt-3 rounded-full`}
          style={{
            animation: `shrink ${duration}ms linear`,
          }}
        />

        <style>{`
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col gap-4 items-center pointer-events-auto">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <ToastNotification {...toast} onClose={onRemove} />
          </div>
        ))}
      </div>
    </div>
  );
}
