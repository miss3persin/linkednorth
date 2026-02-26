import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { getSupabaseUser } from '@/app/lib/authHelpers';

export async function POST(req) {
    try {
        const user = await getSupabaseUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const metadata = user.user_metadata || {};
        const recruiterProfile = metadata.recruiterProfile;

        if (!metadata.isRecruiter || !recruiterProfile) {
            return NextResponse.json({ error: 'Recruiter profile not found' }, { status: 403 });
        }

        const body = await req.json();
        const { title, jobType, contractType, salaryMin, salaryMax, description, skills, applicationLink } = body;

        // Insert into internal_jobs table (Supabase)
        const { data, error } = await supabaseAdmin
            .from('internal_jobs')
            .insert({
                user_id: user.id,
                title,
                job_type: jobType,
                contract_type: contractType,
                salary_min: salaryMin ? parseFloat(salaryMin) : null,
                salary_max: salaryMax ? parseFloat(salaryMax) : null,
                description,
                skills,
                company_name: recruiterProfile.companyName,
                company_logo: recruiterProfile.logoUrl,
                location: recruiterProfile.location,
                status: 'active',
                application_link: applicationLink || null // Save the link
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            // If table doesn't exist, we might need to create it. 
            // For now, let's assume it exists or we will provide SQL.
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, job: data });
    } catch (error) {
        console.error('Job creation API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
