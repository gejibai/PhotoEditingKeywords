import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { BuilderMode } from "@/types/prompt";

export function ModeSwitch({
  mode,
  onModeChange,
}: {
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
}) {
  const ai = mode === "ai";
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <span className="text-sm font-semibold text-slate-700">离线规则</span>
      <Switch checked={ai} onCheckedChange={(checked) => onModeChange(checked ? "ai" : "offline")} />
      <span className="text-sm font-semibold text-slate-700">AI 增强</span>
      <Badge className={ai ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}>
        {ai ? "失败会自动降级" : "本地可用"}
      </Badge>
    </div>
  );
}
