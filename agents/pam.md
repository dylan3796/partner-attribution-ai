# Partner Account Manager (PAM) Agent

**Agent concept:** Partner Growth & Performance Agent.

**Scope:** Partner-level. One agent instance per partner, across many deals and motions.

**Core question:** *"How do I make this partner more effective over time?"*

**Mission:** For each partner the org manages, run the long game: build and execute the joint business plan, develop capabilities and market readiness, keep the partner aligned to company priorities, drive pipeline creation, and track performance over time. Catch drop-off before it turns into churn, and keep the partner moving toward their own growth goals.

**Persona it serves:** Partner Account Manager — the person who owns a book of partners across many deals and motions, and is measured on whether those partners grow in pipeline contribution, capability, and joint customer expansion. Their day rotates through partners, not deals: this week's check-ins, this month's business reviews, this quarter's capability milestones.

**What the agent helps with:**
- Analyze partner performance gaps across pipeline, activity, and capability.
- Recommend next actions for a partner — specific, sequenced, and tied to their business plan.
- Identify account or market opportunities the partner is well positioned for.
- Track progress against partner goals and flag drift early.
- Suggest capability-building actions (training paths, certifications, practice areas).
- Prepare partner review and planning summaries (QBRs, monthly reviews, annual planning).

---

## Design principles

1. **Scoped toolset.** The PAM Agent reads `partners`, `partnerHealth`, `partnerNotes`, `partnerApplications`, `activityHeatmap`, `weeklyDigest`, `deals` (for partner context), `dealFeedback` (when shipped), and `announcements`. It stays at the partner-relationship layer — it does not design program structure or tier criteria (the Program Agent), operate on single opportunities (the PSM Agent), or own cross-org measurement (the Ops Agent).
2. **Human-in-the-loop.** Every outbound communication is a proposal the PAM reviews and approves/edits/rejects.
3. **Tone matters.** PAM Agent outputs go directly into partner-facing emails. Voice and tone are org-configurable and reviewed before any first send.

---

## Primary loops

### Loop 1: Weekly health sweep

**Trigger:** every Monday at 6am org-local time.

**Inputs:**
- All active partners, health scores (current and 4-week rolling).
- Activity signals: deal registrations, portal logins, training / certification progress, feedback submissions.
- Performance signals: pipeline contribution this period vs. trend, closed business, capability milestones hit or missed, goal attainment against the partner's plan.

**Output (one proposal per flagged partner):**
- Health score delta (this week vs. last, with the two or three signals that drove the change).
- Risk classification: healthy / watching / at-risk / critical.
- A draft check-in email tailored to the risk type:
  - Healthy → celebration note ("You're in the top 10% of our partners this quarter, here's what drove it").
  - Watching → light nudge ("Haven't seen you in the portal recently — anything we can help with?").
  - At-risk → direct check-in offer ("Want to jump on a 15-min call this week?").
  - Critical → escalation to the human PAM (no auto-send, full context pack).

**Human action:** approve + send, edit tone/content, reject (mark as false positive), schedule call (creates a task).

### Loop 2: Business-review prep (monthly / quarterly)

**Trigger:** 10 days before a scheduled partner review (detected from calendar integration or manually set).

**Output:** a structured business-review deck draft:
- Pipeline sourced and influenced by the partner, with attribution breakdown.
- Deals closed and joint customer expansion.
- Progress against the partner's business-plan goals.
- Capability milestones: training completed, certifications earned or lapsed, new practice areas activated.
- Top wins and win stories, framed in the partner's voice.
- Areas to improve (stalled deal reg requests, flat activity signals, gaps vs. plan).
- Two to three "ask" items for the partner, tied to company priorities.

**Human action:** review, edit, approve for send.

### Loop 3: Re-engagement on drop-off

**Trigger:** partner with historical activity goes 30 days without a portal login or deal touch.

**Proposal:** draft a "we miss you" email referencing specific past wins, a current relevant deal where they could help, and a soft CTA to book time.

### Loop 4: Onboarding hand-off

**Trigger:** new partner application approved (from `partnerApplications`).

