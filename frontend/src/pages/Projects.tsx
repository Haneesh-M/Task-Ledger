import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { FolderKanban, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Projects() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/projects', newProject);
            toast.success(res.data.message || "Project created successfully!");
            setNewProject({ name: '', description: '' });
            setIsCreating(false);
            fetchProjects();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create project");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this project? All associated tasks and expenses will be permanently removed.")) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-slate-400 mt-1">Manage your workspaces and groupings.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Project</span>
                </button>
            </div>

            {isCreating && (
                <div className="glass-card p-6 border-l-4 border-l-blue-500 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Create New Project</h3>
                    <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Project Name"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Description (Optional)"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">
                                Save Project
                            </button>
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => navigate(`/tasks?projectId=${project.id}`)}
                        className="glass-card p-6 flex flex-col group hover:border-blue-500/50 hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors pointer-events-none" />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                                <FolderKanban className="w-6 h-6" />
                            </div>
                            {user?.role === 'ADMIN' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(project.id);
                                    }}
                                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-slate-800"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">{project.name}</h3>
                        <p className="text-slate-400 flex-1 relative z-10 limit-lines-2">{project.description || "No description provided."}</p>

                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                            View Tasks <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                ))}
                {projects.length === 0 && !isCreating && (
                    <div className="col-span-full text-center py-12 glass-card animate-in fade-in">
                        <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300">No Projects Found</h3>
                        <p className="text-slate-500 mt-2">Create your first project to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
