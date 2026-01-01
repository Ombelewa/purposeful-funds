import { AlertTriangle, Shield, Clock, ChevronRight, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  details: string;
  transactionId: string;
  timestamp: string;
  status: "open" | "investigating" | "closed";
}

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "SPLIT_TRANSACTION",
    severity: "high",
    message: "Split Transaction Pattern Detected",
    details: "3 transactions totaling N$45,000 made within 15 minutes to same vendor",
    transactionId: "TXN-003",
    timestamp: "5 min ago",
    status: "open"
  },
  {
    id: "ALT-002",
    type: "CATEGORY_VIOLATION",
    severity: "critical",
    message: "Category Violation - Blocked",
    details: "Attempted spending on 'Entertainment' - not allowed for Infrastructure Fund",
    transactionId: "TXN-004",
    timestamp: "12 min ago",
    status: "open"
  },
  {
    id: "ALT-003",
    type: "PERSONAL_VENDOR",
    severity: "critical",
    message: "Personal Vendor Detected",
    details: "Vendor bank account matches employee: Jonas Amupolo",
    transactionId: "TXN-006",
    timestamp: "28 min ago",
    status: "investigating"
  },
  {
    id: "ALT-004",
    type: "RAPID_DEPLETION",
    severity: "medium",
    message: "Rapid Budget Consumption",
    details: "45% of quarterly budget consumed in first 3 weeks",
    transactionId: "N/A",
    timestamp: "1 hour ago",
    status: "open"
  },
  {
    id: "ALT-005",
    type: "GHOST_VENDOR",
    severity: "high",
    message: "Unregistered Vendor",
    details: "Vendor 'ABC Supplies' has no tax registration on record",
    transactionId: "TXN-007",
    timestamp: "2 hours ago",
    status: "open"
  },
];

const severityConfig = {
  low: {
    bgClass: "bg-risk-low/10 border-risk-low/20",
    iconClass: "text-risk-low bg-risk-low/15",
    dotClass: "bg-risk-low"
  },
  medium: {
    bgClass: "bg-risk-medium/10 border-risk-medium/20",
    iconClass: "text-risk-medium bg-risk-medium/15",
    dotClass: "bg-risk-medium"
  },
  high: {
    bgClass: "bg-risk-high/10 border-risk-high/20",
    iconClass: "text-risk-high bg-risk-high/15",
    dotClass: "bg-risk-high"
  },
  critical: {
    bgClass: "bg-risk-critical/10 border-risk-critical/20",
    iconClass: "text-risk-critical bg-risk-critical/15",
    dotClass: "bg-risk-critical animate-pulse"
  }
};

export function ActiveAlerts() {
  const criticalCount = mockAlerts.filter(a => a.severity === "critical").length;
  const highCount = mockAlerts.filter(a => a.severity === "high").length;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Active Fraud Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {criticalCount} critical, {highCount} high priority
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          View All Alerts
        </Button>
      </div>

      <div className="divide-y divide-border">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 cursor-pointer",
              alert.severity === "critical" && "bg-destructive/5"
            )}
          >
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              severityConfig[alert.severity].iconClass
            )}>
              <Shield className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  severityConfig[alert.severity].dotClass
                )} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {alert.type.replace(/_/g, " ")}
                </span>
                {alert.status === "investigating" && (
                  <span className="text-xs font-medium text-info">• Investigating</span>
                )}
              </div>
              
              <p className="font-medium text-foreground">{alert.message}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{alert.details}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.timestamp}
                </span>
                {alert.transactionId !== "N/A" && (
                  <span className="font-mono">{alert.transactionId}</span>
                )}
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
