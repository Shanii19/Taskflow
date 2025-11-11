-- Fix the teams UPDATE policy by adding explicit WITH CHECK clause
-- This allows admins to update teams even when setting deleted_at

DROP POLICY IF EXISTS "Admins can update teams" ON public.teams;

CREATE POLICY "Admins can update teams" 
ON public.teams 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));