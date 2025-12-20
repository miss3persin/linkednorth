'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import Sidebar from '@/app/components/layout/Sidebar'
import { Button } from '@/app/components/ui/Button'
import logo from '/public/linkednorth-logo.png'
import arrow_right from '/public/chevron right.png'

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

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn, user } = useUser()
  
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`)
        
        if (!res.ok) {
          throw new Error('Job not found')
        }

        const data = await res.json()
        setJob(data.job)

        // Track job view if user is signed in
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

    if (params.id) {
      fetchJobDetails()
    }
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
        body: JSON.stringify({
          jobId: params.id,
          userId: user.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to save job')

      alert("Job saved successfully!")
    } catch (err) {
      console.error("Failed to save job:", err)
      alert("Failed to save job. Please try again.")
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

    try {
      // Track application in database
      const res = await fetch('/api/applications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: params.id,
          jobTitle: job?.jobTitle,
          company: job?.company,
          applyLink: job?.applyLink,
        }),
      })

      const data = await res.json()

      if (data.success) {
        // Open the external apply link
        if (job?.applyLink) {
          window.open(job.applyLink, '_blank')
        }
      } else {
        alert('Failed to track application. Please try again.')
      }
    } catch (err) {
      console.error('Error applying:', err)
      alert('Failed to apply. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex bg-white mt-16">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex bg-white mt-16">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Job not found'}</p>
            <button
              onClick={() => router.push('/joblistings')}
              className="text-blue-600 hover:underline"
            >
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

      <main className="flex-1 max-w-5xl mx-auto px-6 sm:px-12 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-6 text-sm"
        >
          ← Back to listings
        </button>

        {/* Job Header */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image 
                src={job.imageSrc || logo} 
                alt="Company Logo" 
                fill 
                className="object-contain p-1" 
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{job.jobTitle}</h1>
              <p className="text-lg text-gray-700 mb-1">{job.company}</p>
              <p className="text-sm text-gray-500">
                {job.location} • {formatPostedTime(job.postedTime)}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.jobType && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                {job.jobType}
              </span>
            )}
            {job.contractType && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {job.contractType}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              className="bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition flex items-center gap-2"
            >
              Apply Now
              <Image src={arrow_right} alt="arrow" width={20} height={20} />
            </button>
            
            <button
              onClick={handleSaveJob}
              disabled={isSaving}
              className="border border-gray-300 px-6 py-3 rounded font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Additional Details */}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Ready to apply?</h3>
            <p className="text-gray-600 mb-4">
              Click the button below to apply for this position.
            </p>
            <button
              onClick={handleApply}
              className="bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition"
            >
              Apply for this job
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}