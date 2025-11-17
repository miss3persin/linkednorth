import { prisma } from "../../lib/prisma";
export const runtime = "nodejs";

export async function POST(req) {
  let job;

  // 1️⃣ Parse JSON safely
  try {
    job = await req.json();
  } catch (err) {
    console.error("Invalid JSON received:", err);
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  if (!job || Object.keys(job).length === 0) {
    return new Response(JSON.stringify({ error: "Missing job data" }), { status: 400 });
  }

  // 2️⃣ Generate a safe job ID
  const rawId =
    job.adref ||                                 // best if adref exists
    job.id ||                                    // fallback to id
    (job.redirect_url ? job.redirect_url.split("/").pop() : null); // fallback to last URL segment

  if (!rawId) {
    return new Response(JSON.stringify({ error: "Missing job ID" }), { status: 400 });
  }

  const jobId = String(rawId).replace(/[^a-zA-Z0-9_-]/g, "");

  // 3️⃣ Prepare safe job fields
  const jobData = {
    id: jobId,
    jobTitle: job.title || "Untitled Job",
    company: job.company?.display_name || "Unknown Company",
    location: job.location?.display_name || "Unknown Location",
    description: job.description || "No description available",
    applyLink: job.redirect_url || "#",
  };

  // 4️⃣ Upsert job into DB
  try {
    await prisma.job.upsert({
      where: { id: jobId },
      update: {},  // no updates for now
      create: jobData,
    });

    return new Response(JSON.stringify({ message: "Job saved", id: jobId }), { status: 200 });
  } catch (err) {
    console.error("Prisma upsert failed:", err);
    return new Response(JSON.stringify({ error: "Failed to save job" }), { status: 500 });
  }
}
