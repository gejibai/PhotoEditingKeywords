"use client";

import * as React from "react";
import { toast } from "sonner";
import { CategoryCards } from "@/components/builder/CategoryCards";
import { IdeaInput } from "@/components/builder/IdeaInput";
import { PromptForm } from "@/components/builder/PromptForm";
import { ResultTabs, type OutputTab } from "@/components/builder/ResultTabs";
import { Toolbar } from "@/components/builder/Toolbar";
import { TrendTemplates } from "@/components/builder/TrendTemplates";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BOTTOM_SAFE_AREA,
  defaultFormState,
  ideaExamples,
  templateByCategory,
  trendTemplates,
} from "@/lib/constants";
import {
  applyDeepSeekPatch,
  DEEPSEEK_PROXY_URL,
  requestDeepSeekAnalysis,
} from "@/lib/deepseek-client";
import { analyzeOffline } from "@/lib/offline-rules";
import { buildAllOutputs } from "@/lib/prompt-builder";
import { loadSavedState, saveState } from "@/lib/storage";
import type { Category, FillMode, PromptFormState } from "@/types/prompt";

function mergeForm(form: PromptFormState, patch: Partial<PromptFormState>): PromptFormState {
  return { ...form, ...patch, bottomSafeArea: patch.bottomSafeArea || form.bottomSafeArea || BOTTOM_SAFE_AREA };
}

function resetWithPatch(form: PromptFormState, patch: Partial<PromptFormState>): PromptFormState {
  return mergeForm(
    {
      ...defaultFormState,
      rawIdea: form.rawIdea,
      bottomSafeArea: form.bottomSafeArea || BOTTOM_SAFE_AREA,
    },
    patch,
  );
}

function resetCleanWithPatch(patch: Partial<PromptFormState>): PromptFormState {
  return mergeForm(
    {
      ...defaultFormState,
      bottomSafeArea: BOTTOM_SAFE_AREA,
    },
    patch,
  );
}

