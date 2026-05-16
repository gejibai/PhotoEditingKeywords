import { Badge } from "@/components/ui/badge";

export function ModeSwitch() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[50px] border-2 border-[#c4b89e] bg-[#f7f3df] px-4 py-2 shadow-[0_3px_0_0_#d4c9b4]">
      <span className="text-sm font-bold text-[#725d42]">离线规则</span>
      <Badge className="bg-[#fff9dc] text-[#725d42]">静态页面可用</Badge>
    </div>
  );
}
