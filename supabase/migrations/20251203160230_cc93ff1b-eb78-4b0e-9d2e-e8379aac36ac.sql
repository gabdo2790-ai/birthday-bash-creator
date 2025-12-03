-- Recreate the celebrations_public view with SECURITY INVOKER instead of SECURITY DEFINER
DROP VIEW IF EXISTS public.celebrations_public;

CREATE VIEW public.celebrations_public 
WITH (security_invoker = true)
AS 
SELECT 
  id,
  slug,
  birthday_person_name,
  main_media_url,
  main_media_type,
  created_at,
  updated_at
FROM public.celebrations;