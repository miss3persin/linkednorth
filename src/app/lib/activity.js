import { supabaseAdmin } from './supabase'

export async function getUserActivity(userId) {
  try {
    // Get applied jobs count
    const { data: applications, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('user_id', userId)

    // Get saved/viewed jobs count (you can track views in your jobs table)
    const { data: savedJobs, error: savedError } = await supabaseAdmin
      .from('saved_jobs')
      .select('id')
      .eq('user_id', userId)

    // Get interviews count (if you have an interviews table, or filter applications)
    const { data: interviews, error: intError } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'accepted') // Or whatever status indicates interview

    // Get notifications (if you have a notifications table)
    const { data: notifications, error: notifError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    return {
      appliedJobs: applications?.length || 0,
      viewedJobs: savedJobs?.length || 0,
      interviews: interviews?.length || 0,
      notifications: notifications || [],
    }
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return {
      appliedJobs: 0,
      viewedJobs: 0,
      interviews: 0,
      notifications: [],
    }
  }
}