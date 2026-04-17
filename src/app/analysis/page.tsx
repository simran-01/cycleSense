
"use client";

import KpiCard from '@/components/analysis/KpiCard';
import CycleLengthChart from '@/components/analysis/CycleLengthChart';
import { useCycle } from '@/context/CycleContext';
import { Skeleton } from '@/components/ui/skeleton';

const AnalysisSkeleton = () => (
  <div className="container mx-auto max-w-4xl px-4 py-8">
    <div className="text-center mb-8">
      <Skeleton className="h-10 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    <Skeleton className="h-80 w-full" />
  </div>
);

const NotEnoughData = () => (
    <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl text-primary">Cycle Analysis</h1>
          <p className="text-muted-foreground mt-2">Insights from your historical cycle data.</p>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-background rounded-lg border-2 border-dashed border-muted">
            <h2 className='font-headline text-2xl text-primary/90'>Not Enough Data</h2>
            <p className='text-muted-foreground mt-2 text-center max-w-sm'>We need at least one complete past cycle to generate your analysis chart.</p>
        </div>
    </div>
)


export default function AnalysisPage() {
  const { logs, loading } = useCycle();

  if (loading || !logs || logs.length === 0) {
    return <AnalysisSkeleton />;
  }

  try {
    // --- KPI Card Logic ---
    const averageCycleLength = Number(logs[0]?.avgCycleLength) || 0;
    const cycleVariation = Number(logs[0]?.cycleVariation) || 0;
    const averagePeriodLength = Number(logs[0]?.avgPeriodLength) || 0;

    // --- Medical Evaluation Logic ---
    const isCycleNormal = averageCycleLength >= 21 && averageCycleLength <= 35;
    const isPeriodNormal = averagePeriodLength >= 2 && averagePeriodLength <= 7;
    const isVariationNormal = cycleVariation <= 9;
    const isOverallNormal = isCycleNormal && isPeriodNormal && isVariationNormal;


    // --- Bar Chart Logic ---
    const cycleStarts = logs.filter(log => String(log.isPredicted).trim().toLowerCase() === 'false' && String(log.cycleDay).trim() === '1');
    const last6 = cycleStarts.slice(-6);
    const chartData = last6.map(log => ({ 
        name: new Date(log.date).toLocaleString('default', { month: 'short' }), 
        length: Number(log.cycleLength) || 0
    }));

    if (chartData.length === 0) {
        return <NotEnoughData />
    }

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl text-primary">Cycle Analysis</h1>
          <p className="text-muted-foreground mt-2">Insights from your historical cycle data.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard title="Avg. Cycle" value={averageCycleLength} unit="days" />
          <KpiCard title="Cycle Variation" value={cycleVariation} unit="days" />
          <KpiCard title="Avg. Period" value={averagePeriodLength} unit="days" />
        </div>
        <CycleLengthChart data={chartData} />

        <div className="mt-8 p-6 bg-pink-50 rounded-xl border border-pink-100">
          <h3 className="text-lg font-semibold text-pink-600 mb-3">Your Cycle Insights</h3>
          {isOverallNormal ? (
            <p className="text-gray-700 leading-relaxed">
              Your cycle is in the normal range! Your average cycle length, variation, and average period are all typical. Your body is doing fine. Keep taking care of yourself physically and emotionally, and try not to stress out. You are a powerful woman—go achieve your goals while practicing patience and self-love. Schedule and plan your life according to your phases. Enjoy womanhood! ✨
            </p>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              We noticed some recent changes in your cycle metrics that fall slightly outside the typical statistical ranges. Cycle variations are very common and are likely due to stress, travel, diet, or lifestyle shifts. However, if this is a new pattern for you, please consider consulting a doctor or healthcare provider just to be safe.
            </p>
          )}
        </div>
        
      </div>
    );

  } catch (error) {
    console.error("Error in AnalysisPage:", error);
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="font-headline text-4xl text-destructive">Error</h1>
        <p className="text-muted-foreground mt-2">An unexpected error occurred while analyzing your data.</p>
      </div>
    );
  }
}
