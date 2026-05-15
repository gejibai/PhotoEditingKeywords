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
    <button
      type="button"
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-8 w-14 rounded-full border border-slate-200 transition disabled:opacity-50",
        checked ? "bg-blue-600" : "bg-slate-200",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition",
          checked && "translate-x-6",
        )}
      />
    </button>
  );
}
