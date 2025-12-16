'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { JobListingCard } from '../../components/jobs/JobListingCard'
import { SearchBar } from '../../components/ui/SearchBar'
import { Inter } from 'next/font/google'
import overlay from '/public/Overlay.png'
import stration_6 from '/public/Open Doodles Chilling.png'
import { Button } from '../../components/ui/Button'
import arrow_right from '/public/chevron right.png'
import logo from '/public/linkednorth-logo.png'
import AuthModals from "@/app/components/modals/AuthModals"

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
  const { isSignedIn } = useUser()
  const [openAuthModal, setOpenAuthModal] = useState(false)


  const searchParams = useSearchParams()
  const jobTitleQuery = searchParams.get('jobTitle') || ''
  const countryQuery = searchParams.get('country') || ''


const handleJobClick = async (job) => {
  if (!job?.id) {
    console.error("Missing Prisma job ID");
    return;
  }

  // Optional: save only if not already saved
  try {
    await fetch('/api/saveJob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        externalId: job.externalId, // ✅ API ID
        jobTitle: job.jobTitle,
        company: job.company,
        location: job.location,
        description: job.description,
        applyLink: job.applyLink,
      }),
    });
  } catch (err) {
    console.error("Failed to save job:", err);
  }

  // ✅ Redirect using PRISMA ID ONLY
  const route = isSignedIn
    ? `/joblistings/${job.id}`
    : `/jobs/${job.id}`;

  window.location.href = route;
};





  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/jobs?jobTitle=${encodeURIComponent(jobTitleQuery)}&country=${encodeURIComponent(countryQuery)}`
        )

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`)
        }

        const data = await res.json()

        if (!data.jobs || data.jobs.length === 0) {
          setJobs([])
          setError(null)
        } else {
          setJobs(data.jobs)
          setError(null)
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

  return (
    <div className="min-h-screen flex flex-col mt-20">
      {/* === Hero Section === */}
      <section className="relative bg-gray-50 w-full overflow-hidden py-10 sm:py-8">
        <div className="absolute right-0 bottom-0 h-full flex items-center pointer-events-none opacity-70 sm:opacity-50">
          <Image
            src={overlay}
            alt="overlay"
            className="w-auto h-full object-fill"
            priority
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-12 py-12 sm:py-8 flex flex-col xl:flex-row items-center gap-10">
          <div className="text-center md:text-left w-full">
            <h2 className="text-[2.8rem] md:text-[2.4rem] sm:text-[2rem] font-bold mb-2 leading-tight">
              Find your Dream Job
            </h2>
            <p className={`${inter.variable} text-[#737373] mb-6 font-light text-base sm:text-sm`}>
              Explore our job search platform, built to simplify your job hunt. <br className="hidden sm:block" />
              Navigate opportunities with ease and find the right position quickly and efficiently.
            </p>
            <div className="flex justify-center md:justify-start">
              <SearchBar />
            </div>
          </div>

          <div className="hidden xl:flex justify-center md:justify-end">
            <Image
              src={stration_6}
              alt="hero"
              width={700}
              height={700}
              className="w-[20rem] sm:w-[16rem] md:w-[22rem] lg:w-[35rem] mx-auto md:mx-0"
            />
          </div>
        </div>
      </section>

      {/* === Job Listings === */}
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-12 xl:px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h3 className="font-bold text-3xl md:text-2xl sm:text-xl text-center md:text-left w-full md:w-auto">
              {loading
                ? 'Getting jobs, hold on...'
                : error
                  ? 'Something\'s not right, try again later.'
                  : `${jobs.length} jobs found`}
            </h3>
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <button className="flex items-center border px-3 py-1 rounded text-sm sm:text-xs">
                Most Recent <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Job cards */}
          <div className="flex flex-col gap-6 sm:gap-4">
            {loading ? (
              <p className="text-gray-500 text-center md:text-left">Looking for jobs...</p>
            ) : error ? (
              <p className="text-red-500 text-center md:text-left">{error}</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <JobListingCard
                  key={job.id}
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
                  onViewDetails={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center md:text-left">No jobs match your search.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`border rounded p-6 sm:p-4 sticky top-24 self-start flex flex-col transition-all duration-300 ${selectedJob ? 'h-[85vh]' : 'h-fit'
            } lg:block hidden`}
        >
          {!selectedJob ? (
            <>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-base sm:text-sm">
                <span className="bg-purple-100 text-purple-600 p-2 rounded">✉️</span>
                Subscribe for updates
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Stay informed about new job opportunities so you never miss out.
              </p>
              <input
                type="email"
                placeholder="Enter Email"
                className="border rounded px-4 py-2 w-full mb-3 text-sm"
              />
              <button className="bg-black text-white px-4 py-2 w-full rounded text-sm">
                Subscribe
              </button>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-3 flex-shrink-0">
                <h4 className="font-bold text-lg sm:text-base">Job Details</h4>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-black text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="w-full h-[1px] bg-gray-200 mb-4 flex-shrink-0"></div>

              <div className="overflow-y-auto pr-1 flex-1 thin-scroll">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden">
                    <Image
                      src={selectedJob.imageSrc ? selectedJob.imageSrc : logo}
                      alt="Company Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base sm:text-sm">{selectedJob.jobTitle}</p>
                    <p className="text-sm text-gray-600">{selectedJob.company}</p>
                    <p className="text-xs text-gray-500">
                      {selectedJob.location} • {formatPostedTime(selectedJob.postedTime)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-100 px-3 py-1 text-xs rounded-full">Remote</span>
                  <span className="bg-gray-100 px-3 py-1 text-xs rounded-full">
                    {selectedJob.contractType}
                  </span>
                </div>

                <div className="flex gap-2 mb-4">
                  <button className="bg-black text-white text-sm px-4 py-2 rounded w-full"
                    onClick={() => {
                      if (!isSignedIn) {
                        setOpenAuthModal(true)
                        return
                      }
                      // Normal behavior when signed in
                      console.log("Applying for job…")
                    }}>
                    Easy Apply
                  </button>
                  <button className="border text-sm px-4 py-2 rounded w-full"
                    onClick={() => {
                      if (!isSignedIn) {
                        setOpenAuthModal(true)
                        return
                      }
                      // Normal behavior when signed in
                      console.log("Job saved!")
                    }}>Save</button>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold mb-1">About the job</h5>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

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

        {/* === Mobile Sidebar (Below lg) === */}
        {selectedJob && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 p-5 overflow-y-auto">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-lg">Job Details</h4>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                <Image
                  src={selectedJob.imageSrc ? selectedJob.imageSrc : logo}
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
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
              <button className="bg-black text-white text-sm px-4 py-2 rounded w-full">
                Easy Apply
              </button>
              <button className="border text-sm px-4 py-2 rounded w-full">Save</button>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedJob.description}</p>

            <Button
              text="Show more details"
              img={arrow_right}
              variant="black"
              onClick={() => handleJobClick(selectedJob)}
            />

          </div>
        )}
      </main>

      <AuthModals open={openAuthModal} setOpen={setOpenAuthModal} />

    </div>
  )
}
