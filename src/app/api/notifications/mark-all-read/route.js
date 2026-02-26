import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getUnreadCounts } from "@/services/userService"
import { getSupabaseUser } from "@/app/lib/authHelpers"
import { extractHiddenDerivedIdsFromRequest } from "@/app/lib/hiddenDerivedNotifications"

export async function POST(req) {
  try {
    const user = await getSupabaseUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .update({
        is_read: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) {
      throw error
    }

    const hiddenDerivedIds = extractHiddenDerivedIdsFromRequest(req)
    const counts = await getUnreadCounts(user.id, hiddenDerivedIds)

    return NextResponse.json({ success: true, unreadNotifications: counts.unreadNotifications })
  } catch (error) {
    console.error("Failed to mark notifications read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
