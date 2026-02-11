import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const { userId: authUserId } = await auth()

    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      userId,
      jobId,
      jobTitle,
      company,
      location,
      jobType,
      applyLink,
      imageSrc,
    } = await req.json()

    // 🔒 Critical check (same as your working API)
    if (userId !== authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists (optional but consistent)
    const user = await currentUser()
    if (user) {
      await supabaseAdmin
        .from('users')
        .upsert(
          {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            first_name: user.firstName,
            last_name: user.lastName,
          },
          { onConflict: 'id' }
        )
    }

    const { error } = await supabaseAdmin
      .from('saved_jobs')
      .upsert({
        user_id: userId,
        job_id: jobId,
        job_title: jobTitle,
        status: 'saved',
        job_data: {
          company,
          location,
          jobType,
          applyLink,
          imageSrc,
        },
      },
        {
          onConflict: 'job_id,user_id',
        })

    if (error) {
      console.error('Error saving job:', error)
      return NextResponse.json({ error: 'Failed to save job' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Save job error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('saved_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
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


