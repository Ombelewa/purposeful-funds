import { Wallet, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFundAllocations } from "@/hooks/use-fund-allocations";
import { useSpendingCategories } from "@/hooks/use-spending-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export function FundAllocationCard() {
  const { data: allocations, isLoading } = useFundAllocations();
  const { data: categories } = useSpendingCategories();

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getUsagePercent = (amount: number, remaining: number) => {
    if (amount === 0) return 0;
    return ((amount - remaining) / amount) * 100;
  };

  const getStatus = (percent: number) => {
    if (percent >= 95) return "critical";
    if (percent >= 80) return "warning";
    return "active";
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Fund Allocations</h3>
              <p className="text-sm text-muted-foreground">Active budget wallets</p>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Wallet className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Fund Allocations</h3>
            <p className="text-sm text-muted-foreground">Active budget wallets</p>
          </div>
        </div>
        <Link 
          to="/allocations"
          className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
        >
          Manage <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {allocations && allocations.length > 0 ? (
          allocations.slice(0, 3).map((allocation) => {
            const percentUsed = getUsagePercent(allocation.amount, allocation.remaining_amount);
            const status = getStatus(percentUsed);
            const spent = allocation.amount - allocation.remaining_amount;
            
            return (
              <div key={allocation.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {allocation.organization?.name || "Unknown Organization"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {allocation.department?.name || allocation.source}
                    </p>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full",
                    status === "active" && "bg-success/10 text-success",
                    status === "warning" && "bg-warning/10 text-warning",
                    status === "critical" && "bg-destructive/10 text-destructive"
                  )}>
                    {status === "active" && "Healthy"}
                    {status === "warning" && "Low Balance"}
                    {status === "critical" && "Near Limit"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">
                      N${spent.toLocaleString()} spent
                    </span>
                    <span className="font-medium text-foreground">
                      {percentUsed.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        status === "active" && "bg-success",
                        status === "warning" && "bg-warning",
                        status === "critical" && "bg-destructive"
                      )}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Budget info */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Remaining: </span>
                    <span className="font-mono font-semibold text-foreground">
                      N${allocation.remaining_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {allocation.allowed_categories.slice(0, 2).map((catId) => (
                      <span 
                        key={catId} 
                        className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground"
                      >
                        {getCategoryName(catId)}
                      </span>
                    ))}
                    {allocation.allowed_categories.length > 2 && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                        +{allocation.allowed_categories.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No allocations yet</p>
            <Link to="/allocations" className="text-accent text-sm hover:underline">
              Create your first allocation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
