import { Button } from "@/components/ui/button";
import { Tabs as AnimalTabs, type TabItem } from "animal-island-ui";

export type OutputTab = "full" | "layered" | "compact" | "json";

const tabLabels: Record<OutputTab, string> = {
  full: "完整提示词",
  layered: "分层关键词",
  compact: "一句话",
  json: "JSON",
};

export function ResultTabs({
  outputs,
  activeTab,
  onTabChange,
  onCopyCurrent,
  onCopyAll,
  onExport,
}: {
  outputs: Record<OutputTab, string>;
  activeTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  onCopyCurrent: () => void;
  onCopyAll: () => void;
  onExport: () => void;
}) {
  const items: TabItem[] = (Object.keys(tabLabels) as OutputTab[]).map((tab) => ({
    key: tab,
    label: tabLabels[tab],
    children: (
      <pre className="min-h-80 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-[20px] border border-[#3d3028] bg-[#2b2118] p-5 font-mono text-sm font-semibold leading-7 text-[#e8d5bc]">
        {outputs[tab]}
      </pre>
    ),
  }));

  return (
    <div>
      <AnimalTabs items={items} activeKey={activeTab} onChange={(key) => onTabChange(key as OutputTab)} />
      <div className="sticky bottom-3 mt-4 grid gap-2 rounded-[28px] border-2 border-[#9f927d]/50 bg-[#f7f3df]/90 p-3 shadow-[0_4px_10px_rgba(107,92,67,0.28)] backdrop-blur sm:grid-cols-2">
        <Button onClick={onCopyCurrent}>复制当前 tab</Button>
        <Button variant="outline" onClick={onCopyAll}>
          复制全部结果
        </Button>
        <Button className="sm:col-span-2" variant="dark" onClick={onExport}>
          导出 .txt
        </Button>
      </div>
    </div>
  );
}
