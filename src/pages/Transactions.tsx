import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/hooks/use-transactions";
import { RiskBadge } from "@/components/dashboard/RiskBadge";

const Transactions = () => {
  const { data: transactions, isLoading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTransactions = transactions?.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <DashboardLayout
      title="Transactions"
      subtitle="View and manage all fund transactions"
      currentPath="/transactions"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        {!isLoading && transactions && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">
                {transactions.filter((t) => t.status === "pending").length}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-success">
                {transactions.filter((t) => t.status === "approved").length}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                N${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="font-semibold text-foreground">
                {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-muted-foreground">
                {statusFilter !== "all" && `Filtered by: ${statusFilter}`}
              </p>
            </div>
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
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading transactions...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const StatusIcon =
                      tx.status === "pending"
                        ? Clock
                        : tx.status === "approved"
                        ? CheckCircle2
                        : tx.status === "rejected"
                        ? XCircle
                        : AlertTriangle;
                    return (
                      <tr key={tx.id} className="group">
                        <td>
                          <div>
                            <p className="font-medium text-foreground">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">{tx.id}</p>
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
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              tx.status === "pending"
                                ? "text-warning bg-warning/10"
                                : tx.status === "approved"
                                ? "text-success bg-success/10"
                                : tx.status === "rejected"
                                ? "text-destructive bg-destructive/10"
                                : "text-risk-high bg-risk-high/10"
                            }`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;

