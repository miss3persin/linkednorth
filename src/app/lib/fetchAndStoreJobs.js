import { prisma } from "./prisma";
export const runtime = "nodejs";

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

export async function fetchAndStoreJobs({ countryCode, jobTitle, country }) {
  const ADZUNA_URL = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=20&what=${encodeURIComponent(jobTitle)}&where=${encodeURIComponent(country)}&content-type=application/json`;

  const res = await fetch(ADZUNA_URL);
  if (!res.ok) throw new Error("Failed to fetch jobs from Adzuna");

  const data = await res.json();

  console.log(data.results)

for (const job of data.results) {
  try {
    await prisma.job.upsert({
      where: { externalId: String(job.id) },
      update: {
        jobTitle: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        applyLink: job.redirect_url,
      },
      create: {
        externalId: String(job.id),
        jobTitle: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        applyLink: job.redirect_url,
      },
    });
  } catch (err) {
    console.error("Failed to upsert job:", job.id, err);
  }
}


  return data.results;
}
