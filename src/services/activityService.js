import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { upsertUser } from '@/services/userService';

export async function getUserActivity(userId, hiddenDerivedIds = new Set()) {
    try {
        const hiddenSet = hiddenDerivedIds instanceof Set ? hiddenDerivedIds : new Set(hiddenDerivedIds)
        // Get applications count
        const { data: applications, error: appError } = await supabaseAdmin
            .from('applications')
            .select(`
                id,
                status,
                created_at,
                job_id
            `)
            .eq('profile_id', userId);

        if (appError) throw appError;

        const applicationJobIds = Array.from(
            new Set(
                (applications || [])
                    .map((app) => app.job_id)
                    .filter(Boolean)
            )
        );

        let applicationJobsMap = new Map();
        if (applicationJobIds.length > 0) {
            const { data: applicationJobs } = await supabaseAdmin
                .from('jobs')
                .select('id, title, company')
                .in('id', applicationJobIds);
            applicationJobsMap = new Map((applicationJobs || []).map((job) => [job.id, job]));
        }

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

        const { data: savedJobs, error: savedJobsError } = await supabaseAdmin
            .from('saved_jobs')
            .select(`
                job_id,
                status,
                saved_at
            `)
            .eq('profile_id', userId)
            .order('saved_at', { ascending: false })
            .limit(5);

        const savedJobIds = Array.from(
            new Set(
                (savedJobs || [])
                    .map((entry) => entry.job_id)
                    .filter(Boolean)
            )
        );

        let savedJobsMap = new Map();
        if (savedJobIds.length > 0) {
            const { data: savedJobsDetails } = await supabaseAdmin
                .from('jobs')
                .select('id, title, company')
                .in('id', savedJobIds);
            savedJobsMap = new Map((savedJobsDetails || []).map((job) => [job.id, job]));
        }

        if (notifError) throw notifError;
        if (savedJobsError) throw savedJobsError;

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

        const resolveJob = (jobId) => applicationJobsMap.get(jobId) || savedJobsMap.get(jobId)

        const buildDerivedNotifications = () => {
            const existingLinks = new Set(
                (notifications || [])
                    .map((n) => n.action_link)
                    .filter(Boolean)
            )

            const derived = []
            const formatTitle = (value) => value || 'this role'
            const formatCompany = (value) => value || 'the company'

            const isHiddenDerived = (derivedId) => derivedId && hiddenSet.has(derivedId)

            const addDerived = (entry) => {
                if (!entry.actionLink || existingLinks.has(entry.actionLink)) {
                    return
                }
                if (isHiddenDerived(entry.id)) {
                    return
                }
                existingLinks.add(entry.actionLink)
                derived.push({ ...entry, isDerived: true })
            }

            const applicationNotifications = (applications || [])
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 3)

            applicationNotifications.forEach((app) => {
                const link = `/joblistings/${app.job_id}`
                addDerived({
                    id: `derived-application-${app.id}`,
                    title: 'Application Submitted',
                    message: `Your application for ${formatTitle(resolveJob(app.job_id)?.title)} at ${formatCompany(resolveJob(app.job_id)?.company)} has been submitted successfully.`,
                    text: `Your application for ${formatTitle(resolveJob(app.job_id)?.title)} at ${formatCompany(resolveJob(app.job_id)?.company)} has been submitted successfully.`,
                    actionLink: link,
                    targetJobId: app.job_id,
                    action: 'View',
                    time: new Date(app.created_at || Date.now()).toLocaleDateString(),
                    timeValue: app.created_at,
                    color: 'text-green-600',
                })
            })

            const savedNotifications = (savedJobs || [])
                .sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at))
                .slice(0, 3)

            savedNotifications.forEach((saved) => {
                const link = `/joblistings/${saved.job_id}`
                addDerived({
                    id: `derived-saved-${saved.job_id}-${saved.saved_at}`,
                    title: 'Job Saved',
                    message: `${formatTitle(resolveJob(saved.job_id)?.title)} at ${formatCompany(resolveJob(saved.job_id)?.company)} has been saved for later.`,
                    text: `${formatTitle(resolveJob(saved.job_id)?.title)} at ${formatCompany(resolveJob(saved.job_id)?.company)} has been saved for later.`,
                    actionLink: link,
                    targetJobId: saved.job_id,
                    action: 'View',
                    time: new Date(saved.saved_at || Date.now()).toLocaleDateString(),
                    timeValue: saved.saved_at,
                    color: 'text-blue-500',
                })
            })

            return derived
        }

        const derivedNotifications = buildDerivedNotifications()
        const mergedNotifications = [...(notifications || []), ...derivedNotifications]
            .map((n) => ({
                ...n,
                timeValue: n.timeValue || n.created_at || n.saved_at || Date.now(),
            }))
            .sort((a, b) => new Date(b.timeValue) - new Date(a.timeValue))
            .slice(0, 5)
            .map((n) => ({
                id: n.id,
                title: n.title,
                message: n.message || n.text,
                actionLink: n.action_link || n.actionLink,
                action: n.action || 'View',
                time: n.time || new Date(n.timeValue).toLocaleDateString(),
                color: n.color || 'text-gray-500',
                isDerived: Boolean(n.isDerived),
                targetJobId: n.targetJobId,
                timeValue: n.timeValue,
            }))

        return {
            appliedJobs: totalApplications,
            viewedJobs: jobViews?.length || 0,
            interviews: interviewCount,
            notifications: mergedNotifications,
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
export async function trackJobView(user, jobId, jobTitle, company) {
    try {
        await upsertUser({
            id: user.id,
            auth_id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || user.user_metadata?.firstName || null,
            last_name: user.user_metadata?.last_name || user.user_metadata?.lastName || null,
        });

        const { error } = await supabaseAdmin
            .from('job_views')
            .insert({
                user_id: user.id,
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
