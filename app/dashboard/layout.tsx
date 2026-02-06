"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PieChart,
  Settings,
  Zap,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Partners", href: "/dashboard/partners", icon: Users },
  { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
  { name: "Reports", href: "/dashboard/reports", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-200",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-gray-900 truncate">
              Partner AI
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <item.icon
                  className={clsx(
                    "w-5 h-5 shrink-0",
                    isActive ? "text-primary-600" : "text-gray-400"
                  )}
                />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 w-full transition"
          >
            <ChevronLeft
              className={clsx(
                "w-5 h-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-medium text-gray-500">
              {navigation.find(
                (n) =>
                  pathname === n.href ||
                  (n.href !== "/dashboard" && pathname.startsWith(n.href))
              )?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              Demo Mode
            </span>
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
