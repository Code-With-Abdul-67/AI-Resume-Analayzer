"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, CheckCircle, Plus } from 'lucide-react';
import { processResume } from '@/app/actions';
import { useSession } from 'next-auth/react';

const loadingSteps = [

    "Analyzing your resume...",
    "Calculating ATS score...",
    "Thinking best recommendations...",
    "Finalizing report..."
];

interface UploadZoneProps {
    variant?: 'full' | 'compact';
}

export default function UploadZone({ variant = 'full' }: UploadZoneProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Simulate progress and step changes
    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return prev;

                let increment = 0;
                if (prev < 80) {
                    increment = Math.random() * 10 + 5;
                } else if (prev < 90) {
                    increment = Math.random() * 1 + 0.1;
                } else {
                    increment = 0.2;
                }

                return Math.min(prev + increment, 100);
            });
        }, 150);

        const stepInterval = setInterval(() => {
            setStepIndex(prev => {
                if (prev >= loadingSteps.length - 1) return prev;
                return prev + 1;
            });
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(stepInterval);
        };
    }, [loading]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Auth Gate check
        if (!session) {
            setShowAuthModal(true);
            e.target.value = '';
            return;
        }

        setLoading(true);
        setProgress(0);
        setStepIndex(0);

        const formData = new FormData();
        formData.append("file", file);

        try {
            await processResume(formData);
        } catch (error: any) {
            if (error.message === 'NEXT_REDIRECT') return;
            console.error("Upload failed", error);
            setLoading(false);
            alert("Something went wrong during analysis.");
        }
    };

    return (
        <>
            {/* Standard Upload UI */}
            {variant === 'full' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-dashed border-white/20 rounded-2xl p-12 text-center bg-black/20 hover:bg-black/40 transition-all duration-300 group shadow-2xl backdrop-blur-sm"
                >
                    <label className="cursor-pointer block group">
                        <div className="bg-white/5 w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                            <Upload className="h-12 w-12 text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-3xl font-black block text-white mb-2 group-hover:text-primary transition-colors tracking-tight">Upload Resume (PDF)</span>
                        <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">AI will automatically analyze and optimize it</span>
                        <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" />
                    </label>
                    <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Sign in to save your analysis to your account
                    </div>
                </motion.div>
            ) : (
                <div className="w-full">
                    <label className="cursor-pointer">
                        <div className="w-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 py-4 rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 group">
                            <Plus size={20} className="group-hover:text-primary transition-colors" />
                            Upload Another Resume
                        </div>
                        <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" />
                    </label>
                </div>
            )}

            {/* Auth Modal Overlay */}
            <AnimatePresence>
                {showAuthModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                        onClick={() => setShowAuthModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-card max-w-sm w-full p-8 rounded-3xl text-center shadow-2xl relative border-primary/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Upload className="text-primary w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Sign In Required</h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Please sign in to upload and analyze your resume. This allows us to keep your results secure.
                            </p>
                            <button
                                onClick={() => {
                                    import('next-auth/react').then(mod => mod.signIn('google'));
                                }}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                            >
                                Sign In with Google
                            </button>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Maybe Later
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px]" />
                        <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
                            <div className="relative mb-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-20px] rounded-full border border-primary/20 bg-primary/5 blur-2xl"
                                />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-40 h-40 rounded-full border-[6px] border-white/5 border-t-primary border-r-secondary shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-white">{Math.round(progress)}%</span>
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Processing</span>
                                </div>
                            </div>
                            <div className="h-8 flex items-center justify-center mb-8">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={stepIndex}
                                        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                                        className="text-2xl font-bold text-white text-center tracking-tight"
                                    >
                                        {loadingSteps[stepIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full p-0.5 border border-white/10 overflow-hidden shadow-inner">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary via-purple-400 to-secondary rounded-full relative"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ type: "spring", damping: 15, stiffness: 50 }}
                                >
                                    <motion.div
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2"
                                    />
                                </motion.div>
                            </div>
                            <p className="mt-4 text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">
                                Do not close this window
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

