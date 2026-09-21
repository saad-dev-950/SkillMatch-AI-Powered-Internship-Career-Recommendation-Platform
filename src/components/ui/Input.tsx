import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
              error ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400",
              className
            )
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-rose-600 animate-in fade-in-50">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
