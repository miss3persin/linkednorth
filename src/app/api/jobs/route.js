import { NextResponse } from "next/server";

export const runtime = "edge";

/* ----------------------------- CONFIG ----------------------------- */

const YC_API_URL =
  "https://free-y-combinator-jobs-api.p.rapidapi.com/active-jb-7d";

const REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs";
const JOBICY_API_URL = "https://jobicy.com/api/v2/remote-jobs";

/* ------------------------- UTILITY HELPERS ------------------------- */

async function safeFetch(fn, source) {
  try {
    const data = await fn();
    return { ok: true, source, data };
  } catch (err) {
    console.error(`[${source}] fetch failed`, err);
    return { ok: false, source, data: [] };
  }
}

function dedupeJobs(jobs) {
  const map = new Map();

  for (const job of jobs) {
    const key = `${job.company}-${job.jobTitle}`.toLowerCase();
    if (!map.has(key)) {
      map.set(key, job);
    }
  }

  return Array.from(map.values());
}

/* ------------------------- SOURCE FETCHERS ------------------------- */

async function fetchYCJobs() {
  const res = await fetch(YC_API_URL, {
    headers: {
      "x-rapidapi-host": "free-y-combinator-jobs-api.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    },
    next: { revalidate: 60 * 30 }, // 30 mins
  });

  if (!res.ok) throw new Error("YC API failed");

  const rawJobs = await res.json();

  return rawJobs.map((job) => ({
    id: `yc-${job.id}`,
    source: "ycombinator",
    jobTitle: job.title,
    company: job.organization,
    location:
      job.locations_derived?.length > 0
        ? job.locations_derived.join(" • ")
        : job.remote_derived
          ? "Remote"
          : "Not specified",
    jobType: job.remote_derived ? "Remote" : "On-site / Hybrid",
    contractType: job.employment_type?.[0] || "UNKNOWN",
    postedTime: job.date_posted,
    description: null,
    imageSrc: job.organization_logo || null,
    applyLink: job.external_apply_url || job.url,
    detailsLink: job.url,
  }));
}

async function fetchRemotiveJobs(search) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const res = await fetch(
    `${REMOTIVE_API_URL}?${params.toString()}`,
    {
      next: { revalidate: 60 * 60 * 6 }, // 6 hours (TOS safe)
    }
  );

  if (!res.ok) throw new Error("Remotive API failed");

  const data = await res.json();
  const rawJobs = data.jobs || [];

  return rawJobs.map((job) => ({
    id: `remotive-${job.id}`,
    source: "remotive",
    jobTitle: job.title,
    company: job.company_name,
    location: job.candidate_required_location || "Remote",
    jobType: "Remote",
    contractType: job.job_type
      ? job.job_type.replace("_", " ").toUpperCase()
      : "UNKNOWN",
    postedTime: job.publication_date,
    description: job.description || null,
    imageSrc: job.company_logo || null,
    applyLink: job.url,
    detailsLink: job.url,
    attribution: {
      name: "Remotive",
      url: "https://remotive.com",
    },
  }));
}

async function fetchJobicyJobs() {
  const res = await fetch(JOBICY_API_URL, {
    next: { revalidate: 60 * 60 * 6 }, // 6 hours
  });

  if (!res.ok) throw new Error("Jobicy API failed");

  const data = await res.json();
  const rawJobs = data.jobs || data || [];

  return rawJobs.map((job) => ({
    id: `jobicy-${job.id}`,
    source: "jobicy",
    jobTitle: job.jobTitle,
    company: job.companyName,
    location: job.jobGeo || "Remote",
    jobType: "Remote",
    contractType: Array.isArray(job.jobType)
      ? job.jobType[0].replace("-", " ").toUpperCase()
      : typeof job.jobType === "string"
        ? job.jobType.replace("-", " ").toUpperCase()
        : "UNKNOWN",
    postedTime: job.pubDate,
    description: job.jobDescription || null,
    imageSrc: job.companyLogo || null,
    applyLink: job.url,
    detailsLink: job.url,
    salary:
      job.annualSalaryMin || job.annualSalaryMax
        ? {
          min: job.annualSalaryMin || null,
          max: job.annualSalaryMax || null,
          currency: job.salaryCurrency || null,
        }
        : null,
  }));
}

/* ----------------------------- HANDLER ----------------------------- */

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const limit = Number(searchParams.get("limit") || 100);

  const results = await Promise.allSettled([
    safeFetch(fetchYCJobs, "ycombinator"),
    safeFetch(() => fetchRemotiveJobs(search), "remotive"),
    safeFetch(fetchJobicyJobs, "jobicy"),
  ]);

  const jobs = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => (r.value.ok ? r.value.data : []));

  const dedupedJobs = dedupeJobs(jobs).slice(0, limit);

  return NextResponse.json({
    count: dedupedJobs.length,
    sources: results.map((r) =>
      r.status === "fulfilled"
        ? { source: r.value.source, ok: r.value.ok }
        : { source: "unknown", ok: false }
    ),
    jobs: dedupedJobs,
  });
}
