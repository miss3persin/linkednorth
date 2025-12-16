import Sidebar from "../../components/layout/Sidebar";
import { prisma } from "../../lib/prisma";

export default async function JobPage({ params }) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { externalId: id },
  });

  if (!job) return <p className="min-h-screen flex bg-white text-2xl font-bold items-center justify-center">Job not found</p>;

  return (
    <div className="min-h-screen flex bg-white mt-20">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{job.jobTitle}</h1>
        <p className="text-gray-600 mb-2">{job.company}</p>
        <p className="text-gray-500 mb-4">{job.location}</p>
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: job.description }}></p>
        <a href={job.applyLink} target="_blank" className="bg-black text-white px-4 py-2 rounded">
          Apply
        </a>
      </main>
    </div>
  );
}
