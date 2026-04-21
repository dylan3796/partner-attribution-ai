# What Partner Ops Teams Actually Do

If you read the marketing pages of every partner-tech vendor — Covant included, until recently — you'd think partner ops was a single job with a single shape. Track attribution. Calculate commissions. Run a portal. Done.

Then you read the job descriptions.

Databricks is hiring a Partner Operations Analyst. Stripe is hiring a Partnerships Analytics Lead. MongoDB, Elastic, Datadog, Cloudflare — all hiring into the same function, with subtly different titles, in late 2025 and early 2026. Read six of these postings back-to-back and the pattern comes into focus. Partner ops is not one job. It's twelve.

Here's the list, ranked by how often it shows up across the postings we looked at:

1. Build and maintain partner scorecards and QBR decks.
2. Track partner-sourced versus partner-influenced revenue.
3. Operationalize deal registration and conflict resolution.
4. Manage MDF budget allocation and ROI tracking.
5. Define and execute tier qualification and tier benefits.
6. Analyze partner pipeline velocity and forecast.
7. Design incentives — SPIFs, bonuses, accelerators — and measure lift.
8. Align commission payouts to deal attribution.
9. Monitor partner health and identify at-risk partners before they churn.
10. Manage CRM syncs and data integrity.
11. Conduct partner-sourced versus direct win-rate analysis.
12. Build partner-to-opportunity recommendation engines.

Every one of these shows up in live job descriptions as a core responsibility. Not a stretch goal. Not a nice-to-have. The actual work.

And every one of them, today, lives in a spreadsheet.

---

## The Twelve Jobs, and Who Does Them Today

The shape of the work is worth looking at directly, because the tools partner teams have been handed were built for a much smaller surface area.

**QBR decks (#1)** are still rebuilt from scratch every quarter by a human, pulling from Salesforce exports, finance spreadsheets, portal CSVs, and a Slack channel of partner anecdotes. A real QBR is a week of work for one person. The next quarter, that person does it again.

**Partner-sourced vs. partner-influenced revenue (#2)** is the question that partner ops exists to answer. Most teams cannot answer it precisely, because "influenced" requires knowing about touchpoints that never got logged — forwarded intros, co-sell calls, customer references, pre-sales assists. The influence layer is invisible to the CRM.

**Deal registration and conflict resolution (#3)** is a workflow problem that becomes a relationship problem the moment two partners register the same deal. Most programs resolve this by email chain and back-channel. The good ones have a policy. The great ones have a system.

**MDF tracking (#4)** gets done in a Google Sheet called "MDF_FY26_v4_FINAL_final.xlsx," and the ROI attribution on every dollar of it is reconstructed from memory at the end of the year.

**Tier qualification (#5)** is a rules problem — thresholds on revenue, deal count, certifications — that every program does by hand every month because the rules live in a PDF and the data lives in five other places.

**Pipeline velocity and forecasting (#6)**, **win-rate analysis (#11)**, and **incentive lift measurement (#7)** are all analytics jobs that require joining partner data to deal data to touchpoint data, cleanly, at scale. Most partner teams don't have this join. Most partner teams don't have a data team.

**Commission payout alignment (#8)** is the one place where getting it wrong produces a phone call. So this is the job that absorbs most of a channel manager's week — not because it's hard, but because the margin for error is zero and the tooling makes errors easy.

**Partner health monitoring (#9)** is the most important job on the list and the one with the least tooling behind it. The question — which of my partners is about to go quiet? — is answerable from activity, pipeline, and response-time data that every program has. Almost nobody is watching it in real time.

**CRM sync and data integrity (#10)** is the grunt work that makes every other job possible. When the sync breaks, everything breaks. When a field map changes, a quarter of analytics rewrites.

**Partner-to-opportunity matching (#12)** — the engine that tells an AE which partner to bring into an open deal — is the job that almost nobody is doing today, because the data joins required to do it well didn't exist until recently.

Twelve jobs. One person, usually two, sometimes a small team. Running on spreadsheets.

---

## What an AI-Native Partner Ops Looks Like

This is where AI actually matters, and it's worth being specific about what that means.

Ask-anything copilot does job #1 and job #11 in minutes rather than days — the QBR rebuild and the win-rate analysis — because it joins the data for you and cites the source of every number it surfaces. Natural-language rule-building handles job #8 — payout alignment — by turning an English description of a commission program into executable rules that can be simulated against history before they ship. AI-guided onboarding handles job #5 and job #10 at setup time — tier definition and CRM mapping — by asking questions rather than handing you a 40-field form.

The next wave of features — the ones we're building toward — go after the harder jobs. Ambient touchpoint capture (what we're calling **Partner Signal**) reads CRM, email, and Slack to surface the partner-influenced revenue that job #2 has always missed. **Partner Program AI** goes after jobs #4, #5, and #7 as one coherent problem: tier design, MDF allocation, incentive modeling, and lift measurement, all in one place. **Partner Journey AI** takes the onboarding-to-renewal arc — the lifecycle every account manager tracks manually in their head — and turns it into something the system runs. And **bi-lateral Partner Health** takes job #9 from a one-way rule-based score to a two-way score, because partners know things about their own pipeline and engagement that no amount of CRM-watching will ever reveal.

None of this is magic. All of it maps to a specific job that a specific person is doing today with a specific spreadsheet.

---

## Why This List Matters

The reason we're writing this essay is that the last five years of partner-tech have drifted away from the twelve jobs. The category got abstracted into "partner ecosystem platform" and "ecosystem automation" — phrases that mean everything and nothing. Meanwhile, the people hiring into the function keep writing the same twelve-line job description.

The gap between the marketing language and the job description is where software misses the work.

Covant's bet is simpler: the twelve jobs are the product. Everything we ship should map to one of them or we shouldn't ship it. Everything we claim on a marketing page should be something a partner ops analyst recognizes from their own week. When we say "AI copilot," we mean the thing that rebuilds your QBR deck. When we say "rule builder," we mean the thing that aligns your payouts. When we say "Partner Signal," we mean the thing that surfaces the influenced revenue that nobody has been able to see.

Twelve jobs. One system. No fluff.

That's the work.
