import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ActiveAlerts } from "@/components/dashboard/ActiveAlerts";
import { FundAllocationCard } from "@/components/dashboard/FundAllocationCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Wallet, ArrowRightLeft, AlertTriangle, ShieldCheck } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const Index = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `N$${(amount / 1000000).toFixed(1)}M`;
    }
    return `N$${amount.toLocaleString()}`;
  };

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Fund governance overview"
      currentPath="/"
    >
      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Allocated Funds"
          value={isLoading ? "Loading..." : formatCurrency(stats?.totalAllocated || 0)}
          subtitle={`Across ${stats?.totalAllocations || 0} active allocations`}
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 12, label: "from last month" }}
          variant="accent"
        />
        <StatCard
          title="Today's Transactions"
          value={isLoading ? "Loading..." : String(stats?.todayTransactions || 0)}
          subtitle={isLoading ? "" : `${formatCurrency(stats?.todayAmount || 0)} processed`}
          icon={<ArrowRightLeft className="h-5 w-5" />}
          trend={{ value: 8, label: "from yesterday" }}
        />
        <StatCard
          title="Active Alerts"
          value={isLoading ? "Loading..." : String(stats?.activeAlerts || 0)}
          subtitle={isLoading ? "" : `${stats?.criticalAlerts || 0} critical, ${stats?.highAlerts || 0} high priority`}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: -15, label: "from last week" }}
          variant="destructive"
        />
        <StatCard
          title="Blocked Transactions"
          value={isLoading ? "Loading..." : String(stats?.blockedTransactions || 0)}
          subtitle={isLoading ? "" : `${formatCurrency(stats?.blockedAmount || 0)} prevented`}
          icon={<ShieldCheck className="h-5 w-5" />}
          trend={{ value: 0, label: "this week" }}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Transactions - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <RecentTransactions />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <FundAllocationCard />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mt-6">
        <ActiveAlerts />
      </div>
    </DashboardLayout>
  );
};

export default Index;
