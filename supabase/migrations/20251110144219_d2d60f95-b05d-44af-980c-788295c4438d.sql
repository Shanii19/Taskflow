-- Add status and progress columns to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

-- Add check constraint for status values
ALTER TABLE public.projects
ADD CONSTRAINT projects_status_check CHECK (status IN ('pending', 'in_progress', 'completed'));

-- Update existing projects to have default status if null
UPDATE public.projects SET status = 'pending' WHERE status IS NULL;
UPDATE public.projects SET progress = 0 WHERE progress IS NULL;

-- Update RLS policies for stricter admin-only access
DROP POLICY IF EXISTS "Admins can create projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view non-deleted projects" ON public.projects;

CREATE POLICY "Admins can create projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects" 
ON public.projects 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" 
ON public.projects 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their team projects" 
ON public.projects 
FOR SELECT 
USING (deleted_at IS NULL);

-- Update tasks RLS policies for employee view-only access
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Assignees can update their tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view non-deleted tasks" ON public.tasks;

CREATE POLICY "Admins can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tasks" 
ON public.tasks 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their assigned tasks" 
ON public.tasks 
FOR SELECT 
USING (deleted_at IS NULL AND (auth.uid() = ANY(assignees) OR has_role(auth.uid(), 'admin')));

-- Update teams RLS policies
DROP POLICY IF EXISTS "Admins can create teams" ON public.teams;
DROP POLICY IF EXISTS "Admins can soft delete teams" ON public.teams;
DROP POLICY IF EXISTS "Admins can update teams" ON public.teams;
DROP POLICY IF EXISTS "Users can view non-deleted teams" ON public.teams;

CREATE POLICY "Admins can create teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update teams" 
ON public.teams 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete teams" 
ON public.teams 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "All users can view teams" 
ON public.teams 
FOR SELECT 
USING (deleted_at IS NULL);

-- Add team assignment tracking (junction table for users and teams)
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage team members" 
ON public.team_members 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view team members" 
ON public.team_members 
FOR SELECT 
USING (true);