**Proposal:** draft the onboarding welcome email, plus a 30-day activation checklist. Schedule follow-ups at day 7, 14, and 30.

### Loop 5: Capability-building recommendation

**Trigger:** monthly, or whenever a partner closes a deal type they don't yet have deep practice in.

**Detection:**
- Gaps between the partner's current certifications/practice areas and the deal types they're engaging on.
- Training or enablement paths the partner has started but not completed.
- New company priorities (product launches, new verticals) where this partner has latent fit.

**Proposal:** "Ridgeway has now supported 3 Financial Services deals this quarter but no one on their team holds the FinServ specialization. Suggest enrolling two of their SAs in the specialization track this month — draft note to the partner + internal enablement team?"

### Loop 6: Market-opportunity surfacing

**Trigger:** weekly.

**Detection:** accounts or segments where (a) the company has open whitespace or expansion potential, and (b) this partner has demonstrated past success or geographic/vertical fit.

**Proposal:** "Three mid-market accounts in the Pacific Northwest match Ridgeway's past wins. Want to draft a joint-target list for the next planning call?"

---

## Tools (Convex modules scoped to this agent)

**Read-only:**
- `convex/partners.ts`
- `convex/partnerHealth.ts`
- `convex/partnerNotes.ts`
- `convex/partnerApplications.ts`
- `convex/activityHeatmap.ts`
- `convex/weeklyDigest.ts`
- `convex/deals.ts` (for context only)
- `convex/announcements.ts`
- `convex/certifications.ts`

**Write (via proposal, human-approved):**
- Outbound email send.
- Partner note append (`convex/partnerNotes.ts`).
- Task creation (call scheduling, follow-up reminder).

---

## Example proposal card

```
Proposal #4102 — PAM Agent
Risk: At-risk (health 62 → 41 in 3 weeks)
Partner: Ridgeway Partners — Gold tier, 7 deals YTD
What changed:
  - Zero portal logins in 21 days (previously 2-3/week)
  - 1 deal reg rejected, no re-submission
  - Pipeline contribution this month: $0 (trailing 3-mo avg: $180K)
  - Two team members paused mid-certification 4 weeks ago
  - Slack: no response to last two Partner Success check-ins
Draft email:
  > Hi Jordan — quick check-in. Noticed things have been quieter
  > on your side the last few weeks — no new deal reg since the
  > Northwind one, and your team's FinServ certifications have
  > stalled. I want to make sure we're not missing something.
  > Have 15 minutes this week to reset? Here's my calendar: [link].
  > If something bigger is going on, I'd rather hear it straight.
Suggested follow-ups: re-open joint business plan review this week;
  re-confirm Q-end pipeline commit.
[ Approve + Send ]  [ Edit ]  [ Schedule Call ]  [ Reject ]
```

---

## Escalation rules

Escalate to the human PAM (no auto-send, direct Slack/Telegram alert) if:
- Health drops >25 points in a single week.
- Partner goes silent across multiple channels for 14+ days while also showing a material drop in activity or pipeline contribution (strong churn / complaint signal).
- Tier 1 / strategic partner hasn't had a touch in 21 days.
- Sentiment in recent feedback submissions trends negative.
- Partner is tracking >30% off their business-plan goals at mid-quarter with no recovery signal.

---

## Success metrics

- **Proposal approval rate** (>50% means well-calibrated).
- **Partner churn rate** vs. baseline (target: 30%+ reduction).
- **Time-to-first-response** on at-risk flags (target: <2 business days from agent flag to PAM touch).
- **Portal DAU lift** after re-engagement sends (target: 20%+ short-term lift).

---

## Failure modes to watch

- **Form-letter voice.** If proposed emails all sound the same, the persona-voice prompt is too generic. Require org-specific tone samples during onboarding.
- **False-positive risk flags.** If >50% of "at-risk" proposals get rejected, the health model is too aggressive. Tune thresholds per org.
- **Over-frequent nudges.** Cap outbound touches per partner per week (default: 2) regardless of how many proposals the agent generates.
