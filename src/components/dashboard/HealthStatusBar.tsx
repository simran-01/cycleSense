
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface HealthStatusBarProps {
    statusMessage: string;
    isLate: boolean;
}

const HealthStatusBar: React.FC<HealthStatusBarProps> = ({ statusMessage, isLate }) => {
  return (
    <GlassCard className="w-full text-center p-4">
        <p className={cn('font-medium', isLate ? 'text-amber-600 font-bold' : 'text-primary')}>
          {statusMessage}
        </p>
    </GlassCard>
  );
};

export default HealthStatusBar;
