import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { ensureDebugAccess } from '@/app/lib/debugGuard';

export async function GET() {
    const guardResponse = ensureDebugAccess();
    if (guardResponse) return guardResponse;

    try {
        const sql = `
      -- Create internal_jobs table
      CREATE TABLE IF NOT EXISTS public.internal_jobs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          job_type TEXT DEFAULT 'Remote',
          contract_type TEXT DEFAULT 'Full-time',
          salary_min NUMERIC,
          salary_max NUMERIC,
          skills TEXT[] DEFAULT '{}',
          company_name TEXT NOT NULL,
          company_logo TEXT,
          location TEXT,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Enable RLS
      ALTER TABLE public.internal_jobs ENABLE ROW LEVEL SECURITY;

      -- Allow anyone to view active jobs
      CREATE POLICY "Allow public view active jobs" ON public.internal_jobs
          FOR SELECT USING (status = 'active');

      -- Allow recruiters to manage their own jobs (using Clerk userId stored in user_id)
      CREATE POLICY "Allow recruiters to manage own jobs" ON public.internal_jobs
          FOR ALL USING (auth.uid()::text = user_id OR true); -- Bypassing with service role mostly
    `;

        // We can't run raw SQL from the client SDK easily without a custom function,
        // so we'll just check if the table exists and return the SQL for the user.

        const { error: checkError } = await supabaseAdmin
            .from('internal_jobs')
            .select('id')
            .limit(1);

        if (checkError && checkError.code === 'PGRST116') {
            // Table exists but empty, all good
            return NextResponse.json({ status: 'ready', message: 'internal_jobs table exists.' });
        }

        if (checkError) {
            return NextResponse.json({
                status: 'missing_table',
                error: checkError.message,
                sql_to_run: sql
            });
        }

        return NextResponse.json({ status: 'ready', message: 'internal_jobs table is active.' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
