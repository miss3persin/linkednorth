import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createRecruiterProfile } from '@/services/recruiterService';

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyData = await req.json();

        await createRecruiterProfile(userId, companyData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Recruiter setup API error:', error);
        return NextResponse.json({ error: 'Failed to set up recruiter profile' }, { status: 500 });
    }
}
