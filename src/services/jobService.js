import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

const YC_API_URL = "https://free-y-combinator-jobs-api.p.rapidapi.com/active-jb-7d";
const REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs";
const JOBICY_API_URL = "https://jobicy.com/api/v2/remote-jobs";

async function safeFetch(fn, source) {
    try {
        const data = await fn();
        return { ok: true, source, data };
    } catch (err) {
        console.error(`[${source}] fetch failed`, err);
        return { ok: false, source, data: [] };
    }
}

function dedupeJobs(jobs) {
    const map = new Map();
    for (const job of jobs) {
        const key = `${job.company}-${job.jobTitle}`.toLowerCase();
        if (!map.has(key)) {
            map.set(key, job);
        }
    }
    return Array.from(map.values());
}

async function fetchYCJobs() {
    const res = await fetch(YC_API_URL, {
        headers: {
            "x-rapidapi-host": "free-y-combinator-jobs-api.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
        next: { revalidate: 1800 }, // 30 mins
    });

    if (!res.ok) throw new Error("YC API failed");
    const rawJobs = await res.json();

    return rawJobs.map((job) => ({
        id: `yc-${job.id}`,
        source: "ycombinator",
        jobTitle: job.title,
        company: job.organization,
        location:
            job.locations_derived?.length > 0
                ? job.locations_derived.join(" • ")
                : job.remote_derived
                    ? "Remote"
                    : "Not specified",
        jobType: job.remote_derived ? "Remote" : "On-site / Hybrid",
        contractType: job.employment_type?.[0] || "UNKNOWN",
        postedTime: job.date_posted,
        description: null,
        imageSrc: job.organization_logo || null,
        applyLink: job.external_apply_url || job.url,
        detailsLink: job.url,
    }));
}

async function fetchRemotiveJobs(search) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const res = await fetch(`${REMOTIVE_API_URL}?${params.toString()}`, {
        next: { revalidate: 21600 }, // 6 hours
    });

    if (!res.ok) throw new Error("Remotive API failed");
    const data = await res.json();
    const rawJobs = data.jobs || [];

    return rawJobs.map((job) => ({
        id: `remotive-${job.id}`,
        source: "remotive",
        jobTitle: job.title,
        company: job.company_name,
        location: job.candidate_required_location || "Remote",
        jobType: "Remote",
        contractType: job.job_type
            ? job.job_type.replace("_", " ").toUpperCase()
            : "UNKNOWN",
        postedTime: job.publication_date,
        description: job.description || null,
        imageSrc: job.company_logo || null,
        applyLink: job.url,
        detailsLink: job.url,
        attribution: { name: "Remotive", url: "https://remotive.com" },
    }));
}

async function fetchJobicyJobs() {
    const res = await fetch(JOBICY_API_URL, {
        next: { revalidate: 21600 }, // 6 hours
    });

    if (!res.ok) throw new Error("Jobicy API failed");
    const data = await res.json();
    const rawJobs = data.jobs || data || [];

    return rawJobs.map((job) => ({
        id: `jobicy-${job.id}`,
        source: "jobicy",
        jobTitle: job.jobTitle,
        company: job.companyName,
        location: job.jobGeo || "Remote",
        jobType: "Remote",
        contractType: Array.isArray(job.jobType)
            ? job.jobType[0].replace("-", " ").toUpperCase()
            : typeof job.jobType === "string"
                ? job.jobType.replace("-", " ").toUpperCase()
                : "UNKNOWN",
        postedTime: job.pubDate,
        description: job.jobDescription || null,
        imageSrc: job.companyLogo || null,
        applyLink: job.url,
        detailsLink: job.url,
        salary:
            job.annualSalaryMin || job.annualSalaryMax
                ? {
                    min: job.annualSalaryMin || null,
                    max: job.annualSalaryMax || null,
                    currency: job.salaryCurrency || null,
                }
                : null,
    }));
}

