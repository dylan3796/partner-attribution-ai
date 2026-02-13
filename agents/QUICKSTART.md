# Multi-Agent System - Quick Start

## What This Is

**5 autonomous AI agents working together to run PartnerBase as a business.**

Each agent is an OpenClaw session with a specific role:
1. **Lead Manager** - Handles inbound leads
2. **Sales Agent** - Closes deals  
3. **Content Creator** - Writes content
4. **Product Builder** - Ships features
5. **Outreach Agent** - Cold outreach

They communicate via shared Convex database (task queue + message board).

## How to Launch

### Option 1: Manual (Recommended for Testing)

Start each agent in a separate terminal:

```bash
# Terminal 1 - Lead Manager
openclaw sessions spawn \
  --label "lead_manager" \
  --task "You are the Lead Manager agent. Read agents/lead-manager.md for your role. Poll for new leads every 15 min and handle them according to your instructions."

# Terminal 2 - Sales Agent
openclaw sessions spawn \
  --label "sales" \
  --task "You are the Sales Agent. Read agents/sales.md for your role. Check for demo_request tasks every hour and handle them."

# (Repeat for other agents)
```

### Option 2: Automated Script (Coming Soon)

```bash
node agents/start-all.js
```

This will spawn all 5 agents in isolated sessions.

## Monitoring

**View agent activity:**
- Convex Dashboard: https://dashboard.convex.dev/d/dynamic-guineapig-197
- Tables to watch: `agent_tasks`, `agent_messages`, `agent_activity`

**OpenClaw sessions:**
```bash
openclaw sessions list
```

**Stop all agents:**
```bash
openclaw sessions list | grep "lead_manager\|sales\|content\|builder\|outreach" | awk '{print $1}' | xargs -I {} openclaw sessions stop {}
```

## How Agents Work Together

**Example: New lead → Customer**

1. **User submits email on landing page**
   → Saved to `leads` table in Convex

2. **Lead Manager detects new lead**
   → Sends welcome email
   → Qualifies lead
   → Creates `demo_request` task for Sales Agent
   → Posts message to Sales Agent with context

3. **Sales Agent sees new task**
   → Sends demo invite
   → Conducts demo
   → Sends follow-up
   → Closes deal

4. **Sales Agent hands off to Product Builder**
   → Creates `onboard_customer` task
   → Posts message with customer details

5. **Content Creator asks Sales Agent for case study**
   → Waits 30 days
   → Reaches out to customer
   → Writes case study
   → Publishes to website

All autonomous. Dylan only gets involved for:
- High-value deals (>$20k)
- Major decisions
- Critical bugs

## Agent Communication Example

**Lead Manager → Sales:**
```
FROM: lead_manager
TO: sales
CONTENT: New qualified lead: TechCo (500 employees, using Salesforce, struggling with partner attribution). Contact: john@techco.com. High priority - mark as enterprise deal.
TASK ID: task_xyz123
```

**Sales → Product Builder:**
```
FROM: sales  
TO: builder
CONTENT: Customer signed! TechCo needs onboarding by Friday. Salesforce integration required. Contact: john@techco.com.
TASK ID: task_abc456
```

## Safety & Controls

**Dylan's override commands:**
```javascript
// Pause all agents
await pauseAllAgents();

// Resume
await resumeAllAgents();

// Inject manual task
await createTask({
  type: "manual",
  assignedTo: "sales",
  priority: "urgent",
  title: "Call John at TechCo",
  description: "Follow up on stuck deal - offering 20% discount"
});
```

**Spending limits:**
- Agents can't spend >$50 without approval
- Email sending rate-limited (100/day per agent)
- Code changes require review before merge

## Next Steps

1. **Deploy Convex schema changes:**
   ```bash
   npx convex dev
   ```

2. **Test with one agent:**
   - Start Lead Manager
   - Submit a test lead on landing page
   - Watch it process the lead

3. **Gradually add more agents** as you're comfortable

4. **Monitor daily** until you trust the system

5. **Tune agent prompts** based on behavior

## Troubleshooting

**Agent not responding to tasks?**
- Check if session is still running: `openclaw sessions list`
- Check task queue: Convex dashboard → `agent_tasks` table
- Check agent logs: Session history in OpenClaw

**Agents creating duplicate tasks?**
- Check polling intervals (shouldn't be faster than 15 min)
- Add task deduplication logic

**Email not sending?**
- Verify email credentials in agent config
- Check rate limits

## Future Enhancements

- Web dashboard for Dylan to monitor agents
- Slack integration (agents post updates to #business-ops channel)
- Auto-pause agents during off-hours (weekends, nights)
- Performance dashboard (leads → demos → customers funnel)
- Agent learning (fine-tune prompts based on success metrics)
