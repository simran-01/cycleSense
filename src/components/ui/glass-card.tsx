import { cn } from "@/lib/utils";
import React from "react";

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-lg dark:border-white/10 dark:bg-black/20",
      "bg-clip-padding",
      className
    )}
    {...props}
  />
));
GlassCard.displayName = "GlassCard";

export { GlassCard };
