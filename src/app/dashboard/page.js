// app/dashboard/page.js
import Sidebar from "../components/layout/Sidebar";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { FiEye, FiCalendar, FiBriefcase } from "react-icons/fi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoMdNotificationsOutline } from "react-icons/io";

export default async function Dashboard() {
  const user = await currentUser();
  if (!user) return redirect("/");

  // Mock dynamic data — replace with DB later
  const stats = {
    applications: 12,
    viewed: 47,
    interviews: 3,
  };

  const notifications = [
    {
      title: "Application Status Update",
      text: "Your application for Senior Product Designer at Google has moved to the interview stage.",
      action: "View Application",
      time: "2 hours ago",
    },
    {
      title: "New Job Match",
      text: "We found 5 new jobs that match your profile and preferences.",
      action: "View Jobs",
      time: "Yesterday",
    },
    {
      title: "Resume Feedback",
      text: "AI suggests improvements that could increase your chances by 35%.",
      action: "Edit Resume",
      time: "2 days ago",
    },
  ];

  const progressStats = [
    { label: "Profile Completeness", value: 85, color: "bg-blue-600" },
    { label: "Application Success Rate", value: 62, color: "bg-green-500" },
    { label: "Interview Conversion", value: 40, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 mt-16">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm flex w-full justify-between items-center">Applications Submitted <FiBriefcase className="text-3xl text-blue-500" /></p>
            <h2 className="text-3xl font-bold">{stats.applications}</h2>
            <p className="text-xs text-green-600 mt-1">+3 this week</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm flex w-full justify-between items-center">Jobs Viewed <FiEye className="text-3xl text-green-500" /></p>
            <h2 className="text-3xl font-bold inline-flex items-center gap-1">
              {stats.viewed} 
            </h2>
            <p className="text-xs text-green-600 mt-1">+15 this week</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm flex w-full justify-between items-center">Interviews Scheduled <FiCalendar className="text-3xl text-purple-500" /></p>
            <h2 className="text-3xl font-bold inline-flex items-center gap-1">
              {stats.interviews}
            </h2>
            <p className="text-xs text-green-600 mt-1">+1 this week</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <IoMdNotificationsOutline size={20} /> Notifications
            </h3>
            <button className="text-sm text-blue-600 hover:underline">
              Mark all as read
            </button>
          </div>

          <div className="divide-y">
            {notifications.map((n, i) => (
              <div key={i} className="py-4">
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-500 mt-1">{n.text}</p>
                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block font-medium"
                >
                  {n.action}
                </Link>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Job Hunt Progress</h3>

          {progressStats.map((bar, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{bar.label}</span>
                <span className="font-medium">{bar.value}%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`${bar.color} h-2 rounded-full`}
                  style={{ width: `${bar.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
