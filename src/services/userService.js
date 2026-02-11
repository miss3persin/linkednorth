import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function createUser(userData) {
    const { id, email, first_name, last_name } = userData;
    const { error } = await supabaseAdmin
        .from('users')
        .insert({
            id,
            email,
            first_name,
            last_name,
        });
    if (error) throw error;
    return { success: true };
}

export async function updateUser(id, userData) {
    const { error } = await supabaseAdmin
        .from('users')
        .update({
            ...userData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    if (error) throw error;
    return { success: true };
}

export async function deleteUser(id) {
    const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return { success: true };
}

export async function upsertUser(userData) {
    const { error } = await supabaseAdmin
        .from('users')
        .upsert(userData, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
}

export async function getUnreadCounts(userId) {
    const { count: notificationCount, error: notifError } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (notifError) throw notifError;

    return {
        unreadNotifications: notificationCount || 0,
        unreadMessages: 0, // Placeholder for future implementation
    };
}
