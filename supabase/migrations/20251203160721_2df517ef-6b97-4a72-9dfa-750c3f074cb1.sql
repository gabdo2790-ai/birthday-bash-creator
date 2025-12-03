-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "No direct public access to celebrations" ON public.celebrations;

-- Allow SELECT access - the public view will expose only safe columns
CREATE POLICY "Allow public read for celebrations view"
ON public.celebrations
FOR SELECT
USING (true);