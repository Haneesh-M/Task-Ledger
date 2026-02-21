import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { CheckSquare, Square, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, expensesRes, summaryRes] = await Promise.all([
                    api.get('/projects').then(res => Promise.all(res.data.map((p: any) => api.get(`/tasks?projectId=${p.id}`)))), // For simplicity, we might just need an endpoint to get all tasks by user. Assumed projects fetch.
                    api.get('/expenses'),
                    api.get('/expenses/monthly-summary')
                ]);

                // Flatten tasks if fetched by project
                const allTasks = tasksRes.flatMap((res: any) => res.data);
                setTasks(allTasks);
                setExpenses(expensesRes.data);
                setSummary(summaryRes.data);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Here is your productivity and financial overview.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Tasks</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{tasks.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Square className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Completed Tasks</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{completedTasks}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <CheckSquare className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-emerald-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Monthly Income</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                ${summary?.totalIncome || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Monthly Expense</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                ${summary?.totalExpense || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
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
            </div>
        </div>
    );
}
