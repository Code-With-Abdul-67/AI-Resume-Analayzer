import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AnimatedScore } from "@/components/motion/AnimatedScore";
import { CheckCircle2, ChevronRight, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ResultsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const resume = await prisma.resume.findUnique({
        where: { id },
    });

    if (!resume) notFound();

    const structured = resume.structured as any;

    return (
        <div className="min-h-screen py-12 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-glass-border">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                            <span className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                                <FileText className="text-primary w-8 h-8" />
                            </span>
                            Analysis Results
                        </h1>
                        <p className="text-lg text-slate-400 mt-4 max-w-2xl">
                            We've analyzed your resume against thousands of job descriptions.
                            Here is your personalized optimization report.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <AnimatedScore score={resume.atsScore} />
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Main Content - Optimized Resume */}
                    <div className="xl:col-span-8 space-y-8">
                        <section className="glass-card rounded-3xl overflow-hidden">
                            <div className="px-8 py-6 border-b border-glass-border bg-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-8 bg-accent rounded-full" />
                                    Resume Report
                                </h2>
                            </div>

                            <div className="p-8 space-y-12">
                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-4">
                                        Personal Details <div className="h-px bg-slate-800 grow" />
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                        {Object.entries(structured.personalInfo || {}).map(([key, value]) => {
                                            if (!value) return null;
                                            return (
                                                <div key={key} className="group">
                                                    <span className="text-[10px] text-primary uppercase tracking-wider font-bold mb-1 block group-hover:text-accent transition-colors">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className="text-slate-200 text-base font-medium border-b border-transparent group-hover:border-slate-700 pb-0.5 transition-all">
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Summary */}
                                {structured.summary && (
                                    <div className="relative group">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-4">
                                            Professional Summary <div className="h-px bg-slate-800 grow" />
                                        </h3>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/30 transition-colors">
                                            <p className="text-slate-300 leading-8 text-lg font-light">
                                                {structured.summary}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {structured.skills && structured.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-4">
                                            Core Competencies <div className="h-px bg-slate-800 grow" />
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {structured.skills.map((skill: string, i: number) => (
                                                <span key={i} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium hover:border-accent/50 hover:text-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all cursor-default">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience */}
                                {structured.experience && structured.experience.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-4">
                                            Work History <div className="h-px bg-slate-800 grow" />
                                        </h3>
                                        <div className="space-y-10">
                                            {structured.experience.map((exp: any, i: number) => (
                                                <div key={i} className="relative pl-8 border-l border-slate-800 hover:border-primary transition-colors group">
                                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-800 group-hover:bg-primary group-hover:scale-125 transition-all" />

                                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 gap-2">
                                                        <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{exp.role}</h4>
                                                        <span className="text-sm font-mono text-slate-400 bg-black/30 px-3 py-1 rounded-md border border-white/5">
                                                            {exp.duration}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg text-accent/80 font-medium mb-4">{exp.company}</p>

                                                    <ul className="space-y-3">
                                                        {exp.achievements?.map((ach: string, j: number) => (
                                                            <li key={j} className="text-slate-400 leading-relaxed flex items-start gap-3 text-[15px]">
                                                                <span className="mt-2 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                                                                {ach}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {structured.education && structured.education.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-4">
                                            Education <div className="h-px bg-slate-800 grow" />
                                        </h3>
                                        <div className="grid gap-4">
                                            {structured.education.map((edu: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg">{edu.degree}</h4>
                                                        <p className="text-slate-400">{edu.school}</p>
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-500">
                                                        {edu.year}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar - Tips & Actions */}
                    <aside className="xl:col-span-4 space-y-8">
                        <section className="glass-card rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] pointer-events-none" />

                            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                                <CheckCircle2 className="text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] rounded-full" size={24} />
                                Optimization Tips
                            </h3>
                            <ul className="space-y-5">
                                {resume.suggestions.map((tip, i) => (
                                    <li key={i} className="flex gap-4 text-sm text-slate-300 leading-relaxed group">
                                        <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-green-400 group-hover:bg-green-400/10 transition-colors">
                                            {i + 1}
                                        </span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-3xl p-8 bg-gradient-to-br from-primary to-violet-900 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />

                            <h3 className="font-bold text-2xl mb-2 relative z-10">Job Ready?</h3>
                            <p className="text-blue-100 mb-8 relative z-10 opacity-90">
                                Your resume is optimized and ready for the modern hiring process.
                            </p>

                            <button className="w-full bg-white text-primary py-4 rounded-xl font-black text-lg hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-xl flex items-center justify-center gap-2">
                                <FileText size={20} />
                                Download Improved PDF
                            </button>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}
