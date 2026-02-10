import { auth } from "@/backend/auth";
import { prisma } from "@/backend/lib/prisma";
import { redirect } from "next/navigation";
import HistoryList from "@/frontend/components/HistoryList";
import ClearHistoryButton from "@/frontend/components/ClearHistoryButton";
import BackButton from "@/frontend/components/BackButton";
import { History as HistoryIcon, Plus } from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
    const session = await auth();

    if (!session || !session.user?.id) {
        redirect("/");
    }

    const resumes = await prisma.resume.findMany({
        where: {
            userId: session.user.id
        } as any,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
                <BackButton text="Back to Report" className="mb-4" />

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                            <HistoryIcon className="text-primary w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">Analysis History</h1>
                            <p className="text-slate-400 mt-1">Track your progress and access past resume reports.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="glass-card px-6 py-2.5 rounded-xl bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 font-bold flex items-center gap-2 shadow-lg shadow-primary/5"
                        >
                            <Plus size={18} />
                            New Analysis
                        </Link>
                        {resumes.length > 0 && <ClearHistoryButton />}
                    </div>
                </header>

                {resumes.length === 0 ? (
                    <div className="text-center py-32 glass-card rounded-3xl border-dashed border-white/10 flex flex-col items-center">
                        <HistoryIcon className="w-16 h-16 text-slate-600 mb-6 opacity-30" />
                        <h2 className="text-2xl font-bold text-slate-400">No history found</h2>
                        <p className="text-slate-500 mt-2 mb-10">Upload your first resume to see it here!</p>

                        <Link
                            href="/"
                            className="px-8 py-4 bg-primary rounded-2xl text-white font-black text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 active:scale-95"
                        >
                            <Plus size={24} />
                            Start New Analysis
                        </Link>
                    </div>
                ) : (
                    <HistoryList resumes={resumes as any[]} />
                )}
            </div>
        </div>
    );
}
