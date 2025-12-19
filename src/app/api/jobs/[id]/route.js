import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

export async function GET(req, { params }) {
  try {
    const { id } = await params

    // First, try to fetch from Supabase cache
    const { data: cachedJob, error } = await supabaseAdmin
      .from('jobs_cache')
      .select('*')
      .eq('external_id', id)
      .single()

    if (cachedJob && !error) {
      return NextResponse.json({ 
        job: {
          id: cachedJob.external_id,
          jobTitle: cachedJob.title,
          company: cachedJob.company,
          location: cachedJob.location,
          description: cachedJob.description,
          postedTime: cachedJob.created_at,
          jobType: cachedJob.job_type,
          contractType: cachedJob.contract_type,
          applyLink: cachedJob.apply_link,
          imageSrc: cachedJob.image_url,
          skills: cachedJob.skills || [],
        }
      })
    }

    // If not cached, return error (jobs should be cached when viewed)
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