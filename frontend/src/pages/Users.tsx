import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Users as UsersIcon, Loader2, Ban, Unlock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Users() {
    const { user } = useAuth();
    const [usersList, setUsersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsersList(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'ADMIN') {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleToggleBlock = async (id: number, currentBlockStatus: boolean) => {
        try {
            await api.put(`/users/${id}/block`);
            setUsersList((prev) =>
                prev.map((u) => u.id === id ? { ...u, blocked: !currentBlockStatus } : u)
            );
            toast.success(`User successfully ${currentBlockStatus ? 'unblocked' : 'blocked'}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update user status");
        }
    };

    if (user && user.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

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
                    <h1 className="text-3xl font-bold text-white">System Users</h1>
                    <p className="text-slate-400 mt-1">
                        {usersList.length} registered {usersList.length === 1 ? 'user' : 'users'} in the system.
                    </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 ring-1 ring-purple-500/20">
                    <Shield className="w-6 h-6" />
                </div>
            </div>

            {/* Desktop Table */}
            <div className="glass-card overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 bg-slate-800/30">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {usersList.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-800/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar with initial */}
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${u.id === user?.id
                                                    ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30'
                                                    : 'bg-slate-700 text-slate-300'
                                                }`}>
                                                {u.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white flex items-center gap-1.5">
                                                    {u.name}
                                                    {u.id === user?.id && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">You</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-slate-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${u.role === 'ADMIN'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {u.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.blocked ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                <Ban className="w-3 h-3" /> Blocked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <Unlock className="w-3 h-3" /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Fixed bug: u.id and user?.id are both numbers — no toString() needed */}
                                        {u.id !== user?.id && (
                                            <button
                                                onClick={() => handleToggleBlock(u.id, u.blocked)}
                                                className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${u.blocked
                                                        ? 'text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300'
                                                        : 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
                                                    }`}
                                                title={u.blocked ? "Unblock User" : "Block User"}
                                            >
                                                {u.blocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {usersList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                                        <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No users found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
                {usersList.map((u) => (
                    <div key={u.id} className="glass-card p-4 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${u.id === user?.id
                                ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                            {u.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-white truncate">{u.name}</p>
                                {u.id === user?.id && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full shrink-0">You</span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>{u.role}</span>
                                {u.blocked ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                        <Ban className="w-2.5 h-2.5" /> Blocked
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <Unlock className="w-2.5 h-2.5" /> Active
                                    </span>
                                )}
                            </div>
                        </div>
                        {u.id !== user?.id && (
                            <button
                                onClick={() => handleToggleBlock(u.id, u.blocked)}
                                className={`p-2 rounded-lg transition-colors shrink-0 ${u.blocked ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-red-400 hover:bg-red-500/20'
                                    }`}
                                title={u.blocked ? "Unblock User" : "Block User"}
                            >
                                {u.blocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                ))}
                {usersList.length === 0 && (
                    <div className="glass-card p-12 text-center text-slate-500">
                        <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
