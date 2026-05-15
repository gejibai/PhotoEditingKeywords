"use client";

import { Divider } from "animal-island-ui";
import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return <Divider type="line-teal" className={cn(className)} />;
}
