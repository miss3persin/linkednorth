'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import Sidebar from '@/app/components/layout/Sidebar'
import logo from '/public/linkednorth-logo.png'
import JobApplicationModal from '@/app/components/modals/JobApplicationModal'
import JobDescriptionRenderer from '@/app/components/jobs/JobDescriptionRenderer'
import { MapPin, Clock, Briefcase, Calendar, ExternalLink, Bookmark, ArrowLeft, Share2, Building2 } from 'lucide-react'
import { formatPostedTime, titleCaseContract } from '@/app/lib/dateUtils'
import { Loader } from '@/app/components/ui/Loader'
import { buildSaveJobPayload } from '@/app/lib/jobSavePayload'

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn, user } = useUser()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const [modalState, setModalState] = useState({
    isOpen: false, type: 'success', title: '', message: '', emailAddress: '', externalLink: '',
  })

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`)
        if (!res.ok) throw new Error('Job not found')
        const data = await res.json()
        setJob(data.job)

        if (isSignedIn && user) {
          fetch('/api/jobs/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, jobId: params.id, jobTitle: data.job.jobTitle, company: data.job.company }),
          }).catch(err => console.error('Failed to track view:', err))
        }
      } catch (err) {
        console.error('Error fetching job:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchJobDetails()
  }, [params.id, isSignedIn, user])

  const handleSaveJob = async () => {
    if (!isSignedIn) { router.push('/?redirect=/joblistings/' + params.id); return }
    if (!job) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSaveJobPayload(job, user.id)),
      })

      const resData = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(resData.error || 'Failed')

      const alreadySaved =
        resData.alreadySaved ||
        resData.message?.toLowerCase().includes('already saved')

      setModalState({
        isOpen: true,
        type: alreadySaved ? 'already_saved' : 'success',
        title: alreadySaved ? 'Already Saved' : 'Job Saved!',
        message: alreadySaved
          ? resData.message || 'This job is already saved in your library.'
          : 'Saved to your profile library. You can find it in your Library.',
        emailAddress: '',
        externalLink: ''
      })
    } catch (err) {
      console.error('Save job error:', err)
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Failed to Save',
        message: 'Could not save this job. Please try again.',
        emailAddress: '',
        externalLink: ''
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    try {
      const jobUrl = `${window.location.origin}/joblistings/${params.id}`
      await navigator.clipboard.writeText(jobUrl)
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Link Copied!',
        message: 'A shareable link has been copied to your clipboard.',
        emailAddress: '',
        externalLink: ''
      })
    } catch {
      alert('Failed to copy link.')
    }
  }

  const markJobAsApplied = async () => {
    if (!job || !user?.id) return

    try {
      const payload = {
        ...buildSaveJobPayload(job, user.id),
        status: 'applied',
      }

      const res = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        console.error('Failed to record applied job')
      }
    } catch (err) {
      console.error('Failed to record applied job:', err)
    }
  }

  const handleApply = async () => {
    if (!isSignedIn) { router.push('/?redirect=/joblistings/' + params.id); return }
    if (!job) return

    try {
      const res = await fetch('/api/applications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, jobTitle: job.jobTitle, company: job.company, applyLink: job.applyLink }),
      })
      const data = await res.json()

      if (data.success) {
        markJobAsApplied()

        if (data.alreadyApplied) {
          setModalState({ isOpen: true, type: 'already_applied', title: 'Already Applied', message: 'You have already applied for this position.', emailAddress: '', externalLink: '' })
          return
        }

        const link = job.applyLink

        if (link?.startsWith('mailto:')) {
          setModalState({ isOpen: true, type: 'email', title: 'Send Your Application', message: 'Your application has been recorded. Send your resume to:', emailAddress: link.replace('mailto:', ''), externalLink: '' })
        } else if (link) {
          setModalState({ isOpen: true, type: 'success', title: 'Application Recorded!', message: "Your application has been submitted. Click below to continue to the employer's page.", emailAddress: '', externalLink: link })
        } else {
          setModalState({ isOpen: true, type: 'success', title: 'Application Recorded!', message: 'Your application has been submitted successfully!', emailAddress: '', externalLink: '' })
        }
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Application Failed', message: data.error || 'Failed to submit. Please try again.', emailAddress: '', externalLink: '' })
      }
    } catch {
      setModalState({ isOpen: true, type: 'error', title: 'Something Went Wrong', message: 'Failed to submit. Check your connection and try again.', emailAddress: '', externalLink: '' })
    }
  }

  const handleModalPrimaryAction = () => {
    if (modalState.type === 'email') { window.location.href = `mailto:${modalState.emailAddress}`; setModalState({ ...modalState, isOpen: false }) }
  }
  const handleModalSecondaryAction = async () => {
    if (modalState.type === 'email') {
      try {
        await navigator.clipboard.writeText(modalState.emailAddress)
        setModalState({ isOpen: true, type: 'success', title: 'Email Copied!', message: `${modalState.emailAddress} has been copied to your clipboard.`, emailAddress: '', externalLink: '' })
      } catch { setModalState({ ...modalState, isOpen: false }) }
    }
  }

  const closeModal = () => setModalState({ ...modalState, isOpen: false })

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50 mt-[72px]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader message="Loading job details" size="lg" />
        </main>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex bg-gray-50 mt-[72px]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-none border border-gray-200 text-center max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Job Not Found</h2>
            <p className="text-gray-500 mb-6 text-sm">{error || "The job you're looking for doesn't exist."}</p>
            <button
              onClick={() => router.push('/joblistings')}
              className="w-full bg-black text-white py-3 rounded-none font-bold hover:bg-gray-800 transition-all text-sm uppercase tracking-wider skip-squared"
            >
              Back to Job Board
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="joblistings-page min-h-screen flex bg-gray-50 mt-[72px]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-all skip-squared">
              <ArrowLeft size={14} /> Back to Listings
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-all"
              >
                Share <Share2 size={14} />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-none border border-gray-200 p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative w-20 h-20 rounded-none border border-gray-100 overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={job.imageSrc || logo}
                    alt={job.company}
                    fill
                    className="object-contain p-2"
                    referrerPolicy="no-referrer"
                    unoptimized={true}
                    onError={(e) => {
                      e.target.src = logo.src || logo
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">{job.jobTitle}</h1>
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                    {job.company}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-1.5 text-[0.65rem] sm:text-xs font-bold text-gray-400">
                      <MapPin size={14} /> {job.location || 'Remote'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.65rem] sm:text-xs font-bold text-gray-400">
                      <Clock size={14} /> {titleCaseContract(job.contractType) || 'Full Time'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.65rem] sm:text-xs font-bold text-gray-400">
                      <Calendar size={14} /> {formatPostedTime(job.postedTime)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[180px]">
                <button
                  onClick={handleApply}
                  className="w-full bg-black text-white rounded-none px-6 py-4 font-bold text-sm hover:bg-gray-800 transition-all border border-black shadow-none"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleSaveJob}
                  disabled={isSaving}
                  className="w-full bg-white text-black rounded-none px-6 py-4 font-bold text-sm hover:bg-gray-50 transition-all border border-gray-200"
                >
                  {isSaving ? 'Saving...' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-none border border-gray-200 p-6 sm:p-10">
                <h2 className="text-xs font-black text-gray-400 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                  Job Description
                  <div className="flex-1 h-[1px] bg-gray-100" />
                </h2>

                <div className="prose prose-sm prose-gray max-w-none">
                  <JobDescriptionRenderer description={job.description} />
                </div>

                {job.skills?.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.2em]">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="bg-white text-gray-900 border border-gray-200 px-3 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-wider">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6 lg:sticky lg:top-[92px]">
              <div className="bg-white rounded-none border border-gray-200 p-6 sm:p-8">
                <h4 className="font-bold text-sm text-gray-900 mb-4">Job Summary</h4>
                <ul className="space-y-5">
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Company</span>
                    <span className="text-sm font-bold text-gray-700">{job.company}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Category</span>
                    <span className="text-sm font-bold text-gray-700">{job.jobType || 'General'}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Commitment</span>
                    <span className="text-sm font-bold text-gray-700">{titleCaseContract(job.contractType) || 'Full Time'}</span>
                  </li>
                  <li className="flex flex-col gap-1 pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Job Identifier</span>
                    <span className="text-[10px] font-mono text-gray-500 break-all">{params.id}</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </main>

      <JobApplicationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        emailAddress={modalState.emailAddress}
        externalLink={modalState.externalLink}
        onPrimaryAction={handleModalPrimaryAction}
        onSecondaryAction={handleModalSecondaryAction}
      />
    </div>
  )
}
