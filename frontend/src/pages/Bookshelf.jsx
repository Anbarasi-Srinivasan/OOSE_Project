import React, { useEffect, useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Bookshelf = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Literature', 'History', 'Business'];

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const catQuery = category && category !== 'All' ? `&category=${category}` : '';
            const res = await axios.get(`http://localhost:5000/api/books?search=${search}${catQuery}`);
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchBooks();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, category]);

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-primary-900">Academic Library</h1>
                    <p className="mt-2 text-slate-600">Discover knowledge across all disciplines</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex-grow relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by title or author..." 
                            className="input-field pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <select 
                            className="input-field min-w-[180px]"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Book Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 1, 1, 1, 1].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="aspect-[3/4] bg-slate-200"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-slate-200 w-1/4"></div>
                                    <div className="h-6 bg-slate-200 w-3/4"></div>
                                    <div className="h-4 bg-slate-200 w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {books.map((book) => (
                            <motion.div 
                                key={book._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card group"
                            >
                                <Link to={`/books/${book._id}`}>
                                    <div className="aspect-[3/4] bg-slate-200 relative overflow-hidden">
                                        <img 
                                            src={book.coverImageUrl || 'https://via.placeholder.com/300x400?text=Book+Cover'} 
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                            <button className="w-full py-2 bg-white text-primary-600 font-bold rounded-lg text-sm flex items-center justify-center gap-1">
                                                <BookOpen className="w-4 h-4" /> View Details
                                            </button>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            {book.isFree ? 'FREE' : `$${book.price}`}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">{book.category}</p>
                                        <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{book.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">by {book.author}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && books.length === 0 && (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No books found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookshelf;
