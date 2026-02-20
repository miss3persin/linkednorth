'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

    const router = useRouter()
    const [filterOpen, setFilterOpen] = useState(false)
    const [filterQuery, setFilterQuery] = useState('')
    const [removingJobId, setRemovingJobId] = useState(null)

    const normalizedFilter = filterQuery.trim().toLowerCase()
    const filterActive = normalizedFilter.length > 0
    const matchesFilter = (job) => {
        if (!normalizedFilter) return true
        return (
            job.title?.toLowerCase().includes(normalizedFilter) ||
            job.company?.toLowerCase().includes(normalizedFilter)
        )
    }

    const filteredColumns = filterActive
        ? jobColumns.map((col) => ({
              ...col,
              jobs: col.jobs.filter(matchesFilter),
          }))
        : jobColumns

    const totalFilteredJobs = filteredColumns.reduce((total, col) => total + col.jobs.length, 0)

    const handleRemoveJob = async (job) => {
        if (!job?.jobId) return

        setRemovingJobId(job.jobId)
        try {
            const res = await fetch(`/api/jobs/save?jobId=${encodeURIComponent(job.jobId)}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to remove job')

            setJobColumns(prev => {
                const updated = structuredClone(prev)
                updated.forEach(col => {
                    col.jobs = col.jobs.filter(entry => entry.jobId !== job.jobId)
                })
                return updated
            })
        } catch (err) {
            console.error('Failed to remove job from library', err)
        } finally {
            setRemovingJobId(null)
        }
    }


    

    useEffect(() => {
        async function fetchSavedJobs() {
            try {
                const res = await fetch('/api/jobs/save')
                if (!res.ok) return

                const savedJobs = await res.json()

                const formatted = savedJobs.map(item => ({
                    jobId: item.job_id,
                    title: item.jobs?.title || 'Unknown Position',
                    company: item.jobs?.company || 'Unknown Company',
                    status: item.status || 'saved',
                    date: new Date(item.saved_at || item.created_at).toLocaleDateString(),
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

    

    const handleDragStart = (e, colIndex, job) => {
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ colIndex, jobId: job.jobId })
        )
    }

    const handleDrop = async (e, targetColIndex) => {
        e.preventDefault()
        const { colIndex, jobId } = JSON.parse(
            e.dataTransfer.getData("text/plain")
        )

        if (colIndex === targetColIndex) return

        const targetStatus = jobColumns[targetColIndex].title
            .toLowerCase()
            .split(' ')[0] // saved, applied, pending, etc.

        setJobColumns(prev => {
            const updated = structuredClone(prev)
            const sourceCol = updated[colIndex]
            if (!sourceCol) return prev

            const jobIndex = sourceCol.jobs.findIndex(job => job.jobId === jobId)
            if (jobIndex === -1) return prev

            const [movedJob] = sourceCol.jobs.splice(jobIndex, 1)
            if (!movedJob) return prev
            movedJob.status = targetStatus
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


    

    return (
        <div className="library-page min-h-screen flex bg-white mt-[72px]">
            <Sidebar />

            <main className="flex-1 px-4 sm:px-6 md:px-8 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
                    <div>
                        <h1 className="text-lg sm:text-xl font-semibold">
                            Job Applications Tracker
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Track and manage your job applications
                        </p>
                    </div>

                <div className="flex flex-row flex-wrap gap-2 items-center">
                    <button
                        type="button"
                        onClick={() => setFilterOpen((prev) => !prev)}
                        className="text-xs sm:text-sm border rounded-md px-3 py-2 bg-white hover:bg-gray-50 min-h-[38px] flex items-center justify-center"
                    >
                        {filterOpen ? 'Hide Filters' : 'Filter'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/joblistings')}
                        className="text-xs sm:text-sm bg-black text-white rounded-md px-3 sm:px-4 py-2 flex items-center gap-1 skip-squared min-h-[38px]"
                    >
                        <HiPlus size={14} /> Add Job
                    </button>
                </div>
            </div>

            {filterOpen && (
                <div className="max-w-6xl mx-auto mt-4 mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="flex-1 min-w-[220px]">
                            <label className="text-xs font-semibold text-gray-500">Filter saved jobs</label>
                            <input
                                type="text"
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Search by title or company"
                                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <p className="text-xs text-gray-500">
                                {filterActive
                                    ? `Showing ${totalFilteredJobs} matching job${totalFilteredJobs === 1 ? '' : 's'}`
                                    : 'Filters apply to title + company'}
                            </p>
                            <button
                                type="button"
                                onClick={() => setFilterQuery('')}
                                disabled={!filterActive}
                                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white hover:bg-gray-50 disabled:opacity-40"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {filteredColumns.map((col, i) => (
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
                                    <button
                                        type="button"
                                        onClick={() => router.push('/joblistings')}
                                        className="text-xs border rounded-md flex items-center justify-center gap-1 px-2 py-1 bg-white skip-squared"
                                    >
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
                                    onDragStart={e => handleDragStart(e, i, job)}
                                    className="bg-white p-3 rounded-lg mb-3 shadow-sm border cursor-move"
                                >
                                    <p className="font-medium text-sm">{job.title}</p>
                                    <p className="text-xs text-gray-500">{job.company}</p>
                                    <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500">
                                        <span>{job.date ?? 'Unknown date'}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveJob(job)
                                            }}
                                            disabled={removingJobId === job.jobId}
                                            className={`font-semibold transition-colors ${
                                                removingJobId === job.jobId
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-500 hover:text-red-600'
                                            }`}
                                        >
                                            {removingJobId === job.jobId ? 'Removing...' : 'Remove'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
