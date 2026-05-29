"use client";

/**
 * ImportDataModal — no-auth partner data unlock.
 *
 * Paste/upload a Partners CSV (and optionally a Deals CSV), e.g. a PartnerStack
 * or Monaco export. Parsed client-side and sent to imports.importPartnerData.
 * No OAuth required.
 */

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Modal } from "@/components/ui/modal";
import { parseCsvToObjects, csvToNumber } from "@/lib/csv";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";

const PARTNER_SAMPLE = "name,email,type,tier,commissionRate\nAcme SI,team@acme.io,reseller,gold,18\nDataSync,hi@datasync.io,integration,silver,20";
const DEAL_SAMPLE = "name,amount,status,partnerName,productName\nGlobex Platform,120000,won,Acme SI,Platform License\nInitech Expansion,60000,open,DataSync,Platform License";

type Result = { partnersCreated: number; dealsCreated: number; attributionsCreated: number } | null;

export function ImportDataModal({
  open,
  onClose,
  source,
  sourceLabel,
}: {
  open: boolean;
  onClose: () => void;
  source: string;
  sourceLabel: string;
}) {
  const importData = useMutation(api.imports.importPartnerData);
  const [partnersCsv, setPartnersCsv] = useState("");
  const [dealsCsv, setDealsCsv] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(setter);
  }

  async function handleImport() {
    setBusy(true);
    setError(null);
    try {
      const partners = parseCsvToObjects(partnersCsv).map((r) => ({
        name: r.name || r.partner || r["partner name"] || "",
        email: r.email || undefined,
        type: r.type || undefined,
        tier: r.tier || undefined,
        commissionRate: r.commissionrate || r["commission rate"] ? csvToNumber(r.commissionrate || r["commission rate"]) : undefined,
      })).filter((p) => p.name);

      if (partners.length === 0) {
        setError("No partners found. Make sure your CSV has a 'name' column.");
        setBusy(false);
        return;
      }

      const deals = parseCsvToObjects(dealsCsv).map((r) => ({
        name: r.name || r.deal || r["deal name"] || "",
        amount: csvToNumber(r.amount || r.value),
        status: r.status || undefined,
        partnerName: r.partnername || r["partner name"] || r.partner || "",
        productName: r.productname || r["product name"] || r.product || undefined,
      })).filter((d) => d.name && d.partnerName);

      const res = await importData({ source, partners, deals });
      setResult({
        partnersCreated: res.partnersCreated,
        dealsCreated: res.dealsCreated,
        attributionsCreated: res.attributionsCreated,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Import from ${sourceLabel}`} width={620}>
      {result ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <CheckCircle2 size={40} style={{ color: "#22c55e", marginBottom: ".75rem" }} />
          <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Data unlocked</h3>
          <p className="muted" style={{ fontSize: ".9rem", marginBottom: "1.25rem" }}>
            {result.partnersCreated} partners, {result.dealsCreated} deals, and{" "}
            {result.attributionsCreated} attribution records imported from {sourceLabel}.
          </p>
          <button className="btn" onClick={onClose}>Done</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p className="muted" style={{ fontSize: ".88rem", lineHeight: 1.5 }}>
            Paste or upload your {sourceLabel} export. No login required — your CSV is parsed in the
            browser. We dedupe by name, attach deals to your default program, and compute attribution
            for won deals automatically.
          </p>

          <Field
            label="Partners CSV (required)"
            hint="Columns: name, email, type, tier, commissionRate"
            value={partnersCsv}
            onChange={setPartnersCsv}
            onFile={(e) => onFile(e, setPartnersCsv)}
            onUseSample={() => setPartnersCsv(PARTNER_SAMPLE)}
          />
          <Field
            label="Deals CSV (optional)"
            hint="Columns: name, amount, status, partnerName, productName"
            value={dealsCsv}
            onChange={setDealsCsv}
            onFile={(e) => onFile(e, setDealsCsv)}
            onUseSample={() => setDealsCsv(DEAL_SAMPLE)}
          />

          {error && (
            <div style={{ color: "#dc2626", fontSize: ".85rem", background: "#fef2f2", padding: ".6rem .85rem", borderRadius: 8 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem" }}>
            <button className="btn-secondary" onClick={onClose} disabled={busy}>Cancel</button>
            <button className="btn" onClick={handleImport} disabled={busy || !partnersCsv.trim()}>
              {busy ? <Loader2 size={15} className="spin" /> : <UploadCloud size={15} />}
              <span style={{ marginLeft: 6 }}>{busy ? "Importing…" : "Import data"}</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Field({
  label, hint, value, onChange, onFile, onUseSample,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (s: string) => void;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUseSample: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".3rem" }}>
        <label style={{ fontSize: ".82rem", fontWeight: 600 }}>{label}</label>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <button type="button" onClick={onUseSample} style={linkBtn}>Use sample</button>
          <label style={{ ...linkBtn, cursor: "pointer" }}>
            Upload
            <input type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: "none" }} />
          </label>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={hint}
        rows={4}
        style={{
          width: "100%", fontFamily: "ui-monospace, monospace", fontSize: ".8rem",
          padding: ".6rem .75rem", border: "1px solid var(--border)", borderRadius: 8, resize: "vertical",
        }}
      />
      <div className="muted" style={{ fontSize: ".72rem", marginTop: ".2rem" }}>{hint}</div>
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  background: "none", border: "none", color: "#6366f1", fontSize: ".78rem",
  cursor: "pointer", padding: 0, fontWeight: 600,
};
