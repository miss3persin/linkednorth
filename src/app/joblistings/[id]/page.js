'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import Sidebar from '@/app/components/layout/Sidebar'
import { Button } from '@/app/components/ui/Button'
import logo from '/public/linkednorth-logo.png'
import arrow_right from '/public/chevron right.png'
import JobApplicationModal from '@/app/components/modals/JobApplicationModal'

const formatPostedTime = (dateString) => {
  const date = new Date(dateString)
  // ... keeping time format ...
  return `${years} year${years !== 1 ? 's' : ''} ago`
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn, user } = useUser()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Unified modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    emailAddress: '',
    externalLink: '',
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
            body: JSON.stringify({
              userId: user.id,
              jobId: params.id,
              jobTitle: data.job.jobTitle,
              company: data.job.company,
            }),
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
    if (!isSignedIn) {
      alert("Please sign in to save jobs")
      router.push('/?redirect=/joblistings/' + params.id)
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: params.id, userId: user.id }),
      })
      if (!res.ok) throw new Error('Failed to save job')

      // Copy the shareable link
      const jobUrl = `${window.location.origin}/jobs/${params.id}`
      await navigator.clipboard.writeText(jobUrl)

      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Job Saved!',
        message: 'This job has been saved to your profile and the link has been copied to your clipboard.',
        emailAddress: '',
        externalLink: '',
      })
    } catch (err) {
      console.error("Failed to save job:", err)
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Failed to Save',
        message: 'Could not save this job. Please try again.',
        emailAddress: '',
        externalLink: '',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleApply = async () => {
    if (!isSignedIn) {
      alert("Please sign in to apply")
      router.push('/?redirect=/joblistings/' + params.id)
      return
    }

    if (!job) return

    try {
      // Track application in database
      const res = await fetch('/api/applications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.jobTitle,
          company: job.company,
          applyLink: job.applyLink,
        }),
      })

      const data = await res.json()

      if (data.success) {
        if (data.alreadyApplied) {
          setModalState({
            isOpen: true,
            type: 'already_applied',
            title: 'Already Applied',
            message: 'You have already submitted an application for this position. Check your email for updates from the employer.',
            emailAddress: '',
            externalLink: '',
          })
          return
        }

        const applyLink = job.applyLink

        // Check if it's a mailto link
        if (applyLink && applyLink.startsWith('mailto:')) {
          const emailAddress = applyLink.replace('mailto:', '')
          setModalState({
            isOpen: true,
            type: 'email',
            title: 'Send Your Application',
            message: 'Your application has been recorded. Send your resume to:',
            emailAddress,
            externalLink: '',
          })
        } else if (applyLink) {
          // For regular URLs
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Application Recorded!',
            message: 'Your application has been submitted successfully. Click below to continue to the application page.',
            emailAddress: '',
            externalLink: applyLink,
          })
        } else {
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Application Recorded!',
            message: 'Your application has been submitted successfully!',
            emailAddress: '',
            externalLink: '',
          })
        }
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Application Failed',
          message: data.error || 'Failed to submit your application. Please try again.',
          emailAddress: '',
          externalLink: '',
        })
      }
    } catch (err) {
      console.error('Error applying:', err)
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Something Went Wrong',
        message: 'Failed to submit your application. Please check your connection and try again.',
        emailAddress: '',
        externalLink: '',
      })
    }
  }

  // Modal action handlers
  const handleModalPrimaryAction = () => {
    if (modalState.type === 'email') {
      // Open email client
      window.location.href = `mailto:${modalState.emailAddress}`
      setModalState({ ...modalState, isOpen: false })
    }
  }

  const handleModalSecondaryAction = async () => {
    if (modalState.type === 'email') {
      // Copy email to clipboard
      try {
        await navigator.clipboard.writeText(modalState.emailAddress)
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Email Copied!',
          message: `${modalState.emailAddress}\n\nThe email address has been copied to your clipboard. You can now paste it in your email client.`,
          emailAddress: '',
          externalLink: '',
        })
      } catch (err) {
        console.error('Failed to copy:', err)
        // Fallback: show in prompt
        prompt('Copy this email address:', modalState.emailAddress)
        setModalState({ ...modalState, isOpen: false })
      }
    }
  }

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex bg-white mt-16">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading job details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex bg-white mt-16">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center">
            <p className="text-red-500 mb-4 text-sm sm:text-base">{error || 'Job not found'}</p>
            <button onClick={() => router.push('/joblistings')} className="text-blue-600 hover:underline text-sm sm:text-base">
              Back to job listings
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-white mt-16">
      <Sidebar />
      <main className="flex-1 max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* Back Button */}
        <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-2 text-sm sm:text-base">
          ← Back to listings
        </button>

        {/* Job Header */}
        <div className="bg-white border rounded-lg p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image src={job.imageSrc || logo} alt="Company Logo" fill className="object-contain p-1" />
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{job.jobTitle}</h1>
              <p className="text-base sm:text-lg text-gray-700">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location} • {formatPostedTime(job.postedTime)}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.jobType && <span className="rounded-full bg-green-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-green-800">{job.jobType}</span>}
            {job.contractType && <span className="rounded-full bg-blue-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-blue-800">{job.contractType}</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              text="Apply Now"
              img={arrow_right}
              onClick={handleApply}
              variant="black"
              className="font-medium"
            />
            <Button
              text={isSaving ? 'Saving...' : 'Save Job'}
              onClick={handleSaveJob}
              variant="white"
              className="font-medium"
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white border rounded-lg p-4 sm:p-6 space-y-4">
          <h2 className="text-xl font-bold">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>

          {/* Required Skills */}
          {job.skills?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Section */}
          <div className="pt-4 border-t space-y-2">
            <h3 className="text-lg font-semibold">Ready to apply?</h3>
            <p className="text-gray-600">Click the button below to apply for this position.</p>
            <button onClick={handleApply} className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded font-medium w-full hover:bg-gray-800 transition">
              Apply for this job
            </button>
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
