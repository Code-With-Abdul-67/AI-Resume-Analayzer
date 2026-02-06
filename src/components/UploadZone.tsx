"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { processResume } from '@/app/actions';

const loadingSteps = [
    "Analyzing your resume...",
    "Calculating ATS score...",
    "Thinking best recommendations...",
    "Finalizing report..."
];

export default function UploadZone() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);

    // Simulate progress and step changes
    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return prev;

                let increment = 0;
                if (prev < 80) {
                    increment = Math.random() * 10 + 5; // Much faster initially
                } else if (prev < 90) {
                    increment = Math.random() * 1 + 0.1; // Medium
                } else {
                    increment = 0.2; // Crawl at the very end
                }

                return Math.min(prev + increment, 100);
            });
        }, 150);

        const stepInterval = setInterval(() => {
            setStepIndex(prev => {
                if (prev >= loadingSteps.length - 1) return prev;
                return prev + 1;
            });
        }, 2000); // Shorter step interval (2s instead of 3.5s)

        return () => {
            clearInterval(interval);
            clearInterval(stepInterval);
        };
    }, [loading]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setProgress(0);
        setStepIndex(0);

        const formData = new FormData();
        formData.append("file", file);

        try {
            await processResume(formData);
        } catch (error: any) {
            // Next.js redirect() throws a special error that we should not catch as a failure
            if (error.message === 'NEXT_REDIRECT') {
                return;
            }
            console.error("Upload failed", error);
            setLoading(false);
            alert("Something went wrong during analysis.");
        }
    };

    return (
        <>
            {/* Standard Upload UI */}
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
            </motion.div>

            {/* Full Screen Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
                    >
                        {/* Immersive Glass Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px]" />

                        <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
                            <div className="relative mb-12">
                                {/* Spinning Outer Glow */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-20px] rounded-full border border-primary/20 bg-primary/5 blur-2xl"
                                />

                                {/* Spinning Gradient Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-40 h-40 rounded-full border-[6px] border-white/5 border-t-primary border-r-secondary shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                                />

                                {/* Inner Percentage */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-white">{Math.round(progress)}%</span>
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Processing</span>
                                </div>
                            </div>

                            {/* Animated Step Text */}
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

                            {/* Premium Loading Bar Container */}
                            <div className="w-full h-3 bg-white/5 rounded-full p-0.5 border border-white/10 overflow-hidden shadow-inner overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary via-purple-400 to-secondary rounded-full relative"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ type: "spring", damping: 15, stiffness: 50 }}
                                >
                                    {/* Animated Glow over the progress bar */}
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
