/**
 * channelGraph.ts — the Channel Graph demo + inspector backend.
 *
 * seedGraphDemo loads a deterministic, self-contained scenario into the
 * AUTHENTICATED org, routing every value through the provenance substrate
 * (sourceDocuments + facts + provenanced graphEdges). It is built to set up the
 * flagship "missing partner" case: an OPEN opportunity with no partner attached,
 * a partner that has prior won deals with that account, and recent calendar
 * meetings between the partner's people and the account. The recommendation
 * engine (next session) reasons over exactly this evidence.
 *
 * The read queries power /dashboard/channel-graph so the graph and the evidence
 * behind every fact can be verified by eye.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getOrg } from "./lib/getOrg";
import { assertField, writeFact, getActiveFacts } from "./lib/graph/facts";
import { addEdge } from "./lib/graph/edges";

const DAY = 86_400_000;
const DEMO_TAG = "graph-demo";
const DEMO_PREFIX = "[Graph Demo] ";

// The graph-layer tables this seed owns. Safe to clear wholesale for the org.
const GRAPH_TABLES = [
  "facts",
  "graphEdges",
  "sourceDocuments",
  "partnerPersons",
  "vendorReps",
  "accounts",
  "dealRegistrations",
  "cosellRecords",
  "marketplaceTransactions",
  "accountMappings",
  "extractionCandidates",
  "entityResolutionQueue",
  "conflicts",
] as const;

// ============================================================================
// Seed
// ============================================================================

export const seedGraphDemo = mutation({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return { status: "no_org" as const };
    const organizationId = org._id;
    const now = Date.now();

    // Idempotency: the demo partner carries the DEMO_TAG.
    const existingPartners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
    if (existingPartners.some((p) => p.tags?.includes(DEMO_TAG))) {
      return { status: "already_seeded" as const };
    }

    // ── Source documents (the roots of every evidence chain) ────────────────
    const partnerSource = await ctx.db.insert("sourceDocuments", {
      organizationId,
      kind: "crm_record",
      adapter: "salesforce",
      externalRef: "001LIGHTHOUSE",
      rawText: "Lighthouse Integrators — Partner (Integration), Gold tier.",
      capturedAt: now - 420 * DAY,
      ingestedAt: now,
    });
    const accountSource = await ctx.db.insert("sourceDocuments", {
      organizationId,
      kind: "crm_record",
      adapter: "salesforce",
      externalRef: "001VERTEX",
      rawText: "Vertex Manufacturing — Account, vertex-mfg.com, Manufacturing.",
      capturedAt: now - 430 * DAY,
      ingestedAt: now,
    });

    // ── Partner org + its people ────────────────────────────────────────────
    const partnerId = await ctx.db.insert("partners", {
      organizationId,
      name: "Lighthouse Integrators",
      email: "ops@lighthouse.io",
      contactName: "Dana Liu",
      type: "integration",
      tier: "gold",
      commissionRate: 0.15,
      status: "active",
      tags: [DEMO_TAG],
      notes: "",
      createdAt: now - 420 * DAY,
    });
    await assertField(ctx, {
      organizationId, table: "partners", id: partnerId, field: "name",
      value: "Lighthouse Integrators", sourceId: partnerSource, path: "Account.Name",
    });
    await assertField(ctx, {
      organizationId, table: "partners", id: partnerId, field: "type",
      value: "integration", sourceId: partnerSource, path: "Account.Type",
    });

    const danaId = await ctx.db.insert("partnerPersons", {
      organizationId, partnerId, name: "Dana Liu", email: "dana@lighthouse.io",
      title: "Solutions Engineer", role: "technical", createdAt: now - 420 * DAY,
    });
    const rajId = await ctx.db.insert("partnerPersons", {
      organizationId, partnerId, name: "Raj Patel", email: "raj@lighthouse.io",
      title: "Account Executive", role: "sales", createdAt: now - 420 * DAY,
    });
    for (const [personId, name] of [[danaId, "Dana Liu"], [rajId, "Raj Patel"]] as const) {
      await addEdge(ctx, {
        organizationId, type: "employs",
        from: { table: "partners", id: partnerId },
        to: { table: "partnerPersons", id: personId },
        provenance: {
          sourceId: partnerSource, method: "asserted", confidence: 1.0,
          evidencePointer: { kind: "field_path", path: "Contact.AccountId" },
        },
      });
      await assertField(ctx, {
        organizationId, table: "partnerPersons", id: personId, field: "name",
        value: name, sourceId: partnerSource, path: "Contact.Name",
      });
    }

    // Vendor's own rep on the account (the channel manager).
    const vendorRepId = await ctx.db.insert("vendorReps", {
      organizationId, name: "Morgan Hill", email: "morgan@horizon.example",
      role: "channel_manager", crmUserId: "005MORGAN", createdAt: now - 300 * DAY,
    });

    // ── End customer (Account) ──────────────────────────────────────────────
    const accountId = await ctx.db.insert("accounts", {
      organizationId, name: "Vertex Manufacturing", domain: "vertex-mfg.com",
      salesforceId: "001VERTEX", industry: "Manufacturing", createdAt: now - 430 * DAY,
    });
    await assertField(ctx, {
      organizationId, table: "accounts", id: accountId, field: "name",
      value: "Vertex Manufacturing", sourceId: accountSource, path: "Account.Name",
    });
    await assertField(ctx, {
      organizationId, table: "accounts", id: accountId, field: "domain",
      value: "vertex-mfg.com", sourceId: accountSource, path: "Account.Website",
    });

    // Helper: create a deal + its CRM source + asserted facts + for_account edge.
    async function makeDeal(opts: {
      name: string; amount: number; status: "open" | "won"; daysAgo: number;
      extRef: string;
    }) {
      const dealSource = await ctx.db.insert("sourceDocuments", {
        organizationId, kind: "crm_record", adapter: "salesforce",
        externalRef: opts.extRef,
        rawText: `${opts.name} — Amount ${opts.amount}, Stage ${opts.status === "won" ? "Closed Won" : "Negotiation"}, Account Vertex Manufacturing.`,
        capturedAt: now - opts.daysAgo * DAY, ingestedAt: now,
      });
      const dealId = await ctx.db.insert("deals", {
        organizationId, name: DEMO_PREFIX + opts.name, amount: opts.amount,
        status: opts.status,
        closedAt: opts.status === "won" ? now - opts.daysAgo * DAY : undefined,
        contactName: "Vertex Manufacturing", productName: "Platform",
        source: "salesforce", createdAt: now - opts.daysAgo * DAY,
      });
      const observedAt = now - opts.daysAgo * DAY;
      await assertField(ctx, { organizationId, table: "deals", id: dealId, field: "name", value: DEMO_PREFIX + opts.name, sourceId: dealSource, path: "Opportunity.Name", observedAt });
      await assertField(ctx, { organizationId, table: "deals", id: dealId, field: "amount", value: opts.amount, sourceId: dealSource, path: "Opportunity.Amount", observedAt });
      await assertField(ctx, { organizationId, table: "deals", id: dealId, field: "status", value: opts.status, sourceId: dealSource, path: "Opportunity.StageName", observedAt });
      await addEdge(ctx, {
        organizationId, type: "for_account",
        from: { table: "deals", id: dealId }, to: { table: "accounts", id: accountId },
        provenance: { sourceId: dealSource, method: "asserted", confidence: 1.0, evidencePointer: { kind: "field_path", path: "Opportunity.AccountId" }, observedAt },
      });
      return { dealId, dealSource, observedAt };
    }

    // ── Historical WON deals — Lighthouse was involved (the track record) ────
    const hist1 = await makeDeal({ name: "Vertex Manufacturing — Platform License", amount: 90000, status: "won", daysAgo: 400, extRef: "006VERTEX1" });
    const hist2 = await makeDeal({ name: "Vertex Manufacturing — Capacity Expansion", amount: 45000, status: "won", daysAgo: 120, extRef: "006VERTEX2" });
    for (const [h, role] of [[hist1, "fulfiller"], [hist2, "sourcer"]] as const) {
      await addEdge(ctx, {
        organizationId, type: "involved_in", role,
        from: { table: "partners", id: partnerId }, to: { table: "deals", id: h.dealId },
        provenance: { sourceId: h.dealSource, method: "asserted", confidence: 1.0, evidencePointer: { kind: "field_path", path: "Opportunity.Partner_Account__c" }, observedAt: h.observedAt },
      });
      // a touchpoint too, so the existing attribution engine sees the history
      await ctx.db.insert("touchpoints", {
        organizationId, dealId: h.dealId, partnerId,
        type: role === "sourcer" ? "deal_registration" : "technical_enablement",
        notes: "Lighthouse engaged (graph demo)", createdAt: h.observedAt,
      });
    }

    // ── The GAP: a current OPEN opportunity with NO partner attached ─────────
    const open = await makeDeal({ name: "Vertex Manufacturing — Renewal & Expansion", amount: 130000, status: "open", daysAgo: 6, extRef: "006VERTEX3" });
    // NOTE: deliberately no involved_in edge and no touchpoint for `open`.

    // ── Recent calendar meetings: partner people <-> account (last 30 days) ──
    const meetings = [
      { daysAgo: 21, title: "Vertex × Lighthouse — Renewal scoping", note: "Dana Liu (Lighthouse) met Priya Shah (Vertex) to scope the renewal and expansion footprint." },
      { daysAgo: 12, title: "Vertex × Lighthouse — Technical validation", note: "Dana Liu walked the Vertex platform team through the expansion architecture." },
      { daysAgo: 4, title: "Vertex × Lighthouse — Commercials", note: "Dana Liu and Vertex procurement reviewed renewal pricing options." },
    ];
    for (const m of meetings) {
      const observedAt = now - m.daysAgo * DAY;
      const calSource = await ctx.db.insert("sourceDocuments", {
        organizationId, kind: "calendar", adapter: "google_calendar",
        externalRef: `cal_${m.daysAgo}`,
        rawText: `${m.title}\nAttendees: dana@lighthouse.io, priya@vertex-mfg.com\n${m.note}`,
        capturedAt: observedAt, ingestedAt: now,
      });
      await addEdge(ctx, {
        organizationId, type: "met_with",
        from: { table: "partnerPersons", id: danaId }, to: { table: "accounts", id: accountId },
        provenance: {
          sourceId: calSource, method: "asserted", confidence: 1.0,
          // exact span the meeting evidences — a verbatim quote (grounding-ready)
          evidencePointer: { kind: "span", quote: m.note },
          observedAt,
        },
      });
    }

    // Touch the vendor rep so the node is reachable in the inspector.
    await writeFact(ctx, {
      organizationId,
      subject: { kind: "node", table: "vendorReps", id: vendorRepId, field: "role" },
      value: "channel_manager", method: "asserted", confidence: 1.0,
      sourceId: partnerSource, evidencePointer: { kind: "field_path", path: "User.Role" },
    });

    return {
      status: "seeded" as const,
      partner: "Lighthouse Integrators",
      account: "Vertex Manufacturing",
      openOpportunity: DEMO_PREFIX + "Vertex Manufacturing — Renewal & Expansion",
      priorWins: 2,
      meetings: meetings.length,
    };
  },
});

// ============================================================================
// Clear (graph-layer tables for the org + this seed's marked operational rows)
// ============================================================================

export const clearGraphDemo = mutation({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return { status: "no_org" as const };
    const organizationId = org._id;
    let deleted = 0;

    for (const table of GRAPH_TABLES) {
      const rows = await ctx.db
        .query(table)
        .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
        .collect();
      for (const r of rows) {
        await ctx.db.delete(r._id);
        deleted++;
      }
    }

    // Operational rows this seed created (marked): graph-demo deals + their
    // touchpoints, and the graph-demo partner(s).
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
    for (const d of deals.filter((x) => x.name.startsWith(DEMO_PREFIX))) {
      const tps = await ctx.db
        .query("touchpoints")
        .withIndex("by_deal", (q) => q.eq("dealId", d._id))
        .collect();
      for (const tp of tps) { await ctx.db.delete(tp._id); deleted++; }
      await ctx.db.delete(d._id);
      deleted++;
    }
    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
    for (const p of partners.filter((x) => x.tags?.includes(DEMO_TAG))) {
      await ctx.db.delete(p._id);
      deleted++;
    }

    return { status: "cleared" as const, deleted, message: `Cleared ${deleted} graph rows.` };
  },
});

// ============================================================================
// Read queries (inspector)
// ============================================================================

/** Headline counts: sources by kind, nodes by type, edges, facts by method, gaps. */
export const getGraphOverview = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return null;
    const organizationId = org._id;

    const [sources, facts, edges, accounts, persons, vendorReps] = await Promise.all([
      ctx.db.query("sourceDocuments").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("facts").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("graphEdges").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("accounts").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("partnerPersons").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("vendorReps").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ]);

    const factsByMethod = { asserted: 0, inferred: 0, user_confirmed: 0 as number };
    for (const f of facts) factsByMethod[f.method]++;

    const sourcesByKind: Record<string, number> = {};
    for (const s of sources) sourcesByKind[s.kind] = (sourcesByKind[s.kind] ?? 0) + 1;

    return {
      orgName: org.name,
      counts: {
        sources: sources.length,
        facts: facts.length,
        edges: edges.length,
        accounts: accounts.length,
        partnerPersons: persons.length,
        vendorReps: vendorReps.length,
      },
      sourcesByKind,
      factsByMethod,
    };
  },
});

