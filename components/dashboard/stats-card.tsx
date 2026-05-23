import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
  accent?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, className, accent = "from-primary/15 to-primary/5" }: StatsCardProps) {
  return (
    <div className={cn("liquid-glass rounded-2xl p-6 bg-linear-to-br transition-all duration-300 hover:scale-[1.01]", accent, className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p className={cn("mt-1.5 text-xs font-semibold", trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
              {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded-full skeleton-shimmer" />
          <div className="h-8 w-20 rounded-xl skeleton-shimmer" />
          <div className="h-3 w-24 rounded-full skeleton-shimmer" />
        </div>
        <div className="h-11 w-11 rounded-2xl skeleton-shimmer" />
      </div>
    </div>
  );
}
