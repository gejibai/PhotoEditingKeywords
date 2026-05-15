import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as OutputTab)}>
      <TabsList className="grid-cols-4">
        {(Object.keys(tabLabels) as OutputTab[]).map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tabLabels[tab]}
          </TabsTrigger>
        ))}
      </TabsList>
      {(Object.keys(tabLabels) as OutputTab[]).map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-4">
          <pre className="min-h-80 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-[24px] bg-slate-950 p-4 text-sm leading-7 text-slate-50">
            {outputs[tab]}
          </pre>
        </TabsContent>
      ))}
      <div className="sticky bottom-3 mt-4 grid gap-2 rounded-[24px] border border-slate-200 bg-white/85 p-3 shadow-soft backdrop-blur sm:grid-cols-2">
        <Button onClick={onCopyCurrent}>复制当前 tab</Button>
        <Button variant="outline" onClick={onCopyAll}>
          复制全部结果
        </Button>
        <Button className="sm:col-span-2" variant="dark" onClick={onExport}>
          导出 .txt
        </Button>
      </div>
    </Tabs>
  );
}
