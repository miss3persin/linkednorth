import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function DELETE(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('id');

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        // Verify ownership and delete
        const { error } = await supabaseAdmin
            .from('internal_jobs')
            .delete()
            .eq('id', jobId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting job:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete job API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
