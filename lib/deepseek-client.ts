import { categories, defaultFormState } from "@/lib/constants";
import type { Category, FillMode, PromptFormState } from "@/types/prompt";

const formFields = Object.keys(defaultFormState) as Array<keyof PromptFormState>;
const categoryIds = new Set(categories.map((category) => category.id));

export const DEEPSEEK_PROXY_URL = process.env.NEXT_PUBLIC_DEEPSEEK_PROXY_URL?.trim() || "";

type DeepSeekProxyResponse = {
  category?: unknown;
  patch?: unknown;
};

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && categoryIds.has(value as Category);
}

function normalizePatch(value: unknown): Partial<PromptFormState> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    formFields
      .map((field) => [field, source[field]] as const)
      .filter((entry): entry is readonly [keyof PromptFormState, string] => typeof entry[1] === "string"),
  ) as Partial<PromptFormState>;
}

export function applyDeepSeekPatch(
  currentForm: PromptFormState,
  patch: Partial<PromptFormState>,
  fillMode: FillMode,
): PromptFormState {
  if (fillMode === "overwrite") {
    return {
      ...defaultFormState,
      ...patch,
      rawIdea: patch.rawIdea || currentForm.rawIdea,
      bottomSafeArea: patch.bottomSafeArea || currentForm.bottomSafeArea || defaultFormState.bottomSafeArea,
    };
  }

  const next = { ...currentForm };
  for (const [key, value] of Object.entries(patch) as Array<[keyof PromptFormState, string | undefined]>) {
    if (!value) continue;
    if (key === "rawIdea" || !next[key] || next[key] === defaultFormState[key]) {
      next[key] = value;
    }
  }

  return {
    ...next,
    bottomSafeArea: next.bottomSafeArea || defaultFormState.bottomSafeArea,
  };
}

export async function requestDeepSeekAnalysis({
  rawIdea,
  currentForm,
  fillMode,
  selectedCategory,
}: {
  rawIdea: string;
  currentForm: PromptFormState;
  fillMode: FillMode;
  selectedCategory: Category;
}): Promise<{ category: Category; patch: Partial<PromptFormState> }> {
  if (!DEEPSEEK_PROXY_URL) {
    throw new Error("未配置润色服务地址。");
  }

  const response = await fetch(DEEPSEEK_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rawIdea,
      currentForm,
      fillMode,
      selectedCategory,
      categories: categories.map(({ id, name, description }) => ({ id, name, description })),
      fields: formFields,
    }),
  });

  if (!response.ok) {
    throw new Error(`润色服务请求失败：${response.status}`);
  }

  const data = (await response.json()) as DeepSeekProxyResponse;
  return {
    category: isCategory(data.category) ? data.category : selectedCategory,
    patch: normalizePatch(data.patch),
  };
}
