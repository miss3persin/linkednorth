import { prisma } from "../../lib/prisma";

export async function POST(req) {
  const job = await req.json();

  try {
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

    return new Response(JSON.stringify({ message: "Job saved" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to save job" }), { status: 500 });
  }
}
