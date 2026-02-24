import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckSquare,
    Plus,
    Trash2,
    Calendar,
    AlertCircle,
    Clock,
    CheckCircle2,
    ListTodo,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { storage, Task } from '@/lib/storage';

// ─── Status helpers ───────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    todo: { label: 'To Do', color: 'bg-muted text-muted-foreground', icon: ListTodo },
    in_progress: { label: 'In Progress', color: 'bg-primary text-primary-foreground', icon: Clock },
    done: { label: 'Done', color: 'bg-success text-success-foreground', icon: CheckCircle2 },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
    low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
    medium: { label: 'Medium', color: 'bg-warning text-warning-foreground' },
    high: { label: 'High', color: 'bg-destructive text-destructive-foreground' },
};

// ─── Component ────────────────────────────────────────────────────

export default function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = storage.getActiveTasks().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setTasks(data);
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            storage.deleteTask(taskId);
            toast.success('Task deleted successfully');
            setDeleteTaskId(null);
            fetchTasks();
        } catch (error: any) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    const filteredTasks =
        filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

    const isOverdue = (task: Task) =>
        task.due_date && task.status !== 'done' && new Date(task.due_date) < new Date();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <CheckSquare className="h-8 w-8 text-primary" />
                        Tasks
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and track all your tasks
                    </p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'todo', 'in_progress', 'done'] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(f)}
                        className="capitalize transition-all duration-200 hover:scale-105"
                    >
                        {f === 'all' ? `All (${tasks.length})` : f === 'todo' ? `To Do (${tasks.filter(t => t.status === 'todo').length})` : f === 'in_progress' ? `In Progress (${tasks.filter(t => t.status === 'in_progress').length})` : `Done (${tasks.filter(t => t.status === 'done').length})`}
                    </Button>
                ))}
            </div>

            {/* Tasks Grid */}
            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-5 bg-muted rounded w-3/4" />
                                <div className="h-4 bg-muted rounded w-full mt-2" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-4 bg-muted rounded w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredTasks.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <CheckSquare className="h-14 w-14 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center text-lg font-medium">
                            {filter === 'all' ? 'No tasks yet.' : `No ${filter.replace('_', ' ')} tasks.`}
                        </p>
                        <p className="text-muted-foreground text-sm mt-1 text-center">
                            Click "Add Task" to create your first task.
                        </p>
                        <Button onClick={() => setShowCreateModal(true)} className="mt-5 gap-2">
                            <Plus className="h-4 w-4" />
                            Add Task
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map((task, index) => {
                        const status = statusConfig[task.status] ?? statusConfig['todo'];
                        const priority = priorityConfig[task.priority] ?? priorityConfig['medium'];
                        const StatusIcon = status.icon;
                        const overdue = isOverdue(task);

                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <Card
                                    className={`task-card-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${overdue ? 'border-destructive/50' : 'border-border/50'
                                        }`}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <Badge className={`${status.color} text-xs flex items-center gap-1`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {status.label}
                                                    </Badge>
                                                    <Badge className={`${priority.color} text-xs`}>
                                                        {priority.label}
                                                    </Badge>
                                                    {overdue && (
                                                        <Badge className="bg-destructive text-destructive-foreground text-xs flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="text-base leading-tight line-clamp-2">
                                                    {task.title}
                                                </CardTitle>
                                                {task.description && (
                                                    <CardDescription className="mt-1 line-clamp-2 text-xs">
                                                        {task.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110 shrink-0"
                                                onClick={() => setDeleteTaskId(task.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-2 pt-0">
                                        {/* Due date */}
                                        {task.due_date && (
                                            <div
                                                className={`flex items-center gap-2 text-xs ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                <Calendar className="h-3 w-3" />
                                                <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                                            </div>
                                        )}
                                        {/* Created at */}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>Created {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            <CreateTaskModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onSuccess={fetchTasks}
            />

            {/* Delete Confirm Dialog */}
            <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteTaskId && handleDeleteTask(deleteTaskId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}
