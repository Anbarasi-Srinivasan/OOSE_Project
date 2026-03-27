import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-primary-950/80 backdrop-blur-xl text-slate-400 py-20 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-1 text-center md:text-left flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-3xl font-serif font-black text-white tracking-tighter">Bookflix</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-8 text-slate-500 max-w-xs">
                            Empowering academic excellence through a curated digital repository of elite resources and research tools.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-black tracking-widest text-xs uppercase mb-8">Explore</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/books" className="hover:text-primary-400 transition-colors">Digital Library</Link></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Research Archive</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Publication Access</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black tracking-widest text-xs uppercase mb-8">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Access Guide</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Institutional login</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black tracking-widest text-xs uppercase mb-8">Intelligence</h4>
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="email" 
                                placeholder="Academic email" 
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary-500 outline-none text-white"
                            />
                        </div>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed">
                            Subscribe to receive peer-reviewed updates and new repository entries.
                        </p>
                    </div>
                </div>
                
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase">
                    <p>&copy; {new Date().getFullYear()} BOOKFLIX DIGITAL REPOSITORY. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary-400">Privacy Protocol</a>
                        <a href="#" className="hover:text-primary-400">Security Standards</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
