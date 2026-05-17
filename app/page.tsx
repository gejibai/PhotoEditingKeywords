"use client";

import * as React from "react";
import { toast } from "sonner";
import { CategoryCards } from "@/components/builder/CategoryCards";
import { IdeaInput } from "@/components/builder/IdeaInput";
import { PromptForm } from "@/components/builder/PromptForm";
import { ResultTabs, type OutputTab } from "@/components/builder/ResultTabs";
import { Toolbar } from "@/components/builder/Toolbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BOTTOM_SAFE_AREA, defaultFormState, templateByCategory } from "@/lib/constants";
import { analyzeOffline } from "@/lib/offline-rules";
import { buildAllOutputs } from "@/lib/prompt-builder";
import { loadSavedState, saveState } from "@/lib/storage";
import type { Category, FillMode, PromptFormState } from "@/types/prompt";

const ideaExamples = [
  "自拍修自然一点，皮肤干净但保留真实纹理，不要网红脸",
  "咖啡店照片加白色手账小字，保留原图氛围，底部留白",
  "旅行街拍调成胶片感，低饱和，有一点随手拍颗粒",
  "真实手机随拍，加霓虹马克笔涂鸦，密集混乱一点",
];

const quickEffects = [
  { label: "自然", text: "保持自然真实，不要过度修图" },
  { label: "清透", text: "整体更清透干净，光线柔和" },
  { label: "胶片", text: "加入轻微胶片颗粒和低饱和氛围" },
  { label: "奶油色", text: "偏奶油色、暖白、柔和生活感" },
  { label: "保留原图", text: "保留原图主体、构图和真实光影" },
  { label: "底部留白", text: "底部留白方便放标题或排版" },
  { label: "不要太假", text: "避免塑料感、假 HDR 和过度锐化" },
  { label: "密集涂鸦", text: "加入霓虹色、密集、夸张的数字马克笔涂鸦覆盖" },
];

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

function mergeTemplatePreservingUser(
  form: PromptFormState,
  patch: Partial<PromptFormState>,
): PromptFormState {
  const next = { ...form };
  for (const [key, value] of Object.entries(patch) as Array<[keyof PromptFormState, string | undefined]>) {
    if (!value) continue;
    if (!next[key] || next[key] === defaultFormState[key]) {
      next[key] = value;
    }
  }
  return mergeForm(next, {});
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
  const [activeTab, setActiveTab] = React.useState<OutputTab>("full");
  const [hydrated, setHydrated] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  React.useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      setForm(mergeForm(defaultFormState, saved.formState));
      setSelectedCategory(saved.selectedCategory);
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const ok = saveState({ formState: form, selectedCategory, mode: "offline" });
    if (!ok) toast.warning("localStorage 不可用，本次填写内容可能无法自动恢复。");
  }, [form, selectedCategory, hydrated]);

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
    setForm((current) => mergeTemplatePreservingUser(current, templateByCategory[category]));
  }

  async function analyze(fillMode: FillMode) {
    const rawIdea = form.rawIdea.trim();
    if (!rawIdea) {
      toast.error("先写一句原始想法。");
      return;
    }

    const { category, ...patch } = analyzeOffline(rawIdea, form, fillMode, selectedCategory);
    setSelectedCategory(category);
    setForm((current) => (
      fillMode === "overwrite"
        ? resetWithPatch(current, patch)
        : mergeForm(current, patch)
    ));
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
    <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-[132px] md:px-6 md:py-10 md:pb-[150px]">
      <header className="animal-panel animal-title-card relative mb-6 overflow-hidden p-6 md:p-10">
        <div className="absolute inset-x-0 bottom-0 h-3 bg-[url('/PhotoEditingKeywords/animal-island/wave-yellow.svg')] bg-repeat-x" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-[#e6f9f6] text-[#11a89b]">Photo Prompt Builder</Badge>
            <h1 className="text-4xl font-black tracking-[0.01em] text-[#794f27] md:text-6xl">
              日常修图关键词完善器
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-[#725d42] md:text-lg">
              选一个方向，写一句想法，直接复制能用的修图提示词。不上传图片，也不生成图片。
            </p>
          </div>
          <Badge className="bg-[#fff9dc] text-[#725d42]">静态离线版</Badge>
        </div>
      </header>

      <section className="mb-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-[0.01em] text-[#794f27]">1. 选你想要的感觉</h2>
            <p className="mt-1 text-sm font-semibold text-[#9f927d]">先点最接近的方向，后面可以继续微调。</p>
          </div>
        </div>
        <CategoryCards selectedCategory={selectedCategory} onSelect={applyCategory} />
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
        <div className="min-w-0 space-y-6">
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
                examples={ideaExamples}
                effects={quickEffects}
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
                showNoteFields={selectedCategory === "note" || selectedCategory === "doodle_snap"}
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
    </main>
  );
}