type NodeRef = { table: string; id: string; type: string; label: string; sublabel?: string };

/** The graph-demo node set, grouped for the inspector. */
export const getNodes = query({
  args: {},
  handler: async (ctx): Promise<NodeRef[]> => {
    const org = await getOrg(ctx);
    if (!org) return [];
    const organizationId = org._id;

    const [partners, deals, accounts, persons, vendorReps] = await Promise.all([
      ctx.db.query("partners").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("deals").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("accounts").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("partnerPersons").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ctx.db.query("vendorReps").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ]);

    const nodes: NodeRef[] = [];
    for (const p of partners.filter((x) => x.tags?.includes(DEMO_TAG))) {
      nodes.push({ table: "partners", id: p._id, type: "PartnerOrg", label: p.name, sublabel: `${p.type} · ${p.tier ?? "—"}` });
    }
    for (const a of accounts) nodes.push({ table: "accounts", id: a._id, type: "Account", label: a.name, sublabel: a.domain });
    for (const pp of persons) nodes.push({ table: "partnerPersons", id: pp._id, type: "PartnerPerson", label: pp.name, sublabel: pp.title });
    for (const vr of vendorReps) nodes.push({ table: "vendorReps", id: vr._id, type: "VendorRep", label: vr.name, sublabel: vr.role });
    for (const d of deals.filter((x) => x.name.startsWith(DEMO_PREFIX))) {
      nodes.push({ table: "deals", id: d._id, type: "Opportunity", label: d.name.replace(DEMO_PREFIX, ""), sublabel: `$${d.amount.toLocaleString()} · ${d.status}` });
    }
    return nodes;
  },
});

