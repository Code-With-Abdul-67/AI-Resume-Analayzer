"use client"
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF';
import { FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PDFDownloadButtonProps {
    data: any;
    fileName?: string;
}

export default function PDFDownloadButton({ data, fileName = "optimized-resume.pdf" }: PDFDownloadButtonProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return (
        <div className="w-full bg-white/5 border border-white/10 py-4 rounded-xl font-bold text-lg text-white/50 flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            Preparing PDF...
        </div>
    );

    return (
        <PDFDownloadLink document={<ResumePDF data={data} />} fileName={fileName}>
            {({ blob, url, loading, error }) => (
                <button
                    disabled={loading}
                    className="w-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 py-4 rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 group relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin text-primary" />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <FileText size={20} className="group-hover:text-primary transition-colors" />
                            Download Improved PDF
                        </>
                    )}
                </button>
            )}
        </PDFDownloadLink>
    );
}
