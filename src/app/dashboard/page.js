// app/dashboard/page.js
import Sidebar from "../components/layout/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { FiEye, FiCalendar, FiBriefcase } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { getUserActivity } from "../lib/activity";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  // ✅ Fetch user activity data
  const activity = await getUserActivity(user.id);

  // ✅ Real stats from database
  const stats = {
    applications: activity.appliedJobs,
    viewed: activity.viewedJobs,
    interviews: activity.interviews,
  };

  // ✅ Real notifications from DB
  const notifications = activity.notifications
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((n) => ({
      title: n.title,
      text: n.message,
      actionLink: n.action_link,
      action: n.action_link ? "View" : "Open",
      time: new Date(n.created_at).toLocaleDateString(),
      color: n.color || "text-blue-500",
    }));

  // ✅ Real progress bars with calculated data
  const progressStats = [
    { 
      label: "Profile Completeness", 
      value: activity.profileCompleteness, 
      color: "bg-blue-600" 
    },
    { 
      label: "Application Success Rate", 
      value: activity.successRate, 
      color: "bg-green-500" 
    },
    { 
      label: "Interview Conversion", 
      value: activity.conversionRate, 
      color: "bg-purple-500" 
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 mt-16">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-8">
          Welcome back, {user.firstName}!
        </h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm flex w-full justify-between items-center">
              Applications Submitted{" "}
              <FiBriefcase className="text-3xl text-blue-500" />
            </p>
            <h2 className="text-3xl font-bold">{stats.applications}</h2>
            <p className="text-xs text-gray-400 mt-1">Total applications</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm flex w-full justify-between items-center">
              Jobs Viewed <FiEye className="text-3xl text-green-500" />
            </p>
            <h2 className="text-3xl font-bold inline-flex items-center gap-1">
              {stats.viewed}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm flex w-full justify-between items-center">
              Interviews Scheduled{" "}
              <FiCalendar className="text-3xl text-purple-500" />
            </p>
            <h2 className="text-3xl font-bold inline-flex items-center gap-1">
              {stats.interviews}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Active interviews</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Notifications
            </h3>
            <button className="text-sm text-blue-600 hover:underline">
              Mark all as read
            </button>
          </div>

          <div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No notifications yet.</p>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="py-4 px-4 bg-[#F9FAFB] flex w-full gap-4 items-start mb-2 rounded-md"
                >
                  <IoMdNotificationsOutline className={`text-3xl ${n.color}`} />

                  {/* Content */}
                  <div className="flex-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{n.text}</p>
                    {n.actionLink && (
                      <Link
                        href={n.actionLink}
                        className="text-blue-600 text-sm mt-2 inline-block font-medium"
                      >
                        {n.action}
                      </Link>
                    )}
                  </div>

                  {/* Time stamp */}
                  <p className="text-xs text-gray-400 mt-1 ml-auto">
                    {n.time}
                  </p>
                </div>
              ))
            )}
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
                  className={`${bar.color} h-2 rounded-full transition-all duration-500`}
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