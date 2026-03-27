import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, ArrowUpRight, TrendingUp, History, Download, Loader2, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/reports');
                if (res.data.success) {
                    setReports(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch reports:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Compiling Transaction Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-black text-white italic">Fiscal Intelligence</h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md uppercase tracking-wide">Detailed audit of all digital asset acquisitions and scholar transactions within the Bookflix ecosystem.</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-right min-w-[240px]">
                    <div className="flex items-center justify-end gap-3 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Growth Trajectory</span>
                    </div>
                    <p className="text-5xl font-serif font-black text-white px-2 py-1">${reports.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Total Verified Sales</p>
                </div>
            </div>

            {/* Revenue Analytics Chart */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-[300px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Transaction Volume Heatmap</h3>
                </div>
                <div className="flex-grow w-full">
                    {reports.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={Object.entries(reports.reduce((acc, r) => {
                                    const date = new Date(r.createdAt).toLocaleDateString([], {month: 'short', day: 'numeric'});
                                    acc[date] = (acc[date] || 0) + r.amount;
                                    return acc;
                                }, {})).map(([date, amount]) => ({ date, amount })).reverse()} 
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#ffffff05'}} 
                                    contentStyle={{backgroundColor: '#0a0514', border: '1px solid #ffffff20', borderRadius: '1rem', color: '#fff'}} 
                                />
                                <Bar dataKey="amount" name="Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black italic">No finalized transactions in ledger.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {reports.map((report) => (
                    <motion.div 
                        key={report._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col lg:flex-row justify-between items-center gap-6 hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-6 w-full lg:w-1/3">
                            <div className="p-4 bg-primary-600/10 rounded-2xl border border-primary-500/20">
                                <CreditCard className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-tight">{report.book.title}</h4>
                                <p className="text-[10px] text-slate-500 font-bold mt-1">Purchased by: {report.user.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full lg:w-2/3 lg:gap-16">
                            <div className="text-left lg:text-center">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Network Node</p>
                                <span className="text-slate-400 text-xs font-bold font-mono">{report.user.email}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Protocol Date</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                                    <span className="text-xs font-bold">{new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-right min-w-[100px]">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Transaction</p>
                                <span className="text-white font-black text-lg font-serif italic">+${report.amount.toFixed(2)}</span>
                            </div>
                            <div className="hidden xl:block">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-primary-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SalesReports;
