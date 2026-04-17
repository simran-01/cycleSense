"use client";

import CycleCalendar from "@/components/calendar/CycleCalendar";
import { useCycle } from "@/context/CycleContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  const { cycleInfo, loading } = useCycle();

  if (loading || !cycleInfo) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
            </div>
            <Skeleton className="h-[600px] w-3/4 mx-auto" />
        </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl text-primary">Cycle Calendar</h1>
        <p className="text-muted-foreground mt-2">Visualize your cycle, past and future.</p>
      </div>
      <CycleCalendar
        logs={cycleInfo.logs}
        currentDate={cycleInfo.currentDate}
      />
    </div>
  );
}
