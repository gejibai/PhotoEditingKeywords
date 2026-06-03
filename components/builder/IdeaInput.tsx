import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function IdeaInput({
  value,
  onChange,
  onAnalyzeOverwrite,
  onAnalyzeFillEmpty,
  onClear,
  onRestoreDefaults,
  examples,
  examplesOpen,
  onToggleExamples,
}: {
  value: string;
  onChange: (value: string) => void;
  onAnalyzeOverwrite: () => void;
  onAnalyzeFillEmpty: () => void;
  onClear: () => void;
  onRestoreDefaults: () => void;
  examples?: string[];
  examplesOpen: boolean;
  onToggleExamples: () => void;
}) {
  return (
    <div className="space-y-4">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="例如：咖啡店随拍，加一点手账小字，保留原图氛围，底部留白方便放标题"
        className="min-h-36 text-base"
      />
      {examples?.length ? (
        <div className="rounded-[24px] border border-[#dfd0a5] bg-[#fff9dc]/60 p-3">
          <button
            type="button"
            onClick={onToggleExamples}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <span>
              <span className="block text-sm font-black text-[#6f5528]">需要一点灵感？</span>
              <span className="mt-1 block text-xs font-semibold text-[#9f927d]">看看可直接套用的想法例子</span>
            </span>
            <span className="shrink-0 rounded-full border border-[#c4b89e] bg-[#fff8dd] px-3 py-1 text-xs font-black text-[#725d42]">
              {examplesOpen ? "收起" : "展开"}
            </span>
          </button>
          {examplesOpen ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => onChange(example)}
                  className="rounded-full border border-[#c4b89e] bg-[#fff9dc] px-3 py-2 text-left text-xs font-bold leading-5 text-[#725d42] transition hover:border-[#19c8b9] hover:bg-white"
                >
                  {example}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={onAnalyzeOverwrite}>生成修图提示词</Button>
        <Button variant="outline" onClick={onAnalyzeFillEmpty}>
          帮我补缺少的
        </Button>
        <Button variant="secondary" onClick={onClear}>
          重新写
        </Button>
        <Button variant="ghost" onClick={onRestoreDefaults}>
          套用当前方向
        </Button>
      </div>
    </div>
  );
}
