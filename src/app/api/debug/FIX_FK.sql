-- Fix Foreign Key Constraint Error in 'applications' table

-- The error indicates 'applications.profile_id' references 'profiles.id', but your users are in the 'users' table.
-- We need to remove the incorrect foreign key constraint pointing to 'profiles'.

-- 1. Drop existing constraint
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_profile_id_fkey;

-- 2. (Optional) If you want to enforce relationship with 'users' table instead:
-- Make sure 'users.id' is compatible (text or uuid). Legacy auth IDs are text.
-- If 'users.id' is text and 'applications.profile_id' is text, this works:
-- ALTER TABLE public.applications ADD CONSTRAINT applications_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES users (id);

-- For now, just running step 1 is sufficient to fix the error.
