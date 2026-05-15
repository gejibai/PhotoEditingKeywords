import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Toolbar({ filledCount }: { filledCount: number }) {
  const score = Math.min(100, Math.round((filledCount / 22) * 100));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">生成结果</h2>
        <p className="mt-1 text-sm text-slate-500">自动包含底部 240px / 12% 安全留白规则。</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge>完整度 {score}%</Badge>
        <Separator className="hidden h-6 w-px sm:block" />
        <Badge className="bg-blue-50 text-blue-700">MVP</Badge>
      </div>
    </div>
  );
}
