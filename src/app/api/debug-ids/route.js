import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from('jobs_cache')
        .select('external_id, title')
        .limit(5)

    return NextResponse.json({ data, error })
}
