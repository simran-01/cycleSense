"use client";

import { getPhaseForDay, getPhaseDeepDive, type CyclePhase } from "@/lib/cycle-data";
import { GlassCard } from "../ui/glass-card";
import { useCycle } from "@/context/CycleContext";
import { addDays, format } from "date-fns";

interface PhaseDeepDiveProps {
  selectedDay: number;
}

export default function PhaseDeepDive({ selectedDay }: PhaseDeepDiveProps) {
  const { cycleInfo, loading, logs } = useCycle();

  if (loading || !cycleInfo) {
    return <GlassCard className="w-full h-96 animate-pulse" />;
  }
  
  const { averageCycleLength, currentDay, currentDate } = cycleInfo;

  // Find the date that corresponds to the selected day on the cycle ring
  const dayDiff = selectedDay - currentDay;
  const targetDate = addDays(currentDate, dayDiff);
  const targetDateStr = format(targetDate, 'yyyy-MM-dd');
  
  // Find the log entry for that specific date
  const day = logs.find(log => log.date === targetDateStr);
  
  let descriptionPhase: CyclePhase;

  if (day) {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const isSelectedToday = day.date === todayStr;

    // Bulletproof tracking checks as per user request
    const isPredicted = String(day.isPredicted).toLowerCase() === 'true';
    const hasFlowData = day.period && String(day.period).trim() !== '';
    const isTracked = day.phase === 'Menstrual' && hasFlowData;

    let tempPhase = day.phase;

    // If today is masked as "Extended Luteal" in the UI, force the description to match
    if (isSelectedToday && isPredicted && !isTracked) {
      tempPhase = 'Luteal';
    }

    descriptionPhase = tempPhase as CyclePhase;
  } else {
    // Fallback for dates far in the future not covered by logs
    descriptionPhase = getPhaseForDay(selectedDay, averageCycleLength);
  }

  const content = getPhaseDeepDive(descriptionPhase);

  return (
    <div className="w-full">
        <GlassCard>
            <div className="p-6">
                <h2 className="font-headline text-3xl text-primary mb-4">{content.title}</h2>
                <div className="space-y-4 text-muted-foreground">
                    <div>
                        <h3 className="font-bold text-primary/80 mb-1">Biology</h3>
                        <p>{content.biology}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-primary/80 mb-1">Mood & Mental State</h3>
                        <p>{content.mood}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-primary/80 mb-1">Physical State</h3>
                        <p>{content.physical}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-primary/80 mb-1">Advice</h3>
                        <p>{content.advice}</p>
                    </div>
                </div>
            </div>
        </GlassCard>
    </div>
  );
}
