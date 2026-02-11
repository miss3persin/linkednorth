import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking applications table job_id ---');
    // We can't easily check types via simple select if we don't have access to information_schema
    // But we can try to insert a dummy row with text ID and see the error message details

    // Attempt to insert a dummy record that is guaranteed to fail constraint or type checks
    // but the error message will be revealing.

    try {
        const { error } = await supabase
            .from('applications')
            .insert({
                job_id: 'test-string-id',
                // using a dummy user_id that likely doesn't exist or is invalid to fail safely if type check passes
                // but we expect type check to fail first if it's UUID
                profile_id: 'test-user',
                status: 'pending'
            });

        if (error) {
            console.log('Insert error:', error);
        } else {
            console.log('Insert apparently succeeded? (Unexpected for test-string-id if UUID)');
        }
    } catch (e) {
        console.log('Exception:', e);
    }
}

checkSchema();
