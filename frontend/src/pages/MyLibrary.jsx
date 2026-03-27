import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Download, Clock, Library, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyLibrary = () => {
    const { API_URL, user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders/my-orders`);
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [API_URL]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Opening your personal vault...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 flex items-center gap-3">
                        <Library className="text-primary-600 w-10 h-10" /> My Academic Vault
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Your curated collection of unlocked knowledge and resources.</p>
                </header>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto mt-20">
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-primary-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Your shelf is empty</h2>
                        <p className="mt-4 text-slate-500 text-lg">You haven't purchased or unlocked any premium resources yet. Start exploring our vast academic library today.</p>
                        <Link to="/books" className="btn-primary inline-flex items-center gap-2 mt-8 py-3 px-8 text-lg font-bold">
                            Explore Bookshelf <ArrowRight size={20} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {orders.map((order, i) => (
                            <motion.div 
                                key={order._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="p-6 flex-grow">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-24 h-32 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
                                            <img 
                                                src={order.book.coverImageUrl || 'https://via.placeholder.com/150x200?text=Cover'} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-primary-600 mb-1">{order.book.category}</span>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">{order.book.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1">by {order.book.author}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Clock size={14} /> Unlocked on {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tracking-tighter">
                                            ID: {order.transactionId}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                    <Link 
                                        to={`/books/${order.book._id}`}
                                        className="flex-1 btn-primary py-2 text-sm text-center flex items-center justify-center gap-2"
                                    >
                                        <BookOpen size={16} /> Open
                                    </Link>
                                    <a 
                                        href={`http://localhost:5000${order.book.pdfUrl}`}
                                        download
                                        className="btn-outline flex-1 py-2 text-sm text-center border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} /> Download
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLibrary;
