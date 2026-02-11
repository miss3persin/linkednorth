import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function GET() {
    try {
        // Fetch a few internal jobs to see what application_link values look like
        const { data: jobs, error } = await supabaseAdmin
            .from('internal_jobs')
            .select('id, title, application_link')
            .limit(10);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            jobs,
            count: jobs?.length || 0,
            message: 'Check the application_link values'
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
