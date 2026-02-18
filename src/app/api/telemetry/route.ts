import { NextResponse } from "next/server";
import {
  getTelemetrySummary,
  getSelectionTelemetry,
  getGenerationTelemetry,
  exportTelemetryData,
} from "@/lib/generation/telemetry";

/**
 * GET /api/telemetry
 * Returns telemetry data and metrics
 *
 * Query params:
 * - summary: Get aggregated metrics (default)
 * - full: Get all telemetry entries
 * - export: Get exportable data dump
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "summary";

    switch (mode) {
      case "full":
        return NextResponse.json({
          selections: getSelectionTelemetry(),
          generations: getGenerationTelemetry(),
        });

      case "export":
        return NextResponse.json(exportTelemetryData());

      case "summary":
      default:
        return NextResponse.json(getTelemetrySummary());
    }
  } catch (error) {
    console.error("[Telemetry API] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve telemetry data" },
      { status: 500 }
    );
  }
}
