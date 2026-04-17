"use client";
import { getDailyMuse, CyclePhase } from "@/lib/cycle-data";
import { useCycle } from "@/context/CycleContext";
import { Skeleton } from "../ui/skeleton";

export default function DailyMuse() {
    const { cycleInfo, loading } = useCycle();
    
    if (loading || !cycleInfo) {
        return <Skeleton className="h-6 w-3/4" />;
    }

    const muse = getDailyMuse(cycleInfo.currentPhase);

    return (
        <div className="w-full text-center mt-4">
            <p className="text-lg italic text-muted-foreground">"{muse}"</p>
        </div>
    );
}
