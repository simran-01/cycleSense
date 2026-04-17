
"use client";

import React, { useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import HealthStatusBar from '@/components/dashboard/HealthStatusBar';
import CycleCircle from '@/components/dashboard/CycleCircle';
import PhaseDeepDive from '@/components/dashboard/PhaseDeepDive';
import DailyMuse from '@/components/dashboard/DailyMuse';
import { useCycle } from '@/context/CycleContext';
import { Skeleton } from '@/components/ui/skeleton';
import NextPeriodCard from '@/components/dashboard/NextPeriodCard';

export default function DashboardPage() {
  const { cycleInfo, loading } = useCycle();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (cycleInfo) {
      setSelectedDay(cycleInfo.currentDay);
    }
     // cleanup timeout on unmount
    return () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
  }, [cycleInfo]);

  const handleDaySelect = (day: number) => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    setSelectedDay(day);
    timeoutRef.current = setTimeout(() => {
        if (cycleInfo) {
            setSelectedDay(cycleInfo.currentDay);
        }
    }, 3000); // 3 seconds
  };
  
  if (loading || !cycleInfo || selectedDay === null) {
    return <DashboardSkeleton />;
  }

  const {
    currentDay,
    currentDate,
    averageCycleLength,
    logs
  } = cycleInfo;

  // --- Dashboard Logic ---
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(log => log.date === todayStr);

  const hasFlowData = todayLog?.period && String(todayLog.period).trim() !== '';
  const isTrackedToday = todayLog?.phase === 'Menstrual' && hasFlowData;

  const nextPeriodDateStr = logs[0]?.next_period_date;

  // --- NEW DYNAMIC TIME MATH ---
  let dynamicLateDays = 0;
  if (nextPeriodDateStr) {
    const todayDateObj = new Date(todayStr);
    const expectedDateObj = new Date(nextPeriodDateStr);
    // Calculate difference in days, floor it, ensure it doesn't go below 0
    dynamicLateDays = Math.max(0, Math.floor((todayDateObj.getTime() - expectedDateObj.getTime()) / (1000 * 60 * 60 * 24)));
  }
  // -----------------------------

  let nextPeriodText = "Calculating...";
  let topStatusText = "Your cycle is on track ✨";

  if (isTrackedToday) {
    nextPeriodText = "Currently in Menstrual Phase";
  } else if (dynamicLateDays > 0) {
    nextPeriodText = "Your period may start today";
    topStatusText = `Your Period is late by ${dynamicLateDays} days`;
  } else if (nextPeriodDateStr === todayStr || (todayLog && String(todayLog.is_predicted).toLowerCase() === 'true')) {
    nextPeriodText = "Your period may start today";
  } else if (nextPeriodDateStr && nextPeriodDateStr > todayStr) {
    const formattedDate = new Date(nextPeriodDateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
    nextPeriodText = `Next period starts on ${formattedDate}`; 
  }
  
  const isLateForStatus = dynamicLateDays > 0;
  
  const nextPeriodContent = (
      <p className="font-headline text-2xl font-bold text-primary mt-1 px-4 text-center">
          {nextPeriodText}
      </p>
  );


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col items-center gap-8">
        <HealthStatusBar statusMessage={topStatusText} isLate={isLateForStatus} />
        <CycleCircle
          currentDay={currentDay}
          currentDate={currentDate}
          avgCycleLength={averageCycleLength}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
        />

        <div className="w-full">
            <NextPeriodCard>
              {nextPeriodContent}
            </NextPeriodCard>
        </div>

        <div className="w-full text-center mt-4">
          <h2 className="font-headline text-3xl text-primary/80">
            Phase Deep-Dive
          </h2>
          <p className="text-muted-foreground mt-1">
            Explore the characteristics of each phase.
          </p>
        </div>

        <PhaseDeepDive
          selectedDay={selectedDay}
        />

        <DailyMuse />
      </div>
    </div>
  );
}

const DashboardSkeleton = () => (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col items-center gap-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-96 w-96 rounded-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
)
