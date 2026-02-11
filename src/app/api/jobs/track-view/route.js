import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { upsertUser } from '@/services/userService'
import { trackJobView } from '@/services/activityService'

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

    // Ensure user exists in Supabase
    const user = await currentUser()
    if (user) {
      await upsertUser({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
      })
    }

    // Insert job view
    const result = await trackJobView(userId, jobId, jobTitle, company)

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in track-view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
