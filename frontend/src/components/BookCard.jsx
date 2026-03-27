import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, CreditCard, ChevronRight, Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, onViewDetails }) => {
    const { savedBooks, toggleSaveBook } = useAuth();
    const isFree = book.isFree;
    const isSaved = savedBooks.includes(book._id);

    const handleSave = (e) => {
        e.stopPropagation();
        toggleSaveBook(book._id);
    };

    return (
        <motion.div
            whileHover={{ 
                scale: 1.05, 
                translateY: -10,
                boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)",
                borderColor: "rgba(167, 139, 250, 0.4)"
            }}
            className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={() => onViewDetails(book)}
        >
            {/* Cover Image Placeholder or Real Image */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-900/50 to-slate-900">
                {book.coverImage ? (
                    <img 
                        src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:5000${book.coverImage}`} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/10 group-hover:text-primary-400 transition-colors">
                        <BookOpen className="w-16 h-16" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Digitizing...</span>
                    </div>
                )}

                {/* Price & Actions Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        isFree 
                        ? 'bg-emerald-500/90 text-white border border-emerald-400/50' 
                        : 'bg-primary-600/90 text-white border border-primary-500/50'
                    }`}>
                        {isFree ? 'FREE ACCESS' : `$${book.price}`}
                    </span>
                    
                    <button 
                        onClick={handleSave}
                        className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                            isSaved 
                            ? 'bg-red-500/20 border-red-500/40 text-red-500' 
                            : 'bg-black/20 border-white/10 text-white/50 hover:text-white'
                        }`}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1 block">
                        {book.category}
                    </span>
                    <h3 className="text-lg font-serif font-black text-white leading-tight line-clamp-2 group-hover:text-primary-300 transition-colors">
                        {book.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 mb-6 mt-auto">
                    <div className="p-1.5 bg-white/5 rounded-lg">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 truncate">{book.author}</span>
                </div>

                <button 
                    className="w-full py-3 bg-white/5 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 hover:border-primary-500 transition-all flex items-center justify-center gap-2 group/btn"
                >
                    View Details
                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default BookCard;
