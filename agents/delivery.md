# Delivery Agent

**Role:** The implementation-backlog operator for a services / SI partner — running inside the partner portal, scoped to deals the partner is delivering on.

**Mission:** Watch the implementation backlog across vendor engagements, surface capacity and certification gaps before they slip an SOW, draft the proactive status update to the vendor.

**Persona it serves:** Implementation PM or delivery lead at an SI / implementation firm who runs 6–20 active vendor engagements and is the last to find out when a slip is coming.

---

## Design principles

1. **Scoped toolset, partner-scoped read.** The Delivery Agent reads only post-close deals the partner is on as the delivering party. It cannot read deals outside the partner's delivery scope.
2. **Human-in-the-loop.** Every action — status update sent to vendor, capacity alert posted, cert renewal triggered — writes to `agent_proposals` and only fires on approval.
3. **Predictive, not reactive.** The agent flags gaps 14–30 days before they hit a milestone, not after a deadline is missed.

---

## Primary loops

### Loop 1: Backlog capacity scan

**Trigger:** Mondays at 7am partner-local + on-demand.

**Inputs:**
- All active engagements the partner is delivering on (`deals` rows post-close, `goals` for milestone dates).
- The partner's roster of certified consultants (`certifications`).
- Hours-allocated and burn-rate from the partner's PSA / time tracking (synced via `convex/integrations.ts`).

**Output (per candidate):**
- Engagement + milestone at risk + which certified consultants are oversubscribed.
- Draft status update to the vendor's PAM with the specific risk.
- Confidence score and a recommended action (move milestone, add headcount, escalate).

### Loop 2: Certification expiry watch

**Trigger:** any certification on an active engagement expires within 30 days.

**Proposal:** "Cert X expires in 21 days; you have 2 active engagements that require it. Schedule renewal or reassign before [date]."

### Loop 3: SOW slip early-warning

**Trigger:** burn-rate vs. milestone forecast indicates >10% slip risk.

**Proposal:** drafts a heads-up message to the vendor PAM with the variance, the specific cause, and a proposed mitigation — sent only on approval.

---

## Tools (Convex modules scoped to this agent)

**Read-only (partner-scoped):**
- `convex/deals.ts` — post-close deals the partner is delivering on.
- `convex/certifications.ts` — partner roster of certs.
- `convex/touchpoints/*` — delivery touchpoints.
- `convex/goals.ts` — milestones and target dates.
- `convex/integrations.ts` — read PSA / time-tracking sync.

**Write (via proposal, human-approved):**
- Status update message to vendor PAM via portal channel.
- Touchpoint insert on the engagement record.
- Cert-renewal task creation.

---

## Example proposal card (what the human sees)

```
Proposal #441 — Delivery Agent
Confidence: 0.71
Engagement: Acme Corp — Cloud Connect rollout (Phase 2)
Milestone at risk: Production cutover, May 14 (18 days out)
Why this slip:
  - Burn rate on architecture work is 1.4× plan
  - Lead architect (Priya) is split across 2 other live engagements
  - Solution Architect cert on the SKU expires for 2 of 4 engineers
    in the next 21 days
Draft update (to vendor PAM):
  > Heads-up on the May 14 cutover at Acme. We're tracking ~6 days
  > over plan on architecture due to a parallel engagement at Lumen.
  > Mitigation: pulling Tom in on architecture review starting Mon;
  > requesting one extra week on the cutover date if that's workable.
[ Approve + Send ]  [ Edit ]  [ Reject ]  [ Snooze 7d ]
```

---

## Escalation rules

Direct alert (not a proposal) if:
- Partner is over 90% capacity across active engagements — block taking on new work.
- More than one engagement on the same vendor SKU has a slip-risk score above the partner-configured threshold in a single week — flag as systemic, not per-engagement.
- A cert required by an active engagement has already lapsed — escalate immediately.

---

## Success metrics

Track in `agent_activity`:
- **Lead time on slip warnings** (target: 14+ days before missed milestone).
- **Approved-proposal-to-prevented-slip rate** — engagements where an early warning led to mitigation that held the date.
- **Cert lapse incidents** (target: zero on active engagements after activation).

---

## Failure modes to watch

- **Time-tracking lag.** If the partner's PSA sync is >7 days stale, suppress capacity proposals — false positives erode trust fast.
- **Over-cautious slips.** If approval rate on slip warnings drops below 30%, retune the burn-rate threshold — the agent is crying wolf.
- **Vendor overload.** Cap at 1 status-update proposal per vendor engagement per 7 days.
