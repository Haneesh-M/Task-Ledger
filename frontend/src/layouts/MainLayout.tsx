import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Receipt, LogOut, KeyRound, Users, User, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Theme Toggle State
    const [isLightMode, setIsLightMode] = useState(() => {
        return localStorage.getItem('theme') === 'light';
    });

    useEffect(() => {
        if (isLightMode) {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }, [isLightMode]);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Expenses', path: '/expenses', icon: Receipt },
        ...(user?.role === 'ADMIN' ? [{ name: 'Users', path: '/users', icon: Users }] : []),
    ];

    // Helper for top bar title
    const getCurrentPageTitle = () => {
        const item = navItems.find(i => location.pathname.startsWith(i.path));
        if (item) return item.name;
        if (location.pathname.startsWith('/profile')) return 'Profile Settings';
        if (location.pathname.startsWith('/change-password')) return 'Security Settings';
        return 'Overview';
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 flex overflow-hidden relative">
            {/* Global 3D Floating Geometry Background */}
            <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-float-slow mix-blend-screen pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-float-fast mix-blend-screen pointer-events-none" />
            <div className="fixed top-[40%] left-[60%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[90px] animate-float-slow mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static inset-y-0 left-0 w-64 glass border-r border-slate-700/50 flex flex-col z-50 transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/profile" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform cursor-pointer">
                            <span className="text-white font-bold text-xl uppercase">{user?.name?.charAt(0) || 'T'}</span>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link to="/dashboard" className="hover:text-blue-400 transition-colors block">
                                <h1 className="text-lg font-bold leading-tight truncate">Task Ledger</h1>
                            </Link>
                            <p className="text-xs text-slate-400 w-full truncate">{user?.name || 'User'}</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
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
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 flex flex-col w-full min-w-0">
                {/* Top Navigation Bar */}
                <header className="h-16 glass border-b border-slate-700/50 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-white hidden sm:block">{getCurrentPageTitle()}</h2>
                    </div>

                    <div className="relative flex items-center">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={() => setIsLightMode(!isLightMode)}
                            className="p-2 mr-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent shadow-[0_0_10px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            title="Toggle Theme"
                        >
                            {isLightMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                        </button>

                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50"
                        >
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                                <p className="text-xs text-slate-500">{user?.role}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center uppercase font-bold text-slate-300 ring-2 ring-slate-600 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>

                        {/* Topbar Dropdown Profile Menu */}
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 glass-card border border-slate-600 shadow-2xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95">
                                    <div className="p-3 border-b border-slate-700/50 sm:hidden">
                                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                    </div>
                                    <div className="p-1.5">
                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                                        >
                                            <User className="w-4 h-4" /> Account Profile
                                        </Link>
                                        <Link
                                            to="/change-password"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                                        >
                                            <KeyRound className="w-4 h-4" /> Security Settings
                                        </Link>
                                    </div>
                                    <div className="p-1.5 border-t border-slate-700/50">
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Page Content viewport */}
                <div className="flex-1 overflow-y-auto w-full">
                    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-full pb-20">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
