
"use client";

import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { getPhaseForDay, type CyclePhase } from "@/lib/cycle-data";
import { format, addDays } from "date-fns";
import { useCycle } from "@/context/CycleContext";

interface CycleCircleProps {
  currentDay: number;
  currentDate: Date;
  avgCycleLength: number;
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const CycleCircle: React.FC<CycleCircleProps> = ({ currentDay, currentDate, avgCycleLength, selectedDay, onDaySelect }) => {
  const { logs, loading } = useCycle();
  const totalDays = 28;

  const dayMarkers = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const angle = (day / totalDays) * 2 * Math.PI - Math.PI / 2;
      const x = 50 + 48 * Math.cos(angle);
      const y = 50 + 48 * Math.sin(angle);
      return { day, x: x.toFixed(4), y: y.toFixed(4) };
    });
  }, [totalDays]);

  const displayData = useMemo(() => {
    try {
      if (loading || !logs || logs.length === 0 || selectedDay === null || currentDay === null || !currentDate) {
        return { date: "Loading...", day: "...", phase: "..." };
      }
      
      const safeCurrentDate = new Date(currentDate);
      if (isNaN(safeCurrentDate.getTime())) {
         return { date: "Select a Day", day: " ", phase: " " };
      }

      const dayDiff = selectedDay - currentDay;
      const targetDate = addDays(safeCurrentDate, dayDiff);
      const targetDateStr = format(targetDate, 'yyyy-MM-dd');
      
      const day = logs.find(log => log.date === targetDateStr);
      
      if (!day) {
        return { 
          date: format(targetDate, 'MMMM d'), 
          day: selectedDay, 
          phase: getPhaseForDay(selectedDay, avgCycleLength) 
        };
      }

      const date = format(targetDate, 'MMMM d');
      
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const isSelectedToday = day.date === todayStr;
      const isPredicted = String(day.isPredicted).toLowerCase() === 'true';

      let displayPhase: CyclePhase | string = day.phase;
      let displayDay: string | number = day.cycleDay;

      if (isSelectedToday && isPredicted && day.phase === 'Menstrual') {
        // Mask ONLY today if it is predicted/untracked
        displayPhase = 'Luteal';
        const lastActualStart = logs.findLast(log => Number(log.cycleDay) === 1 && String(log.isPredicted).toLowerCase() !== 'true');
        if (lastActualStart && day.date) {
            const diffTime = Math.abs(new Date(day.date).getTime() - new Date(lastActualStart.date).getTime());
            displayDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
      } else if (isPredicted && day.phase === 'Menstrual') {
        // Normal future predicted days
        displayPhase = 'Predicted Menstrual';
      }

      return {
        date,
        day: displayDay,
        phase: displayPhase
      };

    } catch (error) {
      console.error("Error calculating display data in CycleCircle:", error);
      return { date: "Loading...", day: "...", phase: "..." };
    }
  }, [currentDate, currentDay, selectedDay, avgCycleLength, logs, loading]);


  return (
    <div
      className="relative flex h-96 w-96 items-center justify-center rounded-full bg-white transform scale-110"
      style={{
        boxShadow: "0 0 45px 10px hsl(var(--primary) / 0.25), inset 0 0 20px hsl(var(--background) / 0.8)",
      }}
    >
      <div className="absolute inset-2 rounded-full border-2 border-primary/10" />

      {dayMarkers.map(({ day, x, y }) => (
        <button
          key={day}
          onClick={() => onDaySelect(day)}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full transition-all duration-300"
          style={{ top: `${y}%`, left: `${x}%` }}
          aria-label={`Select day ${day}`}
        >
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full bg-muted transition-all",
              day === (currentDay % totalDays || totalDays) && "bg-accent scale-150",
              day === selectedDay && "ring-2 ring-primary ring-offset-2 ring-offset-white"
            )}
          />
        </button>
      ))}

      <div className="z-10 text-center">
        <p className="font-headline text-2xl uppercase tracking-widest text-primary">
          {displayData.date}
        </p>
        <p className="font-headline text-8xl font-bold text-primary/80 -my-2">
          {displayData.day}
        </p>
        <p className="text-xl font-medium text-muted-foreground">{displayData.phase} Phase</p>
      </div>
    </div>
  );
};

export default CycleCircle;
