import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isUserRecruiter } from '@/services/recruiterService';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ isRecruiter: false });
        }

        const isRecruiter = await isUserRecruiter(userId);

        return NextResponse.json({ isRecruiter });
    } catch (error) {
        console.error('Check recruiter status API error:', error);
        return NextResponse.json({ isRecruiter: false });
    }
}
