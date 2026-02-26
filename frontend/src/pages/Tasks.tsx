import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { CheckSquare, Plus, Trash2, Loader2, DollarSign } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Tasks() {
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO', projectId: '' });
    const [searchTitle, setSearchTitle] = useState('');

    // Store task expenses
    const [taskExpenses, setTaskExpenses] = useState<{ [key: number]: number }>({});

    // Check for query parameters routed from Projects cards
    const location = useLocation();

    useEffect(() => {
        const fetchInit = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const projectedIdFromUrl = queryParams.get('projectId');

                const res = await api.get('/projects');
                setProjects(res.data);

                if (projectedIdFromUrl && res.data.find((p: any) => p.id.toString() === projectedIdFromUrl)) {
                    setSelectedProjectId(projectedIdFromUrl);
                } else if (res.data.length > 0) {
                    setSelectedProjectId(res.data[0].id.toString());
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to connect to API");
            } finally {
                setLoading(false);
            }
        };
        fetchInit();
    }, []);

    useEffect(() => {
        if (!selectedProjectId) return;
        const fetchTasks = async () => {
            try {
                const res = await api.get(`/tasks?projectId=${selectedProjectId}`);
                setTasks(res.data);
                fetchTaskExpenses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, [selectedProjectId]);

    const fetchTaskExpenses = async (tasksList: any[]) => {
        const expensesObj: { [key: number]: number } = {};
        for (const task of tasksList) {
            try {
                const res = await api.get(`/expenses/task/${task.id}/total`);
                expensesObj[task.id] = res.data;
            } catch (e) {
                expensesObj[task.id] = 0;
            }
        }
        setTaskExpenses(expensesObj);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { ...newTask, projectId: selectedProjectId });
            setNewTask({ title: '', description: '', status: 'TODO', projectId: '' });
            setIsCreating(false);
            // Refresh tasks
            const res = await api.get(`/tasks?projectId=${selectedProjectId}`);
            setTasks(res.data);
            fetchTaskExpenses(res.data);
            toast.success("Task created successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to create task");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this task? All linked expenses will also be removed.")) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
            toast.success("Task deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete task");
        }
    };

    const updateStatus = async (task: any, newStatus: string) => {
        try {
            await api.put(`/tasks/${task.id}`, {
                title: task.title,
                description: task.description,
                status: newStatus,
                projectId: task.project?.id || selectedProjectId
            });
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
            toast.success("Status updated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const statusColors: any = {
        'TODO': 'bg-amber-500/20 text-amber-400 border-amber-500/50',
        'IN_PROGRESS': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        'DONE': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tasks</h1>
                    <p className="text-slate-400 mt-1">Manage project items and track costs.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                    />
                    <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {projects.length === 0 && <option value="">No Projects Available</option>}
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        disabled={!selectedProjectId}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">New Task</span>
                    </button>
                </div>
            </div>

            {isCreating && (
                <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <h3 className="text-lg font-semibold text-white mb-4">Create New Task</h3>
                    <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Task Title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">Save</button>
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {selectedProjectId ? (
                <div className="grid grid-cols-1 gap-4">
                    {tasks.filter(t => t.title.toLowerCase().includes(searchTitle.toLowerCase())).map((task) => (
                        <div key={task.id} className="glass-card p-5 border-l-2 hover:border-blue-500 transition-colors flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 min-w-0 w-full">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-white truncate">{task.title}</h3>
                                    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColors[task.status])}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-slate-400 truncate w-full">{task.description}</p>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-700 md:border-none">
                                <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 mr-auto md:mr-4">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-semibold">{taskExpenses[task.id] || 0}</span>
                                </div>

                                <select
                                    value={task.status}
                                    onChange={(e) => updateStatus(task, e.target.value)}
                                    className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-sm text-slate-200 outline-none focus:border-blue-500"
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>

                                <button onClick={() => handleDelete(task.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && !isCreating && (
                        <div className="text-center py-12 glass-card animate-in fade-in">
                            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-300">No Tasks Yet</h3>
                            <p className="text-slate-500 mt-2">Create a task in this project to see it here.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 glass-card">
                    <h3 className="text-xl font-semibold text-slate-300">Create a Project First</h3>
                    <p className="text-slate-500 mt-2">You need a project to create tasks.</p>
                </div>
            )}
        </div>
    );
}
