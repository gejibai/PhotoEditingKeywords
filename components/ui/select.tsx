"use client";

import * as React from "react";
import { Select as AnimalSelect, type SelectOption } from "animal-island-ui";
import { cn } from "@/lib/utils";

export function SelectNative({ className, children, value, onChange, disabled }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const options: SelectOption[] = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => {
      const option = child as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>;
      const optionValue = String(option.props.value ?? option.props.children ?? "");
      return {
        key: optionValue,
        label: String(option.props.children ?? optionValue),
      };
    });

  return (
    <div className={cn("w-full", className)}>
      <AnimalSelect
        options={options}
        value={String(value ?? "")}
        disabled={disabled}
        onChange={(key) => {
          const fakeTarget = { value: key } as HTMLSelectElement;
          onChange?.({
            target: fakeTarget,
            currentTarget: fakeTarget,
          } as React.ChangeEvent<HTMLSelectElement>);
        }}
      />
    </div>
  );
}
