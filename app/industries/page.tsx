import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { INDUSTRY_LIST } from "./[slug]/industries";

export const metadata: Metadata = {
  title: "Partner Programs by Industry — Covant",
  description:
    "See how Covant powers partner programs for SaaS, fintech, and cybersecurity companies. Industry-specific attribution models, commission structures, and benchmarks.",
  openGraph: {
    title: "Partner Programs by Industry — Covant",
    description:
      "Industry-specific partner program strategies, attribution models, and benchmarks for SaaS, fintech, and cybersecurity.",
    url: "https://covant.ai/industries",
  },
};

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-zinc-400" />
            <span className="text-sm text-zinc-400 uppercase tracking-widest">
              Industries
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Partner Programs Built for Your Industry
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Every industry has unique partner dynamics — different partner types,
            commission models, compliance requirements, and attribution
            challenges. Generic PRMs ignore this. Covant doesn&apos;t.
          </p>
        </div>
      </section>

      {/* Industry Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {INDUSTRY_LIST.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="block p-8 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                      style={{
                        backgroundColor: `${industry.color}20`,
                        color: industry.color,
                      }}
                    >
                      {industry.name}
                    </span>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                      {industry.headline}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span>
                        {industry.partnerTypeCount} partner types
                      </span>
                      <span>•</span>
                      <span>
                        {industry.heroStats[0]?.value}{" "}
                        {industry.heroStats[0]?.label.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-zinc-400 group-hover:text-white transition-colors shrink-0 mt-2 md:mt-4">
                    Read guide
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Stats preview */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800/50">
                  {industry.heroStats.map((stat) => (
                    <div key={stat.label}>
                      <div
                        className="text-lg font-bold"
                        style={{ color: industry.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-zinc-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don&apos;t see your industry?
          </h2>
          <p className="text-zinc-400 mb-8">
            Covant works for any company that runs a partner program. Talk to us
            about your specific partner dynamics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
            >
              Talk to Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
            >
              See the Product
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
