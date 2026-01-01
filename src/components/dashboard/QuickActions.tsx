import { useState } from "react";
import { Plus, FileCheck, UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewAllocationModal } from "@/components/modals/NewAllocationModal";
import { AddVendorModal } from "@/components/modals/AddVendorModal";
import { useTransactions } from "@/hooks/use-transactions";
import { useApproveTransaction } from "@/hooks/use-transactions";
import { toast } from "sonner";

export function QuickActions() {
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const { data: transactions } = useTransactions();
  const approveTransaction = useApproveTransaction();

  const pendingTransactions = transactions?.filter((t) => t.status === "pending") || [];
  const hasPending = pendingTransactions.length > 0;

  const handleApprovePending = () => {
    if (pendingTransactions.length === 0) {
      toast.info("No pending transactions to approve");
      return;
    }
    // Approve the first pending transaction as a demo
    approveTransaction.mutate(pendingTransactions[0].id);
  };

  const handleExportReport = () => {
    toast.success("Report export initiated. This feature will be available in the full version.");
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="accent"
          className="gap-2"
          onClick={() => setAllocationModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Allocation
        </Button>
        <Button
          variant="default"
          className="gap-2"
          onClick={handleApprovePending}
          disabled={!hasPending || approveTransaction.isPending}
        >
          <FileCheck className="h-4 w-4" />
          Approve Pending {hasPending && `(${pendingTransactions.length})`}
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setVendorModalOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Add Vendor
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExportReport}
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      <NewAllocationModal
        open={allocationModalOpen}
        onOpenChange={setAllocationModalOpen}
      />
      <AddVendorModal
        open={vendorModalOpen}
        onOpenChange={setVendorModalOpen}
      />
    </>
  );
}
