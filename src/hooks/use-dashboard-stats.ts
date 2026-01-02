import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalAllocated: number;
  totalAllocations: number;
  totalRemaining: number;
  todayTransactions: number;
  todayAmount: number;
  activeAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  blockedTransactions: number;
  blockedAmount: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      // Get fund allocations stats
      const { data: allocations, error: allocError } = await supabase
        .from("fund_allocations")
        .select("amount, remaining_amount");

      if (allocError) throw allocError;

      const totalAllocated = allocations?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;
      const totalRemaining = allocations?.reduce((sum, a) => sum + Number(a.remaining_amount), 0) || 0;

      // Get today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayTxns, error: txnError } = await supabase
        .from("transactions")
        .select("amount, status")
        .gte("transaction_date", today.toISOString());

      if (txnError) throw txnError;

      const todayAmount = todayTxns?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const blockedTxns = todayTxns?.filter(t => t.status === "blocked" || t.status === "rejected") || [];
      const blockedAmount = blockedTxns.reduce((sum, t) => sum + Number(t.amount), 0);

      // Get active alerts
      const { data: alerts, error: alertError } = await supabase
        .from("fraud_alerts")
        .select("severity, status")
        .in("status", ["open", "investigating"]);

      if (alertError) throw alertError;

      const criticalAlerts = alerts?.filter(a => a.severity === "critical").length || 0;
      const highAlerts = alerts?.filter(a => a.severity === "high").length || 0;

      return {
        totalAllocated,
        totalAllocations: allocations?.length || 0,
        totalRemaining,
        todayTransactions: todayTxns?.length || 0,
        todayAmount,
        activeAlerts: alerts?.length || 0,
        criticalAlerts,
        highAlerts,
        blockedTransactions: blockedTxns.length,
        blockedAmount,
      };
    },
    refetchInterval: 30000,
  });
}
