# Covant — Outreach Script

*Three short variants + a "what to include" checklist. Read this doc top-to-bottom once, then use the templates.*

---

## What to include alongside the email

**Zero attachments in the cold email.** If the prospect replies, send this bundle — not before.

1. **60-second Loom.** Screen recording of the actual product, narrated by you. Show, in order:
   - Drop a CSV of their public partner list into Covant.
   - Configure one attribution rule the way *they* already think about attribution.
   - Generate the first payout file.
   - Run one agent pass on their data (e.g., Partner Ops Agent reconciling a commission discrepancy).
   Under 90 seconds. Re-record if it runs long. This is the most important artifact on the list.
2. **Live sandbox link.** A Covant tenant pre-loaded with *their* program (public partners from their partner page + synthetic deals) so they can click around before the call. One link, no signup.
3. **One-pager PDF.** Single page. Hero line, the four role surfaces (partner sales / managers / programs / ops), the Value-per-Input Ladder (Tier 0 → Tier 4), two logos or quotes if you have them, pricing band, your email. No more.
4. **Calendar link.** 15-minute and 30-minute options. Not 60.
5. **Forwardable blurb.** Two sentences they can paste to a colleague after the call without rewriting. Lives at the bottom of the one-pager and in your email signature.

**Explicitly NOT included in first contact:** investor deck, TAM math, roadmap, team bios, full pitch doc, the vision deck, the Series A framing. Upon-request only, and only after a call.

---

## Variant A — Cold email to Head of Partnerships

**Use for:** Tier A of `docs/discovery-targets.md`. Subject line matters more than the body; A/B test two.

**Subject line options** (pick one per batch, rotate weekly):
- `[CompanyName] partner tiers — quick question`
- `Covant × [CompanyName]`
- `15 min on your partner program`

**Body template** (fill the bracketed spots — do not send with them unfilled):

```
Hi [First name] —

Saw [SPECIFIC thing about their program: the way their partner directory is organized / their
new Platinum tier / a G2 comment from one of their partners / their recent HoP announcement].
[One sentence reacting to it, not praising it.]

Most partner teams I talk to spend one week a quarter arguing about who drove what and
reconciling commissions in spreadsheets. Guessing [CompanyName] is no different.

We built Covant — the platform a partner team runs on. Attribution configured the way *you*
already think about it, deal registration, commissions, Stripe-ready payouts, and four
role-specialized agents that handle the ops work so your team can sell.

Free for your first 10 partners. 15 min this week or next? I'll show a live demo with your
program's data pre-loaded — no deck, no form.

— [Your name]
[Title], Covant
[one link]
```

**Rules (enforced):**
- Line 1 hook must be specific to *them*. "I saw your company" = delete and start over.
- Do not say "AI-native." Do not say "disrupt." Do not say "revolutionize." Do not say "synergy."
- Do not pitch the vision (Stripe-for-multi-party-splits). Design-partner language, not Series A language.
- Under 120 words including signature. Count them.
- One link in the signature, not three.

---

## Variant B — LinkedIn DM (≤60 words)

**Use for:** Tier A/B when you've sent a connection request first, or when email bounces.

```
Hi [First name] — saw [specific thing about their program]. Most partner teams lose a week
a quarter to the attribution argument and commission spreadsheet — we built the platform
that runs it. Four role-specialized agents handle the ops work. Free for your first 10
partners. OK if I send you a 60-second Loom?
```

**Notes:**
- The ask is "OK if I send a Loom?" — lower friction than a meeting. Accept-rate is much higher than calendar-link DMs.
- Do not follow up more than twice. Second follow-up is "no worries, saw you're busy — here's the Loom in case it's useful later: [link]." Then stop.

---

## Variant C — Warm-intro ask (to send to a mutual connection)

**Use for:** when you have a 2nd-degree LinkedIn connection to the buyer. This is the highest-converting channel by a wide margin — use it before cold.

```
Hi [Mutual's first name] —

Quick ask. I'm building Covant — the platform a partner team runs on (attribution,
commissions, portal, agents for the ops work). Think: modern PRM for the nearbound era.

[Target's first name] at [CompanyName] runs their partner program and I think [one
specific reason why Target will care — not "they have a partner program" but "they're
on Impartner and have 40 SI partners and their attribution model is three spreadsheets"].

Any chance you'd intro us? I've dropped a 2-line forwardable blurb below so you don't
have to write anything.

—

FORWARDABLE:

[Mutual's first name] thought you'd want to meet [Your name] — they're building Covant,
the platform partner teams run on. Attribution, commissions, portal, plus four
role-specialized agents. I said the current [Impartner / PartnerStack / spreadsheet]
setup was probably overdue for a replatform. Worth 15 min?

— [Your name]
[Title], Covant
[one link]
```

**Rules:**
- Give the mutual the forwardable blurb. Never make them write it.
- One *specific* reason the target will care. Not generic.
- No attachments to the mutual either.

---

## Send cadence

- **Tier A (15):** Mon–Wed of week 1, 5 per day. Not all at once. Replies queue up fast.
- **Tier B (20):** Starts week 2, warm path first. Only cold-email the 5-10 rows without warm paths.
- **Tier C (15):** Month 2, after you have at least one live design partner as reference.

Do not batch-send. Replies get cold within 24 hours; if you can't answer 5 in a day, don't send 5.

---

## Follow-up rules

- **Follow-up 1** (3 business days after first email): one-line reply to the same thread. "Bumping this in case it got buried — here's the 60-second Loom [link]."
- **Follow-up 2** (7 business days after follow-up 1): one line. "Totally fine if this isn't a priority — mind if I drop you a note in a quarter?" This gets a response rate of ~30% and preserves the thread.
- **Follow-up 3:** don't. Stop. The channel is cold. Revisit the row in 60 days.

---

## Tracking

Spreadsheet or Airtable, one row per company from the target list. Columns:

- Sent date
- Variant used (A / B / C)
- Opened (if your tool tracks it)
- Replied (yes / no / deferred)
- Call booked (yes / no / date)
- Outcome (design partner signed / polite no / ghosted / save for later)

Weekly review: any Tier A rows with 0% response rate → the hook is generic. Rewrite.

---

## Smell test before sending any email

Read the body out loud in under 25 seconds. If it sounds like a pitch instead of a peer-to-peer note from a founder, cut words until it doesn't. A good email sounds like a text to a former coworker, not a sales sequence.
