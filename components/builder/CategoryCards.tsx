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
    <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-8">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            "animal-button-press min-h-36 min-w-40 rounded-[45px] border-[2.5px] bg-[#f7f3df] p-4 text-left transition",
            "hover:-translate-y-1",
            selectedCategory === category.id
              ? "border-[#11a89b] bg-[#82d5bb] text-white"
              : "border-[#c4b89e] text-[#725d42]",
          )}
        >
          <span className={cn("mb-4 inline-flex rounded-[18px] border-2 border-white/60 bg-white/35 px-3 py-1 text-xs font-black tracking-[0.05em]", category.accent)}>
            {category.name.slice(0, 2)}
          </span>
          <strong className="block text-sm font-black text-inherit">{category.name}</strong>
          <span className="mt-2 block text-xs font-semibold leading-5 opacity-80">{category.description}</span>
        </button>
      ))}
    </div>
  );
}
