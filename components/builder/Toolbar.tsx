import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Toolbar({ filledCount }: { filledCount: number }) {
  const score = Math.min(100, Math.round((filledCount / 22) * 100));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="mt-1 text-sm font-semibold text-[#9f927d]">默认复制“推荐复制版”就可以用，其他格式放在旁边备用。</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge>完整度 {score}%</Badge>
        <Separator className="hidden h-6 w-px sm:block" />
        <Badge className="bg-[#e6f9f6] text-[#11a89b]">MVP</Badge>
      </div>
    </div>
  );
}
