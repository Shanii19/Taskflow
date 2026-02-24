import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateTaskWithAI } from '@/lib/groq';
import { storage } from '@/lib/storage';

interface CreateTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateTaskModal({ open, onOpenChange, onSuccess }: CreateTaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo' as 'todo' | 'in_progress' | 'done',
        priority: 'medium' as 'low' | 'medium' | 'high',
        due_date: '',
    });

    // ── AI generation ────────────────────────────────────────────
    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim()) {
            toast.error('Please describe what you want to do first');
            return;
        }
        setAiLoading(true);
        try {
            const suggestion = await generateTaskWithAI(aiPrompt.trim());
            setFormData((prev) => ({
                ...prev,
                title: suggestion.title,
                description: suggestion.description,
                priority: suggestion.priority,
            }));
            toast.success('AI generated task details!');
        } catch (error: any) {
            console.error('Groq error:', error);
            toast.error('AI generation failed. Check your Groq API key.');
        } finally {
            setAiLoading(false);
        }
    };

    // ── Submit ───────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.error('Task title is required'); return; }

        setLoading(true);
        try {
            storage.addTask({
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                status: formData.status,
                priority: formData.priority,
                due_date: formData.due_date || null,
            });

            toast.success('Task created successfully!');
            setFormData({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' });
            setAiPrompt('');
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Create New Task
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details manually — or describe your task and let AI do it for you.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">

                        {/* ── AI Prompt Section ─────────────────────────── */}
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
                            <Label className="text-xs font-semibold text-primary flex items-center gap-1">
                                <Wand2 className="h-3 w-3" />
                                ✨ Generate with AI (Groq)
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder='e.g. "Fix the login page bug causing crashes on mobile"'
                                    disabled={aiLoading || loading}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGenerateWithAI())}
                                    className="text-sm"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleGenerateWithAI}
                                    disabled={aiLoading || loading}
                                    className="shrink-0 gap-1"
                                >
                                    {aiLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-4 w-4" />
                                    )}
                                    {aiLoading ? 'Generating…' : 'Generate'}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Describe the task in plain language — AI will fill the title, description and priority.
                            </p>
                        </div>

                        {/* ── Title ─────────────────────────────────────── */}
                        <div className="space-y-2">
                            <Label htmlFor="task-title">Task Title *</Label>
                            <Input
                                id="task-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter task title"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* ── Description ───────────────────────────────── */}
                        <div className="space-y-2">
                            <Label htmlFor="task-desc">Description</Label>
                            <Textarea
                                id="task-desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the task…"
                                disabled={loading}
                                rows={3}
                            />
                        </div>

                        {/* ── Removed Project Dropdown ───────────────────────────────────── */}

                        <div className="grid grid-cols-2 gap-4">
                            {/* ── Status ──────────────────────────────────── */}
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v: 'todo' | 'in_progress' | 'done') => setFormData({ ...formData, status: v })}
                                    disabled={loading}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* ── Priority ────────────────────────────────── */}
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(v: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: v })}
                                    disabled={loading}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* ── Due Date ──────────────────────────────────── */}
                        <div className="space-y-2">
                            <Label htmlFor="task-due">Due Date</Label>
                            <Input
                                id="task-due"
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || aiLoading}>
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</>
                            ) : (
                                'Create Task'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
