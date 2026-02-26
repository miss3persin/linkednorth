export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import LibraryClient from "./LibraryClient"
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

export default async function LibraryPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (!accessToken) {
    return redirect("/")
  }

  const { data } = await supabaseAdmin.auth.getUser(accessToken)
  if (!data?.user) {
    return redirect("/")
  }

  return <LibraryClient />
}
