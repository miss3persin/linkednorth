import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: jobs, error } = await supabaseAdmin
            .from('internal_jobs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Recruiter jobs API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
