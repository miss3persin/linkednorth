"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/layout/Sidebar"; // adjust path if needed
import { useUser } from "@clerk/nextjs";

export default function RecruiterHub() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecruiterData() {
      if (!isLoaded || !user) return;

      try {
        const res = await fetch("/api/recruiter/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error fetching hub data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecruiterData();
  }, [isLoaded, user]);

  // Stats based on fetched jobs
  const stats = [
    {
      label: "Active Job Posts",
      value: jobs.filter((j) => j.status === "active").length,
      change: "+0 vs last month",
      color: "text-green-600",
    },
    {
      label: "Total Applications",
      value: "0", // replace with actual data if available
      change: "+0% vs last month",
      color: "text-green-600",
    },
    {
      label: "Candidates Shortlisted",
      value: "0",
      change: "+0 vs last month",
      color: "text-green-600",
    },
    {
      label: "Interviews Scheduled",
      value: "0",
      change: "-0 vs last month",
      color: "text-red-600",
    },
  ];

  const recentApps = []; // mock for now, replace with API if needed

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen mt-16 bg-white">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Hub</h1>
            <p className="text-sm text-gray-500">
              Manage job postings, applicants, and hiring activities.
            </p>
          </div>

          <button
            onClick={() => {
              const isRecruiter = user?.publicMetadata?.role === "recruiter";
              if (isRecruiter) {
                window.location.href = "/recruiter/post-job";
              }
            }}
            className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
          >
            <span>+</span> Post a Job
          </button>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="border border-gray-100 rounded-xl p-5 shadow-sm bg-white relative"
            >
              <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
              <p className={`text-[10px] font-semibold ${stat.color}`}>
                {stat.change.startsWith("+") ? "↗" : "↘"} {stat.change}
              </p>
              <div className="absolute top-5 right-5 text-gray-300">
                <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Job Posts */}
          <div className="flex-[2]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900">My Job Posts</h2>
              <button className="text-xs text-gray-400 hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {jobs.length === 0 ? (
                <div className="border border-gray-100 rounded-xl p-6 text-center">
                  <p className="text-gray-400 text-sm">No job posts yet</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm">{job.title}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            job.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>📍 {job.location || "Remote"}</span>
                        <span>🕒 Posted {new Date(job.created_at).toLocaleDateString()}</span>
                        <span>👥 0 Applicants</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border border-gray-200 text-xs px-4 py-1.5 rounded-md hover:bg-gray-50">
                        View Applicants
                      </button>
                      <button className="border border-gray-200 text-xs px-4 py-1.5 rounded-md hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="text-gray-400 px-2">•••</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Alerts & Recent Apps */}
          <div className="flex-1 space-y-8">
            {/* Activity & Alerts */}
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Activity & Alerts</h2>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                  <p className="text-[11px] font-semibold text-blue-700">
                    5 new applications received today
                  </p>
                  <p className="text-[9px] text-blue-500">Last updated: 10m ago</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                  <p className="text-[11px] font-semibold text-orange-700">
                    Marketing Manager post expires in 2 days
                  </p>
                  <p className="text-[9px] text-orange-500 underline cursor-pointer">
                    Action required
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-900">Recent Applications</h2>
                <button className="text-xs text-gray-400 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {recentApps.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center">No recent applications</p>
                ) : (
                  recentApps.map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold">{app.name}</p>
                            <span
                              className={`text-[8px] px-1.5 py-0.5 rounded-sm font-bold uppercase ${
                                app.status === "New"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400">
                            {app.role} • {app.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <button className="hover:text-blue-500 text-sm">👁</button>
                        <button className="hover:text-green-500 text-sm">✓</button>
                        <button className="hover:text-red-500 text-sm">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
