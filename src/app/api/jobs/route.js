// app/api/jobs/route.js

const COUNTRY_CODES = {
  "united states": "us",
  "usa": "us",
  "united kingdom": "gb",
  "uk": "gb",
  "canada": "ca",
  "australia": "au",
  "germany": "de",
  "france": "fr",
  "netherlands": "nl",
  "india": "in",
  "nigeria": "ng",
  "south africa": "za",
  "spain": "es",
  "italy": "it",
  "brazil": "br",
  "singapore": "sg",
  "japan": "jp",
  "poland": "pl",
  "sweden": "se",
  "norway": "no",
  "ireland": "ie",
  "switzerland": "ch",
  "mexico": "mx",
  "new zealand": "nz",
  "philippines": "ph",
  "kenya": "ke",
  "ghana": "gh",
};


export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const jobTitle = searchParams.get("jobTitle") || ""
  const country = searchParams.get("country") || ""
  const appId = process.env.ADZUNA_APP_ID || "YOUR_APP_ID"
  const appKey = process.env.ADZUNA_APP_KEY || "YOUR_APP_KEY"

  const key = country?.trim().toLowerCase() || "";
  const countryCode = COUNTRY_CODES[key] || "gb"; // default to GB if not found


  const ADZUNA_URL = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${encodeURIComponent(jobTitle)}&where=${encodeURIComponent(country)}&content-type=application/json`

  try {
    const res = await fetch(ADZUNA_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) throw new Error(`Adzuna API Error: ${res.status}`)
    const data = await res.json()

    const jobs = (data.results || []).map((job, index) => ({
      id: job.id || index + 1,
      jobTitle: job.title || "N/A",
      company: job.company?.display_name || "N/A",
      location: job.location?.display_name || "N/A",
      jobType: job.contract_time || "N/A",
      contractType: job.contract_type || "N/A",
      postedTime: job.created || "Unknown",
      description: job.description || "N/A",
      imageSrc: "/default-logo.png",
      applyLink: job.redirect_url || "#",
      detailsLink: job.redirect_url || "#",
    }))

    return new Response(JSON.stringify({ jobs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching from Adzuna:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch jobs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
