import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { History, CreditCard, ExternalLink, Loader2, Search } from 'lucide-react';

const PurchaseHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/orders/my-library');
                if (res.data.success) {
                    setOrders(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch purchase history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Accessing Transaction Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-black text-white">Transaction Logs</h2>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                    <History className="w-4 h-4 text-primary-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{orders.length} Records Found</span>
                </div>
            </div>

            {orders.length > 0 ? (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <motion.div 
                            key={order._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="w-16 h-20 bg-primary-900/30 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                    {order.book.coverImage && (
                                        <img src={`http://localhost:5000${order.book.coverImage}`} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold leading-tight group-hover:text-primary-300 transition-colors uppercase tracking-tight">{order.book.title}</h4>
                                    <p className="text-xs text-slate-500 font-bold mt-1">Order Ref: {order.transactionId || 'BFX-XXXXXXX'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto md:gap-16">
                                <div className="text-left md:text-right">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Amount Paid</p>
                                    <span className="text-white font-black text-lg font-serif">
                                        {order.amount === 0 ? 'FREE' : `$${order.amount.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Protocol Date</p>
                                    <span className="text-slate-400 text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="hidden lg:block">
                                    <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="h-[40vh] bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 opacity-30 text-center grayscale">
                    <CreditCard className="w-16 h-16 text-white" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">No active transaction telemetry found.</p>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
