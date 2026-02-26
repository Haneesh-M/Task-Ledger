import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            toast.success("Reset link sent to your email");
            setSuccess(true);
            // In a real app we wouldn't show the token, but for testing we show the backend response
            toast(response.data.message, { duration: 10000 });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to process request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="glass-card w-full max-w-md p-8 relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-700/50">
                <Link to="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-blue-400 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to login
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Forgot Password
                    </h2>
                    <p className="text-slate-400 mt-2">Enter your email and we'll send you a reset link.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-400 text-sm">{error}</span>
                    </div>
                )}

                {success ? (
                    <div className="text-center bg-blue-500/10 border border-blue-500/50 rounded-xl p-6">
                        <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">Check your email</h3>
                        <p className="text-slate-400 mb-6">We've sent a password reset link to <span className="text-slate-200">{email}</span></p>
                        <Link to="/reset-password" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Enter reset token manually
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
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

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
