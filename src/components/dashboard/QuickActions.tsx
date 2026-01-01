import { Plus, FileCheck, UserPlus, ShieldCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const actions = [
    { icon: Plus, label: "New Allocation", variant: "accent" as const },
    { icon: FileCheck, label: "Approve Pending", variant: "default" as const },
    { icon: UserPlus, label: "Add Vendor", variant: "outline" as const },
    { icon: Download, label: "Export Report", variant: "outline" as const },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button key={action.label} variant={action.variant} className="gap-2">
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
