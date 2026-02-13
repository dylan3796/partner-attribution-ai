# PartnerBase Business Ops - Multi-Agent System

**Autonomous agents working together to run PartnerBase as a business.**

## Architecture

This is a **multi-agent coordination system** where specialized AI agents handle different aspects of running the business:

1. **Lead Manager** - Handles inbound leads from landing page
2. **Sales Agent** - Manages demos, closes deals
3. **Content Creator** - Writes blog posts, case studies, docs
4. **Product Builder** - Ships features, fixes bugs
5. **Outreach Agent** - Cold outreach, LinkedIn, partnerships

## How It Works

**Communication:** Agents communicate via Convex database (shared task queue + message board)

**Coordination:** Each agent:
- Has a defined role and responsibilities
- Checks for assigned tasks
- Communicates with other agents when needed
- Updates task status and progress

**Autonomy:** Agents run on OpenClaw sessions, can:
- Read/write to Convex
- Access tools (email, browser, code editing)
- Spawn sub-tasks for other agents
- Report progress back to Dylan

## Setup

### 1. Initialize Agents

```bash
cd agents
node setup-agents.js
```

This creates OpenClaw agent configs for each role.

### 2. Start Agents

Agents run as separate OpenClaw sessions. You can:
- **Auto-start:** `node start-all-agents.js`
- **Manual:** Start each agent session individually via OpenClaw CLI

### 3. Monitor

- **Dashboard:** View agent activity in Convex dashboard
- **Reports:** Agents post updates to a shared log
- **Alerts:** Critical items get sent to Dylan via Telegram

## Agent Roles

### Lead Manager
**Responsibilities:**
- Monitor new leads from landing page
- Send welcome email within 5 minutes
- Qualify leads (company size, use case)
- Route qualified leads to Sales Agent
- Follow up on cold leads after 3 days

**Tools:**
- Email (via SendGrid or SMTP)
- Convex (read leads table)
- CRM (update lead status)

### Sales Agent
**Responsibilities:**
- Schedule demos with qualified leads
- Conduct demo calls (prepare talking points)
- Follow up after demos
- Handle objections
- Close deals and onboard customers

**Tools:**
- Calendar (Calendly integration)
- Email
- Zoom/call links
- CRM

### Content Creator
**Responsibilities:**
- Write blog posts (SEO-optimized)
- Create case studies from customer wins
- Update documentation
- Social media content (LinkedIn, Twitter)

**Tools:**
- Web search (research topics)
- Code editor (write markdown)
- Git (commit and publish)
- AI writing models

### Product Builder
**Responsibilities:**
- Implement feature requests
- Fix reported bugs
- Improve UI/UX
- Deploy updates to production

**Tools:**
- Code editor
- Git (commit, push, PR)
- Vercel (deploy)
- Convex (backend changes)

### Outreach Agent
**Responsibilities:**
- Find potential customers (scrape LinkedIn, Twitter)
- Send personalized cold emails
- Build partnerships with complementary tools
- Track outreach performance

**Tools:**
- Web scraping
- Email
- LinkedIn automation
- CRM (log touches)

## Task System

All agents share a **task queue** in Convex:

```typescript
{
  id: string
  type: "lead_followup" | "demo_request" | "feature_request" | "bug_fix" | "content_write" | "outreach"
  assignedTo: "lead_manager" | "sales" | "content" | "builder" | "outreach"
  status: "pending" | "in_progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "urgent"
  data: {...} // task-specific data
  createdAt: number
  updatedAt: number
  completedAt?: number
}
```

**Workflow:**
1. Agent A creates a task for Agent B
2. Agent B polls for tasks assigned to them
3. Agent B completes task and updates status
4. Agent A gets notified of completion

## Communication

Agents post to a shared **message board**:

```typescript
{
  id: string
  from: string // agent name
  to: string | "all" // recipient
  content: string
  timestamp: number
  read: boolean
}
```

Example:
```
FROM: lead_manager
TO: sales
CONTENT: "New qualified lead: TechCo (500 employees, using Salesforce). Interested in demo. Contact: john@techco.com"
```

## Monitoring & Control

**Dylan's Control Panel:**
- View all agent activity in real-time
- Pause/resume agents
- Override decisions
- Inject new tasks manually

**Reporting:**
- Daily summary of what each agent accomplished
- Weekly metrics (leads converted, features shipped, content published)
- Alerts for critical items (high-value lead, production bug, competitor movement)

## Safety

**Guardrails:**
- Agents can't spend money without approval (>$50 transactions require Dylan's confirmation)
- Code changes require review before merging to main
- Email templates reviewed before first send
- Agents log all actions for audit trail

**Human-in-the-loop:**
- High-stakes decisions (close deals >$10k, major code changes) require Dylan approval
- Agents can ask Dylan for guidance via Telegram
- Dylan can pause any agent at any time

## Example: Lead to Customer Journey

1. **Landing page:** User submits email → saved to Convex leads table
2. **Lead Manager:** Detects new lead → sends welcome email → asks qualifying questions
3. **Lead Manager:** Lead responds → qualifies as good fit → creates task for Sales Agent
4. **Sales Agent:** Sees task → sends demo invite → schedules call
5. **Sales Agent:** Conducts demo → sends follow-up → closes deal
6. **Product Builder:** New customer onboarded → ensures smooth setup
7. **Content Creator:** Win recorded → writes case study for website

All of this happens **autonomously** with minimal Dylan involvement (just approvals on big decisions).

## Future Enhancements

- **Marketing Agent:** Runs paid ads, A/B tests landing pages
- **Customer Success:** Onboards customers, handles support tickets
- **Analytics Agent:** Tracks KPIs, generates reports, spots trends
- **Competitor Intel:** Monitors competitor moves, pricing changes
- **Partnership Agent:** Finds and negotiates integration partnerships
