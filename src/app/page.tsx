import UploadZone from "@/components/UploadZone";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-6xl mx-auto px-4 w-full space-y-16">
        <header className="text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> v2.5 Now Live
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-2xl">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">Resume</span> Analyzer
          </h1>
          
        </header>

        {/* Upload Area */}
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20 animate-pulse"></div>
          <section className="glass-card rounded-3xl p-1 relative z-10">
            <UploadZone />
          </section>
        </div>

        {/* Features - Glass Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-8">
          {[
            { title: "Deep Analysis", desc: "Get a comprehensive ATS compatibility score based on 2024 hiring standards.", color: "text-primary" },
            { title: "Smart Rewrite", desc: "Our AI completely restructures your resume to highlight your impact.", color: "text-secondary" },
            { title: "Actionable Tips", desc: "Specific, line-by-line feedback to improve readability and keywords.", color: "text-accent" }
          ].map((feature, i) => (
            <div key={i} className="p-8 glass-card rounded-2xl hover:bg-white/10 transition-colors group">
              <h3 className={`text-xl font-bold mb-3 ${feature.color} group-hover:brightness-125`}>{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </section>

        <footer className="text-center pt-8 text-slate-500 text-sm font-medium">
          Powered by Gemini 2.5 Flash & Next.js 15
        </footer>
      </main>
    </div>
  );
}
