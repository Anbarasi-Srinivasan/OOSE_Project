import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, Book, Activity } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line 
} from 'recharts';

const AcademicProfile = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/academic-profile');
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch academic profile analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Compiling Institutional Analytics...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4 p-8">
                <Activity className="w-12 h-12 text-slate-600 mb-2" />
                <h3 className="text-2xl font-serif font-black text-white italic">Insufficient Ecosystem Data</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center max-w-sm">
                    Upload volumes and simulate transactions to generate longitudinal profile analytics.
                </p>
            </div>
        );
    }

    // Prepare pie chart stats
    const totalFree = data.reduce((sum, item) => sum + item.free, 0);
    const totalPremium = data.reduce((sum, item) => sum + (item.uploaded - item.free), 0);
    const pieData = [
        { name: 'Open Access (Free)', value: totalFree },
        { name: 'Premium Allocation', value: totalPremium > 0 ? totalPremium : 0 }
    ];
    const COLORS = ['#10b981', '#a855f7']; // Emerald and Purple

    return (
        <div className="space-y-12 animate-fade-in text-left">
            <div className="space-y-4">
                <h2 className="text-4xl font-serif font-black text-white italic">Academic Profile & Telemetry</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl uppercase tracking-wide">
                    A comprehensive yearly analysis of curriculum expansion, repository hygiene, and scholar transaction flows.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Bar Chart: Uploads vs Deletions per Year */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-2xl h-96 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Book className="w-5 h-5 text-primary-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Repository Flux (Yearly)</h3>
                    </div>
                    <div className="flex-grow w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="year" stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#ffffff05'}} 
                                    contentStyle={{backgroundColor: '#0a0514', border: '1px solid #ffffff20', borderRadius: '1rem'}} 
                                />
                                <Legend wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
                                <Bar dataKey="uploaded" name="Volumes Uploaded" fill="#a855f7" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="deleted" name="Volumes Purged" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 2. Line Chart: Purchases / Engagement Trends */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-2xl h-96 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Transaction Velocity</h3>
                    </div>
                    <div className="flex-grow w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="year" stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0a0514', border: '1px solid #ffffff20', borderRadius: '1rem'}} 
                                />
                                <Legend wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
                                <Line type="monotone" dataKey="purchased" name="Total Purchases" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 3. Pie Chart: Free vs Paid Access Ratio */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-2xl h-96 lg:col-span-2 flex flex-col"
                >
                    <div className="text-center mb-2">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Monetization Model Distribution</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Free Tier vs Premium Assets</p>
                    </div>
                    <div className="flex-grow w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0a0514', border: '1px solid #ffffff20', borderRadius: '1rem', color: '#fff'}}
                                    itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px', color: '#fff'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-serif font-black text-white">{(totalFree + totalPremium) || 0}</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Volumes</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AcademicProfile;
