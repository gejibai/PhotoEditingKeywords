import { categories } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/prompt";

export function CategoryCards({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-8">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            "min-h-32 min-w-40 rounded-[24px] border bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft",
            selectedCategory === category.id ? "border-blue-300 ring-4 ring-blue-100" : "border-slate-200",
          )}
        >
          <span className={cn("mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold", category.accent)}>
            {category.name.slice(0, 2)}
          </span>
          <strong className="block text-sm font-bold text-slate-950">{category.name}</strong>
          <span className="mt-2 block text-xs leading-5 text-slate-500">{category.description}</span>
        </button>
      ))}
    </div>
  );
}
