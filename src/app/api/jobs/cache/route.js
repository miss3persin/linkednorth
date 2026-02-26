import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

export async function POST(req) {

  try {
    const { jobs } = await req.json()

    if (!jobs || !Array.isArray(jobs)) {
      return NextResponse.json({ error: 'Invalid jobs data' }, { status: 400 })
    }

    // Prepare jobs for insertion
    const jobsToCache = jobs.map(job => ({
      external_id: String(job.id),
      title: job.jobTitle,
      company: job.company,
      location: job.location,
      description: job.description,
      job_type: job.jobType,
      contract_type: job.contractType,
      apply_link: job.applyLink,
      image_url: job.imageSrc,
      skills: job.skills || [],
    }))

    // Insert or update jobs in cache
    const { error } = await supabaseAdmin
      .from('jobs_cache')
      .upsert(jobsToCache, {
        onConflict: 'external_id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Error caching jobs:', error)
      return NextResponse.json({ error: 'Failed to cache jobs' }, { status: 500 })
    }

    return NextResponse.json({ success: true, cached: jobsToCache.length })
  } catch (error) {
    console.error('Error in cache endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
