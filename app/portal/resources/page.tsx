"use client";

import { useState, useMemo } from "react";
import { usePortal } from "@/lib/portal-context";
import {
  Download, FileText, Video, BookOpen, Award, Search,
  Star, Clock, Eye, ExternalLink, Play, Image, Archive,
  TrendingUp, Filter, ChevronRight, Bookmark, BookmarkCheck,
} from "lucide-react";

type ResourceType = "pdf" | "video" | "doc" | "pptx" | "zip" | "quiz" | "webinar" | "template";
type ResourceCategory = "sales" | "case_studies" | "training" | "marketing" | "technical" | "brand";

type Resource = {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  featured?: boolean;
  new?: boolean;
  views: number;
  downloads: number;
  duration?: string; // for videos
  fileSize?: string;
  updatedAt: number;
  tags: string[];
};

const DAY = 86400000;
const now = Date.now();

const TYPE_CONFIG: Record<ResourceType, { icon: typeof FileText; color: string; label: string }> = {
  pdf: { icon: FileText, color: "#ef4444", label: "PDF" },
  video: { icon: Play, color: "#8b5cf6", label: "Video" },
  doc: { icon: FileText, color: "#3b82f6", label: "Doc" },
  pptx: { icon: Image, color: "#f59e0b", label: "Slides" },
  zip: { icon: Archive, color: "#64748b", label: "ZIP" },
  quiz: { icon: Award, color: "#22c55e", label: "Quiz" },
  webinar: { icon: Video, color: "#ec4899", label: "Webinar" },
  template: { icon: FileText, color: "#14b8a6", label: "Template" },
};

const CATEGORY_CONFIG: Record<ResourceCategory, { label: string; color: string }> = {
  sales: { label: "Sales Collateral", color: "#3b82f6" },
  case_studies: { label: "Case Studies", color: "#22c55e" },
  training: { label: "Training", color: "#8b5cf6" },
  marketing: { label: "Co-Marketing", color: "#ec4899" },
  technical: { label: "Technical", color: "#f59e0b" },
  brand: { label: "Brand Assets", color: "#6366f1" },
};