/** Facts + edges for one node, each fact joined to its source document. */
export const getNodeDetail = query({
  args: { table: v.string(), id: v.string() },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) return null;

    const facts = await getActiveFacts(ctx, { table: args.table, id: args.id });
    const enrichedFacts = await Promise.all(
      facts.map(async (f) => {
        const src = await ctx.db.get(f.sourceId);
        return {
          _id: f._id,
          field: f.subjectField,
          value: f.value,
          method: f.method,
          confidence: f.confidence,
          evidencePointer: f.evidencePointer,
          observedAt: f.observedAt,
          recordedAt: f.recordedAt,
          source: src
            ? { kind: src.kind, docType: src.docType, adapter: src.adapter, externalRef: src.externalRef, rawText: src.rawText }
            : null,
        };
      })
    );

    // Edges where this node is an endpoint.
    const organizationId = org._id;
    const allEdges = await ctx.db
      .query("graphEdges")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
    const edges = allEdges
      .filter((e) => (e.fromTable === args.table && e.fromId === args.id) || (e.toTable === args.table && e.toId === args.id))
      .map((e) => ({
        _id: e._id, type: e.type, role: e.role,
        direction: e.fromTable === args.table && e.fromId === args.id ? ("out" as const) : ("in" as const),
        other: e.fromTable === args.table && e.fromId === args.id
          ? { table: e.toTable, id: e.toId }
          : { table: e.fromTable, id: e.fromId },
      }));

    return { facts: enrichedFacts, edges };
  },
});

