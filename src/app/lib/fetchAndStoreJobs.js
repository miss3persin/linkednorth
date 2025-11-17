import { prisma } from "./prisma";
export const runtime = "nodejs";


const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

export async function fetchAndStoreJobs({ countryCode, jobTitle, country }) {
  const ADZUNA_URL = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=20&what=${encodeURIComponent(jobTitle)}&where=${encodeURIComponent(country)}&content-type=application/json`;

  const res = await fetch(ADZUNA_URL);
  if (!res.ok) throw new Error("Failed to fetch jobs from Adzuna");

  const data = await res.json();

  for (const job of data.results) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {},
      create: {
        id: job.id,
        jobTitle: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        applyLink: job.redirect_url,
      },
    });
  }

  return data.results;
}
