
"use client";

import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday as isTodayDateFns
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import type { DailyLog } from '@/lib/cycle-data';

interface CycleCalendarProps {
  logs: DailyLog[];
  currentDate: Date;
}

const CycleCalendar: React.FC<CycleCalendarProps> = ({ logs, currentDate }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(currentDate));

  const logsMap = new Map(logs.map(log => [log.date, log]));
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-2 px-4">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="font-headline text-2xl text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground px-4">
        {days.map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7">
        {daysInMonth.map((day, index) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayLog = logsMap.get(dayStr);
          
          const isTrackedPeriod = dayLog?.phase === 'Menstrual' && String(dayLog.isPredicted).toLowerCase() !== 'true';
          const isPredictedPeriod = dayLog?.phase === 'Menstrual' && String(dayLog.isPredicted).toLowerCase() === 'true';
          const isOvulatory = dayLog?.phase === 'Ovulatory';

          const isToday = isTodayDateFns(day);
          const isCurrentMonth = isSameMonth(day, monthStart);

          const cellClasses = cn(
            'relative h-16 border-t border-border/20 flex items-center justify-center',
             index % 7 !== 0 && 'border-l',
            !isCurrentMonth && 'text-muted-foreground/50 bg-muted/20'
          );

          const dayNumberClasses = cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors duration-200',
            isToday && 'ring-2 ring-accent',
            isTrackedPeriod && 'bg-primary text-primary-foreground',
            isPredictedPeriod && 'bg-primary/10 text-primary border border-dashed border-primary/50',
            isOvulatory && !isTrackedPeriod && !isPredictedPeriod && 'bg-secondary text-secondary-foreground',
            !isCurrentMonth && 'text-muted-foreground/50'
          );

          return (
            <div key={day.toString()} className={cellClasses}>
              <span className={dayNumberClasses}>
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full md:w-3/4">
        <GlassCard className="p-2">
            {renderHeader()}
            <div className="px-2">
             {renderDays()}
             {renderCells()}
            </div>
        </GlassCard>
         <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary" /> Tracked Period</div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary/20 border border-dashed border-primary" /> Predicted Period</div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-secondary" /> Ovulatory Phase</div>
        </div>
    </div>
  );
};

export default CycleCalendar;
