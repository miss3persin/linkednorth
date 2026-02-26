import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { getSupabaseUser } from '@/app/lib/authHelpers'

export async function PATCH(req) {
  try {
    const user = await getSupabaseUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, status } = await req.json()

    const { error } = await supabaseAdmin
      .from('saved_jobs')
      .update({ status })
      .eq('job_id', jobId)
      .eq('profile_id', user.id)

    if (error) {
      console.error('Status update error:', error)
      return NextResponse.json(
        { error: 'Failed to update status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
