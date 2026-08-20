"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "./utils";

export type ToastType = "error" | "success" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let globalShowToast: ((type: ToastType, message: string, title?: string, duration?: number) => void) | null = null;

export const toast = {
  error: (message: string, title = "Error") => {
    if (globalShowToast) globalShowToast("error", message, title);
  },
  success: (message: string, title = "Success") => {
    if (globalShowToast) globalShowToast("success", message, title);
  },
  info: (message: string, title = "Notice") => {
    if (globalShowToast) globalShowToast("info", message, title);
  },
  warning: (message: string, title = "Warning") => {
    if (globalShowToast) globalShowToast("warning", message, title);
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  globalShowToast = showToast;

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast,
      showToast: (type: ToastType, message: string, title?: string) => toast[type](message, title),
      removeToast: () => {},
    };
  }
  return ctx;
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-end gap-3 px-4 py-6 sm:p-6"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onRemove={() => onRemove(item.id)} />
      ))}
    </div>
  );
}

const TYPE_CONFIG = {
  error: {
    icon: AlertCircle,
    border: "border-red-500/40",
    bg: "bg-surface shadow-2xl shadow-red-950/20",
    iconColor: "text-red-500",
    titleColor: "text-red-600 dark:text-red-400",
    accent: "bg-red-500",
  },
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/40",
    bg: "bg-surface shadow-2xl shadow-emerald-950/20",
    iconColor: "text-emerald-500",
    titleColor: "text-emerald-600 dark:text-emerald-400",
    accent: "bg-emerald-500",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/40",
    bg: "bg-surface shadow-2xl shadow-amber-950/20",
    iconColor: "text-amber-500",
    titleColor: "text-amber-600 dark:text-amber-400",
    accent: "bg-amber-500",
  },
  info: {
    icon: Info,
    border: "border-sky-500/40",
    bg: "bg-surface shadow-2xl shadow-sky-950/20",
    iconColor: "text-sky-500",
    titleColor: "text-sky-600 dark:text-sky-400",
    accent: "bg-sky-500",
  },
};

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: () => void }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto relative flex w-full max-w-sm overflow-hidden rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 sm:slide-in-from-right-3",
        config.bg,
        config.border
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.accent)} />
      <div className="flex items-start gap-3 pl-1">
        <Icon size={20} className={cn("shrink-0 mt-0.5", config.iconColor)} aria-hidden />
        <div className="min-w-0 flex-1">
          {item.title && <h4 className={cn("text-sm font-bold tracking-tight", config.titleColor)}>{item.title}</h4>}
          <p className="mt-0.5 text-xs font-medium text-ink-muted leading-relaxed break-words">{item.message}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 -mr-1 -mt-1 rounded-md p-1 text-ink-subtle hover:bg-black/5 hover:text-ink transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
