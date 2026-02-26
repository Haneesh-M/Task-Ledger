import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { CheckSquare, Square, TrendingUp, TrendingDown, Loader2, Clock, Activity, Calendar } from 'lucide-react';

const formatDateToday = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export default function Dashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsData = await api.get('/projects');
                const [tasksRes, expensesRes, summaryRes, activitiesRes] = await Promise.all([
                    Promise.all(projectsData.data.map((p: any) => api.get(`/tasks?projectId=${p.id}`))),
                    api.get('/expenses'),
                    api.get('/expenses/monthly-summary'),
                    api.get('/activities')
                ]);

                // Flatten tasks if fetched by project
                const allTasks = tasksRes.flatMap((res: any) => res.data);
                setProjects(projectsData.data);
                setTasks(allTasks);
                setExpenses(expensesRes.data);
                setSummary(summaryRes.data);
                setActivities(activitiesRes.data || []);
            } catch (err) {
                // Ignore API load errors smoothly
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    // Task Calculations
    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todoTasks = tasks.filter(t => t.status === 'TODO').length;

    const pieData = [
        { name: 'Completed', value: completedTasks, color: '#10b981' }, // green
        { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' }, // blue
        { name: 'To Do', value: todoTasks, color: '#f59e0b' } // amber
    ].filter(d => d.value > 0);

    // Fallback if no tasks
    if (pieData.length === 0) {
        pieData.push({ name: 'No Tasks', value: 1, color: '#475569' });
    }

    // Analytics: Most Active Project calculation
    const projectTaskCounts = tasks.reduce((acc, t) => {
        if (t.project?.id) {
            acc[t.project.id] = (acc[t.project.id] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);

    let mostActiveProjectId: number | null = null;
    let maxTasks = 0;
    Object.entries(projectTaskCounts).forEach(([id, count]) => {
        const numCount = count as number;
        if (numCount > maxTasks) {
            maxTasks = numCount;
            mostActiveProjectId = parseInt(id);
        }
    });

    const mostActiveProject = projects.find(p => p.id === mostActiveProjectId);

    // Analytics: Top Costly Tasks
    const taskExpenseMap = expenses.reduce((acc, e) => {
        if (e.type === 'EXPENSE' && e.taskId) {
            acc[e.taskId] = (acc[e.taskId] || 0) + e.amount;
        }
        return acc;
    }, {} as Record<number, number>);

    const costlyTasks = Object.entries(taskExpenseMap)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([id, amount]) => {
            const numAmount = amount as number;
            const task = tasks.find(t => t.id === parseInt(id));
            return {
                id: parseInt(id),
                title: task ? task.title : `Task #${id}`,
                amount: numAmount
            };
        });

    // Financial Calculations
    const incomeVsExpenseData = [
        { name: 'Income', amount: summary?.totalIncome || 0, fill: '#10b981' },
        { name: 'Expense', amount: summary?.totalExpense || 0, fill: '#ef4444' }
    ];

    // Map expenses to chart data (simple monthly breakdown mock if needed, or recent expenses)
    const recentExpenses = expenses.slice(-5).map(e => ({
        name: e.date.substring(5, 10), // MM-DD
        amount: e.type === 'EXPENSE' ? e.amount : 0
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-slate-400 mt-1">Here is your productivity and financial overview.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/70 border border-slate-700/50 rounded-xl text-slate-400 text-sm shrink-0 self-start sm:self-auto">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{formatDateToday()}</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 border-l-4 border-l-blue-500 hover:shadow-blue-500/10 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{tasks.length}</h3>
                            <p className="text-xs text-slate-500 mt-1">{projects.length} active projects</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                            <Square className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5 border-l-4 border-l-emerald-500 hover:shadow-emerald-500/10 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{completedTasks}</h3>
                            <p className="text-xs text-slate-500 mt-1">{tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% completion rate</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                            <CheckSquare className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5 border-l-4 border-l-green-400 hover:shadow-green-500/10 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Income</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                ${(summary?.totalIncome || 0).toLocaleString()}
                            </h3>
                            <p className="text-xs text-emerald-500 mt-1">↑ Current month</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5 border-l-4 border-l-red-500 hover:shadow-red-500/10 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Expense</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                ${(summary?.totalExpense || 0).toLocaleString()}
                            </h3>
                            <p className="text-xs text-red-400 mt-1">↓ Current month</p>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-400 group-hover:scale-110 transition-transform">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Status */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Task Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Financial Flow */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Income vs Expense</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeVsExpenseData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {incomeVsExpenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Expenses Trend */}
                <div className="glass-card p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={recentExpenses}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Insights & Rankings */}
                <div className="glass-card p-6 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-slate-800/80 to-slate-900 border-none shadow-xl shadow-blue-900/10">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
                            Top 3 Costly Tasks
                        </h3>
                        {costlyTasks.length > 0 ? (
                            <div className="space-y-3">
                                {costlyTasks.map((t, i) => (
                                    <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                                {i + 1}
                                            </div>
                                            <span className="font-medium text-slate-200 truncate max-w-[180px]">{t.title}</span>
                                        </div>
                                        <span className="text-red-400 font-semibold mt-1 sm:mt-0">${t.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-slate-500 text-sm mt-4 italic bg-slate-800/30 p-4 rounded-xl text-center border border-dashed border-slate-700">No task expenses logged yet.</div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg"><CheckSquare className="w-4 h-4" /></span>
                            Most Active Project
                        </h3>
                        {mostActiveProject ? (
                            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 border-l-4 border-l-blue-500 h-[calc(100%-3rem)] flex flex-col justify-center">
                                <h4 className="text-xl font-bold text-white mb-1">{mostActiveProject.name}</h4>
                                <p className="text-slate-400 text-sm mb-3 limit-lines-2">{mostActiveProject.description}</p>
                                <div className="mt-auto">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                                        <Square className="w-3 h-3" />
                                        {maxTasks} Tasks Associated
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500 text-sm mt-4 italic bg-slate-800/30 p-4 rounded-xl text-center border border-dashed border-slate-700 h-[calc(100%-3rem)] flex items-center justify-center">Not enough data to determine.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="glass-card p-6 border-none shadow-xl mt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg"><Activity className="w-4 h-4" /></span>
                    Recent Activity
                </h3>
                {activities.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {activities.map((act) => (
                            <div key={act.id} className="flex gap-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                        {act.userName?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-200">{act.message}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(act.timestamp).toLocaleString()}</span>
                                        <span className="mx-1">•</span>
                                        <span>{act.userName}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm mt-4 italic bg-slate-800/30 p-8 rounded-xl text-center border border-dashed border-slate-700">No recent activity found.</div>
                )}
            </div>
        </div>
    );
}
