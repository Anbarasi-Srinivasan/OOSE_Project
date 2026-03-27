import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const isAdminAttempt = role === 'admin' || email.toLowerCase().endsWith('@admin.admin');
        
        // Validation logic
        if (isAdminAttempt && !email.toLowerCase().endsWith('@admin.admin')) {
            return setError('Admin access requires a @admin.admin email.');
        }

        setLoading(true);
        try {
            const userData = await login(email, password);
            if (userData) {
                if (userData.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials or role mismatch.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-md w-full space-y-12 bg-white/5 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl border border-white/10 animate-slide-up">
                <div className="text-center">
                    <h2 className="text-4xl font-serif font-black text-white">Access Bookflix</h2>
                    <p className="mt-4 text-sm text-slate-500 uppercase tracking-[0.3em] font-bold">Secure Gateway</p>
                </div>

                {/* Role Selector */}
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setRole('user')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${role === 'user' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        User Login
                    </button>
                    <button 
                        onClick={() => setRole('admin')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${role === 'admin' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Admin Portal
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 text-center uppercase tracking-widest animate-pulse">
                        {error}
                    </div>
                )}

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-6 text-left">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block text-primary-400/70">Identity</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium placeholder-slate-700"
                                placeholder={role === 'admin' ? "name@admin.admin" : "academic@email.com"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block text-primary-400/70">Credentials</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium placeholder-slate-700 pr-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 text-lg font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 group"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Authenticating...
                            </span>
                        ) : (
                            <>
                                {role === 'admin' ? 'Admin Access' : 'Sign In Now'}
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-8 border-t border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        New Researcher? {' '}
                        <Link to="/register" className="text-primary-400 hover:text-white transition-colors border-b border-primary-500/30">Apply for Access</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
