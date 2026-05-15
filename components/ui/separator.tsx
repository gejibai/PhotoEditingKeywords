import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-3 w-full bg-[url('/PhotoEditingKeywords/animal-island/divider-line-teal.svg')] bg-center bg-repeat-x", className)} />;
}
