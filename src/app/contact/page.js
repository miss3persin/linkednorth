'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/Button'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ message: 'Sending your message…', type: 'info' })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        cache: 'no-store',
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Unable to send your message right now.')
      }

      setStatus({ message: 'Thanks! Your note is on its way to our team.', type: 'success' })
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Contact form failed', error)
      setStatus({
        message: error?.message || 'Something went wrong. Please try again shortly.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`${inter.variable} min-h-screen bg-white px-4 py-14 sm:px-6 lg:px-12`}>
      <div className="mt-16 mx-auto max-w-4xl space-y-10 text-center">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.5em] text-[#868D9B]">Contact</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101828]">
            Let us know how we can help.
          </h1>
          <p className="text-sm sm:text-base text-[#6E7384] max-w-2xl mx-auto">
            Drop us a line with what you need—whether it’s feedback, a
            partnership idea, or a press request. We read every message and
            aim to reply the same business day.
          </p>
        </div>

          <form
            className="space-y-5 rounded-3xl border border-[#E5E7EB] bg-white px-5 py-8 shadow-[0_25px_60px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#5F6571] uppercase tracking-[0.25em]">
                Full name
                <input
                  className="mt-1 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8F9FB] px-3 py-2 text-sm text-[#101828] placeholder:text-slate-500 placeholder:opacity-30 focus:border-[#101828] focus:outline-none"
                  placeholder="Ava Mercado"
                  value={formData.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#5F6571] uppercase tracking-[0.25em]">
                Email address
                <input
                  type="email"
                  className="mt-1 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8F9FB] px-3 py-2 text-sm text-[#101828] placeholder:text-slate-500 placeholder:opacity-30 focus:border-[#101828] focus:outline-none"
                  placeholder="ava@linkednorth.com"
                  value={formData.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  required
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#5F6571] uppercase tracking-[0.25em]">
              Subject
              <input
                className="mt-1 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8F9FB] px-3 py-2 text-sm text-[#101828] placeholder:text-slate-500 placeholder:opacity-30 focus:border-[#101828] focus:outline-none"
                placeholder="Collaborating on a launch"
                value={formData.subject}
                onChange={(event) => handleChange('subject', event.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#5F6571] uppercase tracking-[0.25em]">
              Message
              <textarea
                rows={6}
                className="mt-1 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8F9FB] px-3 py-2 text-sm text-[#101828] placeholder:text-slate-500 placeholder:opacity-30 focus:border-[#101828] focus:outline-none"
                placeholder="Tell us about your idea or question."
                value={formData.message}
                onChange={(event) => handleChange('message', event.target.value)}
                required
              />
            </label>

          {status && (
            <p
              className={`text-sm font-semibold ${
                status.type === 'error' ? 'text-rose-600' : 'text-[#0F172A]'
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A6B1] sm:text-sm">
              We reply fast.
            </p>
            <div className="w-full sm:w-auto">
              <Button
                text={isSubmitting ? 'Sending…' : 'Send Message'}
                variant="black"
                className={`text-xs sm:text-sm ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}`}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
