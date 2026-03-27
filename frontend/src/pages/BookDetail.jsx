import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BookOpen, Download, CreditCard, ChevronLeft, Calendar, User, Tag, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BookDetail = () => {
    const { id } = useParams();
    const { user, API_URL } = useAuth();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchased, setPurchased] = useState(false);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookRes = await axios.get(`${API_URL}/books/${id}`);
                setBook(bookRes.data);
                
                if (user) {
                    const orderRes = await axios.get(`${API_URL}/orders/my-orders`);
                    const isPurchased = orderRes.data.some(order => order.book._id === id);
                    setPurchased(isPurchased);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, API_URL]);

    const handlePurchase = async () => {
        if (!user) return navigate('/login');
        setPurchasing(true);
        try {
            await axios.post(`${API_URL}/orders`, { bookId: id });
            setPurchased(true);
            alert('Purchase successful!');
        } catch (err) {
            alert('Purchase failed: ' + (err.response?.data?.message || 'Error occurred'));
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading academic resource...</div>;
    if (!book) return <div className="min-h-screen flex items-center justify-center text-slate-500">Book not found.</div>;

    const canRead = book.isFree || purchased || (user && user.role === 'admin');

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-semibold"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to Library
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Left: Book Cover */}
                        <div className="lg:col-span-4 bg-slate-100 p-8 flex items-center justify-center">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="shadow-2xl rounded-lg overflow-hidden border-4 border-white"
                            >
                                <img 
                                    src={book.coverImageUrl || 'https://via.placeholder.com/400x600?text=Book+Cover'} 
                                    alt={book.title}
                                    className="w-full h-full object-cover max-h-[500px]"
                                />
                            </motion.div>
                        </div>

                        {/* Right: Book Details */}
                        <div className="lg:col-span-8 p-8 lg:p-12">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {book.category}
                                </span>
                                {book.isFree && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                        Open Access
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight">{book.title}</h1>
                            <div className="mt-4 flex flex-wrap gap-6 text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary-500" />
                                    <span>{book.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary-500" />
                                    <span>Published {new Date(book.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-slate-900">Abstract / Description</h3>
                                <p className="mt-3 text-slate-600 leading-relaxed text-lg italic">
                                    {book.description || "No abstract available for this resource."}
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-500">Access Type</span>
                                    <span className="text-3xl font-bold font-serif text-primary-900">
                                        {book.isFree ? 'Free' : `$${book.price}`}
                                    </span>
                                </div>

                                {canRead ? (
                                    <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                                        <button 
                                            onClick={() => window.open(`http://localhost:5000${book.pdfUrl}`, '_blank')}
                                            className="btn-primary flex items-center gap-2 flex-grow sm:flex-grow-0"
                                        >
                                            <BookOpen className="w-5 h-5" /> Read Online
                                        </button>
                                        <a 
                                            href={`http://localhost:5000${book.pdfUrl}`} 
                                            download 
                                            className="btn-outline flex items-center gap-2 flex-grow sm:flex-grow-0"
                                        >
                                            <Download className="w-5 h-5" /> Download PDF
                                        </a>
                                        {purchased && !book.isFree && (
                                            <span className="flex items-center gap-1 text-green-600 font-bold ml-2">
                                                <CheckCircle className="w-5 h-5" /> Purchased
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handlePurchase}
                                        disabled={purchasing}
                                        className="btn-primary py-4 px-10 bg-primary-600 hover:bg-primary-700 text-xl flex items-center gap-2 w-full sm:w-auto justify-center"
                                    >
                                        {purchasing ? 'Processing...' : (
                                            <>
                                                <CreditCard className="w-6 h-6" /> Unlock for Full Access
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
