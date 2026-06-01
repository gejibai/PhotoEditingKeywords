import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function IdeaInput({
  value,
  onChange,
  onAnalyzeOverwrite,
  onAnalyzeFillEmpty,
  onAnalyzeWithDeepSeek,
  isAnalyzingWithDeepSeek,
  isDeepSeekEnabled,
  onClear,
  onRestoreDefaults,
  examples,
  effects,
}: {
  value: string;
  onChange: (value: string) => void;
  onAnalyzeOverwrite: () => void;
  onAnalyzeFillEmpty: () => void;
  onAnalyzeWithDeepSeek: () => void;
  isAnalyzingWithDeepSeek: boolean;
  isDeepSeekEnabled: boolean;
  onClear: () => void;
  onRestoreDefaults: () => void;
  examples?: string[];
  effects?: Array<{ label: string; text: string }>;
}) {
  function appendText(text: string) {
    onChange(value.trim() ? `${value.trim()}，${text}` : text);
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="例如：咖啡店随拍，加一点手账小字，保留原图氛围，底部留白方便放标题"
        className="min-h-36 text-base"
      />
      {examples?.length ? (
        <div className="flex flex-wrap gap-2">
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
      {effects?.length ? (
        <div className="space-y-2">
          <div className="text-xs font-black tracking-[0.08em] text-[#9f927d]">可选效果</div>
          <div className="flex flex-wrap gap-2">
            {effects.map((effect) => (
              <button
                key={effect.label}
                type="button"
                onClick={() => appendText(effect.text)}
                className="rounded-full border border-[#19c8b9]/60 bg-[#e6f9f6] px-3 py-2 text-xs font-bold text-[#725d42] transition hover:bg-white"
              >
                {effect.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={onAnalyzeOverwrite}>生成修图提示词</Button>
        <Button
          variant="outline"
          onClick={onAnalyzeWithDeepSeek}
          disabled={isAnalyzingWithDeepSeek}
          title={isDeepSeekEnabled ? undefined : "配置 NEXT_PUBLIC_DEEPSEEK_PROXY_URL 后启用"}
        >
          {isAnalyzingWithDeepSeek ? "AI 润色中..." : "让 AI 润色一下"}
        </Button>
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
