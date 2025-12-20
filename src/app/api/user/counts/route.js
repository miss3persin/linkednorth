import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '../../../lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in Supabase
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

    // Get unread notifications count
    const { count: notificationCount, error: notifError } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (notifError) {
      console.error('Error fetching notification count:', notifError)
    }

    // Get unread messages count (you'll need to create a messages table later)
    // For now, returning 0
    const messageCount = 0;

    return NextResponse.json({
      unreadNotifications: notificationCount || 0,
      unreadMessages: messageCount,
    })
  } catch (error) {
    console.error('Error fetching counts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}