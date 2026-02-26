import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Users as UsersIcon, Loader2 } from 'lucide-react';
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

        fetchUsers();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">System Users</h1>
                <p className="text-slate-400 mt-1">View all registered users.</p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 bg-slate-800/30">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Role</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {usersList.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{u.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))}
                            {usersList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No users found.</p>
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
