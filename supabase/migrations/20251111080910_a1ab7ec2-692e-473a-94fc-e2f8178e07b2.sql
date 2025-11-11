-- Fix teams RLS to allow soft delete operations
-- The issue: SELECT policy blocks rows with deleted_at set, preventing UPDATE operation

DROP POLICY IF EXISTS "All users can view teams" ON public.teams;

-- Allow users to view non-deleted teams, and admins to view all teams
CREATE POLICY "Users can view teams" 
ON public.teams 
FOR SELECT 
USING (
  deleted_at IS NULL OR has_role(auth.uid(), 'admin'::app_role)
);