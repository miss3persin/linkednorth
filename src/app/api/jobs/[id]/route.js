import { NextResponse } from 'next/server'
import { getJobById } from '@/services/jobService'

export async function GET(req, { params }) {
  try {
    const { id } = await params
    const job = await getJobById(id)

    if (job) {
      return NextResponse.json({ job })
    }

    // If not cached, return error
    return NextResponse.json(
      { error: 'Job not found. Please search for this job again.' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching job details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    )
  }
}