async function fetchInternalJobs() {
    try {
        const { data, error } = await supabaseAdmin
            .from('internal_jobs')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(job => ({
            id: `internal-${job.id}`,
            source: "internal",
            jobTitle: job.title,
            company: job.company_name,
            location: job.location,
            jobType: job.job_type,
            contractType: job.contract_type,
            postedTime: job.created_at,
            description: job.description,
            imageSrc: job.company_logo,
            applyLink: `/jobs/${job.id}`, // Internal jobs link to our own details page
            detailsLink: `/jobs/${job.id}`,
            salary: job.salary_min || job.salary_max ? {
                min: job.salary_min,
                max: job.salary_max,
                currency: 'USD' // Defaulting to USD for now or from profile
            } : null,
            skills: job.skills || []
        }));
    } catch (err) {
        console.error('[Internal] fetch failed', err);
        return [];
    }
}

export async function getJobs({ search = "", limit = 100, dedupe = true } = {}) {
    const results = await Promise.allSettled([
        safeFetch(fetchYCJobs, "ycombinator"),
        safeFetch(() => fetchRemotiveJobs(search), "remotive"),
        safeFetch(fetchJobicyJobs, "jobicy"),
        fetchInternalJobs() // Internal jobs are not "safeFetch" wrapped here so we can see errors during dev
    ]);

    const jobs = results
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => {
            if (Array.isArray(r.value)) return r.value; // Internal jobs case
            return (r.value.ok ? r.value.data : []);
        });

    // Sort internal jobs to the top
    const internalJobs = jobs.filter(j => j.source === "internal");
    const otherJobs = jobs.filter(j => j.source !== "internal");

    const processedJobs = dedupe ? dedupeJobs([...internalJobs, ...otherJobs]) : [...internalJobs, ...otherJobs];
    const finalJobs = processedJobs.slice(0, limit);

    return {
        jobs: finalJobs,
        sources: results.map((r) =>
            r.status === "fulfilled"
                ? { source: r.value.source, ok: r.value.ok }
                : { source: "unknown", ok: false }
        ),
    };
}

export async function getJobById(id) {
    // 0. Try Internal Jobs first
    if (id && !id.startsWith('yc-') && !id.startsWith('remotive-') && !id.startsWith('jobicy-')) {
        const { data: internalJob, error: internalError } = await supabaseAdmin
            .from('internal_jobs')
            .select('*')
            .eq('id', id.startsWith('internal-') ? id.replace('internal-', '') : id)
            .single();

        if (internalJob && !internalError) {
            return {
                id: `internal-${internalJob.id}`,
                jobTitle: internalJob.title,
                company: internalJob.company_name,
                location: internalJob.location,
                description: internalJob.description,
                postedTime: internalJob.created_at,
                jobType: internalJob.job_type,
                contractType: internalJob.contract_type,
                applyLink: `/jobs/${internalJob.id}`,
                imageSrc: internalJob.company_logo,
                skills: internalJob.skills || [],
                source: 'internal'
            };
        }
    }

    // 1. Try Cache First
    const { data: cachedJob, error } = await supabaseAdmin
        .from('jobs_cache')
        .select('*')
        .eq('external_id', id)
        .single();

    if (cachedJob && !error) {
        return {
            id: cachedJob.external_id,
            jobTitle: cachedJob.title,
            company: cachedJob.company,
            location: cachedJob.location,
            description: cachedJob.description,
            postedTime: cachedJob.created_at,
            jobType: cachedJob.job_type,
            contractType: cachedJob.contract_type,
            applyLink: cachedJob.apply_link,
            imageSrc: cachedJob.image_url,
            skills: cachedJob.skills || [],
        };
    }

    // 2. Try live lookup if not in cache (Fallback)
    // This is important for direct links or recently updated jobs
    const { jobs } = await getJobs({ limit: 200, dedupe: false });
    const liveJob = jobs.find(j => j.id === id);

    if (liveJob) {
        // Optionally cache it now
        await supabaseAdmin.from('jobs_cache').upsert({
            external_id: String(liveJob.id),
            title: liveJob.jobTitle,
            company: liveJob.company,
            location: liveJob.location,
            description: liveJob.description,
            job_type: liveJob.jobType,
            contract_type: liveJob.contractType,
            apply_link: liveJob.applyLink,
            image_url: liveJob.imageSrc,
            skills: liveJob.skills || [],
        }, { onConflict: 'external_id' });

        return liveJob;
    }

    return null;
}
