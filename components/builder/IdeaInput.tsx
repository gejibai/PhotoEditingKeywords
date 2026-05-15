import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function IdeaInput({
  value,
  onChange,
  onAnalyzeOverwrite,
  onAnalyzeFillEmpty,
  onClear,
  onRestoreDefaults,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onAnalyzeOverwrite: () => void;
  onAnalyzeFillEmpty: () => void;
  onClear: () => void;
  onRestoreDefaults: () => void;
  loading?: boolean;
}) {
  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="例如：把这张咖啡店照片做成日系手账注解风，保留原图氛围，底部留白方便放文字"
        className="min-h-32"
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAnalyzeOverwrite} loading={loading}>
          智能拆解并覆盖填充
        </Button>
        <Button variant="outline" onClick={onAnalyzeFillEmpty} loading={loading}>
          只补空项
        </Button>
        <Button variant="secondary" onClick={onClear}>
          清空
        </Button>
        <Button variant="ghost" onClick={onRestoreDefaults}>
          恢复默认
        </Button>
      </div>
    </div>
  );
}
