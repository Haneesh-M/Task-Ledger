import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Receipt, Plus, Trash2, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

export default function Expenses() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [newExpense, setNewExpense] = useState({
        amount: '',
        type: 'EXPENSE',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        taskId: ''
    });

    // For the form dropdowns
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const fetchData = async () => {
        try {
            const [expRes, projRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/projects')
            ]);
            setExpenses(expRes.data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setProjects(projRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch tasks when a project is selected inside the creation form
    useEffect(() => {
        if (!selectedProjectId) {
            setTasks([]);
            setNewExpense(prev => ({ ...prev, taskId: '' }));
            return;
        }
        const fetchTasks = async () => {
            try {
                const res = await api.get(`/tasks?projectId=${selectedProjectId}`);
                setTasks(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, [selectedProjectId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                amount: parseFloat(newExpense.amount),
                type: newExpense.type,
                category: newExpense.category,
                date: newExpense.date,
                description: newExpense.description
            };

            if (newExpense.taskId) {
                payload.taskId = parseInt(newExpense.taskId, 10);
            }

            await api.post('/expenses', payload);

            // Reset form
            setNewExpense({
                amount: '',
                type: 'EXPENSE',
                category: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                taskId: ''
            });
            setSelectedProjectId('');
            setIsCreating(false);

            // Refresh
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (err) {
            console.error(err);
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
                    <h1 className="text-3xl font-bold text-white">Expenses Ledger</h1>
                    <p className="text-slate-400 mt-1">Track your income and project costs.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Record</span>
                </button>
            </div>

            {isCreating && (
                <div className="glass-card p-6 border-l-4 border-l-blue-500 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold text-white mb-4">New Financial Record</h3>
                    <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Type</label>
                                <select
                                    value={newExpense.type}
                                    onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Software, Salary, Server..."
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm text-slate-400 mb-1 block">Description</label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Optional details..."
                                />
                            </div>

                            {/* Task Linkage Section */}
                            {newExpense.type === 'EXPENSE' && (
                                <>
                                    <div className="md:col-span-2 pt-4 border-t border-slate-700 mt-2">
                                        <p className="text-sm font-medium text-slate-300 mb-3">Link to Task (Optional)</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                value={selectedProjectId}
                                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 block text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">-- Select Project --</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>

                                            <select
                                                value={newExpense.taskId}
                                                onChange={(e) => setNewExpense({ ...newExpense, taskId: e.target.value })}
                                                disabled={!selectedProjectId}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 block text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                <option value="">-- Select Task --</option>
                                                {tasks.map(t => (
                                                    <option key={t.id} value={t.id}>{t.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors">
                                Save Record
                            </button>
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Ledger Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 bg-slate-800/30">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Type</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Description</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Amount</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {expenses.map((expense) => {
                                const isIncome = expense.type === 'INCOME';
                                return (
                                    <tr key={expense.id} className="hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                                            {expense.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                                isIncome
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {isIncome ? 'Income' : 'Expense'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-200">
                                            {expense.category}
                                            {expense.task && (
                                                <div className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                                                    <Receipt className="w-3 h-3" />
                                                    Linked: {expense.task.title}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 max-w-[200px] truncate">
                                            {expense.description || '-'}
                                        </td>
                                        <td className={clsx(
                                            "px-6 py-4 text-sm font-semibold text-right whitespace-nowrap",
                                            isIncome ? "text-emerald-400" : "text-white"
                                        )}>
                                            {isIncome ? '+' : '-'}${expense.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No financial records found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
