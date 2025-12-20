import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '../../../lib/supabase'

export async function POST(req) {
  try {
    const { userId: authUserId } = await auth()
    
    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, jobId, jobTitle, company } = await req.json()

    // Verify the userId matches the authenticated user
    if (userId !== authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in Supabase (create if not)
    const user = await currentUser()
    if (user) {
      await supabaseAdmin
        .from('users')
        .upsert({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
        }, { onConflict: 'id' })
    }

    // Insert job view
    const { error } = await supabaseAdmin
      .from('job_views')
      .insert({
        user_id: userId,
        job_id: jobId,
        job_title: jobTitle,
        company: company,
      })

    if (error) {
      console.error('Error tracking view:', error)
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in track-view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}