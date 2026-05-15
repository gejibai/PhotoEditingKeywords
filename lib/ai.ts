import type { AnalyzeRequest, AnalyzeResponse } from "@/types/prompt";

export async function analyzeWithAi(
  _request: AnalyzeRequest,
  apiKey: string | undefined,
): Promise<NonNullable<AnalyzeResponse["data"]>> {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // MVP placeholder: keep the Route Handler contract stable while the real model
  // call remains swappable and server-only.
  throw new Error("AI analyzer is not implemented in this MVP");
}
