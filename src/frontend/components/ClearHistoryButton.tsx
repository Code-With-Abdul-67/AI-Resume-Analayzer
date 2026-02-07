"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { clearHistory } from "@/backend/actions";

export default function ClearHistoryButton() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleClear = async () => {
        setIsClearing(true);
        try {
            await clearHistory();
            setShowConfirm(false);
            window.location.reload(); // Refresh to show empty state
        } catch (error) {
            console.error("Failed to clear history", error);
            alert("Failed to clear history. Please try again.");
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm"
            >
                <Trash2 size={16} />
                Clear History
            </button>

            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                        onClick={() => setShowConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-card max-w-sm w-full p-8 rounded-3xl text-center shadow-2xl relative border-red-500/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-red-500 w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Clear History?</h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Are you sure you want to delete all your past analysis? This action cannot be undone.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleClear}
                                    disabled={isClearing}
                                    className="w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {isClearing ? "Clearing..." : "Yes, Clear Everything"}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="w-full bg-white/5 text-slate-300 py-3 rounded-xl font-bold hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
