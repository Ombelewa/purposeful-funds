import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "accent" | "warning" | "destructive";
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  variant = "default" 
}: StatCardProps) {
  const TrendIcon = trend 
    ? trend.value > 0 
      ? TrendingUp 
      : trend.value < 0 
        ? TrendingDown 
        : Minus
    : null;

  return (
    <div className={cn(
      "stat-card group",
      variant === "accent" && "border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10",
      variant === "warning" && "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
      variant === "destructive" && "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
          variant === "default" && "bg-primary/10 text-primary group-hover:bg-primary/15",
          variant === "accent" && "bg-accent/15 text-accent group-hover:bg-accent/20",
          variant === "warning" && "bg-warning/15 text-warning group-hover:bg-warning/20",
          variant === "destructive" && "bg-destructive/15 text-destructive group-hover:bg-destructive/20"
        )}>
          {icon}
        </div>
      </div>
      
      {trend && TrendIcon && (
        <div className="mt-4 flex items-center gap-1.5">
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend.value > 0 && "text-success",
            trend.value < 0 && "text-destructive",
            trend.value === 0 && "text-muted-foreground"
          )}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
