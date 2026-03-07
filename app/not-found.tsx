import Link from "next/link";
import { Home, Search, BookOpen, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-neutral-300 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* 404 number */}
        <div className="relative mb-8">
          <span className="text-[8rem] font-black leading-none text-white/[0.04] select-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <Search className="w-7 h-7 text-white/40" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Page not found
        </h1>
        <p className="text-neutral-500 mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          If you think this is a mistake, let us know.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/product"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-800 text-neutral-400 font-semibold text-sm hover:border-neutral-600 hover:text-neutral-300 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Product
          </Link>
        </div>

        {/* Helpful links */}
        <div className="border-t border-neutral-900 pt-8">
          <p className="text-xs text-neutral-600 uppercase tracking-wider font-semibold mb-4">
            Popular pages
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { href: "/demo", label: "Try the Demo" },
              { href: "/pricing", label: "Pricing" },
              { href: "/blog", label: "Blog" },
              { href: "/compare", label: "Comparisons" },
              { href: "/contact", label: "Contact" },
              { href: "/status", label: "System Status" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-colors group"
              >
                {label}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
