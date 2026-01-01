import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FundAllocationCard } from "@/components/dashboard/FundAllocationCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAllocations } from "@/hooks/use-allocations";
import { NewAllocationModal } from "@/components/modals/NewAllocationModal";
import { useState } from "react";

const Allocations = () => {
  const { data: allocations, isLoading } = useAllocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredAllocations = allocations?.filter((alloc) =>
    alloc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alloc.department.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DashboardLayout
      title="Fund Allocations"
      subtitle="Manage and monitor budget allocations"
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
        {!isLoading && allocations && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Allocations</p>
              <p className="text-2xl font-bold">{allocations.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">
                N${allocations.reduce((sum, a) => sum + a.totalBudget, 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">
                N${allocations.reduce((sum, a) => sum + a.spent, 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold">
                N${allocations.reduce((sum, a) => sum + a.remaining, 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Allocations List */}
        <div className="grid gap-6 lg:grid-cols-2">
          {isLoading ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              Loading allocations...
            </div>
          ) : filteredAllocations.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No allocations match your search" : "No allocations found"}
              </p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Allocation
              </Button>
            </div>
          ) : (
            filteredAllocations.map((allocation) => (
              <div key={allocation.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{allocation.name}</h3>
                    <p className="text-sm text-muted-foreground">{allocation.department}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
                      allocation.status === "active"
                        ? "bg-success/10 text-success"
                        : allocation.status === "warning"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {allocation.status === "active" && "Healthy"}
                    {allocation.status === "warning" && "Low Balance"}
                    {allocation.status === "critical" && "Near Limit"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {((allocation.spent / allocation.totalBudget) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          allocation.status === "active"
                            ? "bg-success"
                            : allocation.status === "warning"
                            ? "bg-warning"
                            : "bg-destructive"
                        }`}
                        style={{
                          width: `${(allocation.spent / allocation.totalBudget) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-mono font-semibold">
                        N${allocation.totalBudget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-mono font-semibold">
                        N${allocation.spent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-mono font-semibold">
                        N${allocation.remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Allowed Categories</p>
                    <div className="flex flex-wrap gap-1">
                      {allocation.allowedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <NewAllocationModal open={modalOpen} onOpenChange={setModalOpen} />
    </DashboardLayout>
  );
};

export default Allocations;

