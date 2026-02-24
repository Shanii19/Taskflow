export interface Task {
    id: string;
    project_id: string; // Keep this just for compatibility, use 'local' 
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    created_at: string;
    deleted_at: string | null;
}

const STORAGE_KEY = 'taskflow_tasks';

const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);


export const storage = {
    getTasks: (): Task[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    setTasks: (tasks: Task[]): void => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    },

    addTask: (taskData: Omit<Task, 'id' | 'created_at' | 'deleted_at' | 'project_id'>): Task => {
        const tasks = storage.getTasks();
        const newTask: Task = {
            ...taskData,
            id: generateId(),
            project_id: 'local',
            created_at: new Date().toISOString(),
            deleted_at: null,
        };
        tasks.push(newTask);
        storage.setTasks(tasks);
        return newTask;
    },

    updateTask: (id: string, updates: Partial<Task>): Task | null => {
        const tasks = storage.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) return null;

        const updatedTask = { ...tasks[index], ...updates };
        tasks[index] = updatedTask;
        storage.setTasks(tasks);
        return updatedTask;
    },

    deleteTask: (id: string): void => {
        const tasks = storage.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index].deleted_at = new Date().toISOString();
            storage.setTasks(tasks);
        }
    },

    getActiveTasks: (): Task[] => {
        return storage.getTasks().filter(t => !t.deleted_at);
    }
};
