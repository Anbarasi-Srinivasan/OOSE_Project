import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    BookOpen, 
    Download, 
    CreditCard, 
    Calendar, 
    Tag, 
    CheckCircle2,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BookDetails = ({ book, isOpen, onClose, onRead }) => {
    const { library, buyBook } = useAuth();
    if (!book) return null;

    const isFree = book.isFree;
    const isOwned = library.includes(book._id);
    const canRead = isFree || isOwned;

    const handleBuy = async () => {
        const success = await buyBook(book._id, book.price);
        // Toast is already handled in buyBook in AuthContext
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0a0514]/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
                    >
                        {/* Left: Cover & Actions */}
                        <div className="lg:w-2/5 p-8 lg:p-12 bg-gradient-to-br from-primary-900/30 to-transparent border-r border-white/5 flex flex-col">
                            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl mb-8 group relative bg-slate-900">
                                {book.coverImage ? (
                                    <img 
                                        src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:5000${book.coverImage}`} 
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/5">
                                        <BookOpen className="w-32 h-32" />
                                    </div>
                                )}
                                
                                <div className="absolute top-6 right-6">
                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl ${
                                        isFree ? 'bg-emerald-500' : 'bg-primary-600'
                                    }`}>
                                        {isFree ? 'Library Item' : 'Premium Asset'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => canRead ? onRead(book) : handleBuy()}
                                    className={`w-full py-4 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group ${
                                        canRead 
                                        ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-900/40' 
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                                    }`}
                                >
                                    {canRead ? (
                                        <>
                                            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Begin Reading Now
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Unlock for ${book.price}
                                        </>
                                    )}
                                </button>

                                {canRead && (
                                    <button 
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <Download className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                                        Download PDF
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Info Area */}
                        <div className="lg:w-3/5 p-8 lg:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
                            <button 
                                onClick={onClose}
                                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all z-20"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="space-y-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest italic">{book.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Added {new Date(book.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-5xl font-serif font-black text-white leading-[1.1] mb-4 tracking-tighter italic">
                                        {book.title}
                                    </h2>
                                    <p className="text-xl font-bold text-slate-400 capitalize flex items-center gap-3">
                                        <span className="w-8 h-px bg-primary-600/50" />
                                        {book.author}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-white/5 pb-4">Volume Overview</h3>
                                    <p className="text-slate-400 leading-relaxed text-lg font-medium italic">
                                        {book.description || "No digitization summary available for this repository item yet. Refer to the table of contents for initial indexing."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-5">
                                        <div className="p-4 bg-emerald-500/10 rounded-2xl">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-serif italic">Integrity</p>
                                            <p className="text-xs font-black text-white uppercase tracking-widest">Verified Volume</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-5">
                                        <div className="p-4 bg-primary-500/10 rounded-2xl">
                                            <ShieldAlert className="w-6 h-6 text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-serif italic">Access</p>
                                            <p className="text-xs font-black text-white uppercase tracking-widest">Scholar Tier</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookDetails;
