import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import BrowseBooks from '../components/BrowseBooks';
import BookDetails from '../components/BookDetails';
import PDFViewer from '../components/PDFViewer';
import PurchaseHistory from '../components/PurchaseHistory';
import { Bell, Settings, Book, TrendingUp, Clock, ArrowRight, Library, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import BookCard from '../components/BookCard';

const UserDashboard = () => {
    const auth = useAuth() || {};
    const library = auth.library || [];
    const savedBooks = auth.savedBooks || [];
    const notifications = auth.notifications || [];
    const markNotificationsRead = auth.markNotificationsRead || (() => {});
    const toggleSaveBook = auth.toggleSaveBook || (() => {});

    const [activeSection, setActiveSection] = useState('dashboard');
    const [selectedBook, setSelectedBook] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [allBooks, setAllBooks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/books')
            .then(res => setAllBooks(res.data?.data || []))
            .catch(err => console.error('Dashboard fetch error:', err));
    }, []);

    const handleViewDetails = (book) => { setSelectedBook(book); setIsDetailsOpen(true); };
    const handleRead = (book) => { setSelectedBook(book); setIsReading(true); setIsDetailsOpen(false); };

    const stats = [
        { label: 'Books Read', value: library.length || 0, icon: Book, color: 'text-blue-400' },
        { label: 'Saved Volumes', value: savedBooks.length || 0, icon: Library, color: 'text-emerald-400' },
        { label: 'Reading Hours', value: `${(library.length || 0) * 1.5}h`, icon: Clock, color: 'text-purple-400' },
    ];

    const renderDashboard = () => (
        <div className="space-y-12 animate-fade-in">
            {/* BF Repository Access Hero Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-80 rounded-[3rem] overflow-hidden group shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-purple-900" />
                <img
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80"
                    alt="Library"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 flex flex-col justify-center p-16 text-left">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <span className="text-primary-400 font-black uppercase tracking-[0.6em] text-[10px] mb-4 block">Institutional Access</span>
                        <h2 className="text-5xl lg:text-7xl font-serif font-black text-white italic leading-tight">
                            Bookflix <br /><span className="text-primary-300">Repository Access</span>
                        </h2>
                        <button onClick={() => setActiveSection('browse')} className="mt-8 flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs hover:gap-6 transition-all">
                            Explore Full Catalog <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Analytics Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-xl cursor-default"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-serif font-black text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} shadow-lg`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Curated Library Grid (10 Books) */}
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <h2 className="text-4xl font-serif font-black text-white italic">Curated <span className="text-primary-400">Library</span></h2>
                    <button onClick={() => setActiveSection('browse')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors border-b border-white/10 pb-1">
                        View Full Directory →
                    </button>
                </div>
                {allBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {allBooks.slice(0, 10).map((book, i) => (
                            <motion.div key={book._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <BookCard book={book} onViewDetails={handleViewDetails} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-72 bg-white/5 rounded-3xl animate-pulse border border-white/5" />)}
                    </div>
                )}
            </div>
        </div>
    );

    const renderLibrary = () => (
        <div className="space-y-10">
            <h2 className="text-4xl font-serif font-black text-white italic">My <span className="text-primary-400">Library</span></h2>
            {allBooks.filter(b => savedBooks.includes(b._id)).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {allBooks.filter(b => savedBooks.includes(b._id)).map(book => (
                        <BookCard key={book._id} book={book} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500">
                    <Library className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">Your scholarly library is empty.</p>
                    <button onClick={() => setActiveSection('browse')} className="mt-4 text-primary-400 text-xs font-black uppercase tracking-widest hover:underline">
                        Browse Repository →
                    </button>
                </div>
            )}
        </div>
    );

    const renderProfile = () => (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center gap-10 bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl text-left">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary-600 to-purple-400 border-4 border-white/10 p-1">
                    <div className="w-full h-full rounded-full bg-slate-900 border border-white/20" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-black text-white">Academic Profile</h2>
                    <p className="text-primary-400 font-black uppercase tracking-widest text-xs">Level 4 Research Scholar</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-64 animate-pulse" />
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-64 animate-pulse" />
            </div>
        </div>
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="flex bg-[#0a0514] min-h-screen overflow-hidden">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            <main className="flex-grow p-10 lg:p-14 overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="text-left">
                        <motion.h1 key={activeSection} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            className="text-5xl font-serif font-black text-white capitalize tracking-tighter"
                        >
                            {activeSection.replace('-', ' ')}
                        </motion.h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            Bookflix Intelligence System / v2.04
                        </p>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        {/* Notification Bell */}
                        <button
                            onClick={() => { setIsNotificationsOpen(p => !p); if (!isNotificationsOpen) markNotificationsRead(); }}
                            className={`p-4 bg-white/5 border border-white/10 rounded-2xl transition-all relative ${unreadCount > 0 ? 'text-primary-400' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-[#120a1f] animate-pulse" />
                            )}
                        </button>

                        {/* Notification Panel */}
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-16 right-0 w-96 bg-[#1a0f2e] border border-white/10 rounded-3xl shadow-2xl z-50 p-6 space-y-4"
                                >
                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Protocol Notifications</h4>
                                        <button onClick={() => setIsNotificationsOpen(false)}><X className="w-4 h-4 text-slate-500" /></button>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-3">
                                        {notifications.length > 0 ? notifications.map((n, i) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-2xl flex gap-3">
                                                <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-black text-white mb-1">{n.title}</p>
                                                    <p className="text-[10px] text-slate-400">{n.message}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-[10px] text-slate-600 text-center py-8 uppercase tracking-widest font-black italic">No notifications yet.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Sections */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35 }}
                    >
                        {activeSection === 'dashboard' && renderDashboard()}
                        {activeSection === 'browse' && <BrowseBooks />}
                        {activeSection === 'library' && renderLibrary()}
                        {activeSection === 'history' && <PurchaseHistory />}
                        {activeSection === 'profile' && renderProfile()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Book Details Modal */}
            <BookDetails book={selectedBook} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} onRead={handleRead} />

            {/* PDF Viewer */}
            <AnimatePresence>
                {isReading && <PDFViewer book={selectedBook} onClose={() => setIsReading(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default UserDashboard;
