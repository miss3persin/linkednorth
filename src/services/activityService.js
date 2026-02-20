import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function getUserActivity(userId) {
    try {
        // Get applications count
        const { data: applications, error: appError } = await supabaseAdmin
            .from('applications')
            .select('id, status, created_at')
            .eq('profile_id', userId);

        if (appError) throw appError;

        // Get job views count (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: jobViews, error: viewError } = await supabaseAdmin
            .from('job_views')
            .select('id')
            .eq('user_id', userId)
            .gte('viewed_at', thirtyDaysAgo.toISOString());

        if (viewError) throw viewError;

        // Get interviews count (applications with 'accepted' or 'interviewing' status)
        const interviews = applications?.filter(
            app => app.status === 'accepted' || app.status === 'interviewing'
        ) || [];

        // Get notifications
        const { data: notifications, error: notifError } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(5);

        if (notifError) throw notifError;

        // Get profile completion
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        // Calculate profile completeness
        const profileFields = profile ? [
            profile.resume_uploaded,
            profile.profile_photo,
            profile.bio_completed,
            profile.skills_added,
            profile.experience_added,
            profile.education_added,
        ] : [];

        const completedFields = profileFields.filter(Boolean).length;
        const profileCompleteness = profileFields.length > 0
            ? Math.round((completedFields / profileFields.length) * 100)
            : 0;

        // Calculate application success rate
        const totalApplications = applications?.length || 0;
        const successfulApplications = applications?.filter(
            app => app.status === 'accepted' || app.status === 'interviewing'
        ).length || 0;

        const successRate = totalApplications > 0
            ? Math.round((successfulApplications / totalApplications) * 100)
            : 0;

        // Calculate interview conversion rate
        const interviewCount = interviews.length;
        const conversionRate = totalApplications > 0
            ? Math.round((interviewCount / totalApplications) * 100)
            : 0;

        return {
            appliedJobs: totalApplications,
            viewedJobs: jobViews?.length || 0,
            interviews: interviewCount,
            notifications: notifications || [],
            profileCompleteness,
            successRate,
            conversionRate,
        };
    } catch (error) {
        console.error('Error fetching user activity:', error);
        return {
            appliedJobs: 0,
            viewedJobs: 0,
            interviews: 0,
            notifications: [],
            profileCompleteness: 0,
            successRate: 0,
            conversionRate: 0,
        };
    }
}

// Track when user views a job
export async function trackJobView(userId, jobId, jobTitle, company) {
    try {
        const { error } = await supabaseAdmin
            .from('job_views')
            .insert({
                user_id: userId,
                job_id: jobId,
                job_title: jobTitle,
                company: company,
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error tracking job view:', error);
        return { success: false, error };
    }
}
