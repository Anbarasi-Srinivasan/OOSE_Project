import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth() || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        if (logout) logout();
        navigate('/login');
    };

    return (
        <nav className="bg-primary-950/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-3xl font-serif font-black text-white tracking-tighter group-hover:text-primary-300 transition-all text-neon-purple italic">Bookflix</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-10">
                        <Link to="/" className="text-slate-300 hover:text-white font-medium transition-all hover:scale-105">Home</Link>
                        
                        {user ? (
                            <>
                                {/* Dynamic Dashboard Link */}
                                <Link 
                                    to={user.role === 'admin' ? "/admin/dashboard" : "/user/dashboard"} 
                                    className="text-primary-400 hover:text-primary-200 font-black tracking-widest text-[10px] border-b-2 border-primary-500/50 pb-1 flex items-center gap-2 uppercase"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                                    {user.role === 'admin' ? "Admin Terminal" : "My Dashboard"}
                                </Link>

                                <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-600/30 border border-primary-500/50 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                                            {user.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="hidden lg:block">
                                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Authority</span>
                                            <span className="block text-xs font-bold text-slate-100">{user.username}</span>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors text-[9px] font-black tracking-[0.2em] uppercase cursor-pointer">
                                        TERMINATE
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-8">
                                <Link to="/login" className="text-slate-200 font-medium hover:text-white transition-colors">Login</Link>
                                <Link to="/register" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-black tracking-widest uppercase text-xs hover:bg-primary-500 transition-all shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)]">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
