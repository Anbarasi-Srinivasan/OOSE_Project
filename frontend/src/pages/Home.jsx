import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import BookCard from '../components/BookCard';

const Home = () => {
    const [featuredBooks, setFeaturedBooks] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books');
                // Check if it's res.data.data (standard) or res.data
                const data = res.data.data || res.data;
                setFeaturedBooks(data.slice(0, 4));
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="bg-transparent text-slate-200">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="text-center lg:text-left relative">
                            {/* Atmospheric Glow Orb */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px] animate-pulse" />

                            <motion.h1
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.05 }
                                    }
                                }}
                                className="text-6xl lg:text-8xl font-serif font-black leading-[1.1] text-white italic"
                            >
                                {["Academic", "Mastery"].map((word, i) => (
                                    <span key={i} className="block overflow-hidden">
                                        {word.split("").map((char, j) => (
                                            <motion.span
                                                key={j}
                                                variants={{
                                                    hidden: { y: 100, opacity: 0 },
                                                    visible: { y: 0, opacity: 1 }
                                                }}
                                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                className={`inline-block ${word === "Mastery" ? 'text-neon-purple bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-200' : ''}`}
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </span>
                                ))}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 1 }}
                                className="mt-8 text-xl lg:text-2xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans font-light"
                            >
                                Access an elite collection of premium e-books, research papers, and academic journals.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6"
                            >
                                <Link to="/user/dashboard" className="btn-primary group px-10 py-5 text-xl bg-neon-gradient border-none">
                                    Explore Library
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                                <Link to="/register" className="btn-outline px-10 py-5 text-xl border-primary-500/30 hover:bg-primary-500/10 transition-all">
                                    Join Community
                                </Link>
                            </motion.div>
                        </div>
                        <div className="hidden lg:block relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "circOut" }}
                                className="w-[500px] h-[600px] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-end justify-end group"
                            >
                                {/* Background library image */}
                                <img
                                    src="https://th.bing.com/th/id/OIP.q35F8OpiG7vE8F0OxeaIOgHaHa?w=181&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                                    alt="Library"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-primary-900/60 to-transparent" />

                                {/* Floating monogram */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-[9rem] font-serif font-black text-white text-neon-purple italic drop-shadow-2xl"
                                    >
                                        B-Flix
                                    </motion.div>
                                </div>

                                {/* Bottom label */}
                                <div className="relative z-10 p-8 w-full">
                                    <p className="text-[10px] tracking-[0.6em] text-primary-300 uppercase font-black">Repository Access</p>
                                    <p className="text-white/50 text-xs font-medium mt-1">Explore 10,000+ scholarly volumes</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Stats */}
            <section className="py-20 bg-black/20 backdrop-blur-md border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div>
                            <p className="text-4xl font-black text-white mb-2">24/7</p>
                            <p className="text-slate-500 tracking-[0.2em] font-bold text-xs uppercase">Instant Access</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white mb-2">100%</p>
                            <p className="text-slate-500 tracking-[0.2em] font-bold text-xs uppercase">Encrypted</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white mb-2">PREMIUM</p>
                            <p className="text-slate-500 tracking-[0.2em] font-bold text-xs uppercase">Curated Content</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white mb-2">EXPERT</p>
                            <p className="text-slate-500 tracking-[0.2em] font-bold text-xs uppercase">Peer Reviewed</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-16"
                >
                    <h2 className="text-5xl font-serif font-black text-white italic">Latest <span className="text-primary-400">Releases</span></h2>
                    <Link to="/user/dashboard" className="text-primary-400 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors border-b-2 border-primary-500/30 pb-1">View Full Repository →</Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {featuredBooks.map((book, i) => (
                        <motion.div
                            key={book._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <BookCard book={book} onViewDetails={() => { }} />
                        </motion.div>
                    ))}
                    {featuredBooks.length === 0 && (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse bg-white/5 h-[400px] rounded-3xl border border-white/5" />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
