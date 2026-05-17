import { BOTTOM_SAFE_AREA, categories } from "@/lib/constants";
import type { PromptFormState } from "@/types/prompt";

function clean(value: string | undefined) {
  return value?.trim() || "";
}

function line(label: string, value: string) {
  return `${label}：${value || "未填写"}`;
}

function annotationRules(form: PromptFormState) {
  if (!clean(form.annotationObjects) && !clean(form.annotationTextStyle) && !clean(form.lineStyle) && !clean(form.decorations) && !clean(form.blankSpaceRule)) {
    return "";
  }

  return [
    clean(form.annotationObjects) && `注解对象：${form.annotationObjects}`,
    clean(form.annotationTextStyle) && `文字风格：${form.annotationTextStyle}`,
    clean(form.lineStyle) && `线条：${form.lineStyle}`,
    clean(form.decorations) && `装饰：${form.decorations}`,
    clean(form.blankSpaceRule) && `留白：${form.blankSpaceRule}`,
    "如包含文字，文字必须清晰可读，不要生成乱码。",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFullPrompt(form: PromptFormState): string {
  const annotations = annotationRules(form);
  return [
    line("修图目标", `${form.photoType || "日常照片"}；${form.usageScene || "通用修图工具"}`),
    line("保留内容", form.keep),
    line("修改方向", form.edit),
    line(
      "主体与场景",
      [form.subject, form.scene, form.actionRelation].filter(Boolean).join("；"),
    ),
    line("风格要求", [form.targetStyle, form.mood, form.retouchStrength].filter(Boolean).join("；")),
    line("光线与色彩", [form.lighting, form.color, form.texture].filter(Boolean).join("；")),
    line("构图与画质", [form.composition, form.aspectRatio, form.quality].filter(Boolean).join("；")),
    annotations ? line("注解与涂鸦规则", annotations) : "",
    line("底部安全留白", form.bottomSafeArea || BOTTOM_SAFE_AREA),
    line("禁止项", form.negativePrompt),
  ].filter(Boolean).join("\n\n");
}

export function buildLayeredKeywords(form: PromptFormState): string {
  const annotations = annotationRules(form);
  return [
    line("主体", form.subject || form.photoType),
    line("场景", form.scene || form.usageScene),
    line("动作 / 关系", form.actionRelation),
    line("氛围", form.mood),
    line("光线", form.lighting),
    line("色彩", form.color),
    line("质感", form.texture),
    line("构图", [form.composition, form.aspectRatio].filter(Boolean).join("；")),
    line("画质", form.quality),
    annotations ? line("注解 / 涂鸦", annotations) : "",
    line("底部安全留白", form.bottomSafeArea || BOTTOM_SAFE_AREA),
    line("负面词", form.negativePrompt),
  ].filter(Boolean).join("\n");
}

export function buildCompactPrompt(form: PromptFormState): string {
  const annotations = annotationRules(form);
  return [
    form.photoType || "日常照片修图",
    form.edit,
    form.targetStyle,
    form.mood,
    form.lighting,
    form.color,
    form.quality,
    annotations ? "加入清晰可读的注解或涂鸦覆盖，保留底图可辨识" : "",
    "底部额外预留不少于 240px 纯白色范围，或约占画面高度 12% 的底部安全留白区",
    form.negativePrompt ? `不要：${form.negativePrompt}` : "",
  ]
    .filter(Boolean)
    .join("；");
}

export function buildJsonPrompt(form: PromptFormState): string {
  return JSON.stringify(
    {
      photo_type: form.photoType,
      task: form.edit,
      keep: form.keep,
      edit: form.edit,
      subject: form.subject,
      scene: form.scene,
      style: form.targetStyle,
      lighting: form.lighting,
      color: form.color,
      composition: form.composition,
      quality: form.quality,
      annotations: annotationRules(form),
      bottom_safe_area: form.bottomSafeArea || BOTTOM_SAFE_AREA,
      negative_prompt: form.negativePrompt,
    },
    null,
    2,
  );
}

export function buildAllOutputs(form: PromptFormState) {
  return {
    full: buildFullPrompt(form),
    layered: buildLayeredKeywords(form),
    compact: buildCompactPrompt(form),
    json: buildJsonPrompt(form),
  };
}

export function categoryName(categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? "通用修图增强";
}
