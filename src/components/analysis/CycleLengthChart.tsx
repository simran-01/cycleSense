"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { GlassCard } from "../ui/glass-card";

const chartConfig = {
  length: {
    label: "Cycle Length",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface CycleLengthChartProps {
  data: { name: string; length: number }[];
}

export default function CycleLengthChart({ data }: CycleLengthChartProps) {
  return (
    <GlassCard>
      <div className="p-4">
          <h3 className="font-headline text-xl text-primary/90">Recent Cycle Lengths</h3>
          <p className="text-sm text-muted-foreground">Your last 6 cycles.</p>
      </div>
      <div className="p-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 0, left: -20}}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="length" fill="var(--color-length)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </GlassCard>
  );
}
