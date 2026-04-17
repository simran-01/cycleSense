import { GlassCard } from "@/components/ui/glass-card";

interface KpiCardProps {
    title: string;
    value: string | number;
    unit: string;
}

export default function KpiCard({ title, value, unit }: KpiCardProps) {
    return (
        <GlassCard className="flex flex-col items-center justify-center p-4 text-center">
            <h3 className="font-headline text-lg text-primary/80">{title}</h3>
            <p className="font-headline text-5xl font-bold text-primary mt-1">{value}</p>
            <p className="text-sm text-muted-foreground">{unit}</p>
        </GlassCard>
    );
}
