import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    Check, 
    Image as ImageIcon,
    FileText,
    ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const UploadVolume = ({ setActiveSection }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', author: '', category: '', description: '', 
        price: 0, isFree: true, coverImage: null, pdfUrl: null
    });

    const categories = ['Technology', 'Science', 'History', 'Philosophy', 'Literature', 'Management'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                if (key === 'coverImage') {
                    data.append('cover', formData[key]);
                } else if (key === 'pdfUrl') {
                    data.append('pdf', formData[key]);
                } else {
                    data.append(key, formData[key]);
                }
            }
        });

        try {
            await axios.post('http://localhost:5000/api/books', data);
            toast.success('New Volume Digitized Successfully');
            setActiveSection('books');
        } catch (err) {
            toast.error('System Operation Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in text-left max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
                <button 
                    onClick={() => setActiveSection('books')}
                    className="p-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl transition-all shadow-xl shadow-primary-900/40"
                    title="Return to Repository"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-4xl font-serif font-black text-white italic">Digitize New Volume</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Append to Global Repository</p>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white/5 border border-white/10 rounded-[3rem] shadow-2xl p-12"
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Volume Title</label>
                            <input 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all focus:ring-2 focus:ring-primary-500/20"
                                placeholder="Enter publication name..." required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Principal Author</label>
                            <input 
                                value={formData.author} 
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all focus:ring-2 focus:ring-primary-500/20"
                                placeholder="Lead researcher or author..." required
                            />
                        </div>
                        <div className="flex gap-6">
                            <div className="w-2/3 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                <select 
                                    value={formData.category} 
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all appearance-none focus:ring-2 focus:ring-primary-500/20"
                                    required
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
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all focus:ring-2 focus:ring-primary-500/20"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required={!formData.isFree}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 flex flex-col justify-between">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Abstract / Summary</label>
                            <textarea 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-600 transition-all h-32 resize-none focus:ring-2 focus:ring-primary-500/20"
                                placeholder="Initial repository indexing summary..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cover Mapping</label>
                                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed ${formData.coverImage ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/10 hover:bg-white/5'} rounded-2xl cursor-pointer transition-all`}>
                                    <ImageIcon className={`w-5 h-5 mb-1 ${formData.coverImage ? 'text-primary-400' : 'text-slate-500'}`} />
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${formData.coverImage ? 'text-primary-400' : 'text-slate-500'}`}>
                                        {formData.coverImage ? formData.coverImage.name : 'Upload JPG/PNG'}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setFormData({...formData, coverImage: e.target.files[0]})} required />
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Digital Source</label>
                                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed ${formData.pdfUrl ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:bg-white/5'} rounded-2xl cursor-pointer transition-all`}>
                                    <FileText className={`w-5 h-5 mb-1 ${formData.pdfUrl ? 'text-emerald-400' : 'text-slate-500'}`} />
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${formData.pdfUrl ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {formData.pdfUrl ? formData.pdfUrl.name : 'Upload PDF'}
                                    </span>
                                    <input type="file" className="hidden" accept="application/pdf" onChange={(e) => setFormData({...formData, pdfUrl: e.target.files[0]})} required />
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 mt-auto">
                            <button 
                                type="button" onClick={() => {
                                    setFormData({ title: '', author: '', category: '', description: '', price: 0, isFree: true, coverImage: null, pdfUrl: null });
                                }}
                                className="w-1/3 py-4 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                disabled={loading}
                            >Clear Form</button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-2/3 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/40 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Processing...
                                    </span>
                                ) : (
                                    <>Execute Digitization <Check className="w-4 h-4 group-hover:scale-110 transition-transform" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UploadVolume;
