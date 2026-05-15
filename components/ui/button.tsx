import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "dark" | "danger";
  size?: "default" | "sm" | "lg";
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100",
        size === "sm" && "h-9 px-3 text-sm",
        size === "default" && "min-h-11 px-5 text-sm",
        size === "lg" && "min-h-12 px-6 text-base",
        variant === "default" && "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)] hover:bg-blue-700",
        variant === "secondary" && "bg-slate-100 text-slate-900 hover:bg-slate-200",
        variant === "outline" && "border border-slate-200 bg-white text-blue-700 hover:bg-blue-50",
        variant === "ghost" && "bg-transparent text-slate-600 hover:bg-slate-100",
        variant === "dark" && "bg-slate-950 text-white hover:bg-slate-800",
        variant === "danger" && "bg-red-50 text-red-700 hover:bg-red-100",
        className,
      )}
      {...props}
    />
  );
}
