# Partner Sales Manager (PSM) Agent

**Agent concept:** Deal & Partner Strategist.

**Scope:** Opportunity-level. Works closest to active deals and sales teams.

**Core question:** *"What partner helps us win this deal?"*

**Mission:** On every open opportunity, find the partner who most improves the odds of winning — by fit, capability, industry, geography, or past success — draft the warm intro, shape the joint solution, coordinate the co-sell, and make sure the partner is ready to support delivery after close.

**Persona it serves:** Partner Sales Manager — the person who pulls partners into live opportunities and runs the co-sell motion end-to-end. Their day is opportunity-by-opportunity: spot where a partner can help, line up the right one, move the deal, hand off cleanly to delivery.

**What the agent helps with:**
- Recommend the best partner(s) for an opportunity.
- Flag opportunities missing partner involvement.
- Explain *why* a given partner is a fit (fit, capabilities, industry, geography, past success).
- Suggest a co-sell strategy and shape the joint solution.
- Identify risks or gaps in partner readiness — pre-sale and pre-delivery.
- Estimate likely impact on deal success, speed, or size.

---

## Design principles

1. **Scoped toolset.** The PSM Agent can read `deals`, `partners`, `touchpoints`, `attributions`, `accountMapping` (new), and CRM contact data. It stays at the opportunity layer — it does not manage the long-term partner relationship (that's the PAM Agent), design program structure or tier criteria (the Program Agent), or own measurement and reporting (the Ops Agent).
2. **Human-in-the-loop.** Every agent action writes a row to `agent_proposals` (`pending` → `approved` / `rejected` / `edited`). Only on approval does the mutation fire (e.g., email send, touchpoint insert, CRM update).
3. **Audit first.** Every executed action leaves a trail: who proposed, who approved, what data was used as input, what the outcome was.

---

## Primary loops

### Loop 1: Daily overlap scan

**Trigger:** every morning at 7am org-local time, plus on-demand from the dashboard.

**Inputs:**
- All open deals in the org where the deal stage is past qualification.
- All active partners with CRM contacts or known customer overlaps.
- Existing touchpoints on each deal (to avoid re-suggesting an intro that already happened).

**Output (per candidate):** a proposal row with
- Deal name + stage + ARR.
- Partner name + why they're a fit (e.g., "Partner X sells to 3 of your contacts at this account; has closed 2 deals at similar-sized accounts in the same vertical").
- A draft intro email (to the AE, not the partner directly — the AE decides whether to loop the partner in).
- Confidence score (0-1) based on overlap strength, historical conversion rate, and recency of partner activity.

**Human action:** approve (sends email + logs touchpoint), edit-and-approve (same, with changes), reject (logs as training signal), snooze (re-surfaces in 7 days).

### Loop 2: Stale deal re-ignition

**Trigger:** deal hasn't moved stages in 21 days.

**Proposal:** "This deal has stalled. Partner X has a closed deal at a similar customer in the last 90 days. Want to draft an intro to unstick this one?"

### Loop 3: Deal-registered check-in

**Trigger:** a deal marked `deal_registered` by a partner hasn't had a touchpoint in 14 days.

**Proposal:** draft an update email to the partner asking for status, plus a summary of what's changed on the deal (new contacts, stage change, amount change).

### Loop 4: Pre-delivery readiness check

**Trigger:** deal moves to closed-won with an associated partner, OR deal reaches late-stage (e.g. verbal commit / contract out) with a partner expected to support delivery.

**Detection:**
- Partner has the capability / certification / practice needed for this solution type.
- Partner has bandwidth signal (recent delivery activity, staffing availability if tracked).
- Any open gaps between what was sold and what the partner has previously delivered.

**Proposal:** "This deal is about to close with Bluewave as the delivery partner. Bluewave has delivered 3 similar engagements in the last 6 months, but they haven't done the new Data Residency add-on yet. Draft handoff note to Bluewave + internal delivery team calling out the gap and suggesting a 30-minute enablement session before kickoff?"

**Human action:** approve + send handoff, edit, reject, or escalate if the readiness gap is material enough to involve the PAM.

---

## Tools (Convex modules scoped to this agent)

**Read-only:**
- `convex/deals.ts`
- `convex/partners.ts`
- `convex/touchpoints/*`
- `convex/attributions` (via attribution queries)
- `convex/accountMapping.ts` (new — overlap query)
- `convex/activityHeatmap.ts`

**Write (via proposal, human-approved):**
- Touchpoint insert on deal (via touchpoints module).
- Outbound email send (via email integration).
- CRM task creation (via `convex/integrations.ts`).

---

## Example proposal card (what the human sees)

```
Proposal #3821 — PSM Agent
Confidence: 0.84
Deal: Acme Corp — Series B Expansion ($48K ACV, stage: Proposal)
Partner: Bluewave Consulting
Why this partner:
  - Bluewave sells to 3 contacts at Acme (CTO, VP Eng, Director Platform)
  - Closed 2 deals at similarly-sized Series B companies in the last 60 days
  - On the attribution graph for 4 of your current wins
Draft intro (to Sarah — AE on this deal):
  > Hey Sarah — looking at Acme, Bluewave Consulting has direct
  > relationships with the CTO and VP Eng there. They just closed a
  > similar-stage deal at Northwind last month. Want me to loop Mike
  > (Bluewave) in on the procurement conversation? Happy to send him
  > context and let you run the call.
[ Approve + Send ]  [ Edit ]  [ Reject ]  [ Snooze 7d ]
```

---

## Escalation rules

Alert a human directly (not a proposal) if:
- Proposed intro conflicts with an existing deal registration from a different partner (possible channel conflict).
- Deal amount is above an org-configured threshold (e.g., >$100K ACV) — exec review before any partner is looped in.
- Partner is in a tier that requires pre-approval for co-sell (org config).

---

## Success metrics

Track in `agent_activity`:
- **Proposal approval rate** (target >40% in first month; higher means the agent is well-calibrated).
- **Approved-intro-to-deal-close lift** vs. deals without partner intros (target: 15-25% higher close rate).
- **Time from overlap detection to intro sent** (target: <1 business day).

---

## Failure modes to watch

- **Over-suggestion.** If the agent proposes the same partner on every deal, its confidence function is miscalibrated. Hard-cap proposals-per-partner-per-week.
- **Stale partner data.** If a partner has no activity in 90 days, don't propose them until the PAM Agent flags them as re-engaged.
- **Channel conflict.** Two partners can't both be "the right one" for the same deal. Prefer the partner who registered the deal first; if neither registered, prefer historical closer on the account.
