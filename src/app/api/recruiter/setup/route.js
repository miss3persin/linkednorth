import { NextResponse } from 'next/server';
import { createRecruiterProfile } from '@/services/recruiterService';
import { getSupabaseUser } from '@/app/lib/authHelpers';

export async function POST(req) {
    try {
        const user = await getSupabaseUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyData = await req.json();

        await createRecruiterProfile(user.id, companyData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Recruiter setup API error:', error);
        return NextResponse.json({ error: 'Failed to set up recruiter profile' }, { status: 500 });
    }
}
