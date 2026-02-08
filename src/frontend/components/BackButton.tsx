"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackButton({ text = "Back", className = "" }: { text?: string, className?: string }) {
    const router = useRouter();
    const [lastId, setLastId] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = localStorage.getItem("lastSeenReportId");
            if (id && id !== "undefined") {
                setLastId(id);
            }
        }
    }, []);

    if (!lastId) return null;

    const handleBack = () => {
        // First try router.back() for smoothest experience
        // If that fails or if we want to be explicit:
        router.push(`/results/${lastId}`);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={className}
            >
                <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleBack}
                    className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group shadow-lg"
                >
                    <motion.div
                        animate={{ x: isHovered ? -4 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <ChevronLeft className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="font-bold text-sm tracking-wide">{text}</span>

                    {/* Animated underline effect */}
                    <motion.div
                        className="absolute bottom-2 left-12 right-4 h-px bg-primary/50"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
