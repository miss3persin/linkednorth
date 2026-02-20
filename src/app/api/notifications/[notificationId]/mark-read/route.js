import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getUnreadCounts } from "@/services/userService"

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { notificationId } = await params
    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID missing" }, { status: 400 })     
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("id", notificationId)

    if (error) throw error

    const counts = await getUnreadCounts(userId)
    return NextResponse.json({ success: true, unreadNotifications: counts.unreadNotifications })
  } catch (error) {
    console.error("Failed to mark notification read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
