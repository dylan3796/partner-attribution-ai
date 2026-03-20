"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sparkles, ArrowRight, Loader2, CheckCircle } from "lucide-react";

const EXAMPLES = [
  "We have resellers who get 18%, referral partners who get 12%, and our top gold tier partners get a $5k MDF budget per quarter.",
  "Simple setup — one type of partner, 15% commission on every closed deal. We have about 8 partners right now.",
  "We do tiered commissions: bronze 10%, silver 15%, gold 20%. Plus a $2,500 new logo bonus for the first enterprise deal.",
  "Channel resellers at 20%, tech integration partners at 8%. Gold tier gets accelerator: 25% on deals over $100k.",
];

type ParsedProgram = {
  partnerTypes: { type: string; rate: number }[];
  tiers: { name: string; rate: number; mdf?: number }[];
  bonuses: string[];
  summary: string;
};

function parseProgram(text: string): ParsedProgram {
  const result: ParsedProgram = { partnerTypes: [], tiers: [], bonuses: [], summary: "" };
  const lower = text.toLowerCase();

  // Extract commission rates for partner types
  const typePatterns = [
    { pattern: /reseller[s]?[^.]*?(\d+)%/gi, type: "reseller" },
    { pattern: /referral[s]?[^.]*?(\d+)%/gi, type: "referral" },
    { pattern: /affiliate[s]?[^.]*?(\d+)%/gi, type: "affiliate" },
    { pattern: /integration[s]?[^.]*?(\d+)%/gi, type: "integration" },
    { pattern: /channel[^.]*?(\d+)%/gi, type: "reseller" },
    { pattern: /tech[^.]*?(\d+)%/gi, type: "integration" },
  ];

  for (const { pattern, type } of typePatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const m of matches) {
      const rate = parseInt(m[1]);
      if (rate > 0 && rate <= 100 && !result.partnerTypes.find(p => p.type === type)) {
        result.partnerTypes.push({ type, rate });
      }
    }
  }

  // Extract tier-based rates
  const tierPatterns = [
    { pattern: /(?:gold|platinum)[^.]*?(\d+)%/gi, name: "gold" },
    { pattern: /(?:silver)[^.]*?(\d+)%/gi, name: "silver" },
    { pattern: /(?:bronze)[^.]*?(\d+)%/gi, name: "bronze" },
    { pattern: /platinum[^.]*?(\d+)%/gi, name: "platinum" },
  ];

  for (const { pattern, name } of tierPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const m of matches) {
      const rate = parseInt(m[1]);
      if (rate > 0 && !result.tiers.find(t => t.name === name)) {
        // Extract MDF if mentioned for this tier
        const mdfMatch = text.match(new RegExp(`${name}[^.]*?\\$([\\d,k]+).*?mdf`, 'i'))
          || text.match(new RegExp(`mdf[^.]*?${name}[^.]*?\\$([\\d,k]+)`, 'i'));
        let mdf: number | undefined;
        if (mdfMatch) {
          const raw = mdfMatch[1].replace(',', '');
          mdf = raw.endsWith('k') ? parseInt(raw) * 1000 : parseInt(raw);
        }
        result.tiers.push({ name, rate, mdf });
      }
    }
  }

  // Detect simple "one type" / flat rate
  if (result.partnerTypes.length === 0 && result.tiers.length === 0) {
    const flat = text.match(/(\d+)%/);
    if (flat) {
      result.partnerTypes.push({ type: "partner", rate: parseInt(flat[1]) });
    }
  }

  // Detect bonuses
  const bonusMatch = text.match(/\$([0-9,k]+)\s+(?:new logo|logo|one.time|bonus)/i);
  if (bonusMatch) result.bonuses.push(`$${bonusMatch[1]} new logo bonus`);
  const mdfMatch = text.match(/\$([0-9,k]+)\s+mdf/i) || text.match(/mdf[^.]*?\$([0-9,k]+)/i);
  if (mdfMatch) result.bonuses.push(`$${mdfMatch[1]} MDF budget`);

  // Build summary
  const parts: string[] = [];
  for (const pt of result.partnerTypes) parts.push(`${pt.type} ${pt.rate}%`);
  for (const t of result.tiers) parts.push(`${t.name} tier ${t.rate}%${t.mdf ? ` + $${t.mdf.toLocaleString()} MDF` : ""}`);
  result.summary = parts.join(", ") || "Custom program";

  return result;
}

