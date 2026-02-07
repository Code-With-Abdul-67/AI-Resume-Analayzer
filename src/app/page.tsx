"use client";

import UploadZone from "@/frontend/components/UploadZone";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };


  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col bg-transparent">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px]" />
      </div>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto px-4 w-full relative z-10 gap-8 md:gap-12 lg:gap-16 pt-16"
      >
        {/* Header Section */}
        <motion.header variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl lg:text font-black tracking-tighter text-white drop-shadow-2xl">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">Resume</span> Analyzer
          </h1>
        </motion.header>

        {/* Upload Area */}
        <motion.div variants={itemVariants} className="max-w-xl w-full relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
          <section className="glass-card rounded-3xl p-1 relative z-10 shadow-2xl">
            <UploadZone />
          </section>
        </motion.div>

        {/* Features Grid */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[
            { title: "Deep Analysis", desc: "ATS score based on 2026 hiring standards.", color: "text-primary" },
            { title: "Smart Rewrite", desc: "AI restructures your resume for impact.", color: "text-secondary" },
            { title: "Actionable Tips", desc: "Line-by-line feedback to improve keywords.", color: "text-accent" }
          ].map((feature, i) => (
            <div key={i} className="p-6 glass-card rounded-3xl hover:bg-white/5 transition-all duration-500 group cursor-default border border-white/5">
              <h3 className={`text-base font-bold mb-1 ${feature.color} group-hover:brightness-125 transition-all`}>{feature.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
            </div>
          ))}
        </motion.section>
      </motion.main>

      {/* Footer */}
      <footer className="w-full pb-10 pt-4 text-center relative z-10">
        <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em] opacity-100">
          Powered by Gemini & Next.JS ✨
        </p>
      </footer>
    </div>
  );
}



