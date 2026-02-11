import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    console.log('--- Listing Tables ---');
    // Using a trick: query a table we know exists or try to fetch data from non-existent table to see error list if possible
    // But since we have service role, let's try to query 'profiles' again and check exact error

    // First, try to insert to 'profiles' with ON CONFLICT DO NOTHING to see if it allows write
    // This is safer test than read if RLS blocks read for some reason even for service role (which shouldn't happen but...)

    try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) console.log('Profiles SELECT error:', error);
        else console.log('Profiles SELECT success (perms OK)');
    } catch (e) { console.log('Profiles SELECT exception:', e); }

    try {
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) console.log('Users SELECT error:', error);
        else console.log('Users SELECT success');
    } catch (e) { console.log('Users SELECT exception:', e); }

    // Let's try to get column info via RPC if available, or just guess
    // Since the FK references profiles(id), 'id' column definitely exists in profiles
}

listTables();
