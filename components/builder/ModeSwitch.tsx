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
    <div className="flex flex-wrap items-center gap-3 rounded-[50px] border-2 border-[#c4b89e] bg-[#f7f3df] px-4 py-2 shadow-[0_3px_0_0_#d4c9b4]">
      <span className="text-sm font-bold text-[#725d42]">离线规则</span>
      <Switch checked={ai} onCheckedChange={(checked) => onModeChange(checked ? "ai" : "offline")} />
      <span className="text-sm font-bold text-[#725d42]">AI 增强</span>
      <Badge className={ai ? "bg-[#e6f9f6] text-[#11a89b]" : "bg-[#fff9dc] text-[#725d42]"}>
        {ai ? "失败会自动降级" : "本地可用"}
      </Badge>
    </div>
  );
}
