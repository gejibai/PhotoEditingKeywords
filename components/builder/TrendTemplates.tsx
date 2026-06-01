import { trendTemplates } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TrendTemplates({
  open,
  selectedTrendId,
  onToggle,
  onSelect,
}: {
  open: boolean;
  selectedTrendId: string | null;
  onToggle: () => void;
  onSelect: (trendId: string) => void;
}) {
  return (
    <section className="animal-panel rounded-[30px] p-4 md:p-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span>
          <span className="block text-xl font-black tracking-[0.01em] text-[#794f27]">
            最近流行灵感
          </span>
          <span className="mt-1 block text-sm font-semibold leading-6 text-[#9f927d]">
            把最近好看的修图玩法先藏在这里，想换口味再展开。
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-[#c4b89e] bg-[#fff9dc] px-4 py-2 text-sm font-black text-[#725d42]">
          {open ? "收起" : "展开"}
        </span>
      </button>

      {open ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {trendTemplates.map((trend) => (
            <button
              key={trend.id}
              type="button"
              onClick={() => onSelect(trend.id)}
              className={cn(
                "animal-button-press min-h-32 rounded-[24px] border-2 bg-[#fff8dd] p-4 text-left transition",
                selectedTrendId === trend.id
                  ? "border-[#a88a43] bg-[#fff0bf]"
                  : "border-[#dfd0a5] text-[#725d42]",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <strong className="text-base font-black text-[#3b2f1d]">{trend.name}</strong>
                <span className="shrink-0 rounded-full bg-[#3b2f1d] px-3 py-1 text-xs font-black text-[#fff8de]">
                  {trend.tag}
                </span>
              </span>
              <span className="mt-3 block text-sm font-semibold leading-6 text-[#7a6a4b]">
                {trend.description}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
