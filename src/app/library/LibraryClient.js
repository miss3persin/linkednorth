'use client'

import { useState, useEffect } from "react"
import Sidebar from "../components/layout/Sidebar"
import { HiPlus } from "react-icons/hi"

export default function LibraryClient() {
    const [jobColumns, setJobColumns] = useState([
        {
            title: "Saved Jobs",
            desc: "Jobs you're interested in",
            color: "bg-[#F8FAFC]",
            buttonColor: "bg-white",
            jobs: [],
        },
        {
            title: "Applied Jobs",
            desc: "Applications submitted",
            color: "bg-[#E8F1FF]",
            buttonColor: "bg-white",
            jobs: [],
        },
        {
            title: "Pending Jobs",
            desc: "Awaiting response",
            color: "bg-[#FFF8CC]",
            buttonColor: "bg-white",
            jobs: [],
        },
        {
            title: "Completed",
            desc: "Successfully completed",
            color: "bg-[#D9FBE8]",
            buttonColor: "bg-white",
            jobs: [],
        },
        {
            title: "Rejected",
            desc: "Learn and Improve",
            color: "bg-[#FFE4E4]",
            buttonColor: "bg-white",
            jobs: [],
        },
    ])


    /* ---------------- FETCH SAVED JOBS FROM SUPABASE ---------------- */

    useEffect(() => {
        async function fetchSavedJobs() {
            try {
                const res = await fetch('/api/jobs/save')
                if (!res.ok) return

                const savedJobs = await res.json()

                const formatted = savedJobs.map(item => ({
                    jobId: item.job_id,
                    title: item.job_title,
                    company: item.job_data?.company ?? '',
                    status: item.status,
                    date: new Date(item.created_at).toLocaleDateString(),
                    // tag: "Saved",
                    // tagColor: "bg-blue-100 text-blue-600",
                }))


                // setJobColumns(prev => {
                //     const updated = structuredClone(prev)
                //     const savedCol = updated.find(c => c.title === "Saved Jobs")
                //     if (!savedCol) return prev

                //     const existing = new Set(
                //         savedCol.jobs.map(j => `${j.title}-${j.company}`)
                //     )

                //     formatted.forEach(job => {
                //         const key = `${job.title}-${job.company}`
                //         if (!existing.has(key)) {
                //             savedCol.jobs.unshift(job)
                //         }
                //     })

                //     return updated
                // })
                setJobColumns(prev => {
                    const updated = structuredClone(prev)
                    updated.forEach(col => (col.jobs = []))

                    formatted.forEach(job => {
                        const col = updated.find(c =>
                            c.title.toLowerCase().startsWith(job.status)
                        )
                        if (col) col.jobs.push(job)
                    })

                    return updated
                })

            } catch (err) {
                console.error("Failed to fetch saved jobs")
            }
        }

        fetchSavedJobs()
    }, [])

    /* ---------------- DRAG & DROP ---------------- */

    const handleDragStart = (e, colIndex, jobIndex) => {
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ colIndex, jobIndex })
        )
    }

    const handleDrop = async (e, targetColIndex) => {
        e.preventDefault()
        const { colIndex, jobIndex } = JSON.parse(
            e.dataTransfer.getData("text/plain")
        )

        if (colIndex === targetColIndex) return

        const targetStatus = jobColumns[targetColIndex].title
            .toLowerCase()
            .split(' ')[0] // saved, applied, pending, etc.

        setJobColumns(prev => {
            const updated = structuredClone(prev)
            const [movedJob] = updated[colIndex].jobs.splice(jobIndex, 1)
            updated[targetColIndex].jobs.push(movedJob)

            // 🔥 persist
            fetch('/api/jobs/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: movedJob.jobId,
                    status: targetStatus,
                }),
            })

            return updated
        })
    }


    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen flex bg-white mt-16 overflow-x-hidden">
            <Sidebar />

            <main className="flex-1 px-4 sm:px-6 md:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
                    <div>
                        <h1 className="text-lg sm:text-xl font-semibold">
                            Job Applications Tracker
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Track and manage your job applications
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <button className="text-xs sm:text-sm border rounded-md px-2 sm:px-3 py-1 sm:py-2 bg-white hover:bg-gray-50">
                            Filter
                        </button>
                        <button className="text-xs sm:text-sm bg-black text-white rounded-md px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1">
                            <HiPlus size={14} /> Add Job
                        </button>
                    </div>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                    {jobColumns.map((col, i) => (
                        <div
                            key={i}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, i)}
                            className={`${col.color} p-4 rounded-xl border`}
                        >
                            <div className="mb-4">
                                <p className="text-sm font-semibold">{col.title}</p>
                                <p className="text-xs text-gray-500">{col.desc}</p>

                                <div className="flex justify-between mt-2">
                                    <button className="text-xs border rounded-md flex items-center justify-center gap-1 px-2 py-1 bg-white">
                                        <HiPlus size={12} /> Add Job
                                    </button>
                                    <span className="text-xs bg-gray-200 rounded-full px-2 flex items-center justify-center">
                                        {col.jobs.length}
                                    </span>
                                </div>
                            </div>

                            {col.jobs.map((job, j) => (
                                <div
                                    key={`${job.title}-${j}`}
                                    draggable
                                    onDragStart={e => handleDragStart(e, i, j)}
                                    className="bg-white p-3 rounded-lg mb-3 shadow-sm border cursor-move"
                                >
                                    <p className="font-medium text-sm">{job.title}</p>
                                    <p className="text-xs text-gray-500">{job.company}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
