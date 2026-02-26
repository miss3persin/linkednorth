// app/dashboard/page.js
export const dynamic = "force-dynamic";

import Sidebar from "../components/layout/Sidebar";
import { FiEye, FiCalendar, FiBriefcase } from "react-icons/fi";
import { getUserActivity } from "@/services/activityService";
import { Loader } from "../components/ui/Loader";
import DashboardNotifications from "./components/DashboardNotifications";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import {
  HIDDEN_DERIVED_KEY,
  parseHiddenDerivedIds,
} from "@/app/lib/hiddenDerivedNotifications";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  let user = null;

  if (accessToken) {
    const { data } = await supabaseAdmin.auth.getUser(accessToken);
    user = data?.user ?? null;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading session" size="md" />
      </div>
    );
  }

  const userMetadata = user.user_metadata ?? {};
  const displayName =
    userMetadata.full_name ||
    userMetadata.name ||
    userMetadata.given_name ||
    userMetadata.first_name ||
    userMetadata.firstName ||
    user.email?.split("@")[0] ||
    "there";
  const hiddenDerivedCookie = cookieStore.get(HIDDEN_DERIVED_KEY)?.value;
  const hiddenDerivedIds = new Set(parseHiddenDerivedIds(hiddenDerivedCookie));
  const activity = await getUserActivity(user.id, hiddenDerivedIds);

  const stats = {
    applications: activity.appliedJobs,
    viewed: activity.viewedJobs,
    interviews: activity.interviews,
  };

  const notifications = activity.notifications || [];

  const progressStats = [
    {
      label: "Profile Completeness",
      value: activity.profileCompleteness,
      color: "bg-blue-600",
    },
    {
      label: "Application Success Rate",
      value: activity.successRate,
      color: "bg-green-500",
    },
    {
      label: "Interview Conversion",
      value: activity.conversionRate,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="dashboard-page min-h-screen flex bg-gray-50 mt-[72px]">
      <Sidebar />
      <main className="flex-1 px-3 py-6 sm:px-5 md:px-8 xl:p-10">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          Welcome back, {displayName}!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start gap-3">
              <p className="text-gray-500 text-sm leading-tight">
                Applications Submitted
              </p>
              <FiBriefcase className="text-2xl sm:text-3xl text-blue-500 shrink-0" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {stats.applications}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Total applications</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start gap-3">
              <p className="text-gray-500 text-sm leading-tight">
                Jobs Viewed
              </p>
              <FiEye className="text-2xl sm:text-3xl text-green-500 shrink-0" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {stats.viewed}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start gap-3">
              <p className="text-gray-500 text-sm leading-tight">
                Interviews Scheduled
              </p>
              <FiCalendar className="text-2xl sm:text-3xl text-purple-500 shrink-0" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {stats.interviews}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Active interviews</p>
          </div>
        </div>
        <div
          className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border mb-6 sm:mb-8 flex flex-col min-h-0 overflow-hidden ${notifications.length > 0
              ? "max-h-[360px] sm:max-h-[420px] lg:max-h-[460px]"
              : ""
            }`}
        >
          <DashboardNotifications initialNotifications={notifications} />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">
            Job Hunt Progress
          </h3>

          {progressStats.map((bar, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span className="pr-2">{bar.label}</span>
                <span className="font-medium">{bar.value}%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`${bar.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
