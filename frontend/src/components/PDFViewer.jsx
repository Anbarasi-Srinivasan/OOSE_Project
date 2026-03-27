import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, ExternalLink, Download, Loader2, AlertTriangle } from 'lucide-react';

const PDFViewer = ({ book, onClose }) => {
    const [iframeError, setIframeError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!book) return null;

    // Raw PDF URL
    const rawPdfUrl = book.pdfUrl?.startsWith('http')
        ? book.pdfUrl
        : `http://localhost:5000${book.pdfUrl}`;

    // Use Google Docs Viewer to bypass iframe-blocking on external PDFs
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(rawPdfUrl)}&embedded=true`;

    const handleOpen = () => window.open(rawPdfUrl, '_blank');
    const handleDownload = () => {
        window.location.href = `http://localhost:5000/api/books/${book._id}/download`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0a0514] flex flex-col"
        >
            {/* Toolbar */}
            <div className="h-20 bg-white/5 border-b border-white/10 flex items-center justify-between px-8 backdrop-blur-3xl flex-shrink-0">
                <div className="flex items-center gap-6">
                    <div className="p-3 bg-primary-600 rounded-xl">
                        <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-serif font-black tracking-tight line-clamp-1">{book.title}</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Digital Reader / {book.author}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={handleOpen}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open PDF
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-1" />
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Close
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex-grow relative bg-[#1a1525] overflow-hidden">
                {/* Loading spinner */}
                {loading && !iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading PDF via Google Docs Viewer...</p>
                    </div>
                )}

                {/* Error fallback */}
                {iframeError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-8">
                        <AlertTriangle className="w-16 h-16 text-amber-500/50" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-black text-white italic">Embed Restricted</h3>
                            <p className="text-slate-500 text-sm font-medium max-w-md">
                                This PDF cannot be embedded directly. Use one of the options below to access it.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleOpen} className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest rounded-2xl text-xs flex items-center gap-2 transition-all">
                                <ExternalLink className="w-4 h-4" /> Open in New Tab
                            </button>
                            <button onClick={handleDownload} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl text-xs flex items-center gap-2 transition-all">
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                        </div>
                    </div>
                ) : (
                    <iframe
                        key={viewerUrl}
                        src={viewerUrl}
                        title={book.title}
                        className="w-full h-full border-none"
                        onLoad={() => setLoading(false)}
                        onError={() => { setLoading(false); setIframeError(true); }}
                    />
                )}

                {/* Side gradients */}
                <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#1a1525] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#1a1525] to-transparent pointer-events-none" />
            </div>
        </motion.div>
    );
};

export default PDFViewer;
