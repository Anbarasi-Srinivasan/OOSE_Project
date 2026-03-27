import React from 'react';
import { motion } from 'framer-motion';
import { 
    LayoutGrid, 
    Search, 
    BookOpen, 
    History, 
    User, 
    LogOut,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeSection, setActiveSection }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const userMenuItems = [
        { id: 'dashboard', label: 'Home Dashboard', icon: LayoutGrid },
        { id: 'browse', label: 'Browse Repository', icon: Search },
        { id: 'library', label: 'My Library (Saved)', icon: BookOpen },
        { id: 'history', label: 'Purchase History', icon: History },
        { id: 'profile', label: 'Academic Profile', icon: User },
    ];

    const adminMenuItems = [
        { id: 'dashboard', label: 'System Analytics', icon: LayoutGrid },
        { id: 'books', label: 'Manage Books', icon: BookOpen },
        { id: 'reports', label: 'Purchase History', icon: History },
        { id: 'users', label: 'Manage Users', icon: User },
        { id: 'profile', label: 'Academic Profile', icon: TrendingUp },
    ];

    const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="h-screen w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col p-6 sticky top-0"
        >
            {/* Brand */}
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <BookOpen className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-serif font-black text-white tracking-tighter">Bookflix</span>
            </div>

            {/* Navigation */}
            <nav className="flex-grow space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                                isActive 
                                ? 'bg-primary-600/20 shadow-inner' 
                                : 'hover:bg-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <Icon className={`w-5 h-5 transition-colors ${
                                    isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-white'
                                }`} />
                                <span className={`text-sm font-bold tracking-wide transition-colors ${
                                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'
                                }`}>
                                    {item.label}
                                </span>
                            </div>
                            {isActive && (
                                <motion.div layoutId="active-indicator">
                                    <ChevronRight className="w-4 h-4 text-primary-400" />
                                </motion.div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Profile & Logout */}
            <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-purple-400 border border-white/20" />
                    <div className="overflow-hidden text-left">
                        <p className="text-sm font-black text-white truncate">{user?.username || 'Researcher'}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black italic">
                            {user?.role === 'admin' ? 'System Authority' : 'Standard Scholar'}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm tracking-wide">Secure Exit</span>
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
