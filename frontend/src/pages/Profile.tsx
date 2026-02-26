import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Mocking the update for now until a PUT /api/users/profile endpoint is wired.
        setTimeout(() => {
            toast.success("Profile updated successfully! (Mocked)");
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-slate-400 mt-1">Manage your personal information and preferences.</p>
            </div>

            <div className="glass-card p-8">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-700/50">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-blue-500/20 ring-4 ring-slate-800">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-2">
                            <Shield className="w-3 h-3" />
                            {user?.role}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address (Read Only)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                disabled
                                value={user?.email || ''}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-400 cursor-not-allowed opacity-70"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            {isSaving ? <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" /> : <Save className="w-5 h-5" />}
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
