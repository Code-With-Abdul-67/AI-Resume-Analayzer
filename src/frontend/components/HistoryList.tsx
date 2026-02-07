"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, FileText, Calendar, Zap } from "lucide-react";

export default function HistoryList({ resumes }: { resumes: any[] }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {resumes.map((resume) => {
                const info = resume.structured?.personalInfo || {};
                const name = info.name || "Unnamed Resume";
                const date = new Date(resume.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                return (
                    <motion.div key={resume.id} variants={item}>
                        <Link href={`/results/${resume.id}`}>
                            <div className="glass-card p-6 rounded-3xl group hover:border-primary/50 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                                {/* Score Badge */}
                                <div className="absolute top-4 right-4 bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                                    <Zap className="w-3 h-3 text-primary" />
                                    <span className="text-sm font-black text-white">{resume.atsScore}</span>
                                </div>

                                <div>
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <FileText className="text-slate-400 group-hover:text-primary transition-colors" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{name}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                        <Calendar size={14} />
                                        {date}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Report
                                    </span>
                                    <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
