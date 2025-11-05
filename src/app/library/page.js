// app/profile/library/page.jsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";
import Link from "next/link";
import { HiPlus } from "react-icons/hi";
import { FiBriefcase } from "react-icons/fi";

export default async function LibraryPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  // Mock Dynamic Data (Replace with DB later)
  const jobColumns = [
    {
      title: "Saved Jobs",
      desc: "Jobs you're interested in",
      color: "bg-[#F8FAFC]",
      count: 2,
      buttonColor: "bg-white",
      jobs: [
        {
          title: "Senior Software Engineer",
          company: "TechCorp Solutions",
          date: "Dec 13, 2023",
          tag: "Remote",
          tagColor: "bg-blue-100 text-blue-600",
        },
        {
          title: "Marketing Manager",
          company: "Creative Agency Pro",
          date: "Dec 12, 2023",
          tag: "On-site",
          tagColor: "bg-green-100 text-green-600",
        },
      ],
    },
    {
      title: "Applied Jobs",
      desc: "Applications submitted",
      color: "bg-[#E8F1FF]",
      count: 2,
      buttonColor: "bg-white",
      jobs: [
        {
          title: "UX Designer",
          company: "DesignHub Inc.",
          date: "Dec 10, 2023",
          tag: "Hybrid",
          tagColor: "bg-purple-100 text-purple-600",
        },
      ],
    },
    {
      title: "Pending Jobs",
      desc: "Awaiting response",
      color: "bg-[#FFF8CC]",
      count: 1,
      buttonColor: "bg-white",
      jobs: [
        {
          title: "Product Manager",
          company: "Companywork PLC",
          date: "Dec 8, 2023",
          tag: "Remote",
          tagColor: "bg-blue-100 text-blue-600",
          extra: "Interview: Dec 18, 2:00 PM",
          extraColor: "bg-green-100 text-green-600",
        },
      ],
    },
    {
      title: "Completed",
      desc: "Successfully completed",
      color: "bg-[#D9FBE8]",
      count: 1,
      buttonColor: "bg-white",
      jobs: [
        {
          title: "Data Scientist",
          company: "Analytics Pro",
          date: "Dec 7, 2023",
          tag: "On-site",
          tagColor: "bg-green-100 text-green-600",
          offer: "Offer: $85,000/year",
          offerExpires: "Expires: Dec 20, 2023",
          offerColor: "bg-purple-100 text-purple-600",
        },
      ],
    },
    {
      title: "Rejected",
      desc: "Learn and Improve",
      color: "bg-[#FFE4E4]",
      count: 1,
      buttonColor: "bg-white",
      jobs: [
        {
          title: "Frontend Developer",
          company: "TechSolutions Ltd",
          date: "Nov 28, 2023",
          tag: "Remote",
          tagColor: "bg-blue-100 text-blue-600",
          rejected: "Rejected: Dec 5, 2023",
          rejectedColor: "bg-red-100 text-red-600",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-white mt-16">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-semibold">Job Applications Tracker</h1>
            <p className="text-sm text-gray-500">Track and manage your job applications</p>
          </div>

          <div className="flex gap-3">
            <button className="text-sm border rounded-md px-3 py-2 bg-white hover:bg-gray-50">
              Filter
            </button>
            <button className="text-sm bg-black text-white rounded-md px-3 py-2 flex items-center gap-1">
              <HiPlus size={16} /> Add Job
            </button>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {jobColumns.map((col, i) => (
            <div key={i} className={`${col.color} p-4 rounded-xl border`}>
              {/* Column Header */}
              <div className="mb-4">
                <p className="text-sm font-semibold">{col.title}</p>
                <p className="text-xs text-gray-500">{col.desc}</p>

                <div className="flex justify-between items-center mt-2">
                  <button
                    className={`flex items-center justify-center gap-1 text-xs border rounded-md w-full ${col.buttonColor} py-1 hover:opacity-80`}
                  >
                    <HiPlus size={12} /> Add Job
                  </button>
                  <span className="text-xs ml-2 bg-gray-200 rounded-full px-2 py-[2px]">
                    {col.count}
                  </span>
                </div>
              </div>

              {/* Job Cards */}
              {col.jobs.map((job, j) => (
                <div key={j} className="bg-white p-3 rounded-lg mb-3 shadow-sm border">
                  <p className="font-medium text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.company}</p>

                  <p className="text-xs text-gray-500 mt-1">Applied: {job.date}</p>

                  {job.tag && (
                    <span className={`text-[10px] px-2 py-[2px] rounded-md ${job.tagColor} mt-2 inline-block`}>
                      {job.tag}
                    </span>
                  )}

                  {job.extra && (
                    <span className={`block text-[10px] px-2 py-[2px] mt-2 rounded-md ${job.extraColor}`}>
                      {job.extra}
                    </span>
                  )}

                  {job.offer && (
                    <span className={`block text-[10px] px-2 py-[2px] mt-2 rounded-md ${job.offerColor}`}>
                      {job.offer}
                    </span>
                  )}

                  {job.offerExpires && (
                    <span className={`block text-[10px] px-2 py-[2px] rounded-md ${job.offerColor}`}>
                      {job.offerExpires}
                    </span>
                  )}

                  {job.rejected && (
                    <span className={`text-[10px] px-2 py-[2px] mt-2 rounded-md ${job.rejectedColor}`}>
                      {job.rejected}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
