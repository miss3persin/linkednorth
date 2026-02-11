import Sidebar from "@/app/components/layout/Sidebar";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, Calendar } from "lucide-react";

export default async function JobApplicantsPage({ params }) {
    const { id: jobId } = await params;
    const { userId } = await auth();

    // 1. Fetch Job Details (Verify ownership)
    const { data: job, error: jobError } = await supabaseAdmin
        .from('internal_jobs')
        .select('*')
        .eq('id', jobId)
        //.eq('user_id', userId) // Security check
        .single();

    if (jobError || !job) {
        return (
            <div className="min-h-screen bg-white flex">
                <Sidebar />
                <div className="flex-1 p-8 flex items-center justify-center">
                    <p>Job not found or access denied.</p>
                </div>
            </div>
        );
    }

    // Security check: ensure the current user owns this job
    if (job.user_id !== userId) {
        return (
            <div className="min-h-screen bg-white flex">
                <Sidebar />
                <div className="flex-1 p-8 flex items-center justify-center">
                    <p>Unauthorized access.</p>
                </div>
            </div>
        );
    }

    // 2. Fetch Applications
    // job_id in applications is TEXT, matching the uuid string of internal_jobs
    const { data: applications, error: appError } = await supabaseAdmin
        .from('applications')
        .select('*')
        .in('job_id', [jobId, `internal-${jobId}`])
        .order('created_at', { ascending: false });

    // 3. Fetch User Profiles for these applications
    let applicants = [];
    if (applications && applications.length > 0) {
        const profileIds = [...new Set(applications.map(app => app.profile_id))];
        const { data: users } = await supabaseAdmin
            .from('users')
            .select('*')
            .in('id', profileIds);

        const usersMap = {};
        if (users) {
            users.forEach(u => usersMap[u.id] = u);
        }

        applicants = applications.map(app => {
            const user = usersMap[app.profile_id] || {};
            return {
                appId: app.id,
                appliedAt: new Date(app.created_at).toLocaleDateString(),
                status: app.status,
                name: user.first_name ? `${user.first_name} ${user.last_name}` : 'Unknown Candidate',
                email: user.email,
                clerkId: app.profile_id
            };
        });
    }

    return (
        <div className="flex min-h-screen mt-16 bg-[#F8F9FB]">
            <Sidebar />

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <Link href="/recruiter/hub" className="text-gray-500 hover:text-black flex items-center gap-2 text-sm mb-4">
                        <ChevronLeft size={16} /> Back to Hub
                    </Link>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                            <p className="text-gray-500 text-sm">
                                {job.location} • {job.job_type} • Posted {new Date(job.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="bg-white px-4 py-2 border rounded-lg text-sm font-bold shadow-sm">
                            {applicants.length} Applicants
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-700">Candidates</h2>
                        <div className="flex gap-2">
                            <button className="text-xs font-bold text-gray-500 bg-white border px-3 py-1.5 rounded-md hover:bg-gray-50">Filter</button>
                            <button className="text-xs font-bold text-gray-500 bg-white border px-3 py-1.5 rounded-md hover:bg-gray-50">Export</button>
                        </div>
                    </div>

                    {applicants.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p>No applications yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {applicants.map((candidate) => (
                                <div key={candidate.appId} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {candidate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {candidate.email || 'No email provided'}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> Applied {candidate.appliedAt}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                candidate.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                                        `}>
                                            {candidate.status || 'Pending'}
                                        </span>
                                        <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
