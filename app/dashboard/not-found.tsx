import Link from "next/link";
import { LayoutDashboard, Users, FileText, Settings, ArrowRight } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <div className="text-6xl font-black text-white/[0.06] mb-6 select-none">404</div>
        <h1 className="text-xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-neutral-500 text-sm mb-8">
          This dashboard page doesn&apos;t exist. It may have been moved or removed.
        </p>

        <div className="space-y-1.5">
          {[
            { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard Home" },
            { href: "/dashboard/partners", icon: Users, label: "Partners" },
            { href: "/dashboard/deals", icon: FileText, label: "Deals" },
            { href: "/dashboard/settings", icon: Settings, label: "Settings" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors group"
            >
              <Icon className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
              {label}
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
