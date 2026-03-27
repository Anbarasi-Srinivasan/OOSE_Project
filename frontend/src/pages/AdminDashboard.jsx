import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Sidebar from '../components/Sidebar';
import ManageBooks from '../components/admin/ManageBooks';
import UploadVolume from '../components/admin/UploadVolume';
import UserManagement from '../components/admin/UserManagement';
import SalesReports from '../components/admin/SalesReports';
import AcademicProfile from '../components/admin/AcademicProfile';
import { 
    Users, 
    BookOpen, 
    TrendingUp, 
    Bell, 
    Settings,
    Activity,
    DollarSign,
    UserCheck,
    Bookmark,
    Fingerprint
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats] = useState({ users: 0, booksRead: 0, booksAddedToLibraries: 0, sales: 0, telemetryData: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const analyticsCards = [
        { label: 'Total Logged-in Users', value: stats.users, icon: UserCheck, color: 'text-blue-400', trend: 'Active' },
        { label: 'Number of Books Read', value: stats.booksRead || 0, icon: BookOpen, color: 'text-purple-400', trend: 'Engaged' },
        { label: 'Books Added To Libraries', value: stats.booksAddedToLibraries || 0, icon: Bookmark, color: 'text-emerald-400', trend: 'Saved' },
    ];

    const renderBooks = () => (
        <ManageBooks setActiveSection={setActiveSection} />
    );

    const renderUsers = () => (
        <UserManagement />
    );

    const renderReports = () => (
        <SalesReports />
    );

    const renderDashboard = () => (
        <div className="space-y-12 animate-fade-in text-left">
            {/* 3 Main Analytics Grid per requirements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {analyticsCards.map((card, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <card.icon className="w-24 h-24" />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-white/5 ${card.color}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest ${card.color}`}>{card.trend}</span>
                        </div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1">{card.label}</p>
                        <h3 className="text-5xl font-serif font-black text-white tracking-tighter">{card.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Recharts System Engagement Overview */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-[400px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-5 h-5 text-primary-400" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Global Reading Telemetry</h2>
                </div>
                <div className="flex-grow w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.telemetryData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScholars" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="day" stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#0a0514', border: '1px solid #ffffff20', borderRadius: '1rem', color: '#fff'}}
                            />
                            <Area type="monotone" dataKey="readingSessions" name="Reading Sessions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                            <Area type="monotone" dataKey="activeScholars" name="Active Scholars" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScholars)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex bg-[#0a0514] min-h-screen overflow-hidden">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            
            <main className="flex-grow p-10 lg:p-14 overflow-y-auto custom-scrollbar">
                {/* Header Navbar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="text-left">
                        <motion.h1 
                            key={activeSection}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-5xl font-serif font-black text-white capitalize tracking-tighter"
                        >
                            {activeSection.replace('-', ' ')}
                        </motion.h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-3 ml-1 italic">
                             Bookflix Management Portal / v4.2.0-Admin
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="px-5 py-2.5 bg-primary-600/10 border border-primary-500/20 rounded-2xl">
                             <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest italic">Authority verified</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-lg hover:shadow-primary-500/10">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-lg hover:shadow-primary-500/10">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="min-h-[70vh]"
                    >
                        {activeSection === 'dashboard' && renderDashboard()}
                        {activeSection === 'books' && renderBooks()}
                        {activeSection === 'upload-book' && <UploadVolume setActiveSection={setActiveSection} />}
                        {activeSection === 'users' && renderUsers()}
                        {activeSection === 'reports' && renderReports()}
                        {activeSection === 'profile' && <AcademicProfile />}
                        {!['dashboard', 'books', 'upload-book', 'users', 'reports', 'profile'].includes(activeSection) && (
                            <div className="h-[60vh] flex flex-col items-center justify-center gap-8 opacity-20 grayscale saturate-0">
                                <Activity className="w-20 h-20 text-white animate-pulse" />
                                <h3 className="text-3xl font-serif font-black text-white tracking-widest uppercase italic">Digitizing {activeSection} Module...</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Full Protocol Integration Pending</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
