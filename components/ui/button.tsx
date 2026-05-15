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
        "animal-button-press inline-flex items-center justify-center gap-2 border-2 font-semibold tracking-[0.02em] disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19c8b9]",
        size === "sm" && "h-9 px-3 text-sm",
        size === "default" && "min-h-[45px] rounded-[50px] px-5 text-sm",
        size === "lg" && "min-h-12 rounded-3xl px-8 text-base",
        variant === "default" && "border-[#11a89b] bg-[#19c8b9] text-white hover:bg-[#3dd4c6]",
        variant === "secondary" && "border-[#c4b89e] bg-[#f8f8f0] text-[#725d42] hover:bg-[#fff9dc]",
        variant === "outline" && "border-[#19c8b9] bg-[#e6f9f6] text-[#725d42] hover:bg-white",
        variant === "ghost" && "border-transparent bg-transparent text-[#725d42] shadow-none hover:bg-[#e6f9f6]",
        variant === "dark" && "border-[#3d3028] bg-[#2b2118] text-[#e8d5bc] hover:bg-[#3d3028]",
        variant === "danger" && "border-[#c94444] bg-[#e05a5a] text-white hover:bg-[#f06f6f]",
        className,
      )}
      {...props}
    />
  );
}
