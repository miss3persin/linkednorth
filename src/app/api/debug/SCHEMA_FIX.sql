-- Run this in your Supabase SQL Editor to fix the job application error

-- 1. Drop the foreign key constraint enforcing UUIDs (if it exists)
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_job_id_fkey;

-- 2. Change job_id column from UUID to TEXT to support external job IDs (like 'yc-123')
ALTER TABLE public.applications ALTER COLUMN job_id TYPE text;

-- 3. (Optional) Add a check constraint to ensure job_id is not empty
ALTER TABLE public.applications ADD CONSTRAINT job_id_not_empty CHECK (length(job_id) > 0);
