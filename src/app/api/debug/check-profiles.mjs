import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
    console.log('--- Checking profiles table ---');

    // Attempt to select one row
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting from profiles:', error);
    } else {
        console.log('Profiles select success.');
        if (data && data.length > 0) {
            console.log('Sample row:', data[0]);
        } else {
            console.log('Table exists but is empty.');
            // If empty, try to insert a dummy row to see columns in error or success
            console.log('Attempting dummy insert to probe schema...');
            const { error: insertError } = await supabase.from('profiles').insert({ id: 'dummy_probe' });
            if (insertError) console.log('Insert probe error:', insertError);
        }
    }
}

checkProfiles();
