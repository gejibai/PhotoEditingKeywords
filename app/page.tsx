"use client";

import * as React from "react";
import { toast } from "sonner";
import { CategoryCards } from "@/components/builder/CategoryCards";
import { IdeaInput } from "@/components/builder/IdeaInput";
import { ModeSwitch } from "@/components/builder/ModeSwitch";
import { PromptForm } from "@/components/builder/PromptForm";
import { ResultTabs, type OutputTab } from "@/components/builder/ResultTabs";
import { Toolbar } from "@/components/builder/Toolbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BOTTOM_SAFE_AREA, defaultFormState, templateByCategory } from "@/lib/constants";
import { analyzeOffline } from "@/lib/offline-rules";
import { buildAllOutputs } from "@/lib/prompt-builder";
import { loadSavedState, saveState } from "@/lib/storage";
import type { AnalyzeResponse, BuilderMode, Category, FillMode, PromptFormState } from "@/types/prompt";

function mergeForm(form: PromptFormState, patch: Partial<PromptFormState>): PromptFormState {
  return { ...form, ...patch, bottomSafeArea: patch.bottomSafeArea || form.bottomSafeArea || BOTTOM_SAFE_AREA };
}

function fillEmptyForm(form: PromptFormState, patch: Partial<PromptFormState>): PromptFormState {
  const next: Record<keyof PromptFormState, string> = { ...form };
  for (const [key, value] of Object.entries(patch) as Array<[keyof PromptFormState, string | undefined]>) {
    if (value && !next[key]) next[key] = value;
  }
  next.bottomSafeArea = next.bottomSafeArea || BOTTOM_SAFE_AREA;
  return next;
}

function exportText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [form, setForm] = React.useState<PromptFormState>(defaultFormState);
  const [selectedCategory, setSelectedCategory] = React.useState<Category>("general");
  const [mode, setMode] = React.useState<BuilderMode>("offline");
  const [activeTab, setActiveTab] = React.useState<OutputTab>("full");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      setForm(mergeForm(defaultFormState, saved.formState));
      setSelectedCategory(saved.selectedCategory);
      setMode(saved.mode);
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const ok = saveState({ formState: form, selectedCategory, mode });
    if (!ok) toast.warning("localStorage 不可用，本次填写内容可能无法自动恢复。");
  }, [form, selectedCategory, mode, hydrated]);

  const outputs = React.useMemo(() => buildAllOutputs(form), [form]);
  const filledCount = React.useMemo(
    () => Object.values(form).filter((value) => value.trim()).length,
    [form],
  );

  function updateField(field: keyof PromptFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function applyCategory(category: Category) {
    setSelectedCategory(category);
    setForm((current) => fillEmptyForm(current, templateByCategory[category]));
  }

  async function analyze(fillMode: FillMode) {
    const rawIdea = form.rawIdea.trim();
    if (!rawIdea) {
      toast.error("先写一句原始想法。");
      return;
    }

    if (mode === "ai") {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawIdea, currentForm: form, mode: fillMode }),
        });
        const result = (await response.json()) as AnalyzeResponse;
        if (!result.ok || !result.data) throw new Error(result.error || "AI 返回格式不完整");
        const { category, ...patch } = result.data;
        if (category) setSelectedCategory(category);
        setForm((current) => mergeForm(current, patch));
        toast.success("已使用 AI 增强拆解。");
        return;
      } catch {
        toast.warning("AI 增强暂不可用，已使用离线规则拆解。");
      }
    }

    const { category, ...patch } = analyzeOffline(rawIdea, form, fillMode);
    setSelectedCategory(category);
    setForm((current) => mergeForm(current, patch));
    toast.success(fillMode === "overwrite" ? "已根据原始想法覆盖填充。" : "已根据原始想法补齐空项。");
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("已复制。");
    } catch {
      toast.error("复制失败，请手动选择文本复制。");
    }
  }

  const allText = `【完整提示词】\n${outputs.full}\n\n【分层关键词】\n${outputs.layered}\n\n【一句话压缩版】\n${outputs.compact}\n\n【JSON 结构化提示词】\n${outputs.json}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 pb-24 md:px-6 md:py-10">
      <header className="animal-panel animal-title-card relative mb-6 overflow-hidden p-6 md:p-10">
        <div className="absolute inset-x-0 bottom-0 h-3 bg-[url('/animal-island/wave-yellow.svg')] bg-repeat-x" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-[#e6f9f6] text-[#11a89b]">Photo Prompt Builder</Badge>
            <h1 className="text-4xl font-black tracking-[0.01em] text-[#794f27] md:text-6xl">
              日常修图关键词完善器
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-[#725d42] md:text-lg">
              输入一句想法，自动拆解成可复制的修图提示词。MVP 只整理提示词，不上传图片，也不生成图片。
            </p>
          </div>
          <ModeSwitch mode={mode} onModeChange={setMode} />
        </div>
      </header>

      <section className="mb-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-[0.01em] text-[#794f27]">选择修图方向</h2>
            <p className="mt-1 text-sm font-semibold text-[#9f927d]">点击分类会补充推荐字段，不会清掉你已经写好的内容。</p>
          </div>
        </div>
        <CategoryCards selectedCategory={selectedCategory} onSelect={applyCategory} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-black tracking-[0.01em] text-[#794f27]">原始想法</h2>
              <p className="text-sm font-semibold text-[#9f927d]">一句话就够，后面可以慢慢补细节。</p>
            </CardHeader>
            <CardContent>
              <IdeaInput
                value={form.rawIdea}
                onChange={(value) => updateField("rawIdea", value)}
                onAnalyzeOverwrite={() => analyze("overwrite")}
                onAnalyzeFillEmpty={() => analyze("fill-empty")}
                onClear={() => {
                  setForm({ ...defaultFormState, bottomSafeArea: BOTTOM_SAFE_AREA });
                  setSelectedCategory("general");
                  toast.success("已清空。");
                }}
                onRestoreDefaults={() => {
                  setForm((current) => mergeForm(current, templateByCategory[selectedCategory]));
                  toast.success("已恢复当前分类默认值。");
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-black tracking-[0.01em] text-[#794f27]">字段完善</h2>
            </CardHeader>
            <CardContent>
              <PromptForm
                form={form}
                showNoteFields={selectedCategory === "note"}
                onChange={updateField}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <Toolbar filledCount={filledCount} />
            </CardHeader>
            <CardContent>
              <ResultTabs
                outputs={outputs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCopyCurrent={() => copyText(outputs[activeTab])}
                onCopyAll={() => copyText(allText)}
                onExport={() => {
                  try {
                    exportText("日常修图关键词.txt", allText);
                    toast.success("已导出 TXT。");
                  } catch {
                    toast.error("导出失败。");
                  }
                }}
              />
            </CardContent>
          </Card>
        </aside>
      </div>
      <div className="mt-10 h-16 bg-[url('/animal-island/footer-tree.webp')] bg-bottom bg-repeat-x opacity-90" />
    </main>
  );
}
