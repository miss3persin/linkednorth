import { NextResponse } from 'next/server'
import { getSupabaseUser } from '@/app/lib/authHelpers'
import { trackJobView } from '@/services/activityService'

export async function POST(req) {
  try {
    const user = await getSupabaseUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, jobTitle, company } = await req.json()

    const result = await trackJobView(user, jobId, jobTitle, company)

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in track-view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
