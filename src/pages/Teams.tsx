import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function Teams() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Teams
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your teams and team members
        </p>
      </div>

      <div className="flex items-center justify-center h-96 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">Teams view coming soon...</p>
      </div>
    </motion.div>
  );
}
