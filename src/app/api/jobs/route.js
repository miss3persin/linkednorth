import { NextResponse } from "next/server";
import { getJobs } from "@/services/jobService";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const limit = Number(searchParams.get("limit") || 100);

  try {
    const { jobs, sources } = await getJobs({ search, limit });

    return NextResponse.json({
      count: jobs.length,
      sources,
      jobs,
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
