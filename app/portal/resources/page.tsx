"use client";
import { Download, FileText, Video, BookOpen, Award } from "lucide-react";

const resources = [
  { category: "Sales Collateral", items: [
    { title: "Product Battle Card", desc: "Key differentiators vs competitors", type: "PDF", icon: FileText },
    { title: "One-Pager: Enterprise", desc: "Enterprise value proposition overview", type: "PDF", icon: FileText },
    { title: "Pricing Guide", desc: "Current pricing tiers and discounts", type: "PDF", icon: FileText },
  ]},
  { category: "Case Studies", items: [
    { title: "How Globex Scaled 3x with Partners", desc: "Enterprise success story with attribution data", type: "PDF", icon: BookOpen },
    { title: "Initech: From 0 to $500k Partner Revenue", desc: "Mid-market growth playbook", type: "PDF", icon: BookOpen },
  ]},
  { category: "Training & Certification", items: [
    { title: "Partner Onboarding Guide", desc: "Getting started with the platform", type: "Video", icon: Video },
    { title: "Advanced Sales Training", desc: "Selling strategies for enterprise accounts", type: "Video", icon: Video },
    { title: "Platform Certification Exam", desc: "Get certified and earn higher commissions", type: "Quiz", icon: Award },
  ]},
  { category: "Co-Marketing Templates", items: [
    { title: "Email Templates", desc: "Pre-written outreach sequences", type: "Doc", icon: FileText },
    { title: "Co-Branded Slide Deck", desc: "Customizable presentation template", type: "PPTX", icon: FileText },
    { title: "Social Media Kit", desc: "Post templates and brand assets", type: "ZIP", icon: Download },
  ]},
];

export default function PortalResourcesPage() {
  return (
    <>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Resources</h1>
          <p className="muted">Everything you need to sell, market, and succeed as a partner</p>
        </div>

        {resources.map((section) => (
          <div key={section.category} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>{section.category}</h2>
            <div className="grid-3" style={{ gap: "1rem" }}>
              {section.items.map((item) => (
                <div key={item.title} className="card card-hover" style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <item.icon size={20} color="var(--muted)" />
                    <span className="badge badge-neutral" style={{ fontSize: ".7rem" }}>{item.type}</span>
                  </div>
                  <h3 style={{ fontWeight: 600, fontSize: ".95rem" }}>{item.title}</h3>
                  <p className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5 }}>{item.desc}</p>
                  <button className="btn-outline" style={{ marginTop: "auto", fontSize: ".8rem", padding: ".4rem .8rem", alignSelf: "start" }} onClick={() => alert(`"${item.title}" would be downloaded in production. This is a demo.`)}>
                    <Download size={14} /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  );
}
