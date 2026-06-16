"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/toast";
import {
  Network, Database, Trash2, Loader2, FileText, Quote, ArrowRight,
  ArrowLeft, Sparkles, AlertTriangle, CalendarDays, Building2, User, Briefcase, Users,
} from "lucide-react";

// method -> badge style
const METHOD_BADGE: Record<string, string> = {
  asserted: "badge-info",
  user_confirmed: "badge-success",
  inferred: "badge-danger",
};

const NODE_ICON: Record<string, typeof Network> = {
  PartnerOrg: Users,
  Account: Building2,
  PartnerPerson: User,
  VendorRep: User,
  Opportunity: Briefcase,
};

export default function ChannelGraphPage() {
  const { toast } = useToast();
  const overview = useQuery(api.channelGraph.getGraphOverview);
  const nodes = useQuery(api.channelGraph.getNodes);
  const scenario = useQuery(api.channelGraph.getTriggerScenario);

  const seed = useMutation(api.channelGraph.seedGraphDemo);
  const clear = useMutation(api.channelGraph.clearGraphDemo);
  const [busy, setBusy] = useState<"seed" | "clear" | null>(null);

  const [selected, setSelected] = useState<{ table: string; id: string; label: string; type: string } | null>(null);
  const detail = useQuery(
    api.channelGraph.getNodeDetail,
    selected ? { table: selected.table, id: selected.id } : "skip"
  );

  async function handleSeed() {
    setBusy("seed");
    try {
      const res = await seed({});
      if (res.status === "no_org") toast("No organization for the current user.", "error");
      else if (res.status === "already_seeded") toast("Graph demo already seeded.");
      else toast("Channel Graph demo seeded.");
    } catch (e: any) {
      toast(e?.message ?? "Seed failed", "error");
    } finally {
      setBusy(null);
    }
  }

  async function handleClear() {
    if (!window.confirm("Remove the Channel Graph demo data (graph tables + demo deals/partner)?")) return;
    setBusy("clear");
    try {
      const res = await clear({});
      setSelected(null);
      toast(res.status === "cleared" ? `Cleared ${res.deleted} rows.` : "Nothing to clear.");
    } catch (e: any) {
      toast(e?.message ?? "Clear failed", "error");
    } finally {
      setBusy(null);
    }
  }

  const hasData = (overview?.counts.facts ?? 0) > 0;
  const nodesByType = groupBy(nodes ?? [], (n) => n.type);

  return (
    <div id="main-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-.02em", display: "flex", alignItems: "center", gap: ".6rem" }}>
            <Network size={26} /> Channel Graph
          </h1>
          <p className="muted" style={{ fontSize: ".9rem", marginTop: ".3rem", maxWidth: 640 }}>
            Every fact below carries its source and the exact evidence behind it. Nothing is
            stored bare — that&apos;s the no-fabrication guarantee. Seed the demo to see the
            graph form, then click any node to verify its provenance.
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn" onClick={handleSeed} disabled={busy !== null}>
            {busy === "seed" ? <Loader2 size={16} /> : <Database size={16} />} Seed demo
          </button>
          <button className="btn-outline" onClick={handleClear} disabled={busy !== null}>
            {busy === "clear" ? <Loader2 size={16} /> : <Trash2 size={16} />} Clear
          </button>
        </div>
      </div>

      {!hasData && (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <Network size={36} style={{ opacity: 0.4, marginBottom: ".75rem" }} />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>No graph yet</h2>
          <p className="muted" style={{ fontSize: ".9rem", marginTop: ".4rem" }}>
            Click <strong>Seed demo</strong> to load a scenario: a partner with a track record,
            an account, recent meetings, and an open opportunity with <em>no partner attached</em>.
          </p>
        </div>
      )}

      {hasData && overview && (
        <>
          {/* Overview cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: ".75rem", marginBottom: "1.25rem" }}>
            <Stat label="Sources" value={overview.counts.sources} hint={Object.entries(overview.sourcesByKind).map(([k, n]) => `${n} ${k}`).join(" · ")} />
            <Stat label="Facts" value={overview.counts.facts} />
            <Stat label="Edges" value={overview.counts.edges} />
            <Stat label="Accounts" value={overview.counts.accounts} />
            <Stat label="Partner people" value={overview.counts.partnerPersons} />
          </div>

          {/* Provenance breakdown */}
          <div className="card" style={{ marginBottom: "1.25rem", padding: "1.25rem" }}>
            <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", marginBottom: ".6rem" }}>
              Facts by method
            </div>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              <span className="badge badge-info">{overview.factsByMethod.asserted} asserted</span>
              <span className="badge badge-success">{overview.factsByMethod.user_confirmed} user-confirmed</span>
              <span className="badge badge-danger">{overview.factsByMethod.inferred} inferred</span>
            </div>
            <p className="muted" style={{ fontSize: ".8rem", marginTop: ".6rem" }}>
              All demo facts are <strong>asserted</strong> (confidence 1.0) — copied verbatim from a system
              of record. Inferred facts appear once the recommendation engine runs.
            </p>
          </div>

          {/* Trigger scenario */}
          {scenario?.seeded && (
            <div className="card" style={{ marginBottom: "1.25rem", border: "1px solid #fcd34d", background: "#fffbeb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                <Sparkles size={18} color="#b45309" />
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#92400e" }}>Recommendation trigger (what the engine will see)</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".6rem", flexWrap: "wrap" }}>
                <Briefcase size={15} />
                <strong>{scenario.openOpportunity.name}</strong>
                <span className="muted">${scenario.openOpportunity.amount.toLocaleString()} · open</span>
                {!scenario.hasPartner && (
                  <span className="badge badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
                    <AlertTriangle size={12} /> no partner attached
                  </span>
                )}
              </div>
              <div style={{ fontSize: ".88rem", lineHeight: 1.7 }}>
                Yet <strong>{scenario.candidatePartner?.name ?? "a partner"}</strong> has a track record with this account:
                <ul style={{ margin: ".4rem 0 .6rem 1.2rem" }}>
                  {scenario.priorWins.map((w, i) => (
                    <li key={i}>Won: {w.name} — ${w.amount.toLocaleString()}</li>
                  ))}
                </ul>
                and <strong>{scenario.meetings.length} recent meetings</strong> with the account:
                <ul style={{ margin: ".4rem 0 0 1.2rem" }}>
                  {scenario.meetings.map((m, i) => (
                    <li key={i} style={{ display: "flex", gap: ".4rem", alignItems: "baseline" }}>
                      <CalendarDays size={13} style={{ flexShrink: 0, marginTop: 3 }} />
                      <span>
                        {m.observedAt ? new Date(m.observedAt).toLocaleDateString() : ""} —{" "}
                        <span className="muted">&ldquo;{m.quote}&rdquo;</span>{" "}
                        <span className="badge badge-neutral">{m.source?.kind}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ fontSize: ".82rem", color: "#92400e", marginTop: ".75rem", fontStyle: "italic" }}>
                Next step builds the engine that turns this evidence into an <em>inferred</em> recommendation
                you can approve, edit, or deny — with this exact why-chain attached.
              </p>
            </div>
          )}

          {/* Node explorer + detail */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 320px) 1fr", gap: "1rem", alignItems: "start" }}>
            <div className="card" style={{ padding: "1rem" }}>
              <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", marginBottom: ".5rem" }}>
                Nodes
              </div>
              {Object.entries(nodesByType).map(([type, items]) => {
                const Icon = NODE_ICON[type] ?? Network;
                return (
                  <div key={type} style={{ marginBottom: ".75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".78rem", fontWeight: 600, color: "var(--muted)", marginBottom: ".3rem" }}>
                      <Icon size={13} /> {type}
                    </div>
                    {items.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setSelected({ table: n.table, id: n.id, label: n.label, type: n.type })}
                        style={{
                          display: "block", width: "100%", textAlign: "left", padding: ".4rem .55rem",
                          borderRadius: 8, border: "1px solid transparent", cursor: "pointer",
                          background: selected?.id === n.id ? "var(--subtle)" : "transparent",
                          fontSize: ".86rem",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{n.label}</div>
                        {n.sublabel && <div className="muted" style={{ fontSize: ".75rem" }}>{n.sublabel}</div>}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="card" style={{ padding: "1.25rem", minHeight: 240 }}>
              {!selected && (
                <div style={{ textAlign: "center", color: "var(--muted)", paddingTop: "3rem" }}>
                  <FileText size={28} style={{ opacity: 0.4 }} />
                  <p style={{ fontSize: ".9rem", marginTop: ".5rem" }}>Select a node to inspect its facts and evidence.</p>
                </div>
              )}
              {selected && (
                <>
                  <div style={{ marginBottom: "1rem" }}>
                    <div className="muted" style={{ fontSize: ".75rem" }}>{selected.type}</div>
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{selected.label}</h2>
                  </div>

                  {detail === undefined && <Loader2 size={18} />}

                  {detail && (
                    <>
                      {/* Facts */}
                      <SectionLabel>Facts ({detail.facts.length})</SectionLabel>
                      {detail.facts.length === 0 && <p className="muted" style={{ fontSize: ".85rem" }}>No facts.</p>}
                      <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.25rem" }}>
                        {detail.facts.map((f) => (
                          <div key={f._id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: ".7rem .8rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                              <strong style={{ fontSize: ".88rem" }}>{f.field ?? "(value)"}</strong>
                              <span style={{ fontSize: ".88rem" }}>= {formatValue(f.value)}</span>
                              <span className={`badge ${METHOD_BADGE[f.method] ?? "badge-neutral"}`}>{f.method}</span>
                              <span className="badge badge-neutral">conf {f.confidence}</span>
                            </div>
                            {/* provenance */}
                            <div style={{ marginTop: ".5rem", fontSize: ".8rem", color: "var(--muted)", display: "flex", flexDirection: "column", gap: ".25rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                                <Database size={12} />
                                source: <strong>{f.source?.kind}</strong>
                                {f.source?.docType ? ` (${f.source.docType})` : ""} · {f.source?.adapter}
                                {f.source?.externalRef ? ` · ${f.source.externalRef}` : ""}
                              </div>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
                                <Quote size={12} style={{ marginTop: 3, flexShrink: 0 }} />
                                {f.evidencePointer.kind === "field_path" ? (
                                  <span>field: <code>{f.evidencePointer.path}</code></span>
                                ) : (
                                  <span style={{ fontStyle: "italic" }}>&ldquo;{f.evidencePointer.quote}&rdquo;</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Edges */}
                      <SectionLabel>Relationships ({detail.edges.length})</SectionLabel>
                      {detail.edges.length === 0 && <p className="muted" style={{ fontSize: ".85rem" }}>No edges.</p>}
                      <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                        {detail.edges.map((e) => (
                          <div key={e._id} style={{ fontSize: ".85rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
                            {e.direction === "out" ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                            <span className="badge badge-neutral">{e.type}{e.role ? `:${e.role}` : ""}</span>
                            <span className="muted">{e.direction === "out" ? "→" : "←"} {e.other.table}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="card" style={{ padding: "1rem" }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div className="muted" style={{ fontSize: ".8rem", marginTop: ".3rem" }}>{label}</div>
      {hint && <div className="muted" style={{ fontSize: ".7rem", marginTop: ".2rem" }}>{hint}</div>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", marginBottom: ".5rem" }}>
      {children}
    </div>
  );
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "number") return v.toLocaleString();
  return String(v);
}

function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of arr) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}