const demoResources: Resource[] = [
  // Sales
  { id: "r1", title: "Product Battle Card", description: "Key differentiators vs top 5 competitors. Updated monthly with latest feature comparisons and win/loss data.", category: "sales", type: "pdf", views: 342, downloads: 189, fileSize: "2.4 MB", updatedAt: now - 5 * DAY, tags: ["competitive", "enterprise"], featured: true },
  { id: "r2", title: "Enterprise Value Proposition", description: "One-pager highlighting ROI metrics, security compliance, and enterprise-grade features.", category: "sales", type: "pdf", views: 256, downloads: 145, fileSize: "1.1 MB", updatedAt: now - 12 * DAY, tags: ["enterprise", "one-pager"] },
  { id: "r3", title: "Pricing & Packaging Guide", description: "Current pricing tiers, partner discounts, volume breaks, and deal desk escalation criteria.", category: "sales", type: "pdf", views: 523, downloads: 312, fileSize: "800 KB", updatedAt: now - 3 * DAY, tags: ["pricing", "discounts"], new: true },
  { id: "r4", title: "Objection Handling Playbook", description: "Top 15 sales objections with proven responses, talk tracks, and supporting evidence.", category: "sales", type: "doc", views: 187, downloads: 98, fileSize: "1.8 MB", updatedAt: now - 20 * DAY, tags: ["objections", "talk-tracks"] },
  // Case Studies
  { id: "r5", title: "Globex Industries: 3x Partner Revenue", description: "How Globex scaled their partner program from $500K to $1.5M in 12 months using attribution-driven incentives.", category: "case_studies", type: "pdf", views: 412, downloads: 267, fileSize: "3.2 MB", updatedAt: now - 8 * DAY, tags: ["enterprise", "scaling"], featured: true },
  { id: "r6", title: "Initech: 0 to $500K Partner Revenue", description: "Mid-market playbook: how Initech built their first partner channel from scratch.", category: "case_studies", type: "pdf", views: 298, downloads: 156, fileSize: "2.8 MB", updatedAt: now - 15 * DAY, tags: ["mid-market", "new-program"] },
  { id: "r7", title: "Covant: Multi-Touch Attribution ROI", description: "Video case study on implementing role-based attribution and its impact on partner engagement.", category: "case_studies", type: "video", views: 534, downloads: 0, duration: "12 min", updatedAt: now - 6 * DAY, tags: ["attribution", "video"] },
  // Training
  { id: "r8", title: "Partner Onboarding Masterclass", description: "Complete onboarding walkthrough: portal setup, deal registration, first 30 days.", category: "training", type: "video", views: 876, downloads: 0, duration: "45 min", updatedAt: now - 2 * DAY, tags: ["onboarding", "getting-started"], new: true, featured: true },
  { id: "r9", title: "Advanced Enterprise Sales Training", description: "Selling strategies for enterprise accounts: champion building, multi-threading, procurement navigation.", category: "training", type: "webinar", views: 345, downloads: 0, duration: "60 min", updatedAt: now - 10 * DAY, tags: ["enterprise", "advanced"] },
  { id: "r10", title: "Platform Certification Exam", description: "30-question certification exam. Pass to earn your badge and unlock higher commission tiers.", category: "training", type: "quiz", views: 654, downloads: 0, updatedAt: now - 1 * DAY, tags: ["certification", "quiz"], new: true },
  { id: "r11", title: "API Integration Workshop", description: "Hands-on technical training for integrating Covant APIs into your existing workflows.", category: "training", type: "webinar", views: 189, downloads: 0, duration: "90 min", updatedAt: now - 18 * DAY, tags: ["api", "technical", "developer"] },
  // Marketing
  { id: "r12", title: "Email Outreach Templates", description: "12 pre-written email sequences for partner-led outreach: cold, warm, nurture, and event follow-up.", category: "marketing", type: "template", views: 432, downloads: 278, fileSize: "500 KB", updatedAt: now - 7 * DAY, tags: ["email", "outreach"], featured: true },
  { id: "r13", title: "Co-Branded Slide Deck", description: "Customizable 20-slide presentation with your logo. Includes speaker notes and talk track.", category: "marketing", type: "pptx", views: 356, downloads: 198, fileSize: "8.5 MB", updatedAt: now - 14 * DAY, tags: ["presentation", "co-brand"] },
  { id: "r14", title: "Social Media Content Kit", description: "30 ready-to-post social templates for LinkedIn, Twitter. Includes images, copy, and hashtag strategy.", category: "marketing", type: "zip", views: 267, downloads: 145, fileSize: "24 MB", updatedAt: now - 4 * DAY, tags: ["social", "linkedin", "content"] },
  { id: "r15", title: "Webinar-in-a-Box Kit", description: "Everything to run a co-branded webinar: slide deck, email invites, landing page copy, follow-up sequences.", category: "marketing", type: "zip", views: 178, downloads: 89, fileSize: "15 MB", updatedAt: now - 22 * DAY, tags: ["webinar", "event", "co-brand"] },
  // Technical
  { id: "r16", title: "API Reference Guide", description: "Complete REST API documentation with authentication, endpoints, and code samples in Python, Node, and cURL.", category: "technical", type: "doc", views: 543, downloads: 312, fileSize: "4.2 MB", updatedAt: now - 3 * DAY, tags: ["api", "developer", "reference"], new: true },
  { id: "r17", title: "Webhook Integration Guide", description: "Step-by-step guide to setting up inbound webhooks from Salesforce, HubSpot, and custom sources.", category: "technical", type: "pdf", views: 234, downloads: 156, fileSize: "2.1 MB", updatedAt: now - 11 * DAY, tags: ["webhooks", "integration"] },
  // Brand
  { id: "r18", title: "Brand Guidelines & Logo Pack", description: "Official Covant logos (SVG, PNG), color palette, typography specs, and co-branding dos and don'ts.", category: "brand", type: "zip", views: 312, downloads: 178, fileSize: "18 MB", updatedAt: now - 30 * DAY, tags: ["logo", "brand", "guidelines"] },
];

