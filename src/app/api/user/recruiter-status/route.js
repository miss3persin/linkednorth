import { NextResponse } from 'next/server';
import { isUserRecruiter } from '@/services/recruiterService';
import { getSupabaseUser } from '@/app/lib/authHelpers';

export async function GET(req) {
    try {
        const user = await getSupabaseUser(req);
        if (!user) {
            return NextResponse.json({ isRecruiter: false });
        }

        const isRecruiter = await isUserRecruiter(user.id);

        return NextResponse.json({ isRecruiter });
    } catch (error) {
        console.error('Check recruiter status API error:', error);
        return NextResponse.json({ isRecruiter: false });
    }
}
