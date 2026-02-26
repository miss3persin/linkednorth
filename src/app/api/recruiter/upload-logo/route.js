import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { getSupabaseUser } from '@/app/lib/authHelpers';

export async function POST(req) {
    try {
        const user = await getSupabaseUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert file to buffer for Supabase
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload using service role key (bypasses RLS)
        const { data, error: uploadError } = await supabaseAdmin.storage
            .from('company-logos')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Get the public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('company-logos')
            .getPublicUrl(filePath);

        return NextResponse.json({ publicUrl });
    } catch (error) {
        console.error('Logo upload API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
