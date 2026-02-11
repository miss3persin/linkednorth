import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function GET() {
    try {
        // SQL to fix the schema issue
        const sql = `
-- Drop the foreign key constraint if it exists (it likely enforces UUID)
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_job_id_fkey;

-- Change job_id column type to TEXT to support external job IDs (which use strings like 'yc-123')
ALTER TABLE public.applications ALTER COLUMN job_id TYPE text USING job_id::text;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'job_id';
        `;

        // Check if we can execute it via RPC (unlikely but worth a check if exec_sql exists)
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });

        if (error) {
            return NextResponse.json({
                status: 'manual_action_required',
                message: 'To fix the job application error, please run the following SQL in your Supabase SQL Editor:',
                sql_command: sql,
                rpc_error: error.message
            });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Schema updated successfully via RPC.'
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
