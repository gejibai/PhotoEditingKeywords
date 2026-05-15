"use client";

import * as React from "react";
import { Button as AnimalButton } from "animal-island-ui";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "dark" | "danger";
  size?: "default" | "sm" | "lg";
  loading?: boolean;
  htmlType?: "submit" | "reset" | "button";
};

export function Button({ className, variant = "default", size = "default", loading, disabled, htmlType, ...props }: ButtonProps) {
  const type = variant === "default" ? "primary" : variant === "danger" ? "primary" : variant === "ghost" ? "text" : "default";
  const animalSize = size === "sm" ? "small" : size === "lg" ? "large" : "middle";
  return (
    <AnimalButton
      type={type}
      size={animalSize}
      danger={variant === "danger"}
      ghost={variant === "outline"}
      loading={loading}
      disabled={disabled}
      htmlType={htmlType}
      className={cn(
        "font-bold",
        variant === "dark" && "border-[#3d3028] bg-[#2b2118] text-[#e8d5bc]",
        variant === "secondary" && "bg-[#f8f8f0] text-[#725d42]",
        className,
      )}
      {...props}
    />
  );
}
