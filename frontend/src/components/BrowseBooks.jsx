import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Loader2, BookX } from 'lucide-react';
import BookCard from './BookCard';
import BookDetails from './BookDetails';
import PDFViewer from './PDFViewer';

const BrowseBooks = ({ onViewDetails: externalViewDetails }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books');
                if (res.data.success) {
                    setBooks(res.data.data);
                    const cats = ['All', ...new Set(res.data.data.map(b => b.category))];
                    setCategories(cats);
                }
            } catch (err) {
                console.error('Error fetching books:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleViewDetails = (book) => {
        setSelectedBook(book);
        setIsDetailsOpen(true);
        if (externalViewDetails) externalViewDetails(book);
    };

    const handleRead = (book) => {
        setSelectedBook(book);
        setIsReading(true);
        setIsDetailsOpen(false);
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 italic">Syncing Repository Index...</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-12 animate-fade-in">
                {/* Search & Filter Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-3xl shadow-2xl">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by Title or Researcher..."
                            className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-4 rounded-2xl text-white font-medium outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="flex items-center gap-3">
                            <Filter className="w-4 h-4 text-primary-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Filter by Category</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        selectedCategory === cat
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-white/5 text-slate-500 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <AnimatePresence mode="wait">
                    {filteredBooks.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-[50vh] flex flex-col items-center justify-center gap-6 text-center"
                        >
                            <BookX className="w-20 h-20 text-white/10 mb-2" />
                            <h3 className="text-3xl font-serif font-black text-white/30 italic">Zero Matches in Repository.</h3>
                            <p className="text-xs uppercase tracking-[0.4em] font-bold text-slate-600">Refine your search parameters and re-query.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Book Details Modal */}
            <BookDetails
                book={selectedBook}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onRead={handleRead}
            />

            {/* PDF Reader Overlay */}
            <AnimatePresence>
                {isReading && (
                    <PDFViewer
                        book={selectedBook}
                        onClose={() => setIsReading(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default BrowseBooks;
