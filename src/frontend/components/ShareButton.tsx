"use client";

import { Linkedin } from "lucide-react";

export default function ShareButton() {
    const handleShare = () => {
        const shareUrl = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
    };

    return (
        <button
            onClick={handleShare}
            className="w-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 py-4 rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 group relative z-10"
        >
            <Linkedin className="w-5 h-5 group-hover:text-[#0077b5] transition-colors" />
            Share on LinkedIn
        </button>
    );
}
