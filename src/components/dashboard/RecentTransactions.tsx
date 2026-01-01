import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { useApproveTransaction, useRejectTransaction } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "text-warning bg-warning/10"
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    className: "text-success bg-success/10"
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "text-destructive bg-destructive/10"
  },
  flagged: {
    icon: AlertTriangle,
    label: "Flagged",
    className: "text-risk-high bg-risk-high/10"
  }
};

export function RecentTransactions() {
  const { data: transactions, isLoading } = useTransactions();
  const approveTransaction = useApproveTransaction();
  const rejectTransaction = useRejectTransaction();

  const recentTransactions = transactions
    ? [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)
    : [];

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy HH:mm");
    } catch {
      return timestamp;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-semibold text-foreground">Recent Transactions</h3>
            <p className="text-sm text-muted-foreground">Latest spending activity</p>
          </div>
        </div>
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Latest spending activity</p>
        </div>
        <button className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              recentTransactions.map((tx) => {
                const StatusIcon = statusConfig[tx.status].icon;
                return (
                  <tr key={tx.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          tx.amount > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                        )}>
                          {tx.amount > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{tx.id} • {formatTimestamp(tx.timestamp)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-foreground">{tx.vendor}</p>
                      <p className="text-xs text-muted-foreground">by {tx.initiatedBy}</p>
                    </td>
                    <td>
                      <p className="font-mono font-semibold text-foreground">
                        N${tx.amount.toLocaleString()}
                      </p>
                    </td>
                    <td>
                      <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <RiskBadge score={tx.riskScore} />
                    </td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        statusConfig[tx.status].className
                      )}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig[tx.status].label}
                      </span>
                    </td>
                    <td>
                      {tx.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => approveTransaction.mutate(tx.id)}
                            disabled={approveTransaction.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => rejectTransaction.mutate(tx.id)}
                            disabled={rejectTransaction.isPending}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
