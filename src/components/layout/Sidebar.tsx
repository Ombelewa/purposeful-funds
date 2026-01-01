import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  AlertTriangle, 
  Building2, 
  FolderKanban,
  Users,
  FileText,
  Settings,
  Shield,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/use-alerts";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  badgeVariant?: "default" | "warning" | "critical";
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Wallet, label: "Fund Allocations", href: "/allocations" },
  { icon: ArrowRightLeft, label: "Transactions", href: "/transactions" },
  { icon: AlertTriangle, label: "Fraud Alerts", href: "/alerts", badge: 5, badgeVariant: "critical" },
];

const managementNavItems: NavItem[] = [
  { icon: Building2, label: "Departments", href: "/departments" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: Users, label: "Vendors", href: "/vendors" },
];

const systemNavItems: NavItem[] = [
  { icon: FileText, label: "Audit Logs", href: "/audit" },
  { icon: Shield, label: "Fraud Rules", href: "/rules" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  currentPath?: string;
}

export function Sidebar({ currentPath = "/" }: SidebarProps) {
  const { data: alerts } = useAlerts();
  const activeAlertsCount = alerts?.filter(a => a.status === "open" || a.status === "investigating").length || 0;
  const criticalAlertsCount = alerts?.filter(a => a.severity === "critical").length || 0;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
          <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">FundGuard</h1>
          <p className="text-[11px] text-sidebar-foreground/60 uppercase tracking-widest">Namibia</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Overview
          </p>
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const badgeCount = item.href === "/alerts" ? (criticalAlertsCount > 0 ? criticalAlertsCount : activeAlertsCount) : item.badge;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "nav-link",
                      currentPath === item.href && "active"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {badgeCount && badgeCount > 0 && (
                      <span className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        item.badgeVariant === "critical" && "bg-destructive text-destructive-foreground",
                        item.badgeVariant === "warning" && "bg-warning text-warning-foreground",
                        !item.badgeVariant && "bg-sidebar-accent text-sidebar-foreground"
                      )}>
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Management */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Management
          </p>
          <ul className="space-y-1">
            {managementNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "nav-link",
                    currentPath === item.href && "active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* System */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            System
          </p>
          <ul className="space-y-1">
            {systemNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "nav-link",
                    currentPath === item.href && "active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-foreground">
            JN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Johan Ndara</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Treasury Officer</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <LogOut className="h-4 w-4 text-sidebar-foreground/60" />
          </button>
        </div>
      </div>
    </aside>
  );
}