export default function Home() {
  const [form, setForm] = React.useState<PromptFormState>(defaultFormState);
  const [selectedCategory, setSelectedCategory] = React.useState<Category>("general");
  const [activeTab, setActiveTab] = React.useState<OutputTab>("compact");
  const [hydrated, setHydrated] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [isAnalyzingWithDeepSeek, setIsAnalyzingWithDeepSeek] = React.useState(false);
  const [selectedTrendId, setSelectedTrendId] = React.useState<string | null>(null);
  const [examplesOpen, setExamplesOpen] = React.useState(false);
  const [trendsOpen, setTrendsOpen] = React.useState(false);

  React.useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      setForm(mergeForm(defaultFormState, saved.formState));
      setSelectedCategory(saved.selectedCategory);
      setActiveTab(saved.activeTab === "full" ? "full" : "compact");
      setSelectedTrendId(saved.selectedTrendId ?? null);
      setExamplesOpen(Boolean(saved.examplesOpen));
      setTrendsOpen(Boolean(saved.trendsOpen));
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const ok = saveState({
      formState: form,
      selectedCategory,
      activeTab,
      selectedTrendId,
      mode: "offline",
      examplesOpen,
      trendsOpen,
    });
    if (!ok) toast.warning("localStorage 不可用，本次填写内容可能无法自动恢复。");
  }, [form, selectedCategory, activeTab, selectedTrendId, examplesOpen, trendsOpen, hydrated]);

  const outputs = React.useMemo(() => buildAllOutputs(form), [form]);
  const filledCount = React.useMemo(
    () => Object.values(form).filter((value) => value.trim()).length,
    [form],
  );

  function updateField(field: keyof PromptFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function applyCategory(category: Category) {
    setSelectedTrendId(null);
    setSelectedCategory(category);
    setForm((current) => resetCleanWithPatch({
      ...templateByCategory[category],
      rawIdea: current.rawIdea,
    }));
  }

  function applyTrendTemplate(trendId: string) {
    const trend = trendTemplates.find((item) => item.id === trendId);
    if (!trend) return;

    setSelectedTrendId(trend.id);
    setSelectedCategory(trend.category);
    setForm(resetCleanWithPatch({
      ...templateByCategory[trend.category],
      ...trend.form,
      rawIdea: trend.rawIdea,
    }));
    toast.success("已换成这套灵感。");
  }

  async function analyze(fillMode: FillMode) {
    const rawIdea = form.rawIdea.trim();
    if (!rawIdea) {
      toast.error("先写一句原始想法。");
      return;
    }

    const { category, ...patch } = analyzeOffline(rawIdea, form, fillMode, selectedCategory);
    setSelectedTrendId(null);
    setSelectedCategory(category);
    setForm((current) => (
      fillMode === "overwrite"
        ? resetWithPatch(current, patch)
        : mergeForm(current, patch)
    ));
    toast.success(fillMode === "overwrite" ? "已根据原始想法覆盖填充。" : "已根据原始想法补齐空项。");
  }

  async function analyzeWithDeepSeek() {
    const rawIdea = form.rawIdea.trim();
    if (!rawIdea) {
      toast.error("先写一句原始想法。");
      return;
    }

    if (!DEEPSEEK_PROXY_URL) {
      toast.error("还没有配置 DeepSeek 代理地址。");
      return;
    }

    setIsAnalyzingWithDeepSeek(true);
    try {
      const { category, patch } = await requestDeepSeekAnalysis({
        rawIdea,
        currentForm: form,
        fillMode: "overwrite",
        selectedCategory,
      });
      setSelectedTrendId(null);
      setSelectedCategory(category);
      setForm((current) => applyDeepSeekPatch(current, patch, "overwrite"));
      toast.success("已使用 DeepSeek AI 拆解并填充。");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "DeepSeek AI 拆解失败。");
    } finally {
      setIsAnalyzingWithDeepSeek(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("已复制。");
    } catch {
      toast.error("复制失败，请手动选择文本复制。");
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-[132px] md:px-6 md:py-10 md:pb-[150px]">
      <header className="animal-panel animal-title-card relative mb-6 overflow-hidden p-6 md:p-10">
        <div className="absolute inset-x-0 bottom-0 h-3 bg-[url('/PhotoEditingKeywords/animal-island/wave-yellow.svg')] bg-repeat-x" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-[#e6f9f6] text-[#11a89b]">修图灵感小帮手</Badge>
            <h1 className="text-4xl font-black tracking-[0.01em] text-[#794f27] md:text-6xl">
              修图魔法铺
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-[#725d42] md:text-lg">
              把“想变好看一点”翻译成清楚的修图提示词，顺手整理风格、光线、色彩、留白和避坑要求。
            </p>
          </div>
        </div>
      </header>

      <section className="mb-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-[0.01em] text-[#794f27]">1. 选你想要的感觉</h2>
            <p className="mt-1 text-sm font-semibold text-[#9f927d]">
              先点最接近的方向，建议再到高级设置里调整自己想要的内容，出图效果会更好。
            </p>
          </div>
        </div>
        <CategoryCards selectedCategory={selectedCategory} onSelect={applyCategory} />
        {selectedCategory === "meme" ? (
          <div className="mt-4 rounded-[24px] border-2 border-[#11a89b]/50 bg-[#e6f9f6] px-5 py-4 shadow-[0_4px_10px_rgba(107,92,67,0.14)]">
            <strong className="block text-base font-black text-[#0b8f84]">表情包想更像你脑子里的梗？</strong>
            <p className="mt-1 text-sm font-bold leading-6 text-[#725d42]">
              建议打开高级设置，调整你想要的情绪、文字区位置、贴纸和强调符号；这些细节填得越准，生成的提示词越贴近想要的效果。
            </p>
          </div>
        ) : null}
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <TrendTemplates
            open={trendsOpen}
            selectedTrendId={selectedTrendId}
            onToggle={() => setTrendsOpen((current) => !current)}
            onSelect={applyTrendTemplate}
          />

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-black tracking-[0.01em] text-[#794f27]">2. 描述一下照片和想法</h2>
              <p className="text-sm font-semibold text-[#9f927d]">一句话就够。也可以点下面的例子，再改成自己的。</p>
            </CardHeader>
            <CardContent>
              <IdeaInput
                value={form.rawIdea}
                onChange={(value) => updateField("rawIdea", value)}
                onAnalyzeOverwrite={() => analyze("overwrite")}
                onAnalyzeFillEmpty={() => analyze("fill-empty")}
                onAnalyzeWithDeepSeek={analyzeWithDeepSeek}
                isAnalyzingWithDeepSeek={isAnalyzingWithDeepSeek}
                isDeepSeekEnabled={Boolean(DEEPSEEK_PROXY_URL)}
                examples={ideaExamples}
                examplesOpen={examplesOpen}
                onToggleExamples={() => setExamplesOpen((current) => !current)}
                onClear={() => {
                  setForm({ ...defaultFormState, bottomSafeArea: BOTTOM_SAFE_AREA });
                  setSelectedCategory("general");
                  setSelectedTrendId(null);
                  setExamplesOpen(false);
                  setTrendsOpen(false);
                  toast.success("已清空。");
                }}
                onRestoreDefaults={() => {
                  setSelectedTrendId(null);
                  setForm((current) => resetCleanWithPatch({
                    ...templateByCategory[selectedCategory],
                    rawIdea: current.rawIdea,
                  }));
                  toast.success("已恢复当前分类默认值。");
                }}
              />
            </CardContent>
          </Card>

          <details
            className="animal-panel rounded-[30px] p-4"
            open={showAdvanced}
            onToggle={(event) => setShowAdvanced(event.currentTarget.open)}
          >
            <summary className="cursor-pointer list-none text-lg font-black text-[#794f27]">
              高级设置：想微调细节再打开
            </summary>
            <div className="mt-5">
              <PromptForm
                form={form}
                showNoteFields={selectedCategory === "note" || selectedCategory === "doodle_snap" || selectedCategory === "meme"}
                onChange={updateField}
              />
            </div>
          </details>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <h2 className="mb-3 text-2xl font-black tracking-[0.01em] text-[#794f27]">3. 复制生成结果</h2>
              <Toolbar filledCount={filledCount} />
            </CardHeader>
            <CardContent>
              <ResultTabs
                outputs={outputs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCopyCurrent={() => copyText(outputs[activeTab])}
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
