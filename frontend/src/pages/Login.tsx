import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [tiltStyle, setTiltStyle] = useState({});
    const [returningUser, setReturningUser] = useState<{ name: string; email: string } | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Check for returning user in localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.name && parsed?.email) {
                    setReturningUser({ name: parsed.name, email: parsed.email });
                    setEmail(parsed.email);
                }
            }
        } catch {
            // ignore
        }
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = -(e.clientY - top - height / 2) / 25;
        setTiltStyle({ transform: `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)` });
    };

    const handleMouseLeave = () => {
        setTiltStyle({ transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)` });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
            {/* Floating Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-600/30 rounded-full blur-[80px] animate-float-slow mix-blend-screen pointer-events-none" />
            <div className="absolute top-[40%] right-[15%] w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] animate-float-fast mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[10%] left-[30%] w-72 h-72 bg-emerald-500/20 rounded-full blur-[90px] animate-float-slow mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Geometric accents */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-500/20 rounded-xl rotate-45 animate-float-fast pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-purple-500/20 rounded-full animate-float-slow pointer-events-none" style={{ animationDelay: '1s' }} />

            <div
                className="glass-card w-full max-w-md p-8 relative z-10 transition-transform duration-200 ease-out shadow-[0_0_50px_rgba(59,130,246,0.15)] border-t border-l border-white/10"
                style={tiltStyle}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 mb-4 ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <LogIn className="w-8 h-8" />
                    </div>
                    {returningUser ? (
                        <>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Welcome back, {returningUser.name.split(' ')[0]}! 👋
                            </h2>
                            <p className="text-slate-400 mt-2">Great to see you again. Sign in to continue.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Welcome Back
                            </h2>
                            <p className="text-slate-400 mt-2">Sign in to your productivity hub</p>
                        </>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-400 text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <Link to="/forgot-password" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
