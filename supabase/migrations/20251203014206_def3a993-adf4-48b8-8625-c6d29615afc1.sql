-- Drop the overly permissive DELETE policy on messages
DROP POLICY IF EXISTS "Anyone can delete messages" ON public.messages;

-- Create a restrictive DELETE policy (deletions should go through edge functions)
CREATE POLICY "No direct public deletes on messages"
ON public.messages
FOR DELETE
USING (false);