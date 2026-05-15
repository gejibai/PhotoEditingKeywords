"use client";

import * as React from "react";
import { Input as AnimalInput } from "animal-island-ui";
import { cn } from "@/lib/utils";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> & {
  allowClear?: boolean;
};

export function Input({ className, ...props }: InputProps) {
  return (
    <AnimalInput
      size="large"
      className={cn(
        "w-full",
        className,
      )}
      {...props}
    />
  );
}
