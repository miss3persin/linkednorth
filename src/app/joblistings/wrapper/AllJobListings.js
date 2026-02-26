'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { JobListingCard } from '../../components/jobs/JobListingCard'
import { SearchBar } from '../../components/ui/SearchBar'
import { Inter } from 'next/font/google'
import overlay from '/public/Overlay.png'
import { Button } from '../../components/ui/Button'
import arrow_right from '/public/chevron right.png'
import logo from '/public/linkednorth-logo.png'
import Sidebar from '@/app/components/layout/Sidebar'
import JobApplicationModal from '../../components/modals/JobApplicationModal'
import AuthModals from '../../components/modals/AuthModals'
import { HiMenu, HiX } from 'react-icons/hi'
import { stripHtml } from '@/app/lib/cleanDescription'
import { buildSaveJobPayload } from '@/app/lib/jobSavePayload'
import { buildSaveModalState } from '@/app/lib/saveModalState'
import { useSessionContext } from '@/app/lib/supabaseAuthContext'
import { useAuthFetch } from '@/app/lib/useAuthFetch'

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

import { formatPostedTime } from '@/app/lib/dateUtils'

import { Pagination } from '../../components/ui/Pagination'
import { dispatchNotificationDelta } from '@/app/lib/notificationEvents'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const [sortBy, setSortBy] = useState('recent')
  const JOBS_PER_PAGE = 25
  const MAX_PAGES = 50

  const searchParams = useSearchParams()
  const router = useRouter()

  // ✅ Updated to match the search bar / merged API params
  const jobTitleQuery = searchParams.get('search') || ''
  const countryQuery = searchParams.get('geo') || ''

  const { session } = useSessionContext()
  const isSignedIn = Boolean(session)
  const user = session?.user
  const authFetch = useAuthFetch()

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    emailAddress: '',
    externalLink: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  const [openAuthModal, setOpenAuthModal] = useState(false)

  const handleJobClick = (job) => {
    router.push(`/joblistings/${job.id}`)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [jobTitleQuery, countryQuery, sortBy])

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      setError(null)
      try {
        const query = new URLSearchParams()
        if (jobTitleQuery) query.append('search', jobTitleQuery)
        if (countryQuery) query.append('geo', countryQuery)

        const offset = (currentPage - 1) * JOBS_PER_PAGE
        query.append('limit', JOBS_PER_PAGE.toString())
        query.append('offset', offset.toString())
        query.append('sort', sortBy)

        const res = await fetch(`/api/jobs?${query.toString()}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        setJobs(data.jobs || [])
        setTotalJobs(data.totalCount || 0)

        // Optional background cache
        if (data.jobs && data.jobs.length > 0) {
          fetch('/api/jobs/cache', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobs: data.jobs }),
          }).catch(() => { })
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
  }, [jobTitleQuery, countryQuery, currentPage, sortBy])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveJob = async (job) => {
    if (!isSignedIn) {
      setOpenAuthModal(true)
      return
    }

    if (!job) return

    setIsSaving(true)

    try {
      const res = await authFetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSaveJobPayload(job, user.id)),
      })

      const resData = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(resData.error || 'Failed to save job')

      const modalOptions = buildSaveModalState(resData, {
        successTitle: 'Job Saved!',
        successMessage: 'This job has been saved to your profile library for later.',
      })

      dispatchNotificationDelta(1)

      setModalState({
        isOpen: true,
        emailAddress: '',
        externalLink: '',
        ...modalOptions,
      })
    } catch (err) {
      console.error('Failed to save job:', err)
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save this job. Please try again.',
        emailAddress: '',
        externalLink: '',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const closeModal = () => setModalState({ ...modalState, isOpen: false })

  const totalPages = Math.min(Math.ceil(totalJobs / JOBS_PER_PAGE), MAX_PAGES)

  return (
    <div className="joblistings-page min-h-screen flex bg-white mt-[72px]">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <section className="relative bg-gray-50 w-full py-8 sm:py-6">
          <div className="absolute right-0 bottom-0 h-full pointer-events-none opacity-40 sm:opacity-50">
            <Image
              src={overlay}
              alt="overlay"
              className="w-auto h-full object-cover"
              priority
            />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-6 grid grid-cols-1 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-[2.1rem] sm:text-[2rem] md:text-[2.4rem] font-bold mb-2 leading-tight">
                Find your Dream Job
              </h2>
              <p className={`${inter.variable} text-[#737373] mb-5 font-light text-sm sm:text-sm`}>
                Explore our job search platform, built to simplify your job hunt.
              </p>
              <div className="flex justify-center md:justify-start">
                <SearchBar />
              </div>
            </div>
          </div>
        </section>
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 xl:px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">
                {loading
                  ? 'Getting jobs...'
                  : error
                    ? 'Error loading jobs'
                    : `${totalJobs} jobs found`}
              </h3>

              <div className="relative self-start sm:self-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 px-3 py-1 pr-8 rounded text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
                >
                  <option value="recent">Most Recent</option>
                  <option value="relevance">Relevance</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-sm border border-gray-100" />
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
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
                      onViewDetails={() => setSelectedJob(job)}
                    />
                  ))}

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <p className="text-gray-600">No jobs match your search.</p>
              )}
            </div>
          </div>
          {selectedJob && (
            <div
              className="lg:hidden fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedJob(null)}
            >
              <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-xl">Job Details</h4>
                  <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-black p-2 bg-gray-50 rounded-full transition-colors">
                    <HiX className="text-xl" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

                <div className="overflow-y-auto pr-1 flex-1 thin-scroll">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                      <Image
                        src={selectedJob.imageSrc || logo}
                        alt="Company Logo"
                        fill
                        className="object-contain"
                        unoptimized={true}
                        onError={(e) => {
                          e.target.src = logo.src || logo
                        }}
                      />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg leading-tight">{selectedJob.jobTitle}</h5>
                      <p className="text-gray-600 font-medium">{selectedJob.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedJob.location} • {formatPostedTime(selectedJob.postedTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => window.open(selectedJob.applyLink, '_blank')}
                      className="bg-black text-white text-sm px-6 py-3 rounded-xl w-full hover:bg-gray-800 transition font-bold shadow-lg shadow-black/10"
                    >
                      Easy Apply
                    </button>
                    <button
                      onClick={() => handleSaveJob(selectedJob)}
                      disabled={isSaving}
                      className={`border border-gray-200 text-sm px-6 py-3 rounded-xl w-full transition font-bold ${isSaving ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-700 leading-relaxed font-medium line-clamp-5">
                      {stripHtml(selectedJob.description)}
                    </p>
                  </div>

                  <Button
                    text="Show more details"
                    img={arrow_right}
                    variant="black"
                    className="w-full justify-center !rounded-xl !py-4"
                    onClick={() => handleJobClick(selectedJob)}
                  />
                </div>
              </div>
            </div>
          )}

          <aside className={`
            border bg-white rounded-xl p-6 sticky top-[90px] self-start flex-col h-[80vh] hidden lg:flex
            ${!selectedJob ? 'justify-start h-fit' : ''}
          `}>
            {!selectedJob ? (
              <>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-base">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">✉️</span>
                  Subscribe for updates
                </h4>
                <p className="text-sm text-gray-600 mb-4">Stay informed about new job opportunities.</p>
                <input type="email" placeholder="Enter Email" className="border border-gray-200 rounded-lg px-4 py-2 w-full mb-3 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all" />
                <button className="bg-black text-white px-4 py-3 w-full rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-black/5">Subscribe</button>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg">Job Details</h4>
                  <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-black">✕</button>
                </div>
                <div className="w-full h-[1px] bg-gray-100 mb-4"></div>

                <div className="overflow-y-auto pr-1 flex-1 thin-scroll">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-lg border border-gray-50 overflow-hidden shrink-0">
                      <Image
                        src={selectedJob.imageSrc || logo}
                        alt="Company Logo"
                        fill
                        className="object-contain"
                        unoptimized={true}
                        onError={(e) => {
                          e.target.src = logo.src || logo
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-base leading-tight line-clamp-2">{selectedJob.jobTitle}</p>
                      <p className="text-sm text-gray-600">{selectedJob.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedJob.location} • {formatPostedTime(selectedJob.postedTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => window.open(selectedJob.applyLink, '_blank')}
                      className="bg-black text-white text-xs px-4 py-2.5 rounded-lg w-full hover:bg-gray-800 transition font-bold"
                    >
                      Easy Apply
                    </button>
                    <button
                      onClick={() => handleSaveJob(selectedJob)}
                      disabled={isSaving}
                      className={`border border-gray-200 text-xs px-4 py-2.5 rounded-lg w-full transition font-bold ${isSaving ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-5">{stripHtml(selectedJob.description)}</p>
                  <Button
                    text="Show more details"
                    img={arrow_right}
                    variant="black"
                    className="w-full justify-center !rounded-lg"
                    onClick={() => handleJobClick(selectedJob)}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
        <JobApplicationModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          type={modalState.type}
          title={modalState.title}
          message={modalState.message}
          emailAddress={modalState.emailAddress}
          externalLink={modalState.externalLink}
        />

        <AuthModals open={openAuthModal} setOpen={setOpenAuthModal} />
      </main>
    </div>
  )
}
