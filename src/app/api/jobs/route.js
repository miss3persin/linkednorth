import { NextResponse } from "next/server";
import { getJobs } from "@/services/jobService";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const geo = searchParams.get("geo") || "";
  const limit = Number(searchParams.get("limit") || 25);
  const offset = Number(searchParams.get("offset") || 0);
  const sort = searchParams.get("sort") || "recent";

  try {
    const { jobs, totalCount, sources } = await getJobs({ search, geo, limit, offset, sort });

    return NextResponse.json({
      count: jobs.length,
      totalCount,
      sources,
      jobs,
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
