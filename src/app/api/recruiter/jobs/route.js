import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { getSupabaseUser } from '@/app/lib/authHelpers';

export async function GET(req) {
    try {
        const user = await getSupabaseUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch Internal Jobs posted by this recruiter
        const { data: jobs, error: jobsError } = await supabaseAdmin
            .from('internal_jobs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (jobsError) {
            console.error('Supabase jobs error:', jobsError);
            return NextResponse.json({ error: jobsError.message }, { status: 500 });
        }

        const jobIds = jobs.map(j => j.id);

        // Define initial stats
        let dashboardStats = {
            activeJobs: jobs.filter(j => j.status === 'active').length,
            totalApplications: 0,
            shortlisted: 0,
            interviews: 0
        };

        let enrichedJobs = jobs.map(j => ({ ...j, applicant_count: 0 }));
        let recentApplications = [];

        if (jobIds.length > 0) {
            // 2. Fetch ALL applications for these jobs
            // Important: Applications store job_id with "internal-" prefix for internal jobs
            // We need to query for both raw UUID (just in case) and prefixed ID
            const prefixedIds = jobIds.map(id => `internal-${id}`);
            const allPossibleIds = [...jobIds, ...prefixedIds];

            const { data: apps, error: appsError } = await supabaseAdmin
                .from('applications')
                .select('id, job_id, profile_id, status, created_at')
                .in('job_id', allPossibleIds) // Filter by our job IDs (prefixed or raw)
                .order('created_at', { ascending: false });

            if (!appsError && apps) {
                // Calculate stats based on fetched applications
                dashboardStats.totalApplications = apps.length;
                dashboardStats.shortlisted = apps.filter(a => a.status === 'shortlisted').length;
                dashboardStats.interviews = apps.filter(a => a.status === 'interviewing' || a.status === 'interview').length;

                // Map application counts to jobs
                enrichedJobs = jobs.map(job => {
                    const jobApps = apps.filter(a => a.job_id === job.id || a.job_id === `internal-${job.id}`);
                    return {
                        ...job,
                        applicant_count: jobApps.length
                    };
                });

                // Prepare Recent Applications (limit 5)
                const recentAppsRaw = apps.slice(0, 5);

                // Fetch user data for these recent applicants
                const profileIds = [...new Set(recentAppsRaw.map(a => a.profile_id))];
                let usersMap = {};

                if (profileIds.length > 0) {
                    const { data: users, error: usersError } = await supabaseAdmin
                        .from('users')
                        .select('id, first_name, last_name, email')
                        .in('id', profileIds);

                    if (!usersError && users) {
                        users.forEach(u => {
                            usersMap[u.id] = u;
                        });
                    }
                }

                // Format recent applications for frontend
                recentApplications = recentAppsRaw.map(app => {
                    const applicant = usersMap[app.profile_id];
                    const job = jobs.find(j => j.id === app.job_id || `internal-${j.id}` === app.job_id);
                    return {
                        id: app.id,
                        name: applicant ? `${applicant.first_name} ${applicant.last_name}` : 'Unknown Applicant',
                        role: job ? job.title : 'Unknown Role',
                        time: new Date(app.created_at).toLocaleDateString(), // Or use simple logic "2 hours ago" on frontend
                        status: app.status || 'New',
                        jobId: job ? job.id : app.job_id // Use raw job ID for link if possible
                    };
                });
            } else if (appsError) {
                console.error('Error fetching applications:', appsError);
            }
        }

        return NextResponse.json({
            jobs: enrichedJobs,
            stats: dashboardStats,
            recentApplications
        });

    } catch (error) {
        console.error('Recruiter dashboard API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
