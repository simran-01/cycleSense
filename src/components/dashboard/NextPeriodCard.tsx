
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface NextPeriodCardProps {
  children: React.ReactNode;
  className?: string;
}

const NextPeriodCard: React.FC<NextPeriodCardProps> = ({ children, className }) => {
  return (
    <GlassCard className={cn('flex flex-col items-center justify-center text-center p-4 min-h-[124px]', className)}>
      <h3 className="font-headline text-lg text-primary/80">Next Period</h3>
      {children}
    </GlassCard>
  );
};

export default NextPeriodCard;
