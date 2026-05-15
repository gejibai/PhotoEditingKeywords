import { NextResponse } from "next/server";
import { analyzeWithAi } from "@/lib/ai";
import { analyzeOffline } from "@/lib/offline-rules";
import type { AnalyzeRequest, AnalyzeResponse } from "@/types/prompt";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    if (!body.rawIdea?.trim()) {
      return NextResponse.json<AnalyzeResponse>(
        { ok: false, error: "rawIdea is required" },
        { status: 400 },
      );
    }

    try {
      const data = await analyzeWithAi(body, process.env.OPENAI_API_KEY);
      return NextResponse.json<AnalyzeResponse>({ ok: true, data });
    } catch {
      const data = analyzeOffline(body.rawIdea, body.currentForm, body.mode);
      return NextResponse.json<AnalyzeResponse>({
        ok: true,
        data,
        error: "AI unavailable; offline fallback data is included",
      });
    }
  } catch {
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}
