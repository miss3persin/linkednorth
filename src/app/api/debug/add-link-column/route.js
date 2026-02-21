import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { ensureDebugAccess } from '@/app/lib/debugGuard';

export async function GET() {
    const guardResponse = ensureDebugAccess();
    if (guardResponse) {
        return guardResponse;
    }

    try {
        const sql = `ALTER TABLE public.internal_jobs ADD COLUMN IF NOT EXISTS application_link TEXT;`;

        // Try to execute the SQL directly via rpc (if enabled) or just return it
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });

        if (error) {
            // If RPC fails (might not be enabled), we return the instruction
            return NextResponse.json({
                status: 'manual_action_required',
                message: 'To add the application link feature, please run the following SQL:',
                sql_command: sql
            });
        }

        return NextResponse.json({ status: 'success', message: 'Assuming column added successfully via RPC (if configured).' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
