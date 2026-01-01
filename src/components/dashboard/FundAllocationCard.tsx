import { Wallet, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Allocation {
  id: string;
  name: string;
  department: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  status: "active" | "warning" | "critical";
  allowedCategories: string[];
}

const mockAllocations: Allocation[] = [
  {
    id: "ALLOC-001",
    name: "Infrastructure Development",
    department: "Public Works",
    totalBudget: 5000000,
    spent: 1250000,
    remaining: 3750000,
    status: "active",
    allowedCategories: ["Construction", "Equipment", "Materials"]
  },
  {
    id: "ALLOC-002",
    name: "Healthcare Equipment",
    department: "Ministry of Health",
    totalBudget: 2500000,
    spent: 2125000,
    remaining: 375000,
    status: "warning",
    allowedCategories: ["Medical Equipment", "Supplies"]
  },
  {
    id: "ALLOC-003",
    name: "Education Program",
    department: "Ministry of Education",
    totalBudget: 1800000,
    spent: 1710000,
    remaining: 90000,
    status: "critical",
    allowedCategories: ["Books", "Technology", "Training"]
  },
];

export function FundAllocationCard() {
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
        <button className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
          Manage <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="divide-y divide-border">
        {mockAllocations.map((allocation) => {
          const percentUsed = (allocation.spent / allocation.totalBudget) * 100;
          
          return (
            <div key={allocation.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{allocation.name}</p>
                  <p className="text-sm text-muted-foreground">{allocation.department}</p>
                </div>
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full",
                  allocation.status === "active" && "bg-success/10 text-success",
                  allocation.status === "warning" && "bg-warning/10 text-warning",
                  allocation.status === "critical" && "bg-destructive/10 text-destructive"
                )}>
                  {allocation.status === "active" && "Healthy"}
                  {allocation.status === "warning" && "Low Balance"}
                  {allocation.status === "critical" && "Near Limit"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">
                    N${allocation.spent.toLocaleString()} spent
                  </span>
                  <span className="font-medium text-foreground">
                    {percentUsed.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      allocation.status === "active" && "bg-success",
                      allocation.status === "warning" && "bg-warning",
                      allocation.status === "critical" && "bg-destructive"
                    )}
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
              </div>

              {/* Budget info */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Remaining: </span>
                  <span className="font-mono font-semibold text-foreground">
                    N${allocation.remaining.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-1">
                  {allocation.allowedCategories.slice(0, 2).map((cat) => (
                    <span 
                      key={cat} 
                      className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground"
                    >
                      {cat}
                    </span>
                  ))}
                  {allocation.allowedCategories.length > 2 && (
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                      +{allocation.allowedCategories.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
