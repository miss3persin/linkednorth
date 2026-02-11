'use client'

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import AuthModals from "../modals/AuthModals"
import { useSearchParams, usePathname } from 'next/navigation'
import { saveJobsRedirect } from '../../lib/authRedirect'
import React from 'react'
import Image from 'next/image'
import { Inter, Open_Sans } from 'next/font/google'
import arrow_right from '/public/chevron right.png'
import arrow_right_black from '/public/chevron right black.png'
import save_btn from '/public/job_save_btn.png'
import logo from '/public/linkednorth-logo.png'
import { Button } from '../ui/Button'
import JobApplicationModal from '../modals/JobApplicationModal'

const openSans = Open_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

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

// Truncate description to a specific number of sentences
const truncateDescription = (text, sentenceLimit = 3) => {
  if (!text) return ''

  // Split by sentence-ending punctuation
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

  if (sentences.length <= sentenceLimit) return text

  // Join first few sentences and add ellipsis
  return sentences.slice(0, sentenceLimit).join(' ').trim() + '...'
}


export const JobListingCard = ({
  id,
  jobTitle,
  company,
  location,
  postedTime,
  jobType,
  contractType,
  description,
  imageSrc,
  applyLink,
  detailsLink,
  onViewDetails = () => { },
}) => {
  const { isSignedIn, user } = useUser()
  const [openAuthModal, setOpenAuthModal] = useState(false)
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

  const searchParams = useSearchParams()
  const pathname = usePathname()


  const requireAuth = (action) => {
    if (!isSignedIn) {
      // Save redirect ONLY when coming from jobs page
      if (pathname === '/jobs') {
        saveJobsRedirect(searchParams)
      }

      localStorage.setItem(
        'redirectAfterLogin',
        window.location.pathname + window.location.search
        // `${pathname}?${searchParams.toString()}`
      )

      setOpenAuthModal(true)
      return
    }

    action?.()
  }

  // Helper function to copy email to clipboard
  const copyEmailToClipboard = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      alert(`Email address copied to clipboard!\n\n${email}\n\nYou can now paste it in your email client.`);
    } catch (err) {
      console.error('Failed to copy email:', err);
      // Fallback: show email in a prompt so user can manually copy
      prompt('Copy this email address:', email);
    }
  }


  const handleApply = async () => {
    if (!isSignedIn) {
      setOpenAuthModal(true)
      return
    }

    try {
      // Track application in database
      const res = await fetch('/api/applications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: id,
          jobTitle,
          company,
          applyLink,
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

  const handleSaveJob = async () => {
    if (!isSignedIn) {
      setOpenAuthModal(true)
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/jobs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: id,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save job')
      }

      // Copy the shareable link
      const jobUrl = `${window.location.origin}/jobs/${id}`
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
      console.error(err)
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

  return (
    <>
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

      <div className="flex w-full max-w-[48rem] flex-col rounded-sm border border-[#E5E7EB] bg-white p-6 shadow-sm">
        {/* === Top Section === */}
        <div className="flex items-start justify-between flex-wrap gap-3 sm:gap-0">

          <div className="flex gap-3 sm:gap-4">
            <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
              <Image
                src={imageSrc ? imageSrc : logo}
                alt="Company Logo"
                fill
                className="object-contain p-1"
              />
            </div>

            <div className="flex flex-col gap-0.5 sm:gap-1">
              <p className="font-bold text-lg sm:text-xl md:text-2xl text-[#111827] leading-snug">
                {jobTitle}
              </p>
              <div className="flex flex-wrap items-center gap-1 text-[0.65rem] sm:text-xs md:text-sm text-[#4F98FF]">
                <span>{company}</span>
                <span>•</span>
                <span>{location}</span>
                <span>•</span>
                <span>{formatPostedTime(postedTime)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Image
              src={save_btn}
              alt="save"
              width={16}
              height={16}
              className={`cursor-pointer ${isSaving ? 'opacity-50' : 'hover:opacity-80'}`}
              onClick={handleSaveJob}
            />
          </div>
        </div>

        {/* === Description === */}
        <p className="text-xs sm:text-sm md:text-base text-[#4B5563] leading-relaxed pl-0 sm:pl-[4.5rem] mb-3 sm:mb-2 max-w-[40rem] mt-2 sm:mt-0">
          {truncateDescription(description, 2)}
        </p>

        {/* === Tags === */}
        <div className="flex flex-wrap gap-2 pl-0 sm:pl-[4.5rem] mb-4 sm:mb-5">
          <span className="rounded-full bg-green-100 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-medium text-green-800">
            {jobType}
          </span>
          <span className="rounded-full bg-blue-100 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-medium text-blue-800">
            {contractType}
          </span>
        </div>

        {/* === Buttons === */}
        <div className="flex flex-col sm:flex-row gap-2 pl-0 sm:pl-[4.5rem]">
          <Button
            text="Apply Now"
            img={arrow_right}
            variant="black"
            onClick={(e) => {
              e.preventDefault();
              const applyAction = async () => {
                await handleApply();
              };
              requireAuth(applyAction);
            }}
          />

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              requireAuth(onViewDetails)
            }}
            className="border-[#D1D5DB] bg-white text-[#374151] font-semibold border flex items-center justify-center gap-2 px-3 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm w-full sm:w-auto rounded-sm hover:bg-gray-50 transition"
          >
            View Details
            <Image src={arrow_right_black} alt="arrow" width={20} height={20} className="sm:w-6 sm:h-6" />
          </a>
        </div>

        <AuthModals open={openAuthModal} setOpen={setOpenAuthModal} />

      </div>
    </>
  )
}