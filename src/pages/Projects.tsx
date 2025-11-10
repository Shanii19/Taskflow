import { motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FolderKanban className="h-8 w-8 text-primary" />
          Projects
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your team projects and tasks
        </p>
      </div>

      <div className="flex items-center justify-center h-96 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">Projects view coming soon...</p>
      </div>
    </motion.div>
  );
}
