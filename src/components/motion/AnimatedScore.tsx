"use client";
import { motion } from "framer-motion";

export const AnimatedScore = ({ score }: { score: number }) => (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-40 w-40">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-accent blur-[40px] opacity-20 rounded-full" />

            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />

                {/* Progress Circle */}
                <motion.circle
                    cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none"
                    className="text-accent drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="text-4xl font-black text-white"
                >
                    {score}%
                </motion.span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">Match Rate</span>
            </div>
        </div>
        <h3 className="mt-4 font-bold text-white tracking-wide text-lg">ATS Compatibility</h3>
    </div>
);
