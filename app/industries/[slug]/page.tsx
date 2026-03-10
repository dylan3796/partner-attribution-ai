import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
  Shield,
  BarChart3,
  Users,
  Lightbulb,
  Quote,
  ChevronRight,
} from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { INDUSTRIES, INDUSTRY_LIST } from "./industries";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES[slug];
  if (!industry) return {};

  return {
    title: `${industry.name} Partner Programs — Covant`,
    description: industry.subheadline,
    openGraph: {
      title: `${industry.name} Partner Programs — Covant`,
      description: industry.subheadline,
      url: `https://covant.ai/industries/${slug}`,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = INDUSTRIES[slug];
  if (!industry) notFound();

  const relatedIndustries = industry.relatedSlugs
    .map((s) => INDUSTRIES[s])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Industries
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${industry.color}20`,
                color: industry.color,
              }}
            >
              {industry.name}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {industry.headline}
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            {industry.subheadline}
          </p>

          {/* Hero stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {industry.heroStats.map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50"
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: industry.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-zinc-400" />
            <h2 className="text-2xl font-bold">
              Partner Types in {industry.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {industry.partnerTypes.map((type) => (
              <div
                key={type}
                className="flex items-start gap-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/30"
              >
                <ChevronRight
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: industry.color }}
                />
                <span className="text-sm text-zinc-300">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-zinc-400" />
            <h2 className="text-2xl font-bold">
              Why {industry.name} Partner Programs Are Hard
            </h2>
          </div>
          <p className="text-zinc-400 mb-10 max-w-2xl">
            These are the real problems VPs of Partnerships face in{" "}
            {industry.name.toLowerCase()} — not the generic &ldquo;partner
            management is complex&rdquo; hand-waving.
          </p>

          <div className="space-y-6">
            {industry.challenges.map((challenge, i) => (
              <div
                key={challenge.title}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
              >
                <div className="flex items-start gap-4">
                  <span className="text-lg font-bold text-zinc-600 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-zinc-400" />
            <h2 className="text-2xl font-bold">
              How Covant Solves It for {industry.name}
            </h2>
          </div>
          <p className="text-zinc-400 mb-10 max-w-2xl">
            Purpose-built features that address {industry.name.toLowerCase()}{" "}
            partner program challenges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.solutions.map((solution) => (
              <div
                key={solution.title}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors"
              >
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-3"
                  style={{
                    backgroundColor: `${industry.color}15`,
                    color: industry.color,
                  }}
                >
                  {solution.feature}
                </span>
                <h3 className="text-lg font-semibold mb-2">
                  {solution.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Attribution Model */}
      <section className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-5 h-5 text-zinc-400" />
            <h2 className="text-2xl font-bold">
              Recommended Attribution Model
            </h2>
          </div>

          <div
            className="p-8 rounded-xl border bg-zinc-900/50"
            style={{ borderColor: `${industry.color}30` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: `${industry.color}20`,
                  color: industry.color,
                }}
              >
                {industry.attributionModel.recommended}
              </span>
              <span className="text-sm text-zinc-500">
                Recommended for {industry.name}
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-6">
              {industry.attributionModel.why}
            </p>
            <div>
              <h4 className="text-sm font-medium text-zinc-500 mb-2">
                Also consider:
              </h4>
              <ul className="space-y-1.5">
                {industry.attributionModel.alternatives.map((alt) => (
                  <li
                    key={alt}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <Check className="w-3.5 h-3.5 text-zinc-600" />
                    {alt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-5 h-5 text-zinc-400" />
            <h2 className="text-2xl font-bold">
              {industry.name} Partner Program Benchmarks
            </h2>
          </div>
          <p className="text-zinc-400 mb-10 max-w-2xl">
            Industry-specific metrics to track — with benchmarks from
            high-performing {industry.name.toLowerCase()} partner programs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industry.metrics.map((metric) => (
              <div
                key={metric.name}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{metric.name}</h3>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${industry.color}15`,
                      color: industry.color,
                    }}
                  >
                    {metric.benchmark}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/benchmarks"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              See all partner program benchmarks →
            </Link>
          </div>
        </div>
      </section>

      {/* Program Tips */}
      <section className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="w-5 h-5 text-zinc-400" />
            <h2 className="text-2xl font-bold">
              {industry.name} Program Best Practices
            </h2>
          </div>

          <div className="space-y-4">
            {industry.programTips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-900/30"
              >
                <span
                  className="text-sm font-bold mt-0.5 shrink-0"
                  style={{ color: industry.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-8 h-8 text-zinc-700 mx-auto mb-6" />
          <blockquote className="text-xl text-zinc-300 italic leading-relaxed mb-6">
            &ldquo;{industry.quoteText}&rdquo;
          </blockquote>
          <div>
            <div className="font-semibold">{industry.quotePerson}</div>
            <div className="text-sm text-zinc-500">{industry.quoteRole}</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to build a {industry.name.toLowerCase()} partner program that
            scales?
          </h2>
          <p className="text-zinc-400 mb-8">
            See how Covant handles attribution, commissions, and partner
            intelligence for {industry.name.toLowerCase()} companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
            >
              See the Product
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/beta"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
            >
              Join the Beta
            </Link>
          </div>
        </div>
      </section>

      {/* Related Industries */}
      {relatedIndustries.length > 0 && (
        <section className="py-16 px-4 border-t border-zinc-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6">
              Partner programs by industry
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedIndustries.map((ri) => (
                <Link
                  key={ri.slug}
                  href={`/industries/${ri.slug}`}
                  className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors group"
                >
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-3"
                    style={{
                      backgroundColor: `${ri.color}20`,
                      color: ri.color,
                    }}
                  >
                    {ri.name}
                  </span>
                  <h3 className="font-semibold mb-2 group-hover:text-white transition-colors">
                    {ri.headline}
                  </h3>
                  <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
