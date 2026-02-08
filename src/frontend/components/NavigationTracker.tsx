"use client";

import { useEffect } from "react";

export default function NavigationTracker({ reportId }: { reportId: string }) {
    useEffect(() => {
        if (typeof window !== "undefined" && reportId && reportId !== "undefined") {
            localStorage.setItem("lastSeenReportId", reportId);
        }
    }, [reportId]);

    return null;
}
