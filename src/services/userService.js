import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

// Create a new user in public.users (rarely used if upsert is your main flow)
export async function createUser(userData) {
    const { id, email, first_name, last_name } = userData;
    const { error } = await supabaseAdmin
        .from('users')
        .insert({ id, email, first_name, last_name });
    if (error) throw error;
    return { success: true };
}

// Update an existing user by id
export async function updateUser(id, userData) {
    const { error } = await supabaseAdmin
        .from('users')
        .update({ ...userData, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
    return { success: true };
}

// Delete a user by id (cascades if auth_id FK is set)
export async function deleteUser(id) {
    const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return { success: true };
}

// ✅ Production-safe upsertUser
export async function upsertUser(userData) {
    const authId = userData.auth_id;
    if (!authId) throw new Error('auth_id is required to sync Supabase users.');

    const payload = {
        id: userData.id || authId, // preserve your text ID if provided
        auth_id: authId,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        updated_at: new Date().toISOString()
    };

    // Upsert using email as the conflict target to handle pre-existing rows without auth_id
    const { error } = await supabaseAdmin
        .from('users')
        .upsert(payload, { onConflict: 'email' });

    if (error) throw error;

    return { success: true };
}

// Get unread notifications + messages count
export async function getUnreadCounts(userId, hiddenDerivedIds = new Set()) {
    const hiddenSet = hiddenDerivedIds instanceof Set ? hiddenDerivedIds : new Set(hiddenDerivedIds)
    const { count: notificationCount, error: notifError } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (notifError) throw notifError;

    const derivedCount = await getDerivedNotificationCount(userId, hiddenSet);

    return {
        unreadNotifications: (notificationCount || 0) + derivedCount,
        unreadMessages: 0 // Placeholder
    };
}

// Helper: calculate derived notifications
async function getDerivedNotificationCount(userId, hiddenDerivedIds = new Set()) {
    const hiddenSet = hiddenDerivedIds instanceof Set ? hiddenDerivedIds : new Set(hiddenDerivedIds)
    const { data: notifications } = await supabaseAdmin
        .from('notifications')
        .select('action_link')
        .eq('user_id', userId);

    const existingLinks = new Set(
        (notifications || []).map(n => n.action_link).filter(Boolean)
    );

    const { data: applications } = await supabaseAdmin
        .from('applications')
        .select('(id, job_id)')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

    const { data: savedJobs } = await supabaseAdmin
        .from('saved_jobs')
        .select('(job_id)')
        .eq('profile_id', userId)
        .order('saved_at', { ascending: false })
        .limit(3);

    let count = 0;

    const isHiddenDerived = (derivedId) => derivedId && hiddenSet.has(derivedId)

    const registerLink = (link, derivedId) => {
        if (!link || existingLinks.has(link)) return false;
        if (isHiddenDerived(derivedId)) return false;
        existingLinks.add(link);
        return true;
    };

    (applications || []).forEach(app => {
        const link = `/joblistings/${app.job_id}`;
        if (registerLink(link, `derived-application-${app.id}`)) count += 1;
    });

    (savedJobs || []).forEach(saved => {
        const link = `/joblistings/${saved.job_id}`;
        if (registerLink(link, `derived-saved-${saved.job_id}-${saved.saved_at}`)) count += 1;
    });

    return count;
}
