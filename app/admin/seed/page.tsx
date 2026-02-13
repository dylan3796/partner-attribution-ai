"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function SeedPage() {
  const clearData = useMutation(api.seedDemo.clearDemoData);
  const seedData = useMutation(api.seedDemo.seedDemoData);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClearAndSeed() {
    setLoading(true);
    setStatus("Clearing existing data...");
    
    try {
      const clearResult = await clearData();
      setStatus(`✓ ${clearResult.message}\nSeeding demo data...`);
      
      const seedResult = await seedData();
      setStatus(`✓ ${clearResult.message}\n✓ ${seedResult.message}\n\nCreated:\n- ${seedResult.partnersCreated} partners\n- ${seedResult.dealsCreated} deals`);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearOnly() {
    setLoading(true);
    setStatus("Clearing all data...");
    
    try {
      const result = await clearData();
      setStatus(`✓ ${result.message}`);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
        Demo Data Seed
      </h1>
      <p className="muted" style={{ marginBottom: "2rem" }}>
        Manage demo data for PartnerBase
      </p>

      <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Demo Data Preview
        </h2>
        <p style={{ marginBottom: "1.5rem" }}>
          This will create 4 realistic partner companies:
        </p>
        <ul style={{ marginBottom: "2rem", marginLeft: "1.5rem" }}>
          <li><strong>TechStar Solutions</strong> — Reseller (Gold) - 2 deals, $245k pipeline</li>
          <li><strong>CloudBridge Partners</strong> — Referral (Silver) - 2 deals, $320k pipeline</li>
          <li><strong>DataPipe Agency</strong> — Integration (Gold) - 1 deal, $175k won</li>
          <li><strong>NexGen Resellers</strong> — Reseller (Platinum) - 1 deal, $95k won</li>
        </ul>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button
            onClick={handleClearAndSeed}
            disabled={loading}
            className="btn"
            style={{ flex: 1 }}
          >
            {loading ? "Processing..." : "Clear & Seed Demo Data"}
          </button>
          <button
            onClick={handleClearOnly}
            disabled={loading}
            className="btn"
            style={{ flex: 1, background: "#dc2626" }}
          >
            {loading ? "Clearing..." : "Clear All Data"}
          </button>
        </div>

        {status && (
          <pre style={{ 
            background: "#f9fafb", 
            padding: "1rem", 
            borderRadius: "6px", 
            fontSize: ".85rem",
            whiteSpace: "pre-wrap"
          }}>
            {status}
          </pre>
        )}
      </div>

      <p className="muted" style={{ fontSize: ".85rem" }}>
        ⚠️ <strong>Warning:</strong> "Clear All Data" will permanently delete all organizations, partners, deals, and related data.
      </p>
    </div>
  );
}
