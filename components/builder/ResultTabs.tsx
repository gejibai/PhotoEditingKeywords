import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type OutputTab = "compact" | "full";

const tabLabels: Record<OutputTab, string> = {
  compact: "短版",
  full: "推荐复制版",
};

const outputTabs: OutputTab[] = ["compact", "full"];

export function ResultTabs({
  outputs,
  activeTab,
  onTabChange,
  onCopyCurrent,
}: {
  outputs: Record<string, string>;
  activeTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  onCopyCurrent: () => void;
}) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as OutputTab)} className="min-w-0 max-w-full">
      <div className="-mx-1 max-w-full overflow-x-auto px-1 pb-1">
        <TabsList className="grid w-full grid-cols-2 gap-1">
          {outputTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="min-w-[88px] flex-shrink-0 whitespace-nowrap">
              {tabLabels[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {outputTabs.map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-4">
          <pre className="min-h-72 max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-[20px] border border-[#3d3028] bg-[#2b2118] p-4 font-mono text-sm font-semibold leading-7 text-[#e8d5bc] sm:min-h-80 sm:p-5">
            {outputs[tab]}
          </pre>
        </TabsContent>
      ))}
      <div className="sticky bottom-3 mt-4 max-w-full rounded-[28px] border-2 border-[#9f927d]/50 bg-[#f7f3df]/90 p-3 shadow-[0_4px_10px_rgba(107,92,67,0.28)] backdrop-blur">
        <Button className="w-full" onClick={onCopyCurrent}>复制这版</Button>
      </div>
    </Tabs>
  );
}
