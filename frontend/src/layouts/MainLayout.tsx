import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Receipt, LogOut, KeyRound, Users } from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Expenses', path: '/expenses', icon: Receipt },
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Security', path: '/change-password', icon: KeyRound },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-64 glass border-r border-slate-700/50 flex flex-col relative z-20">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-100 leading-tight">ProSystem</h1>
                            <p className="text-xs text-slate-400">Intelligence</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(item.path);

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-blue-500/10 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                    )}
                                    <Icon className={clsx("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6">
                    <div className="glass-card mb-4 p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center uppercase font-bold text-slate-300 ring-2 ring-slate-600">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 overflow-y-auto w-full">
                <div className="p-8 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
