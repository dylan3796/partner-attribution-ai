import type { Metadata } from "next";
import {
  Scale,
  Receipt,
  History,
  BarChart3,
  Target,
  Award,
  FileText,
  Banknote,
  Plug,
  LayoutDashboard,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import CTABand from "@/components/marketing/CTABand";

export const metadata: Metadata = {
  title: "Product — Covant",
  description:
    "The AI-native successor to the PRM. Covant scores every partner, recommends the attribution model that fits each motion, reconstructs your last twelve months of partner-sourced revenue, and hands your team the next move.",
};

// Product page: the live voice, made scannable. Every capability is one icon +
// one declarative line — no paragraphs. Only what ships (no Channel TAM, no MCP).
// Grouped Attribution / Partners / Operations / Access. Layout/tokens: design-system.md.

type Capability = { icon: LucideIcon; title: string; line: string };
type Group = { name: string; items: Capability[] };

const GROUPS: Group[] = [
  {
    name: "Attribution",
    items: [
      { icon: Scale, title: "A model per motion", line: "Covant recommends the attribution model that fits each motion — never forces one onto everything." },
      { icon: Receipt, title: "Credit with an audit trail", line: "Every split explained, every touchpoint cited. Credit your partners can't dispute." },
      { icon: History, title: "Your last twelve months, reconstructed", line: "Connect the CRM and watch a year of partner-sourced revenue get attributed." },
    ],
  },
  {
    name: "Partners",
    items: [
      { icon: BarChart3, title: "Every partner, scored", line: "On what they actually drive — sourced revenue, win rate, influence. Not what they claim." },
      { icon: Target, title: "The right partner, named", line: "Best-fit partner for any open deal, with the evidence behind the call." },
      { icon: Award, title: "Tiers that stay current", line: "Progress tracked as partners earn it; reviews routed to you." },
    ],
  },
  {
    name: "Operations",
    items: [
      { icon: FileText, title: "Deal registration", line: "Partners submit, you approve, it flows into your CRM." },
      { icon: Banknote, title: "Payouts, calculated and routed", line: "Flagged the moment they're earned, paid on your sign-off." },
      { icon: Plug, title: "Salesforce and HubSpot", line: "Reads the deals and touchpoints you already have. Useful in days." },
    ],
  },
  {
    name: "Access",
    items: [
      { icon: LayoutDashboard, title: "A portal that's yours", line: "Your brand, your rules. Each partner sees only their slice." },
      { icon: MessageSquare, title: "Ask your channel anything", line: "Plain-language answers, with the records attached." },
    ],
  },
];

export default function ProductPage() {
  return (
    <main className="site site--story">
      {/* Hero — the claim */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container">
          <p className="m-eyebrow">Product</p>
          <h1 className="m-h1" style={{ maxWidth: "18ch" }}>
            Everything the PRM should have done.
          </h1>
          <p className="m-lead" style={{ maxWidth: "54ch" }}>
            Covant scores every partner, settles attribution across every
            motion, and reconstructs your last twelve months of partner-sourced
            revenue. The successor to the PRM.
          </p>
          <div className="m-hero-cta">
            <a className="m-btn" href="#demo">Request a demo</a>
          </div>
        </div>
      </section>

      {/* Capability groups — one icon, one line each */}
      {GROUPS.map((group, gi) => (
        <section
          key={group.name}
          className={`m-section ${gi % 2 === 0 ? "m-section--surface" : ""}`}
        >
          <div className="m-container">
            <Reveal>
              <p className="m-eyebrow">{group.name}</p>
            </Reveal>
            <div className="m-grid m-grid-3" style={{ marginTop: "1.5rem" }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Reveal className="m-card" key={item.title}>
                    <Icon size={22} aria-hidden />
                    <h3 className="m-h3" style={{ margin: ".75rem 0 .35rem" }}>
                      {item.title}
                    </h3>
                    <p className="m-body">{item.line}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* The five models — real proof, one per motion */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The models</p>
            <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
              Five models. One per motion.
            </h2>
          </Reveal>
          <Reveal style={{ marginTop: "2rem" }}>
            <ModelList />
          </Reveal>
        </div>
      </section>

      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="Connect your CRM and watch Covant attribute the last twelve months of partner-sourced revenue."
      />
    </main>
  );
}