/**
 * The flagship "missing partner" scenario, assembled from the graph: the open
 * opportunity with no partner, the candidate partner, its prior wins with the
 * same account, and recent meetings. This is exactly the evidence the
 * recommendation engine (next session) will turn into a proposal.
 */
export const getTriggerScenario = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return null;
    const organizationId = org._id;

    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
    const demoDeals = deals.filter((d) => d.name.startsWith(DEMO_PREFIX));
    const openDeal = demoDeals.find((d) => d.status === "open");
    if (!openDeal) return { seeded: false as const };

    const edges = await ctx.db
      .query("graphEdges")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();

    // Does the open opp already have a partner involved? (the gap test)
    const hasPartner = edges.some((e) => e.type === "involved_in" && e.toTable === "deals" && e.toId === openDeal._id);

    // Candidate partner = one with prior involved_in on won deals for this account.
    const accountEdges = edges.filter((e) => e.type === "for_account");
    const openAccountId = accountEdges.find((e) => e.fromId === openDeal._id)?.toId;
    const priorWinDeals = demoDeals.filter(
      (d) => d.status === "won" && accountEdges.some((e) => e.fromId === d._id && e.toId === openAccountId)
    );
    const priorWinIds = new Set(priorWinDeals.map((d) => d._id));
    const candidatePartnerId = edges.find(
      (e) => e.type === "involved_in" && e.toTable === "deals" && priorWinIds.has(e.toId as Id<"deals">)
    )?.fromId;
    const candidatePartner = candidatePartnerId
      ? await ctx.db.get(candidatePartnerId as Id<"partners">)
      : null;

    // Recent meetings between the partner's people and the account.
    const meetingEdges = edges.filter((e) => e.type === "met_with" && e.toId === openAccountId);
    const meetings = await Promise.all(
      meetingEdges.map(async (e) => {
        const factRows = await getActiveFacts(ctx, { table: "graphEdges", id: e._id });
        const f = factRows[0];
        const src = f ? await ctx.db.get(f.sourceId) : null;
        return {
          observedAt: f?.observedAt,
          quote: f?.evidencePointer.kind === "span" ? f.evidencePointer.quote : undefined,
          source: src ? { kind: src.kind, adapter: src.adapter, externalRef: src.externalRef } : null,
        };
      })
    );
    meetings.sort((a, b) => (b.observedAt ?? 0) - (a.observedAt ?? 0));

    return {
      seeded: true as const,
      openOpportunity: { id: openDeal._id, name: openDeal.name.replace(DEMO_PREFIX, ""), amount: openDeal.amount },
      hasPartner,
      candidatePartner: candidatePartner ? { id: candidatePartner._id, name: candidatePartner.name } : null,
      priorWins: priorWinDeals.map((d) => ({ name: d.name.replace(DEMO_PREFIX, ""), amount: d.amount })),
      meetings,
    };
  },
});
