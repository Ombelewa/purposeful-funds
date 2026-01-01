import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActiveAlerts } from "@/components/dashboard/ActiveAlerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlerts } from "@/hooks/use-alerts";
import { useUpdateAlert } from "@/hooks/use-alerts";

const Alerts = () => {
  const { data: alerts, isLoading } = useAlerts();
  const updateAlert = useUpdateAlert();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAlerts = alerts?.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  }) || [];

  return (
    <DashboardLayout
      title="Fraud Alerts"
      subtitle="Monitor and investigate suspicious activities"
      currentPath="/alerts"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        {!isLoading && alerts && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
            <div className="rounded-xl border bg-destructive/5 p-4 border-destructive/20">
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-destructive">
                {alerts.filter((a) => a.severity === "critical").length}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold text-risk-high">
                {alerts.filter((a) => a.severity === "high").length}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold">
                {alerts.filter((a) => a.status === "open").length}
              </p>
            </div>
          </div>
        )}

        {/* Alerts List */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="font-semibold text-foreground">
                {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-muted-foreground">Active fraud detection alerts</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading alerts...</div>
            ) : filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No alerts found</div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    alert.severity === "critical" ? "bg-destructive/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        alert.severity === "critical"
                          ? "bg-risk-critical/15 text-risk-critical"
                          : alert.severity === "high"
                          ? "bg-risk-high/15 text-risk-high"
                          : alert.severity === "medium"
                          ? "bg-risk-medium/15 text-risk-medium"
                          : "bg-risk-low/15 text-risk-low"
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            alert.severity === "critical"
                              ? "bg-risk-critical animate-pulse"
                              : alert.severity === "high"
                              ? "bg-risk-high"
                              : alert.severity === "medium"
                              ? "bg-risk-medium"
                              : "bg-risk-low"
                          }`}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {alert.type.replace(/_/g, " ")}
                        </span>
                        {alert.status === "investigating" && (
                          <span className="text-xs font-medium text-info">• Investigating</span>
                        )}
                      </div>
                      <p className="font-medium text-foreground">{alert.message}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{alert.details}</p>
                      {alert.transactionId && (
                        <p className="text-xs text-muted-foreground mt-2 font-mono">
                          Transaction: {alert.transactionId}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {alert.status === "open" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateAlert.mutate({
                              id: alert.id,
                              updates: { status: "investigating" },
                            })
                          }
                        >
                          Investigate
                        </Button>
                      )}
                      {alert.status === "investigating" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateAlert.mutate({
                              id: alert.id,
                              updates: { status: "closed" },
                            })
                          }
                        >
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

import { Shield } from "lucide-react";

export default Alerts;

