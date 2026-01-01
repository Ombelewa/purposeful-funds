import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ActiveAlerts } from "@/components/dashboard/ActiveAlerts";
import { FundAllocationCard } from "@/components/dashboard/FundAllocationCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Wallet, ArrowRightLeft, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";

const Index = () => {
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
          value="N$9.3M"
          subtitle="Across 12 active allocations"
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 12, label: "from last month" }}
          variant="accent"
        />
        <StatCard
          title="Today's Transactions"
          value="47"
          subtitle="N$523,450 processed"
          icon={<ArrowRightLeft className="h-5 w-5" />}
          trend={{ value: 8, label: "from yesterday" }}
        />
        <StatCard
          title="Active Alerts"
          value="5"
          subtitle="2 critical, 2 high priority"
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: -15, label: "from last week" }}
          variant="destructive"
        />
        <StatCard
          title="Blocked Transactions"
          value="3"
          subtitle="N$188,000 prevented"
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
