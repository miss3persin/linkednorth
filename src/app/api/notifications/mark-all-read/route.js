import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getUnreadCounts } from "@/services/userService"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)

    if (error) {
      throw error
    }

    const counts = await getUnreadCounts(userId)

    return NextResponse.json({ success: true, unreadNotifications: counts.unreadNotifications })
  } catch (error) {
    console.error("Failed to mark notifications read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
