import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  vendor: string;
  amount: number;
  category: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  riskScore: number;
  timestamp: string;
  initiatedBy: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    description: "Office Equipment Purchase",
    vendor: "Tech Solutions Namibia",
    amount: 45000,
    category: "Equipment",
    status: "approved",
    riskScore: 15,
    timestamp: "2024-01-15 09:30",
    initiatedBy: "Maria Shikongo"
  },
  {
    id: "TXN-002",
    description: "Consulting Services",
    vendor: "Windhoek Consulting",
    amount: 125000,
    category: "Services",
    status: "pending",
    riskScore: 45,
    timestamp: "2024-01-15 10:15",
    initiatedBy: "Peter Nghipondoka"
  },
  {
    id: "TXN-003",
    description: "Vehicle Maintenance",
    vendor: "AutoFix Garage",
    amount: 28500,
    category: "Maintenance",
    status: "flagged",
    riskScore: 72,
    timestamp: "2024-01-15 11:00",
    initiatedBy: "Jonas Amupolo"
  },
  {
    id: "TXN-004",
    description: "Catering Services",
    vendor: "Taste of Namibia",
    amount: 15000,
    category: "Events",
    status: "rejected",
    riskScore: 88,
    timestamp: "2024-01-15 11:45",
    initiatedBy: "Sarah Haufiku"
  },
  {
    id: "TXN-005",
    description: "Stationery Supplies",
    vendor: "Office Mate",
    amount: 8500,
    category: "Supplies",
    status: "approved",
    riskScore: 8,
    timestamp: "2024-01-15 14:20",
    initiatedBy: "David Munyama"
  },
];

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
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((tx) => {
              const StatusIcon = statusConfig[tx.status].icon;
              return (
                <tr key={tx.id} className="group cursor-pointer">
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
                        <p className="text-xs text-muted-foreground">{tx.id} • {tx.timestamp}</p>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
