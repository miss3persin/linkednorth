import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { ensureDebugAccess } from '@/app/lib/debugGuard';

export async function GET() {
  const guardResponse = ensureDebugAccess()
  if (guardResponse) return guardResponse

  const { data, error } = await supabaseAdmin
        .from('jobs_cache')
        .select('external_id, title')
        .limit(5)

    return NextResponse.json({ data, error })
}
