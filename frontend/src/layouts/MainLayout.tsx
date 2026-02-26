import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, FolderKanban, CheckSquare, Receipt,
    LogOut, KeyRound, Users, User, ChevronDown, Menu, X, Sun, Moon
} from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

    // Close sidebar when navigating on mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Expenses', path: '/expenses', icon: Receipt },
        ...(user?.role === 'ADMIN' ? [{ name: 'Users', path: '/users', icon: Users }] : []),
    ];

    const getCurrentPageTitle = () => {
        const item = navItems.find(i => location.pathname.startsWith(i.path));
        if (item) return item.name;
        if (location.pathname.startsWith('/profile')) return 'Profile Settings';
        if (location.pathname.startsWith('/change-password')) return 'Security Settings';
        return 'Overview';
    };

    return (
        <div className="min-h-screen bg-slate-900 flex overflow-hidden relative">
            {/* Global Background Orbs */}
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
                {/* Sidebar Header */}
                <div className="p-5 flex items-center justify-between border-b border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/profile"
                            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform cursor-pointer shrink-0"
                        >
                            <span className="text-white font-bold text-xl uppercase">{user?.name?.charAt(0) || 'T'}</span>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link to="/dashboard" className="hover:text-blue-400 transition-colors block">
                                <h1 className="text-base font-bold leading-tight truncate">Task Ledger</h1>
                            </Link>
                            <p className="text-xs text-slate-400 truncate">{user?.name || 'User'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3 mt-1">Navigation</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-blue-500/10 text-blue-400"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full shadow-[0_0_8px_rgba(96,165,250,0.7)]" />
                                )}
                                <Icon className={clsx("w-5 h-5 shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                <span className="font-medium text-sm">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-slate-700/30 space-y-1">
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all group"
                    >
                        <User className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                        <span className="font-medium text-sm">Account</span>
                    </Link>
                    <Link
                        to="/change-password"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all group"
                    >
                        <KeyRound className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                        <span className="font-medium text-sm">Security</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 flex flex-col w-full min-w-0">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-30 flex flex-col">
                    {/* Rainbow gradient accent line at very top */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 shrink-0" />

                    {/* Main header bar */}
                    <div
                        className="glass border-b flex items-center justify-between px-4 sm:px-6 gap-4"
                        style={{
                            height: '3.75rem',
                            borderColor: 'var(--border-subtle)',
                            boxShadow: 'var(--shadow-glass)',
                        }}
                    >
                        {/* LEFT — hamburger + breadcrumb */}
                        <div className="flex items-center gap-2.5 min-w-0">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors shrink-0"
                                aria-label="Open sidebar"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Breadcrumb */}
                            <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
                                <span className="text-slate-500 font-medium shrink-0">Task Ledger</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-600 -rotate-90 shrink-0" />
                                <span
                                    className="font-semibold truncate"
                                    style={{ color: 'var(--text-accent)' }}
                                >
                                    {getCurrentPageTitle()}
                                </span>
                            </div>
                            {/* Mobile — just page title */}
                            <h2 className="sm:hidden text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                {getCurrentPageTitle()}
                            </h2>
                        </div>

                        {/* RIGHT — actions */}
                        <div className="relative flex items-center gap-2 shrink-0">

                            {/* Theme toggle pill */}
                            <button
                                onClick={() => setIsLightMode(!isLightMode)}
                                title="Toggle Theme"
                                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 focus:outline-none"
                                style={{
                                    background: isLightMode
                                        ? 'rgba(99,102,241,0.12)'
                                        : 'rgba(251,191,36,0.10)',
                                    border: isLightMode
                                        ? '1px solid rgba(99,102,241,0.25)'
                                        : '1px solid rgba(251,191,36,0.20)',
                                    boxShadow: isLightMode
                                        ? '0 0 14px rgba(99,102,241,0.15)'
                                        : '0 0 14px rgba(251,191,36,0.10)',
                                }}
                            >
                                {isLightMode
                                    ? <Moon className="w-4 h-4 text-indigo-400" />
                                    : <Sun className="w-4 h-4 text-amber-400" />
                                }
                            </button>

                            {/* Divider */}
                            <div className="w-px h-6 bg-slate-700/50 hidden sm:block" />

                            {/* User chip — pill shaped */}
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl transition-all duration-200 group shrink-0"
                                style={{
                                    background: 'var(--bg-muted)',
                                    border: '1px solid var(--border-default)',
                                    boxShadow: dropdownOpen ? '0 0 0 2px rgba(59,130,246,0.25)' : 'none',
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center uppercase font-bold text-white text-sm shrink-0 shadow-md"
                                    style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                        boxShadow: '0 2px 10px rgba(59,130,246,0.35)',
                                    }}
                                >
                                    {user?.name?.charAt(0) || 'U'}
                                </div>

                                {/* Name + role (hidden on mobile) */}
                                <div className="hidden sm:block text-left leading-tight">
                                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {user?.name?.split(' ')[0]}
                                    </p>
                                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                        {user?.role}
                                    </p>
                                </div>

                                <ChevronDown
                                    className={clsx(
                                        'w-4 h-4 transition-transform duration-200',
                                        dropdownOpen ? 'rotate-180' : ''
                                    )}
                                    style={{ color: 'var(--text-muted)' }}
                                />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <>
                                    {/* Backdrop — bg prevents page content bleeding through */}
                                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={() => setDropdownOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-60 z-60 overflow-hidden rounded-2xl border border-slate-600/60 shadow-2xl shadow-black/60"
                                        style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.98) 0%, rgba(15,23,42,0.98) 100%)', backdropFilter: 'blur(20px)', zIndex: 60 }}
                                    >
                                        {/* User info header */}
                                        <div className="px-4 py-3.5 border-b border-slate-700/60">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-lg">
                                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                                    <span className="inline-flex items-center mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                                                        {user?.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="p-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/8 rounded-xl transition-all duration-150 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                                    <User className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-medium leading-tight">Account Profile</p>
                                                    <p className="text-[11px] text-slate-500">Manage your info</p>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/change-password"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/8 rounded-xl transition-all duration-150 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                                    <KeyRound className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-medium leading-tight">Security Settings</p>
                                                    <p className="text-[11px] text-slate-500">Change password</p>
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Sign out */}
                                        <div className="p-2 border-t border-slate-700/60">
                                            <button
                                                onClick={() => { setDropdownOpen(false); logout(); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-150 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                                    <LogOut className="w-4 h-4 text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium leading-tight">Sign Out</p>
                                                    <p className="text-[11px] text-red-500/70">End your session</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>{/* end main header bar */}
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-full pb-20">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
