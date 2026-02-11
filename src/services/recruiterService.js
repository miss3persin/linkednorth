import { clerkClient } from '@clerk/nextjs/server';

export async function createRecruiterProfile(userId, companyData) {
    const { companyName, location, industry, logoUrl } = companyData;
    const client = await clerkClient();

    try {
        // Update Clerk metadata to store recruiter info
        await client.users.updateUser(userId, {
            publicMetadata: {
                isRecruiter: true
            },
            privateMetadata: {
                isRecruiter: true,
                recruiterProfile: {
                    companyName,
                    location,
                    industry,
                    logoUrl,
                    setupAt: new Date().toISOString()
                }
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating Clerk metadata:', error);
        throw new Error('Failed to update recruiter profile in Clerk');
    }
}

export async function isUserRecruiter(userId) {
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        return !!user.privateMetadata?.isRecruiter;
    } catch (error) {
        console.error('Error checking recruiter status from Clerk:', error);
        return false;
    }
}
