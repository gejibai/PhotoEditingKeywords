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
        "relative h-8 w-14 rounded-full border-[2.5px] transition disabled:opacity-50",
        checked
          ? "border-[#6fba2c] bg-[#86d67a] shadow-[0_3px_0_0_#5a9e1e]"
          : "border-[#c4b89e] bg-[#d4c9b4] shadow-[0_3px_0_0_#bdaea0]",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-[0_3px_0_0_#bdaea0] transition",
          checked && "translate-x-6",
        )}
      />
    </button>
  );
}
