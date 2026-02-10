
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, FileText, Calendar, Zap, Trash2, Loader2 } from "lucide-react";
import UsageQuota from "./UsageQuota";
import { deleteResume } from "@/backend/actions";
import { useState } from "react";

export default function HistoryList({ resumes }: { resumes: any[] }) {
    const limit = 10; // Should ideally come from props or backend, but match for now
    const count = resumes.length;
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this analysis?")) {
            setDeletingId(id);
            try {
                await deleteResume(id);
                // [FIX] Clear stale localStorage ID if it matches the one we just deleted
                if (typeof window !== "undefined") {
                    const lastId = localStorage.getItem("lastSeenReportId");
                    if (lastId === id) {
                        localStorage.removeItem("lastSeenReportId");
                        // Dispatch storage event so BackButton can update
                        window.dispatchEvent(new Event('storage'));
                    }
                }
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete resume");
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="space-y-12">
            <UsageQuota count={count} limit={limit} />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {resumes.map((resume) => {
                    const info = resume.structured?.personalInfo || {};
                    const name = info.name || "Unnamed Resume";
                    const dateObj = new Date(resume.createdAt);
                    const isDeleting = deletingId === resume.id;

                    const date = dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });

                    const time = dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <motion.div key={resume.id} variants={item}>
                            <div className="relative group">
                                <Link href={`/ results / ${resume.id} `}>
                                    <div className="glass-card p-8 rounded-[2rem] group-hover:border-primary/50 transition-all duration-500 relative overflow-hidden h-full flex flex-col bg-gradient-to-br from-white/5 to-white/[0.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:translate-y-[-4px]">
                                        {/* Animated background glow on hover */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Score Badge */}
                                            <div className="absolute -top-2 -right-2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 group-hover:border-primary/30 transition-all shadow-xl">
                                                <Zap className="w-3.5 h-3.5 text-primary fill-primary/20" />
                                                <span className="text-base font-black text-white">{resume.atsScore}</span>
                                            </div>

                                            <div className="mb-8">
                                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                    <FileText className="text-primary w-7 h-7" />
                                                </div>

                                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-1">{name}</h3>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-slate-300 transition-colors">
                                                        <Calendar size={14} className="text-primary/60" />
                                                        <span className="text-sm font-medium">{date}</span>
                                                        <div className="flex items-center gap-2.5 text-slate-500 group-hover:text-slate-400 transition-colors">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                            <span className="text-[13px] font-medium tracking-wide uppercase">{time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                                    View Analysis
                                                </span>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:translate-x-1">
                                                    <ChevronRight className="text-slate-400 group-hover:text-white w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Delete Button - Relative to card but not child of Link */}
                                <button
                                    onClick={(e) => handleDelete(e, resume.id)}
                                    disabled={isDeleting}
                                    className="absolute bottom-6 right-20 p-2.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-md z-20 shadow-lg shadow-red-500/10"
                                    title="Delete Analysis"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
