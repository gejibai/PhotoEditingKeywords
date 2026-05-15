import * as React from "react";
import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={cn("h-5 w-5 rounded-lg border-[2.5px] border-[#c4b89e] accent-[#19c8b9]", className)} {...props} />;
}
