import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, children, variant = "primary", ...props }: BadgeProps) {
  const variants = {
    primary: "bg-indigo-50 text-indigo-700 border-indigo-200",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    outline: "bg-transparent text-slate-600 border-slate-300",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
