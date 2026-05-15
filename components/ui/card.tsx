"use client";

import * as React from "react";
import { Card as AnimalCard } from "animal-island-ui";
import { cn } from "@/lib/utils";

type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color">;

export function Card({ className, ...props }: CardProps) {
  return (
    <AnimalCard
      className={cn("backdrop-blur", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2 p-5 pb-3 text-[#725d42]", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-3 text-[#725d42]", className)} {...props} />;
}
