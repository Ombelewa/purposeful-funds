import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useVendors } from "@/hooks/use-vendors";
import { AddVendorModal } from "@/components/modals/AddVendorModal";
import { cn } from "@/lib/utils";

const Vendors = () => {
  const { data: vendors, isLoading } = useVendors();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredVendors = vendors?.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DashboardLayout
      title="Vendors"
      subtitle="Manage vendor registry and verification"
      currentPath="/vendors"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>

        {/* Stats */}
        {!isLoading && vendors && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Vendors</p>
              <p className="text-2xl font-bold">{vendors.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-success">
                {vendors.filter((v) => v.verified).length}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Tax Registered</p>
              <p className="text-2xl font-bold text-success">
                {vendors.filter((v) => v.taxRegistered).length}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Unverified</p>
              <p className="text-2xl font-bold text-warning">
                {vendors.filter((v) => !v.verified).length}
              </p>
            </div>
          </div>
        )}

        {/* Vendors Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Loading vendors...
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No vendors match your search" : "No vendors found"}
              </p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Vendor
              </Button>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{vendor.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{vendor.id}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {vendor.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded">
                        <XCircle className="h-3 w-3" />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {vendor.registrationNumber && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Registration Number</p>
                      <p className="text-sm font-mono">{vendor.registrationNumber}</p>
                    </div>
                  )}
                  {vendor.bankAccount && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Bank Account</p>
                      <p className="text-sm font-mono">{vendor.bankAccount}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      {vendor.taxRegistered ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-xs text-muted-foreground">Tax Registered</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Not Tax Registered</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddVendorModal open={modalOpen} onOpenChange={setModalOpen} />
    </DashboardLayout>
  );
};

export default Vendors;

