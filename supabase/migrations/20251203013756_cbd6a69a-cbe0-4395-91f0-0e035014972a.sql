-- Create a secure view that excludes password columns
CREATE OR REPLACE VIEW public.celebrations_public AS
SELECT 
  id,
  slug,
  birthday_person_name,
  main_media_url,
  main_media_type,
  created_at,
  updated_at
FROM public.celebrations;

-- Grant access to the view
GRANT SELECT ON public.celebrations_public TO anon, authenticated;

-- Drop the overly permissive SELECT policy on the base table
DROP POLICY IF EXISTS "Anyone can view celebrations" ON public.celebrations;

-- Create a more restrictive policy that denies direct SELECT on the base table
-- (Service role will still have access for edge functions)
CREATE POLICY "No direct public access to celebrations"
ON public.celebrations
FOR SELECT
USING (false);

-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Anyone can update celebrations" ON public.celebrations;

-- Create restrictive UPDATE policy (updates should go through edge functions)
CREATE POLICY "No direct public updates to celebrations"
ON public.celebrations
FOR UPDATE
USING (false);

-- Keep INSERT policy for creating celebrations (passwords are set by the creator)
-- The existing INSERT policy is acceptable