"use client";

import { Switch as AnimalSwitch } from "animal-island-ui";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <span className={cn("inline-flex")}>
      <AnimalSwitch
        checked={checked}
        disabled={disabled}
        onChange={onCheckedChange}
        checkedChildren="ON"
        unCheckedChildren="OFF"
      />
    </span>
  );
}
