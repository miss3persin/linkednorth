import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { upsertUser, getUnreadCounts } from '@/services/userService'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
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

    const counts = await getUnreadCounts(userId)

    return NextResponse.json(counts)
  } catch (error) {
    console.error('Error fetching counts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}