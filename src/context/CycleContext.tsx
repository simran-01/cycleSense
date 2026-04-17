
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  type CycleInfo,
  type DailyLog,
  type PeriodFlow,
  generateCycleData,
  getPhaseForDay,
} from '@/lib/cycle-data';
import { format, parseISO, startOfDay, addDays, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface CycleContextType {
  cycleInfo: CycleInfo | null;
  loading: boolean;
  trackPeriod: (flow: PeriodFlow) => void;
  logs: DailyLog[];
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

const processPrecalculatedData = (logs: DailyLog[]): CycleInfo | null => {
  if (!logs || logs.length === 0) {
    return null;
  }

  const today = startOfDay(new Date());
  const todayStr = format(today, 'yyyy-MM-dd');

  let currentLog = logs.find(log => log.date === todayStr);
  const firstLog = logs[0]; // For global averages

  // Graceful fallback if today's log is somehow missing from the dataset
  if (!currentLog) {
      console.error("Could not find a log for today's date. Using fallback.");
      currentLog = {
          date: todayStr,
          cycleDay: 1,
          phase: 'Menstrual',
          period: null,
          isPredicted: true,
          cycleLength: Number(firstLog?.cycleLength) || 28,
          avgCycleLength: Number(firstLog?.avgCycleLength) || 28,
          avgPeriodLength: Number(firstLog?.avgPeriodLength) || 5,
          cycleVariation: Number(firstLog?.cycleVariation) || 0,
          daysLate: Number(firstLog?.daysLate) || 0,
          energy: null, feelings: null, mind: null, skin: null, socialLife: null, spotting: null,
          next_period_date: firstLog?.next_period_date,
      };
  }
  
  const estimatedNextPeriod = currentLog.next_period_date
    ? parseISO(currentLog.next_period_date)
    : null;

  return {
    currentDay: currentLog.cycleDay,
    currentPhase: currentLog.phase,
    currentDate: today,
    averageCycleLength: Number(firstLog.avgCycleLength) || 28,
    cycleVariation: Number(firstLog.cycleVariation) || 0,
    averagePeriodLength: Number(firstLog.avgPeriodLength) || 5,
    estimatedNextPeriod,
    historicalCycles: [], // This can be built if needed, but is not part of the core request.
    logs,
    daysLate: Number(firstLog.daysLate) || 0,
  };
};

export const CycleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cycleLogs, setCycleLogs] = useState<DailyLog[]>([]);
  const [cycleInfo, setCycleInfo] = useState<CycleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCycleData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/logs');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to fetch cycle data from the server.'
          );
        }
        const logs: DailyLog[] = await response.json();
        if (logs.length === 0) {
          throw new Error('No data returned from BigQuery. Is the table empty?');
        }

        setCycleLogs(logs);
        setCycleInfo(processPrecalculatedData(logs));
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
          variant: 'destructive',
          title: 'Could not connect to backend.',
          description: 'Falling back to mock data. ' + message,
        });
        const mockLogs = generateCycleData();
        setCycleLogs(mockLogs);
        setCycleInfo(processPrecalculatedData(mockLogs));
      } finally {
        setLoading(false);
      }
    };

    fetchCycleData();
  }, [toast]);

  const trackPeriod = useCallback(
    (flow: PeriodFlow) => {
      console.log(`Optimistically updating UI for period tracking with flow: ${flow}`);
      
      const todayStr = format(startOfDay(new Date()), 'yyyy-MM-dd');
      const trackDateObj = startOfDay(parseISO(todayStr));
      const avgCycleLength = Number(cycleLogs[0]?.avgCycleLength) || 28;

      const updatedLogs = cycleLogs.map(log => {
        const logDateObj = startOfDay(parseISO(log.date));
        
        // 1. Update the tracked day
        if (log.date === todayStr) {
          return { 
            ...log, 
            period: flow, 
            phase: 'Menstrual' as CyclePhase, 
            cycleDay: 1, 
            isPredicted: false 
          };
        } 
        // 2. Cascade the update to all future dates
        else if (logDateObj > trackDateObj) {
          const newCycleDay = differenceInDays(logDateObj, trackDateObj) + 1;
          
          return { 
            ...log, 
            cycleDay: newCycleDay,
            phase: getPhaseForDay(newCycleDay, avgCycleLength),
            period: null, // Future days don't have a flow value yet
            isPredicted: true, // Future days are predictions
          };
        }
        
        // 3. Leave past dates alone
        return log;
      });

      setCycleLogs(updatedLogs);
      setCycleInfo(processPrecalculatedData(updatedLogs));
      
       toast({
          title: "Period Tracked!",
          description: `Your flow has been logged as ${flow}.`,
       });

    },
    [cycleLogs, toast]
  );

  return (
    <CycleContext.Provider
      value={{ cycleInfo, loading, trackPeriod, logs: cycleLogs }}
    >
      {children}
    </CycleContext.Provider>
  );
};

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
};
