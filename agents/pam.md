# Partner Account Manager (PAM) Agent

**Role:** The relationship operator for the partner account team.

**Mission:** Watch every partner's health. Flag risk before it becomes churn. Write the check-ins, the QBR prep, and the nudges that keep partners engaged.

**Persona it serves:** Partner Account Manager — the person on the customer's team responsible for the partner relationship (health, activity, communication, QBRs).

---

## Design principles

1. **Scoped toolset.** The PAM Agent reads `partners`, `partnerHealth`, `partnerNotes`, `partnerApplications`, `activityHeatmap`, `weeklyDigest`, `deals` (for partner context), `dealFeedback` (when shipped), and `announcements`. It cannot edit commission rules, tier rules, or payouts.
2. **Human-in-the-loop.** Every outbound communication is a proposal the PAM reviews and approves/edits/rejects.
3. **Tone matters.** PAM Agent outputs go directly into partner-facing emails. Voice and tone are org-configurable and reviewed before any first send.

---

## Primary loops

### Loop 1: Weekly health sweep

**Trigger:** every Monday at 6am org-local time.

**Inputs:**
- All active partners, health scores (current and 4-week rolling).
- Activity signals: deal registrations, portal logins, MDF requests, certifications, feedback submissions.
- Commission activity: pending payouts, disputes, recent commissions received.

**Output (one proposal per flagged partner):**
- Health score delta (this week vs. last, with the two or three signals that drove the change).
- Risk classification: healthy / watching / at-risk / critical.
- A draft check-in email tailored to the risk type:
  - Healthy → celebration note ("You're in the top 10% of our partners this quarter, here's what drove it").
  - Watching → light nudge ("Haven't seen you in the portal recently — anything we can help with?").
  - At-risk → direct check-in offer ("Want to jump on a 15-min call this week?").
  - Critical → escalation to the human PAM (no auto-send, full context pack).

**Human action:** approve + send, edit tone/content, reject (mark as false positive), schedule call (creates a task).

### Loop 2: QBR prep (monthly / quarterly)

**Trigger:** 10 days before a scheduled QBR (detected from calendar integration or manually set).

**Output:** a structured QBR deck draft:
- Deals sourced and influenced (with attribution breakdown).
- Commission earned (paid + pending).
- Top wins and win stories.
- Areas to improve (open deal reg requests, certifications lapsed, missed MDF deadlines).
- Two to three "ask" items for the partner.

**Human action:** review, edit, approve for send.

### Loop 3: Re-engagement on drop-off

**Trigger:** partner with historical activity goes 30 days without a portal login or deal touch.

**Proposal:** draft a "we miss you" email referencing specific past wins, a current relevant deal where they could help, and a soft CTA to book time.

### Loop 4: Onboarding hand-off

**Trigger:** new partner application approved (from `partnerApplications`).

**Proposal:** draft the onboarding welcome email, plus a 30-day activation checklist. Schedule follow-ups at day 7, 14, and 30.

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
  - Open commission dispute from last payout run (11 days old)
  - Slack: no response to last two Partner Success check-ins
Draft email:
  > Hi Jordan — quick check-in. Noticed things have been quieter on
  > your side the last few weeks, and I saw the open dispute from
  > our last payout hasn't been resolved. I want to make sure we're
  > not missing something. Have 15 minutes this week to reset?
  > Here's my calendar: [link]. If something bigger is going on,
  > I'd rather hear it straight.
Suggested follow-ups: resolve dispute within 3 business days.
[ Approve + Send ]  [ Edit ]  [ Schedule Call ]  [ Reject ]
```

---

## Escalation rules

Escalate to the human PAM (no auto-send, direct Slack/Telegram alert) if:
- Health drops >25 points in a single week.
- Partner has pending payout + open dispute + zero communication in 14 days (signals they're about to churn or publicly complain).
- Tier 1 / strategic partner hasn't had a touch in 21 days.
- Sentiment in recent feedback submissions trends negative.

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
