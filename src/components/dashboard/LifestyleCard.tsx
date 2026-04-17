import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LifestyleCardProps {
  icon: React.ElementType<LucideProps>;
  title: string;
  tip: string;
  iconColor?: string;
  className?: string;
}

const LifestyleCard: React.FC<LifestyleCardProps> = ({
  icon: Icon,
  title,
  tip,
  iconColor = 'text-primary',
  className,
}) => {
  return (
    <GlassCard className={cn("flex h-full flex-col items-center justify-start text-center p-8", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/50 mb-6">
        <Icon className={cn('h-10 w-10', iconColor)} />
      </div>
      <h3 className="font-headline text-2xl text-primary/90">{title}</h3>
      <p className="mt-3 text-base text-muted-foreground">{tip}</p>
    </GlassCard>
  );
};

export default LifestyleCard;
