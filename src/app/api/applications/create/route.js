import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { getSupabaseUser } from '@/app/lib/authHelpers'
export async function POST(req) {
  try {
    const user = await getSupabaseUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, jobTitle, company, applyLink } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || user.user_metadata?.firstName || null,
          last_name: user.user_metadata?.last_name || user.user_metadata?.lastName || null,
        },
        { onConflict: 'id' }
      )

    // Check if user already applied to this job
    const { data: existingApp } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('profile_id', user.id)
      .eq('job_id', jobId)
      .single()

    if (existingApp) {
      // Already applied, just return success and the apply link
      return NextResponse.json({
        success: true,
        alreadyApplied: true,
        applyLink
      })
    }

    // Create application record
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({
        job_id: jobId,
        profile_id: user.id,
        status: 'pending',
      })
      .select()

    if (error) {
      console.error('Error creating application:', error)
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
    }

    // Create notification for the user
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Application Submitted',
        message: `Your application for ${jobTitle} at ${company} has been submitted successfully.`,
        action_link: `/joblistings/${jobId}`,
        color: 'text-green-500',
      })

    const { error: jobUpsertError } = await supabaseAdmin
      .from('jobs')
      .upsert(
        {
          id: jobId,
          title: jobTitle,
          company,
          apply_url: applyLink,
        },
        { onConflict: 'id' }
      )

    if (jobUpsertError) {
      console.error('Error upserting job during application:', jobUpsertError)
    }

    const { error: savedJobError } = await supabaseAdmin
      .from('saved_jobs')
      .upsert(
        {
          profile_id: user.id,
          job_id: jobId,
          status: 'applied',
        },
        { onConflict: ['profile_id', 'job_id'] }
      )

    if (savedJobError) {
      console.error('Failed to upsert applied job record:', savedJobError)
    }

    return NextResponse.json({
      success: true,
      application: data[0],
      applyLink
    })
  } catch (error) {
    console.error('Error in create application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
