"use client";

import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { ToastItem } from "@/components/providers/ToastProvider";

export type ToastType = "success" | "error" | "warning" | "info";

const typeStyles: Record<
  ToastType,
  {
    bg: string;
    border: string;
    icon: React.ReactNode;
    titleColor: string;
  }
> = {
  success: {
    bg: "bg-white dark:bg-slate-900",
    border: "border-emerald-500/30 dark:border-emerald-500/40",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    titleColor: "text-emerald-700 dark:text-emerald-400",
  },
  error: {
    bg: "bg-white dark:bg-slate-900",
    border: "border-rose-500/30 dark:border-rose-500/40",
    icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    titleColor: "text-rose-700 dark:text-rose-400",
  },
  warning: {
    bg: "bg-white dark:bg-slate-900",
    border: "border-amber-500/30 dark:border-amber-500/40",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    titleColor: "text-amber-700 dark:text-amber-400",
  },
  info: {
    bg: "bg-white dark:bg-slate-900",
    border: "border-indigo-500/30 dark:border-indigo-500/40",
    icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
    titleColor: "text-indigo-700 dark:text-indigo-400",
  },
};

export function Toast({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const style = typeStyles[toast.type];

  return (
    <div
      role="status"
      className={`pointer-events-auto p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 ${style.bg} ${style.border}`}
    >
      {style.icon}
      <div className="flex-1 text-xs sm:text-sm">
        {toast.title && <h4 className={`font-bold mb-0.5 ${style.titleColor}`}>{toast.title}</h4>}
        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
