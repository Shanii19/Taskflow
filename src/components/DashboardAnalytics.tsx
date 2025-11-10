import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

interface DashboardAnalyticsProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    pendingProjects: number;
  };
}

const COLORS = {
  completed: 'hsl(var(--success))',
  inProgress: 'hsl(var(--primary))',
  pending: 'hsl(var(--warning))',
  overdue: 'hsl(var(--destructive))',
};

export function DashboardAnalytics({ stats }: DashboardAnalyticsProps) {
  const taskData = [
    { name: 'Completed', value: stats.completedTasks, color: COLORS.completed },
    { name: 'In Progress', value: stats.inProgressTasks, color: COLORS.inProgress },
    { name: 'Overdue', value: stats.overdueTasks, color: COLORS.overdue },
  ].filter(item => item.value > 0);

  const projectData = [
    { name: 'Completed', value: stats.completedProjects, fill: COLORS.completed },
    { name: 'In Progress', value: stats.inProgressProjects, fill: COLORS.inProgress },
    { name: 'Pending', value: stats.pendingProjects, fill: COLORS.pending },
  ];

  const totalTasks = stats.totalTasks || 1;
  const completionPercentage = Math.round((stats.completedTasks / totalTasks) * 100);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Pie Chart - Task Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Task Completion Status</span>
              <span className="text-sm font-normal text-muted-foreground">
                {completionPercentage}% Complete
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taskData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No task data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Bar Chart - Project Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Project Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalProjects > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No project data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
