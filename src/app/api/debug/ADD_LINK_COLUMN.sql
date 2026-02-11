-- Add application_link column to internal_jobs table
ALTER TABLE public.internal_jobs ADD COLUMN IF NOT EXISTS application_link TEXT;

-- (Optional) If we want to enforce it at DB level, we can add NOT NULL later, 
-- but for now we'll handle validation in the API/Frontend to avoid breaking existing rows immediately if any.