export default function DescribePage() {
  const router = useRouter();
  const seedMyOrg = useMutation(api.seedDemo.seedMyOrg);
  const seedFromProgram = useMutation(api.seedFromProgram.seedFromProgram);
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<ParsedProgram | null>(null);
  const [loading, setLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<{ partners: number; deals: number; rules: number } | null>(null);
  const [exampleIdx, setExampleIdx] = useState(0);

  function handleParse() {
    if (!text.trim()) return;
    const result = parseProgram(text);
    setParsed(result);
  }

  async function handleContinue() {
    setLoading(true);
    localStorage.setItem("covant_nl_description", text);
    if (parsed) localStorage.setItem("covant_parsed_program", JSON.stringify(parsed));

    // Use personalized seeding when we have parsed program data
    if (parsed && (parsed.partnerTypes.length > 0 || parsed.tiers.length > 0)) {
      try {
        const result = await seedFromProgram({
          partnerTypes: parsed.partnerTypes,
          tiers: parsed.tiers,
          bonuses: parsed.bonuses,
          summary: parsed.summary,
          description: text,
        });
        if (result && "partners" in result) {
          setSeedResult({ partners: result.partners as number, deals: result.deals as number, rules: result.rules as number });
          // Brief pause to show success before navigating
          await new Promise(r => setTimeout(r, 1200));
        }
      } catch {
        // Fallback to generic seed
        try { await seedMyOrg({}); } catch {}
      }
    } else {
      try { await seedMyOrg({}); } catch {}
    }
    router.push("/dashboard");
  }

  async function handleSkip() {
    setLoading(true);
    try { await seedMyOrg({}); } catch {}
    router.push("/dashboard");
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#ffffff", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#f9fafb", border: "1px solid #e5e7eb",
            borderRadius: 8, padding: ".35rem .8rem", marginBottom: "1.25rem",
          }}>
            <Sparkles size={14} style={{ color: "#6366f1" }} />
            <span style={{ fontSize: ".8rem", fontWeight: 600, color: "#6b7280" }}>Covant Setup</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.03em", color: "#0a0a0a", marginBottom: ".5rem" }}>
            Describe your partner program
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.5 }}>
            Tell us how it works — in plain English. We&apos;ll configure the rules automatically.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ marginTop: ".75rem", background: "none", border: "none", color: "#9ca3af", fontSize: ".85rem", cursor: "pointer", textDecoration: "underline" }}
          >
            Skip for now →
          </button>
        </div>

        {/* Text input */}
        <div style={{ marginBottom: "1rem" }}>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setParsed(null); }}
            placeholder="e.g. We have resellers who get 18%, referral partners at 12%, and gold tier partners get a $5k MDF budget per quarter..."
            rows={5}
            style={{
              width: "100%", padding: "1rem 1.15rem", background: "#ffffff",
              border: "1.5px solid #d1d5db", borderRadius: 10, color: "#0a0a0a",
              fontSize: ".95rem", lineHeight: 1.6, resize: "vertical",
              fontFamily: "inherit", boxSizing: "border-box", outline: "none",
              transition: "border-color .15s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#0a0a0a"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        {/* Examples */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: ".78rem", color: "#9ca3af", fontWeight: 600, marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".06em" }}>Try an example</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setText(ex); setParsed(null); setExampleIdx(i); }}
                style={{
                  padding: ".3rem .7rem", borderRadius: 6,
                  border: `1px solid ${exampleIdx === i && text === ex ? "#0a0a0a" : "#e5e7eb"}`,
                  background: exampleIdx === i && text === ex ? "#0a0a0a" : "#f9fafb",
                  color: exampleIdx === i && text === ex ? "#fff" : "#374151",
                  fontSize: ".78rem", fontWeight: 500, cursor: "pointer",
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Parse button */}
        {text.trim() && !parsed && (
          <button
            onClick={handleParse}
            style={{
              width: "100%", padding: ".8rem", background: "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: 10, color: "#374151",
              fontSize: ".9rem", fontWeight: 600, cursor: "pointer", marginBottom: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <Sparkles size={16} style={{ color: "#6366f1" }} />
            Parse my program
          </button>
        )}

        {/* Parsed result */}
        {parsed && (
          <div style={{
            background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10,
            padding: "1.25rem", marginBottom: "1.25rem",
          }}>
            <p style={{ fontSize: ".78rem", fontWeight: 700, color: "#6b7280", marginBottom: ".75rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
              ✓ Covant understood your program
            </p>
            {parsed.partnerTypes.length > 0 && (
              <div style={{ marginBottom: ".5rem" }}>
                <p style={{ fontSize: ".82rem", fontWeight: 600, color: "#374151", marginBottom: ".35rem" }}>Partner Types</p>
                {parsed.partnerTypes.map((pt) => (
                  <div key={pt.type} style={{ display: "flex", justifyContent: "space-between", padding: ".35rem 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: ".85rem", textTransform: "capitalize", color: "#374151" }}>{pt.type}</span>
                    <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#0a0a0a" }}>{pt.rate}% commission</span>
                  </div>
                ))}
              </div>
            )}
            {parsed.tiers.length > 0 && (
              <div style={{ marginBottom: ".5rem" }}>
                <p style={{ fontSize: ".82rem", fontWeight: 600, color: "#374151", marginBottom: ".35rem" }}>Tiers</p>
                {parsed.tiers.map((t) => (
                  <div key={t.name} style={{ display: "flex", justifyContent: "space-between", padding: ".35rem 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: ".85rem", textTransform: "capitalize", color: "#374151" }}>{t.name}</span>
                    <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#0a0a0a" }}>
                      {t.rate}%{t.mdf ? ` + $${t.mdf.toLocaleString()} MDF` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {parsed.bonuses.length > 0 && (
              <div>
                <p style={{ fontSize: ".82rem", fontWeight: 600, color: "#374151", marginBottom: ".35rem" }}>Bonuses</p>
                {parsed.bonuses.map((b) => (
                  <div key={b} style={{ padding: ".35rem 0", fontSize: ".85rem", color: "#059669" }}>✓ {b}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Success indicator */}
        {seedResult && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10,
            padding: "1rem 1.25rem", marginBottom: "1rem",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <CheckCircle size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: ".85rem", fontWeight: 600, color: "#15803d", margin: 0 }}>
                Program configured!
              </p>
              <p style={{ fontSize: ".78rem", color: "#166534", margin: 0 }}>
                Created {seedResult.rules} commission rule{seedResult.rules !== 1 ? "s" : ""}, {seedResult.partners} sample partner{seedResult.partners !== 1 ? "s" : ""}, and {seedResult.deals} deal{seedResult.deals !== 1 ? "s" : ""} matching your program.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button
            onClick={handleContinue}
            disabled={loading || !text.trim()}
            style={{
              flex: 1, padding: ".8rem", background: text.trim() ? "#0a0a0a" : "#d1d5db",
              color: "#fff", border: "none", borderRadius: 10, fontSize: ".95rem",
              fontWeight: 600, cursor: text.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <ArrowRight size={16} />}
            {loading ? "Configuring your program..." : parsed ? "Configure & go to dashboard" : "Configure & go to dashboard"}
          </button>
          <button
            onClick={handleSkip}
            disabled={loading}
            style={{
              padding: ".8rem 1.25rem", background: "#fff", color: "#6b7280",
              border: "1px solid #e5e7eb", borderRadius: 10, fontSize: ".88rem",
              fontWeight: 500, cursor: "pointer",
            }}
          >
            Skip
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: ".8rem", color: "#9ca3af", marginTop: "1.25rem" }}>
          {parsed ? "We'll create sample data matching your program so you can explore immediately." : "We'll load sample data so you can explore immediately."} Replace it with your own anytime.
        </p>
      </div>
    </div>
  );
}