function timeAgo(ts: number): string {
  const days = Math.floor((now - ts) / DAY);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function PortalResourcesPage() {
  const { partner } = usePortal();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set(["r1", "r8", "r12"]));
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    return demoResources.filter((r) => {
      if (showBookmarked && !bookmarked.has(r.id)) return false;
      if (filterCategory !== "all" && r.category !== filterCategory) return false;
      if (filterType !== "all" && r.type !== filterType) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.includes(q));
      }
      return true;
    });
  }, [search, filterCategory, filterType, showBookmarked, bookmarked]);

  const featured = demoResources.filter((r) => r.featured);

  function handleDownload(id: string, title: string) {
    setDownloadCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    // In production, this would trigger actual file download
    console.log(`Downloading: ${title}`);
  }

  function toggleBookmark(id: string) {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Partner Resources</h1>
          <p className="muted">{demoResources.length} resources across {Object.keys(CATEGORY_CONFIG).length} categories</p>
        </div>
        <button
          onClick={() => setShowBookmarked(!showBookmarked)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            fontSize: ".85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            border: showBookmarked ? "2px solid #6366f1" : "1px solid var(--border)",
            background: showBookmarked ? "#6366f115" : "transparent", color: showBookmarked ? "#6366f1" : "var(--muted)",
          }}
        >
          {showBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          Saved ({bookmarked.size})
        </button>
      </div>

      {/* Featured row */}
      {!showBookmarked && !search && filterCategory === "all" && (
        <div>
          <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 10 }}>
            <Star size={13} style={{ verticalAlign: -2 }} /> Featured
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {featured.map((r) => {
              const tcfg = TYPE_CONFIG[r.type];
              const Icon = tcfg.icon;
              return (
                <div key={r.id} className="card" style={{ padding: "1rem", borderTop: `3px solid ${tcfg.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700, background: `${tcfg.color}15`, color: tcfg.color }}>{tcfg.label}</span>
                    {r.new && <span style={{ padding: "1px 6px", borderRadius: 999, fontSize: ".6rem", fontWeight: 700, background: "#22c55e20", color: "#22c55e" }}>NEW</span>}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: 4 }}>{r.title}</h3>
                  <p className="muted" style={{ fontSize: ".8rem", lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{r.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="muted" style={{ fontSize: ".7rem" }}><Eye size={11} style={{ verticalAlign: -2 }} /> {r.views}</span>
                    <button onClick={() => handleDownload(r.id, r.title)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, fontSize: ".75rem", fontWeight: 600, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer" }}>
                      {r.type === "video" || r.type === "webinar" ? <><Play size={12} /> Watch</> : <><Download size={12} /> Get</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 10, top: 9, color: "var(--muted)" }} />
          <input className="input" placeholder="Search resources, tags..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, width: "100%" }} />
        </div>
        <select className="input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ maxWidth: 170 }}>
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select className="input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ maxWidth: 140 }}>
          <option value="all">All Types</option>
          {Object.entries(TYPE_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Resource list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((r) => {
          const tcfg = TYPE_CONFIG[r.type];
          const catCfg = CATEGORY_CONFIG[r.category];
          const Icon = tcfg.icon;
          const isBookmarked = bookmarked.has(r.id);

          return (
            <div key={r.id} className="card" style={{ padding: "1rem 1.25rem", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${tcfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: tcfg.color, flexShrink: 0 }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{r.title}</span>
                  <span style={{ padding: "1px 6px", borderRadius: 999, fontSize: ".6rem", fontWeight: 700, background: `${tcfg.color}15`, color: tcfg.color }}>{tcfg.label}</span>
                  <span style={{ padding: "1px 6px", borderRadius: 999, fontSize: ".6rem", fontWeight: 600, background: `${catCfg.color}10`, color: catCfg.color }}>{catCfg.label}</span>
                  {r.new && <span style={{ padding: "1px 6px", borderRadius: 999, fontSize: ".6rem", fontWeight: 700, background: "#22c55e20", color: "#22c55e" }}>NEW</span>}
                </div>
                <p className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5, marginBottom: 6 }}>{r.description}</p>
                <div style={{ display: "flex", gap: "1rem", fontSize: ".75rem", flexWrap: "wrap" }}>
                  <span className="muted"><Eye size={11} style={{ verticalAlign: -2 }} /> {r.views} views</span>
                  {r.downloads > 0 && <span className="muted"><Download size={11} style={{ verticalAlign: -2 }} /> {r.downloads + (downloadCounts[r.id] || 0)}</span>}
                  {r.duration && <span className="muted"><Clock size={11} style={{ verticalAlign: -2 }} /> {r.duration}</span>}
                  {r.fileSize && <span className="muted">{r.fileSize}</span>}
                  <span className="muted">Updated {timeAgo(r.updatedAt)}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                <button onClick={() => toggleBookmark(r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: isBookmarked ? "#6366f1" : "var(--muted)" }} title={isBookmarked ? "Remove bookmark" : "Bookmark"}>
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
                <button
                  onClick={() => handleDownload(r.id, r.title)}
                  className="btn-outline"
                  style={{ fontSize: ".8rem", padding: "6px 14px", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}
                >
                  {r.type === "video" || r.type === "webinar" ? <><Play size={13} /> Watch</> : r.type === "quiz" ? <><Award size={13} /> Start</> : <><Download size={13} /> Download</>}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <Search size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600 }}>No resources found</p>
            <p className="muted" style={{ fontSize: ".875rem" }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
