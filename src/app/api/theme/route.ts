import { NextRequest, NextResponse } from "next/server";
import { generateTheme } from "@/lib/theme/engine";
import { generateCSSVariables } from "@/lib/theme/tokens";
import type { ThemeAPIRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: ThemeAPIRequest = await request.json();

    const theme = generateTheme({
      brandColor: body.brandColor,
      mode: body.mode ?? "dark",
      style: body.style ?? "modern",
      description: body.description,
    });

    const cssVariables = generateCSSVariables(theme);

    return NextResponse.json({
      theme,
      css: cssVariables,
    });
  } catch (error) {
    console.error("Theme generation error:", error);
    return NextResponse.json(
      { error: "Theme generation failed" },
      { status: 500 }
    );
  }
}
