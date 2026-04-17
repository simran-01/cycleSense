
"use client";

import { getPhaseTips, type CyclePhase } from '@/lib/cycle-data';
import LifestyleCard from '@/components/dashboard/LifestyleCard';
import { Dumbbell, Heart, Leaf, Sparkles } from 'lucide-react';
import { useCycle } from '@/context/CycleContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsPage() {
  const { cycleInfo, loading, logs } = useCycle();

  if (loading || !cycleInfo || !logs || logs.length === 0) {
    return <RecommendationsSkeleton />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === todayStr);

  const isPredictedToday = String(todayLog?.isPredicted).toLowerCase() === 'true';
  const hasFlowData = todayLog?.period && String(todayLog.period).trim() !== '';
  const isTrackedToday = todayLog?.phase === 'Menstrual' && hasFlowData;

  let contentPhase: CyclePhase = (todayLog?.phase as CyclePhase) || 'Follicular';
  let displayPhaseName: string = todayLog?.phase || 'Follicular';

  if (isPredictedToday && !isTrackedToday) {
    contentPhase = 'Luteal';
    displayPhaseName = 'Extended Luteal';
  }

  const tips = getPhaseTips(contentPhase);

  const lifestyleCards = [
    {
      icon: Sparkles,
      title: 'Skincare',
      tip: tips.skincare,
      color: 'text-pink-400',
    },
    {
      icon: Dumbbell,
      title: 'Exercise',
      tip: tips.exercise,
      color: 'text-purple-400',
    },
    {
      icon: Leaf,
      title: 'Diet',
      tip: tips.diet,
      color: 'text-green-400',
    },
    {
      icon: Heart,
      title: 'Social',
      tip: tips.social,
      color: 'text-red-400',
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col flex-1">
        <div className="text-center mb-8">
            <h1 className="font-headline text-4xl text-primary">Daily Recommendations</h1>
            <p className="text-muted-foreground mt-2">Personalized tips for your current {displayPhaseName} phase.</p>
        </div>
        <div className="flex-grow flex items-center justify-center">
            <div className="grid w-full grid-cols-1 gap-32 sm:grid-cols-2">
              {lifestyleCards.map((card) => (
                <LifestyleCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  tip={card.tip}
                  iconColor={card.color}
                  className="transform transition-transform duration-300 scale-125"
                />
              ))}
            </div>
        </div>
    </div>
  );
}

const RecommendationsSkeleton = () => (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col flex-1">
        <div className="text-center mb-8">
            <Skeleton className="h-10 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
        </div>
        <div className="flex-grow flex items-center justify-center">
            <div className="grid w-full grid-cols-1 gap-32 sm:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
        </div>
    </div>
);
