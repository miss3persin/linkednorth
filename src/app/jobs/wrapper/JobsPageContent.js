'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { JobListingCard } from '../../components/jobs/JobListingCard'
import { saveJobsRedirect } from '../../lib/authRedirect'
import { SearchBar } from '../../components/ui/SearchBar'
import { Inter } from 'next/font/google'
import overlay from '/public/Overlay.png'
import { Button } from '../../components/ui/Button'
import arrow_right from '/public/chevron right.png'
import logo from '/public/linkednorth-logo.png'
import { useUser } from "@clerk/nextjs"

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const formatPostedTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`
  return `${years} year${years !== 1 ? 's' : ''} ago`
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const jobTitleQuery = searchParams.get('jobTitle') || ''
  const countryQuery = searchParams.get('country') || ''

  const { isSignedIn, user } = useUser()

  const handleJobClick = (job) => {
    router.push(`/joblistings/${job.id}`)
  }

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      setError(null)
      try {
        // Map old query params to new merged API params
        const query = new URLSearchParams()
        if (jobTitleQuery) query.append('search', jobTitleQuery)
        if (countryQuery) query.append('geo', countryQuery)
        query.append('limit', '100') // fetch max 100 jobs by default

        const res = await fetch(`/api/jobs?${query.toString()}`)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        const fetchedJobs = data.jobs || []
        setJobs(fetchedJobs)

        // Cache jobs in background (optional)
        if (fetchedJobs.length > 0) {
          fetch('/api/jobs/cache', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobs: fetchedJobs }),
          })
            .then(res => {
              if (res.status === 401) console.warn("Not logged in, skipping cache.");
            })
            .catch(err => console.error('Cache error:', err));
        }
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Something went wrong while fetching jobs.")
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [jobTitleQuery, countryQuery])

  const handleViewDetails = (job) => {
    setSelectedJob(job)
  }

  const handleSaveJob = async (job) => {
    if (!isSignedIn) {
      saveJobsRedirect(searchParams)
      alert("Please sign in to save jobs")
      return
    }

    try {
      const res = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          userId: user.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to save job')

      alert("Job saved successfully!")
    } catch (err) {
      console.error("Failed to save job:", err)
      alert("Failed to save job. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex bg-white mt-16">

      <main className="flex-1 flex flex-col">
        {/* === Hero Section === */}
        <section className="relative bg-gray-50 w-full py-10 sm:py-8">
          <div className="absolute right-0 bottom-0 h-full flex items-center pointer-events-none opacity-70 sm:opacity-50">
            <Image src={overlay} alt="overlay" className="w-auto h-full object-fill" priority />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 sm:px-12 py-12 sm:py-8 grid grid-cols-1 gap-10 sm:gap-6 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-[2.8rem] md:text-[2.4rem] sm:text-[2rem] font-bold mb-2 leading-tight">
                Find your Dream Job
              </h2>
              <p className={`${inter.variable} text-[#737373] mb-6 font-light text-base sm:text-sm`}>
                Explore our job search platform, built to simplify your job hunt.
              </p>
              <div className="flex justify-center md:justify-start">
                <SearchBar />
              </div>
            </div>
          </div>
        </section>

        {/* === Job Listings === */}
        <div className="flex-1 max-w-6xl mx-auto px-6 sm:px-12 xl:px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <h3 className="font-bold text-3xl md:text-2xl sm:text-xl">
                {loading
                  ? 'Getting jobs...'
                  : error
                    ? 'Error loading jobs'
                    : `${jobs.length} jobs found`}
              </h3>

              <button className="flex items-center border px-3 py-1 rounded text-sm sm:text-xs">
                Most Recent <ChevronDown size={16} className="ml-1" />
              </button>
            </div>

            <div className="flex flex-col gap-6 sm:gap-4">
              {loading ? (
                <p className="text-gray-500">Looking for jobs...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobListingCard
                    key={job.id}
                    id={job.id}
                    jobTitle={job.jobTitle}
                    company={job.company}
                    location={job.location}
                    postedTime={job.postedTime}
                    jobType={job.jobType}
                    contractType={job.contractType}
                    description={job.description}
                    imageSrc={job.imageSrc || logo}
                    applyLink={job.applyLink}
                    detailsLink={job.detailsLink}
                    onViewDetails={() => handleViewDetails(job)}
                  />
                ))
              ) : (
                <p className="text-gray-600">No jobs match your search.</p>
              )}
            </div>
          </div>

          {/* Sidebar details panel */}
          <aside className={`border rounded p-6 sm:p-4 sticky top-24 self-start flex flex-col ${selectedJob ? 'h-[85vh]' : 'h-fit'} hidden lg:block`}>
            {!selectedJob ? (
              <>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-base sm:text-sm">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded">✉️</span>
                  Subscribe for updates
                </h4>
                <p className="text-sm text-gray-600 mb-4">Stay informed about new job opportunities.</p>
                <input type="email" placeholder="Enter Email" className="border rounded px-4 py-2 w-full mb-3 text-sm" />
                <button className="bg-black text-white px-4 py-2 w-full rounded text-sm">Subscribe</button>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg">Job Details</h4>
                  <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-black text-sm">✕</button>
                </div>
                <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

                <div className="overflow-y-auto pr-1 flex-1 thin-scroll">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image src={selectedJob.imageSrc || logo} alt="Company Logo" fill className="object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-base">{selectedJob.jobTitle}</p>
                      <p className="text-sm text-gray-600">{selectedJob.company}</p>
                      <p className="text-xs text-gray-500">
                        {selectedJob.location} • {formatPostedTime(selectedJob.postedTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => window.open(selectedJob.applyLink, '_blank')}
                      className="bg-black text-white text-sm px-4 py-2 rounded w-full hover:bg-gray-800 transition"
                    >
                      Easy Apply
                    </button>
                    <button
                      onClick={() => handleSaveJob(selectedJob)}
                      className="border text-sm px-4 py-2 rounded w-full hover:bg-gray-50 transition"
                    >
                      Save
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{selectedJob.description}</p>
                  <Button
                    text="Show more details"
                    img={arrow_right}
                    variant="black"
                    onClick={() => handleJobClick(selectedJob)}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
