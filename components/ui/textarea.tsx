import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-[24px] border-[2.5px] border-[#c4b89e] bg-[#f8f8f0] px-5 py-3 text-base font-medium leading-7 tracking-[0.01em] text-[#725d42] shadow-[0_3px_0_0_#d4c9b4] outline-none transition placeholder:text-[#c4b89e] focus:border-[#ffcc00] focus:shadow-[0_3px_0_0_#e0b800,0_0_0_3px_rgba(255,204,0,0.15)]",
        className,
      )}
      {...props}
    />
  );
}
