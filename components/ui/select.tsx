import * as React from "react";
import { cn } from "@/lib/utils";

export function SelectNative({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-[50px] border-[2.5px] border-[#c4b89e] bg-[#f8f8f0] px-5 text-base font-medium tracking-[0.01em] text-[#725d42] shadow-[0_3px_0_0_#d4c9b4] outline-none transition focus:border-[#ffcc00] focus:shadow-[0_3px_0_0_#e0b800,0_0_0_3px_rgba(255,204,0,0.15)]",
        className,
      )}
      {...props}
    />
  );
}
