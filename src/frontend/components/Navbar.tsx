"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Github, HandHelping, UserPlus, Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const isLoading = status === "loading";


    const navLinks = [
        {
            name: "Become a Contributor",
            href: "https://github.com/Code-With-Abdul-67/resume-ai-analyzer/issues",
            icon: <HandHelping className="w-4 h-4" />,
        },
        {
            name: "GitHub",
            href: "https://github.com/Code-With-Abdul-67/resume-ai-analyzer",
            icon: <Github className="w-4 h-4" />,
        },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[999] border-b border-violet-500/10 bg-background/20 backdrop-blur-xl">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-white font-black text-lg">R</span>
                            </div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                                AI Resume Analyzer
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-card flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border-white/10 hover:border-primary/60 hover:bg-primary/30 shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                                >
                                    {link.icon}
                                    {link.name}
                                </a>
                            ))}

                            {isLoading ? (
                                <div className="w-24 h-9 bg-primary/10 animate-pulse rounded-lg ml-2" />
                            ) : session ? (
                                <div className="flex items-center gap-3 ml-2">
                                    <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-lg border-white/10">
                                        {session.user?.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                className="w-6 h-6 rounded-full border border-primary/40"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                                                <span className="text-[10px] font-bold text-primary">
                                                    {session.user?.name?.charAt(0) || "U"}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
                                            {session.user?.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="glass-card px-4 py-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-white/10 hover:border-rose-500/40 transition-all duration-300 text-sm font-bold"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn("google")}
                                    className="glass-card hover:bg-primary/30 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 border-white/10 hover:border-primary/60 shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign In
                                </button>
                            )}
                        </div>


                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>


                {/* Mobile Nav */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden absolute top-20 left-4 right-4 z-40"
                        >
                            <div className="glass-card rounded-2xl p-6 space-y-4 border-white/10 shadow-2xl">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-card flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 border-white/10 hover:border-primary/60 hover:bg-primary/30 shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </a>
                                ))}
                                <hr className="border-white/5" />
                                {isLoading ? (
                                    <div className="w-full h-12 bg-primary/10 animate-pulse rounded-xl" />
                                ) : session ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl border-white/10">
                                            {session.user?.image && (
                                                <img
                                                    src={session.user.image}
                                                    alt="User"
                                                    className="w-8 h-8 rounded-full border border-primary/40"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">
                                                    {session.user?.name}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {session.user?.email}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                setShowLogoutConfirm(true);
                                            }}
                                            className="w-full glass-card hover:bg-rose-500/20 text-rose-400 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border-white/10 hover:border-rose-500/40"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            signIn("google");
                                        }}
                                        className="w-full glass-card hover:bg-primary/30 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border-white/10 hover:border-primary/60 shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card max-w-sm w-full p-8 rounded-3xl border-white/10 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
                                <LogOut className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Sign Out</h3>
                            <p className="text-slate-400 mb-8">
                                Do you really want to sign out?
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all shadow-lg shadow-rose-500/25 outline-none"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
