import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Edit2, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectDetailsModalProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProjectDetailsModal({ project, open, onOpenChange, onSuccess }: ProjectDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending',
    progress: 0,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'pending',
        progress: project.progress || 0,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status,
          progress: formData.progress,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast.success('Project updated successfully');
      setIsEditing(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'on_hold':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted';
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] animate-scale-in">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Project Details</DialogTitle>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="transition-all duration-200 hover:scale-110"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="transition-all duration-200 hover:scale-110"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                disabled={loading}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            ) : (
              <p className="text-lg font-semibold text-foreground">{formData.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                disabled={loading}
                rows={4}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            ) : (
              <p className="text-muted-foreground">
                {formData.description || 'No description provided'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="transition-all duration-200 hover:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusColor(formData.status)}>
                  {formData.status.replace('_', ' ')}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
              {isEditing ? (
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })
                  }
                  disabled={loading}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              ) : (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${formData.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Team</Label>
              <p className="text-sm font-medium">{project.teams?.name || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Created By</Label>
              <p className="text-sm font-medium">{project.profiles?.full_name || 'Unknown'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Created At</Label>
              <p className="text-sm">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Last Updated</Label>
              <p className="text-sm">
                {new Date(project.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {isEditing && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="transition-all duration-200 hover:scale-105"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 transition-all duration-200 hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
