import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Building2, FolderOpen, Calendar, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFundAllocations } from "@/hooks/use-fund-allocations";
import { useSpendingCategories } from "@/hooks/use-spending-categories";
import { NewAllocationModal } from "@/components/modals/NewAllocationModal";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Allocations = () => {
  const { data: allocations, isLoading } = useFundAllocations();
  const { data: categories } = useSpendingCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredAllocations = allocations?.filter((alloc) =>
    alloc.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alloc.organization?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alloc.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alloc.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getUsagePercent = (alloc: typeof filteredAllocations[0]) => {
    if (alloc.amount === 0) return 0;
    return ((alloc.amount - alloc.remaining_amount) / alloc.amount) * 100;
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 95) return "bg-destructive";
    if (percent >= 80) return "bg-warning";
    return "bg-success";
  };

  const getStatusLabel = (percent: number) => {
    if (percent >= 95) return "Critical";
    if (percent >= 80) return "Low Balance";
    return "Healthy";
  };

  const totalAllocated = allocations?.reduce((sum, a) => sum + a.amount, 0) || 0;
  const totalRemaining = allocations?.reduce((sum, a) => sum + a.remaining_amount, 0) || 0;
  const totalSpent = totalAllocated - totalRemaining;

  return (
    <DashboardLayout
      title="Fund Allocations"
      subtitle="Manage and monitor budget allocations with spending restrictions"
      currentPath="/allocations"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search allocations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Allocation
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Allocations</p>
            <p className="text-2xl font-bold">{allocations?.length || 0}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold font-mono">
              N${totalAllocated.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold font-mono">
              N${totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold font-mono text-success">
              N${totalRemaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Allocations List */}
        <div className="grid gap-6 lg:grid-cols-2">
          {isLoading ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              Loading allocations...
            </div>
          ) : filteredAllocations.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No allocations match your search" : "No fund allocations yet"}
              </p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Allocation
              </Button>
            </div>
          ) : (
            filteredAllocations.map((allocation) => {
              const usagePercent = getUsagePercent(allocation);
              const spent = allocation.amount - allocation.remaining_amount;
              
              return (
                <div key={allocation.id} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {allocation.source}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {allocation.organization?.name || "Unknown Organization"}
                      </h3>
                      {allocation.department && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <FolderOpen className="h-3 w-3" />
                          {allocation.department.name}
                          {allocation.project && ` → ${allocation.project.name}`}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
                        usagePercent >= 95
                          ? "bg-destructive/10 text-destructive"
                          : usagePercent >= 80
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {getStatusLabel(usagePercent)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Budget Usage</span>
                        <span className="font-medium">{usagePercent.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getStatusColor(usagePercent)}`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget Details */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Allocated</p>
                        <p className="font-mono font-semibold">
                          N${allocation.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-mono font-semibold">
                          N${spent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-mono font-semibold text-success">
                          N${allocation.remaining_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(allocation.start_date), "MMM d, yyyy")}
                        {allocation.end_date && ` - ${format(new Date(allocation.end_date), "MMM d, yyyy")}`}
                      </span>
                    </div>

                    {/* Allowed Categories */}
                    {allocation.allowed_categories.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Allowed Categories</p>
                        <div className="flex flex-wrap gap-1">
                          {allocation.allowed_categories.slice(0, 4).map((catId) => (
                            <span
                              key={catId}
                              className="text-xs bg-success/10 text-success px-2 py-0.5 rounded"
                            >
                              {getCategoryName(catId)}
                            </span>
                          ))}
                          {allocation.allowed_categories.length > 4 && (
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                              +{allocation.allowed_categories.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Forbidden Categories */}
                    {allocation.forbidden_categories.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Blocked Categories</p>
                        <div className="flex flex-wrap gap-1">
                          {allocation.forbidden_categories.map((catId) => (
                            <span
                              key={catId}
                              className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded"
                            >
                              {getCategoryName(catId)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {allocation.notes && (
                      <p className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                        "{allocation.notes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <NewAllocationModal open={modalOpen} onOpenChange={setModalOpen} />
    </DashboardLayout>
  );
};

export default Allocations;
