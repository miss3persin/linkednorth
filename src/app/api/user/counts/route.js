import { NextResponse } from 'next/server'
import { getUnreadCounts } from '@/services/userService'
import { getSupabaseUser } from '@/app/lib/authHelpers'
import { extractHiddenDerivedIdsFromRequest } from '@/app/lib/hiddenDerivedNotifications'

export async function GET(req) {
  try {
    const user = await getSupabaseUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let counts
    try {
      const hiddenDerivedIds = extractHiddenDerivedIdsFromRequest(req)
      counts = await getUnreadCounts(user.id, hiddenDerivedIds)
    } catch (readError) {
      console.error('Error reading counts:', readError)
      return NextResponse.json({ error: 'Failed to read counts' }, { status: 500 })
    }

    return NextResponse.json(counts)
  } catch (error) {
    console.error('Error fetching counts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
