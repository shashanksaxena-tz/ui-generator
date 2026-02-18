import { NextRequest, NextResponse } from "next/server";
import { generateUI, generateDemoSchema } from "@/lib/generation/engine";
import { extractComponentNames } from "@/lib/generation/schema";
import type { GenerationRequest, ReactInterfaceSchema } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, theme, constraints, previousSchema, styleHint } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check if any AI key is configured
    const hasGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    if (!hasGoogle && !hasOpenAI && !hasAnthropic) {
      // No AI keys — use demo/fallback generation
      const demoSchema = generateDemoSchema(prompt);
      return NextResponse.json({
        schema: demoSchema,
        theme: null,
        metadata: {
          tokensUsed: 0,
          model: "demo",
          generationTimeMs: 0,
          componentsUsed: extractComponentNames(demoSchema),
          cachedLayout: false,
        },
      });
    }

    // Build generation request
    const genRequest: GenerationRequest = {
      prompt,
      theme,
      constraints,
      styleHint,
      context: previousSchema
        ? { previousSchema: previousSchema as ReactInterfaceSchema }
        : undefined,
    };

    const result = await generateUI(genRequest);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";

    // If AI fails, fall back to demo
    try {
      const body = await request.clone().json();
      const demoSchema = generateDemoSchema(body.prompt ?? "dashboard");
      return NextResponse.json({
        schema: demoSchema,
        theme: null,
        metadata: {
          tokensUsed: 0,
          model: "demo-fallback",
          generationTimeMs: 0,
          componentsUsed: extractComponentNames(demoSchema),
          cachedLayout: false,
        },
      });
    } catch {
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}
