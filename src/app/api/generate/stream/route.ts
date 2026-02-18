import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { buildSystemPrompt, buildRefinementPrompt } from "@/lib/generation/prompts";
import type { ThemeConfig, ReactInterfaceSchema } from "@/types";

function getStreamingProvider() {
  const providerName = process.env.AI_PROVIDER ?? "google";
  const model = process.env.AI_MODEL;

  switch (providerName) {
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      return anthropic(model || "claude-sonnet-4-20250514");
    }
    case "openai": {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      return openai(model || "gpt-4o");
    }
    case "google":
    default: {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
      return google(model || "gemini-2.0-flash");
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt, theme, constraints, previousSchema, styleHint } = body;

  const systemPrompt = buildSystemPrompt(constraints, theme as ThemeConfig, styleHint);

  let userMessage = prompt;
  if (previousSchema) {
    userMessage = buildRefinementPrompt(
      JSON.stringify(previousSchema as ReactInterfaceSchema, null, 2),
      prompt
    );
  }

  const model = getStreamingProvider();

  const result = streamText({
    model,
    system: systemPrompt,
    prompt: userMessage,
    maxTokens: 16384,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
