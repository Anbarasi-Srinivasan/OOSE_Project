import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Upload, 
    X, 
    Check, 
    AlertCircle,
    BookOpen,
    DollarSign,
    Tag,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageBooks = ({ setActiveSection }) => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '', author: '', category: '', description: '', 
        price: 0, isFree: true, coverImage: null, pdfUrl: null
    });

    const categories = ['Technology', 'Science', 'History', 'Philosophy', 'Literature', 'Management'];

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/books');
            setBooks(res.data.data);
        } catch (err) {
            console.error('Failed to fetch books:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this volume from the repository?')) {
            try {
                await axios.delete(`http://localhost:5000/api/books/${id}`);
                toast.success('Volume Purged from Repository');
                fetchBooks();
            } catch (err) {
                toast.error('Deletion Failure: ' + err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) data.append(key, formData[key]);
        });

        try {
            if (editingBook) {
                await axios.put(`http://localhost:5000/api/books/${editingBook._id}`, data);
                toast.success('Volume Meta-Data Synchronized');
            } else {
                await axios.post('http://localhost:5000/api/books', data);
                toast.success('New Volume Digitized Successfully');
            }
            setIsModalOpen(false);
            setEditingBook(null);
            setFormData({ title: '', author: '', category: '', description: '', price: 0, isFree: true, coverImage: null, pdfUrl: null });
            fetchBooks();
        } catch (err) {
            toast.error('System Operation Failed: ' + err.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                <div className="text-left">
                    <h2 className="text-3xl font-serif font-black text-white italic">Volume Repository</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Found {books.length} Digitized Assets</p>
                </div>
                <button 
                    onClick={() => setActiveSection('upload-book')}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-900/40 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" /> Add New Volume
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {books.map((book) => (
                    <motion.div 
                        key={book._id}
                        layout
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="w-16 h-20 bg-slate-900 rounded-xl overflow-hidden border border-white/5 flex-shrink-0">
                                {book.coverImage && (
                                    <img src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:5000${book.coverImage}`} alt="" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="text-left">
                                <h4 className="text-white font-bold leading-tight group-hover:text-primary-300 transition-colors uppercase tracking-tight">{book.title}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{book.author}</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">{book.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right px-6">
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                    book.isFree ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-primary-500/10 border-primary-500/20 text-primary-400'
                                }`}>
                                    {book.isFree ? 'OPEN ACCESS' : `$${book.price}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => { setEditingBook(book); setFormData(book); setIsModalOpen(true); }}
                                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all hover:bg-white/10"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(book._id)}
                                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#0a0514]/90 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl p-12"
                        >
                            <h2 className="text-4xl font-serif font-black text-white italic mb-10">
                                {editingBook ? 'Edit Volume Terminal' : 'New Volume Digitization'}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Volume Title</label>
                                        <input 
                                            value={formData.title} 
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all"
                                            placeholder="Enter publication name..." required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Principal Author</label>
                                        <input 
                                            value={formData.author} 
                                            onChange={(e) => setFormData({...formData, author: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all"
                                            placeholder="Lead researcher or author..." required
                                        />
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-2/3 space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                            <select 
                                                value={formData.category} 
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all appearance-none"
                                            >
                                                <option value="" className="bg-[#0a0514]">Select Domain</option>
                                                {categories.map(c => <option key={c} value={c} className="bg-[#0a0514]">{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="w-1/3 space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Tier</label>
                                            <div className="flex h-14 bg-white/5 border border-white/10 rounded-2xl p-1">
                                                <button 
                                                    type="button" onClick={() => setFormData({...formData, isFree: true})}
                                                    className={`flex-1 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${formData.isFree ? 'bg-primary-600 text-white' : 'text-slate-500'}`}
                                                >Free</button>
                                                <button 
                                                    type="button" onClick={() => setFormData({...formData, isFree: false})}
                                                    className={`flex-1 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${!formData.isFree ? 'bg-primary-600 text-white' : 'text-slate-500'}`}
                                                >Paid</button>
                                            </div>
                                        </div>
                                    </div>
                                    {!formData.isFree && (
                                        <div className="space-y-2 animate-fade-in">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Value ($)</label>
                                            <input 
                                                type="number" value={formData.price} 
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Abstract / Summary</label>
                                        <textarea 
                                            value={formData.description} 
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all h-32 resize-none"
                                            placeholder="Initial repository indexing summary..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cover Mapping</label>
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                                                <ImageIcon className="w-5 h-5 text-slate-500 mb-1" />
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Upload JPG/PNG</span>
                                                <input type="file" className="hidden" onChange={(e) => setFormData({...formData, coverImage: e.target.files[0]})} />
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Digital Source</label>
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                                                <FileText className="w-5 h-5 text-slate-500 mb-1" />
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Upload PDF</span>
                                                <input type="file" className="hidden" onChange={(e) => setFormData({...formData, pdfUrl: e.target.files[0]})} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button 
                                            type="button" onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                                        >Cancel</button>
                                        <button 
                                            type="submit"
                                            className="flex-1 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/40 flex items-center justify-center gap-2"
                                        >
                                            {editingBook ? 'Commit Changes' : 'Execute Digitization'} <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageBooks;
