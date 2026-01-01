import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentPath?: string;
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  currentPath = "/" 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPath={currentPath} />
      <div className="pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
