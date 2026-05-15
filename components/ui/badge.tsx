import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-[10px] border-2 border-[#9f927d]/40 bg-[#fff9dc] px-3 py-1 text-xs font-bold tracking-[0.03em] text-[#794f27]", className)}
      {...props}
    />
  );
}
