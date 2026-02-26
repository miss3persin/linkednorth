import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { getSupabaseUser } from '@/app/lib/authHelpers'

export async function POST(req) {
  try {
    const user = await getSupabaseUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await req.json()
    const {
      userId,
      jobId,
      title,
      company,
      location,
      description,
      apply_url,
      external_source
    } = payload

    const allowedStatuses = ['saved', 'applied', 'pending', 'completed', 'rejected']
    const rawStatus =
      typeof payload.status === 'string' ? payload.status.trim().toLowerCase() : ''
    const finalStatus = allowedStatuses.includes(rawStatus) ? rawStatus : 'saved'

    if (!jobId || !title) {
      return NextResponse.json(
        { error: 'Missing required job data' },
        { status: 400 }
      )
    }

    // 🔒 Ensure user is saving their own job
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure profile exists
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: user.id,
        },
        { onConflict: 'id' }
      )

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      return NextResponse.json(
        { error: 'Failed to ensure profile exists' },
        { status: 500 }
      )
    }

    // ✅ Properly upsert full job (title is NOT NULL)
    const { error: jobError } = await supabaseAdmin
      .from('jobs')
      .upsert(
        {
          id: jobId,
          title,
          company,
          location,
          description,
          apply_url,
          external_source
        },
        { onConflict: 'id' }
      )

    if (jobError) {
      console.error('Job upsert error:', jobError)
      return NextResponse.json(
        { error: 'Failed to store job' },
        { status: 500 }
      )
    }

    // ✅ Insert saved job (no manual duplicate check needed)
    const { error: saveError } = await supabaseAdmin
      .from('saved_jobs')
      .insert({
        profile_id: userId,
        job_id: jobId,
        status: finalStatus
      })

    if (saveError) {
      // If duplicate (unique constraint), report that it was already stored
      if (saveError.code === '23505') {
        let currentStatus = finalStatus

        const { data: existingSavedJob, error: fetchStatusError } = await supabaseAdmin
          .from('saved_jobs')
          .select('status')
          .eq('profile_id', userId)
          .eq('job_id', jobId)
          .single()

        if (fetchStatusError) {
          console.error('Error fetching existing saved job status:', fetchStatusError)
        } else if (existingSavedJob?.status) {
          currentStatus = existingSavedJob.status
        }

        if (finalStatus !== 'saved') {
          const { error: statusUpdateError } = await supabaseAdmin
            .from('saved_jobs')
            .update({ status: finalStatus })
            .eq('profile_id', userId)
            .eq('job_id', jobId)

          if (statusUpdateError) {
            console.error('Status update on duplicate error:', statusUpdateError)
          } else {
            currentStatus = finalStatus
          }
        }

        return NextResponse.json({
          success: true,
          alreadySaved: true,
          status: currentStatus,
          message: 'Already saved'
        })
      }

      console.error('Error saving job:', saveError)
      return NextResponse.json(
        { error: 'Failed to save job' },
        { status: 500 }
      )
    }

    try {
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Job Saved',
          message: `${title} at ${company} has been saved to your library.`,
          action_link: `/joblistings/${jobId}`,
          color: 'text-blue-500',
        })
    } catch (notifyError) {
      console.error('Failed to create saved job notification:', notifyError)
    }

    return NextResponse.json({
      success: true,
      status: finalStatus,
      message: 'Job saved'
    })

  } catch (err) {
    console.error('Save job error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req) {
  try {
    const user = await getSupabaseUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('saved_jobs')
      .select(`
        job_id,
        status,
        saved_at,
        jobs (
          title,
          company,
          location,
          description,
          apply_url,
          external_source
        )
      `)
      .eq('profile_id', user.id)
      .order('saved_at', { ascending: false })

    if (error) {
      console.error(error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const user = await getSupabaseUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('saved_jobs')
      .delete()
      .eq('profile_id', user.id)
      .eq('job_id', jobId)

    if (error) {
      console.error('Error deleting saved job:', error)
      return NextResponse.json(
        { error: 'Failed to delete saved job' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting saved job:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
