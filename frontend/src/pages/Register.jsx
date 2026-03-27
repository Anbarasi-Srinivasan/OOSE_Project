import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const isTargetingAdmin = role === 'admin' || email.toLowerCase().endsWith('@admin.admin');

        // Strong validation for Admin role requirements
        if (isTargetingAdmin && !email.toLowerCase().endsWith('@admin.admin')) {
            return setError('Administrative registration requires a @admin.admin email.');
        }

        setLoading(true);
        try {
            await register(username, email, password, role);
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-md w-full space-y-10 bg-white/5 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl border border-white/10 animate-slide-up">
                <div className="text-center">
                    <h2 className="text-4xl font-serif font-black text-white">Join Bookflix</h2>
                    <p className="mt-4 text-sm text-slate-500 uppercase tracking-[0.3em] font-bold">Account Registration</p>
                </div>

                {/* Role Selector */}
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setRole('user')}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${role === 'user' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Scholar Signup
                    </button>
                    <button 
                        onClick={() => setRole('admin')}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${role === 'admin' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Admin Signup
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 text-center uppercase tracking-widest animate-pulse">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 text-left">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block text-primary-400/70">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium placeholder-slate-700"
                                placeholder="Academic Scholar"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block text-primary-400/70">Academic Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium placeholder-slate-700"
                                placeholder={role === 'admin' ? "name@admin.admin" : "scholar@domain.edu"}
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
                                    className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium placeholder-slate-700 pr-12"
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
                        className="w-full btn-primary py-4 text-lg font-black tracking-widest uppercase hover:scale-[1.02] mt-4 shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all active:scale-95 group"
                    >
                        {loading ? (
                             <span className="flex items-center justify-center gap-3">
                             <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                             Processing...
                         </span>
                        ) : (
                            <>
                                Join as {role === 'admin' ? 'Administrator' : 'Scholar'}
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-8 border-t border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        Existing User? {' '}
                        <Link to="/login" className="text-primary-400 hover:text-white transition-colors border-b border-primary-500/30">Return to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
