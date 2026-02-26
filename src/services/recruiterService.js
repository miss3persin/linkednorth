import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

const RETRYABLE_CODES = new Set(['EAI_AGAIN', 'ECONNRESET', 'ETIMEDOUT']);
const RETRYABLE_MESSAGES = ['fetch failed', 'getaddrinfo', 'AuthRetryableFetchError'];
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 250;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
    if (!error) return false;
    const code = error.code || error?.cause?.code;
    if (code && RETRYABLE_CODES.has(code)) {
        return true;
    }
    const message = (error.message || '').toLowerCase();
    return RETRYABLE_MESSAGES.some((pattern) => message.includes(pattern.toLowerCase()));
};

const fetchUserByIdWithRetry = async (userId) => {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
        try {
            const result = await supabaseAdmin.auth.admin.getUserById(userId);
            if (result.error) {
                throw result.error;
            }
            if (result.data?.user) {
                return result.data;
            }
            throw new Error('User data missing from Supabase response');
        } catch (error) {
            const shouldRetry = attempt < MAX_RETRIES && isRetryableError(error);
            if (!shouldRetry) {
                throw error;
            }
            await delay(RETRY_DELAY_MS * (attempt + 1));
        }
    }
    throw new Error('Unable to fetch Supabase user after retries');
};

export async function createRecruiterProfile(userId, companyData) {
    const { companyName, location, industry, logoUrl } = companyData;

    try {
        const { user } = await fetchUserByIdWithRetry(userId);
        const existingMetadata = user?.user_metadata || {};
        const existingProfile = existingMetadata.recruiterProfile || {};

        const updatedMetadata = {
            ...existingMetadata,
            isRecruiter: true,
            recruiterProfile: {
                ...existingProfile,
                companyName,
                location,
                industry,
                logoUrl,
                setupAt: new Date().toISOString(),
            },
        };

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: updatedMetadata,
        });

        if (updateError) {
            throw updateError;
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating Supabase metadata:', error);
        throw new Error('Failed to update recruiter profile');
    }
}

export async function isUserRecruiter(userId) {
    try {
        const { user } = await fetchUserByIdWithRetry(userId);
        if (!user) {
            return false;
        }
        const metadata = user.user_metadata || {};
        return Boolean(metadata.isRecruiter && metadata.recruiterProfile);
    } catch (error) {
        console.error('Error checking recruiter status:', error);
        return false;
    }
}
