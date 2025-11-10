import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus,
  TrendingUp,
  Users,
  FolderKanban
} from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    totalTeams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .is('deleted_at', null);

      if (tasksError) throw tasksError;

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .is('deleted_at', null);

      if (projectsError) throw projectsError;

      // Fetch teams
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .is('deleted_at', null);

      if (teamsError) throw teamsError;

      const now = new Date();
      const completed = tasks?.filter(t => t.status === 'done').length || 0;
      const inProgress = tasks?.filter(t => t.status === 'in_progress').length || 0;
      const overdue = tasks?.filter(t => {
        if (!t.due_date || t.status === 'done') return false;
        return new Date(t.due_date) < now;
      }).length || 0;

      setStats({
        totalTasks: tasks?.length || 0,
        completedTasks: completed,
        inProgressTasks: inProgress,
        overdueTasks: overdue,
        totalProjects: projects?.length || 0,
        totalTeams: teams?.length || 0,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const overviewCards = [
    {
      title: 'Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-secondary',
    },
    {
      title: 'Teams',
      value: stats.totalTeams,
      icon: Users,
      color: 'text-accent',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your tasks and projects.
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className="task-card-hover border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overview Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {overviewCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">
                  {loading ? '...' : card.value}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total active {card.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Team
              </Button>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Invite Members
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
