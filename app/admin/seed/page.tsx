"use client";
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Database, Trash2, CheckCircle, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

export default function SeedPage() {
  const seedMutation = useMutation(api.seedDemo.seedDemoData);
  const clearMutation = useMutation(api.seedDemo.clearDemoData);

  const [seedStatus, setSeedStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [clearStatus, setClearStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [clearResult, setClearResult] = useState<any>(null);

  async function handleSeed() {
    setSeedStatus("running");
    setResult(null);
    try {
      const res = await seedMutation({});
      setResult(res);
      setSeedStatus("done");
    } catch (err: any) {
      setResult({ error: err?.message ?? String(err) });
      setSeedStatus("error");
    }
  }

  async function handleClear() {
    if (!window.confirm("This will DELETE ALL data from the database. Are you sure?")) return;
    setClearStatus("running");
    setClearResult(null);
    try {
      const res = await clearMutation({});
      setClearResult(res);
      setClearStatus("done");
    } catch (err: any) {
      setClearResult({ error: err?.message ?? String(err) });
      setClearStatus("error");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link
        href="/dashboard"
        style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", color: "var(--muted)", fontSize: ".85rem", marginBottom: "2rem" }}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: ".5rem" }}>
          🌱 Database Admin
        </h1>
        <p className="muted">
          Seed initial data for your organization. This page lets you populate sample
          data to get started quickly.
        </p>
      </div>

      {/* Seed Card */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "#ecfdf5", padding: ".75rem", borderRadius: 12 }}>
            <Database size={24} color="#059669" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".3rem" }}>Seed Demo Data</h2>
            <p className="muted" style={{ fontSize: ".9rem" }}>
              Creates a demo organization with 4 partner companies, 6 realistic deals,
              touchpoints, attributions, and payouts.
            </p>
          </div>
        </div>

        <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
          <li style={{ fontSize: ".9rem" }}>4 partners (TechStar, CloudBridge, DataPipe, NexGen)</li>
          <li style={{ fontSize: ".9rem" }}>6 deals across won/open stages</li>
          <li style={{ fontSize: ".9rem" }}>Touchpoints and attribution records</li>
          <li style={{ fontSize: ".9rem" }}>Pending and paid commission payouts</li>
        </ul>

        <button
          className="btn"
          style={{ width: "100%", padding: ".75rem", fontSize: "1rem", gap: ".5rem" }}
          onClick={handleSeed}
          disabled={seedStatus === "running"}
        >
          {seedStatus === "running" ? (
            <><Loader2 size={18} /> Seeding…</>
          ) : (
            <><Database size={18} /> Seed Demo Data</>
          )}
        </button>

        {seedStatus === "done" && result && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#ecfdf5", borderRadius: 8, border: "1px solid #6ee7b7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <CheckCircle size={18} color="#059669" />
              <strong style={{ color: "#065f46" }}>Seed complete!</strong>
            </div>
            <p style={{ fontSize: ".85rem", color: "#065f46" }}>
              Created {result.partnersCreated} partners and {result.dealsCreated} deals.
            </p>
            <Link href="/dashboard" style={{ fontSize: ".85rem", color: "#059669", fontWeight: 600, marginTop: ".5rem", display: "inline-block" }}>
              → Go to Dashboard
            </Link>
          </div>
        )}

        {seedStatus === "error" && result && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#fef2f2", borderRadius: 8, border: "1px solid #fca5a5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <AlertTriangle size={18} color="#dc2626" />
              <strong style={{ color: "#991b1b" }}>Error: {result.error}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Clear Card */}
      <div className="card" style={{ border: "1px solid #fca5a5" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "#fef2f2", padding: ".75rem", borderRadius: 12 }}>
            <Trash2 size={24} color="#dc2626" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".3rem", color: "#991b1b" }}>
              Clear All Data
            </h2>
            <p className="muted" style={{ fontSize: ".9rem" }}>
              Permanently deletes all organizations, partners, deals, payouts, and related
              records from the database. Use before re-seeding.
            </p>
          </div>
        </div>

        <button
          className="btn"
          style={{ width: "100%", padding: ".75rem", fontSize: "1rem", gap: ".5rem", background: "#dc2626" }}
          onClick={handleClear}
          disabled={clearStatus === "running"}
        >
          {clearStatus === "running" ? (
            <><Loader2 size={18} /> Clearing…</>
          ) : (
            <><Trash2 size={18} /> Clear All Data</>
          )}
        </button>

        {clearStatus === "done" && clearResult && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#ecfdf5", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <CheckCircle size={18} color="#059669" />
              <span style={{ fontSize: ".85rem", color: "#065f46" }}>{clearResult.message}</span>
            </div>
          </div>
        )}

        {clearStatus === "error" && clearResult && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#fef2f2", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <AlertTriangle size={18} color="#dc2626" />
              <strong style={{ color: "#991b1b" }}>Error: {clearResult.error}</strong>
            </div>
          </div>
        )}
      </div>

      <p className="muted" style={{ fontSize: ".8rem", marginTop: "1.5rem", textAlign: "center" }}>
        Convex deployment: <code style={{ fontSize: ".75rem", background: "var(--subtle)", padding: "2px 6px", borderRadius: 4 }}>{process.env.NEXT_PUBLIC_CONVEX_URL}</code>
      </p>
    </div>
  );
}
