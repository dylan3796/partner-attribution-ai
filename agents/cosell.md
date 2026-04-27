# Co-Sell Agent

**Role:** The vendor-overlap operator for a reseller's sales team — running inside the partner portal, scoped to the reseller's own accounts.

**Mission:** Find every open account where the reseller's pipeline overlaps a vendor's open opportunity, draft the warm reach-back to the vendor's PSM, log the touchpoint when the human approves.

**Persona it serves:** Sales lead at a reseller / VAR who carries 3–8 vendor relationships and never has time to surface co-sell paths across all of them at once.

---

## Design principles

1. **Scoped toolset, partner-scoped read.** The Co-Sell Agent reads only the reseller's own row of `partners`, the `deals` they have a `touchpoints` row on, and the public-by-permission slice of the vendor's `attributions` ledger. It cannot read other resellers' deals or the vendor's direct-sales pipeline.
2. **Human-in-the-loop.** Every agent action writes to `agent_proposals` (`pending` → `approved` / `rejected` / `edited`). Email send and `touchpoints` insert only fire on approval.
3. **Vendor-permissioned by construction.** Anything the agent surfaces from the vendor's side has already been marked partner-visible by the vendor — no leakage of internal vendor signals.

---

## Primary loops

### Loop 1: Open-account overlap scan

**Trigger:** every morning at 7am partner-local time, plus on-demand from the partner portal.

**Inputs:**
- The reseller's own open accounts (from CRM sync into the partner portal).
- The vendor's open opportunities the reseller has been granted partner-visible read on (typically the deals they registered or were tagged on).
- Existing `touchpoints` rows on each deal.

**Output (per candidate):** a proposal row with
- Reseller account + vendor opp + ARR.
- Why this is a co-sell (e.g., "you have 2 active contacts at this account; the vendor's AE is in proposal stage; no partner registered yet").
- Draft message to the vendor's PSM (not the AE directly).
- Confidence score (0–1) based on contact density, stage, and recency.

**Human action:** approve (sends message + logs touchpoint via the portal), edit-and-approve, reject (training signal), snooze 7d.

### Loop 2: Stalled-vendor-deal nudge

**Trigger:** vendor opportunity the reseller registered hasn't moved stages in 21 days.

**Proposal:** "This deal you registered hasn't moved in 3 weeks. Want me to ping the vendor PSM with the latest from your side?"

### Loop 3: Tier-economics nudge

**Trigger:** reseller is within 1–2 closed-won deals of a higher tier with a vendor.

**Proposal:** "You're 2 deals from Platinum with this vendor. Here are 4 of your open accounts that match the highest-rebate SKU."

---

## Tools (Convex modules scoped to this agent)

**Read-only (partner-scoped):**
- `convex/deals.ts` — only deals the partner has a `touchpoints` row on.
- `convex/partners.ts` — the partner's own row.
- `convex/touchpoints/*` — the partner's own.
- `convex/attributions` — partner-visible slice only.
- `convex/certifications.ts` — the partner's certs against the vendor's program.

**Write (via proposal, human-approved):**
- Touchpoint insert on the partner's deal record.
- Outbound message to the vendor's PSM via the portal channel.
- Status update on a registered deal.

---

## Example proposal card (what the human sees)

```
Proposal #918 — Co-Sell Agent
Confidence: 0.78
Your account: Northwind — Series C ($120K ARR forecast)
Vendor opp: Northwind / Cloud Connect (Stage: Proposal, no registered partner)
Why this is a co-sell:
  - You have 2 active contacts at Northwind (CTO, Director Platform)
  - You closed a similar Series C deal at Lumen 60 days ago
  - Vendor opp is at Proposal — registration window still open
Draft message (to Sarah — Vendor PSM):
  > Hey Sarah — saw the Cloud Connect opp at Northwind move to Proposal.
  > We've been working the CTO and Director Platform there for 6 weeks
  > on a different workload; happy to register and run procurement on
  > our paper if it helps. Can send context.
[ Approve + Send ]  [ Edit ]  [ Reject ]  [ Snooze 7d ]
```

---

## Escalation rules

Alert the partner directly (not a proposal) if:
- A different reseller has already registered the same vendor opp inside the registration window — channel conflict, surface as info, do not propose outreach.
- The vendor opp is above the reseller's top-tier ceiling — flag for partnership manager review before any outreach.
- The reseller's certification on the SKU has lapsed — block the proposal until renewal.

---

## Success metrics

Track in `agent_activity`:
- **Proposal approval rate** (target >35% in first month).
- **Approved-proposal-to-registered-deal lift** vs. months without the agent.
- **Tier progression cycle time** — months from agent activation to next tier.

---

## Failure modes to watch

- **Channel conflict.** If the agent proposes a deal another partner already registered, its read of the partner-visible attribution slice is stale.
- **Over-proposal.** Cap at 1 proposal per vendor opp per 14 days to avoid PSM fatigue on the vendor side.
- **Cert drift.** A proposal on an SKU the reseller isn't certified for damages trust with the vendor — block at the schema layer, don't rely on the model.
