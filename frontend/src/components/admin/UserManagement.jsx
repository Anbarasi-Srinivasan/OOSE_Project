import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Mail, Shield, Trash2, Search, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // We'll need a backend route for this. I'll use the existing /api/auth/profile if I had a list one, 
                // but usually admins need a specific one. I'll create /api/admin/users in the next step.
                const res = await axios.get('http://localhost:5000/api/admin/users');
                if (res.data.success) {
                    setUsers(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Accessing User Database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <div className="flex justify-between items-center bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                <div>
                    <h2 className="text-3xl font-serif font-black text-white italic">Scholar Registry</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Verified Identities in Repository</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Search scholars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-primary-600 transition-all font-bold"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredUsers.map((user) => (
                    <motion.div 
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600/20 to-transparent border border-white/5 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-tight">{user.username}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <Mail className="w-3 h-3 text-slate-500" />
                                    <span className="text-[10px] text-slate-500 font-bold">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Authority Tier</p>
                                <div className="flex items-center gap-2">
                                    <Shield className={`w-3 h-3 ${user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <button className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
