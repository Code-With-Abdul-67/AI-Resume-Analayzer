"use client";

import { motion } from "framer-motion";
import { Zap, AlertCircle } from "lucide-react";

interface UsageQuotaProps {
    count: number;
    limit: number;
    compact?: boolean;
}

export default function UsageQuota({ count, limit, compact = false }: UsageQuotaProps) {
    const percentage = Math.min((count / limit) * 100, 100);
    const isFull = count >= limit;

    if (compact) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <Zap className={`w-4 h-4 ${isFull ? 'text-amber-400' : 'text-primary'}`} />
                <span className="text-sm font-bold text-white">
                    {count} / {limit} <span className="text-slate-500 font-medium ml-1">Used</span>
                </span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-[2rem] relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent border-primary/20"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isFull ? 'bg-amber-400/20 border-amber-400/30' : 'bg-primary/20 border-primary/30'} border`}>
                            {isFull ? <AlertCircle className="text-amber-400 w-6 h-6" /> : <Zap className="text-primary w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Analysis Limit</h3>
                            <p className="text-slate-400 text-sm">You have used {count} of your {limit} free analyses.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span className={isFull ? 'text-amber-400' : 'text-primary'}>Usage Level</span>``
                        <span className="text-slate-400">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-4 bg-black/40 rounded-full p-1 border border-white/5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${isFull ? 'from-amber-400 to-orange-500' : 'from-primary to-purple-500'} relative`}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>
                </div>

                {isFull && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 text-amber-400 text-sm font-medium flex items-center gap-2"
                    >
                        <AlertCircle size={16} />
                        Limit reached. Upgrade to Pro for unlimited analyses.
                    </motion.p>
                )}
            </div>

            {/* Background decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
    );
}
