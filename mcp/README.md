# PartnerAI MCP Server

Model Context Protocol (MCP) server that exposes PartnerAI platform data for natural language querying through any MCP-compatible LLM client (Claude Desktop, Cursor, custom integrations, etc.).

## Quick Start

```bash
cd mcp/
npm install
npm run build
npm start
```

## Integration

### Claude Desktop / MCP Client Config

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "partnerai": {
      "command": "node",
      "args": ["<path-to>/mcp/dist/index.js"],
      "env": {
        "PARTNERAI_API_KEY": "pk_your_api_key_here"
      }
    }
  }
}
```

### Enterprise LLM Integration

If your organization uses its own LLM, configure the MCP server as a tool provider:

```bash
# Set environment variables
export PARTNERAI_API_KEY="pk_your_api_key"
export LLM_PROVIDER="openai"  # or "anthropic", "azure", etc.
export LLM_API_KEY="your_llm_api_key"

npm start
```

## Available Tools

| Tool | Description |
|------|-------------|
| `query_partners` | Search and filter partners by status, type, tier, or text search |
| `query_deals` | Search deals by status, amount range, or text |
| `get_attribution` | Get attribution data for a specific deal or partner |
| `query_payouts` | View payout status and history |
| `get_partner_score` | Get composite score for a partner |
| `query_revenue` | Revenue analytics and metrics |
| `get_top_partners` | Ranked list of top performing partners |
| `get_at_risk_deals` | Deals approaching close date |

## Resources

| URI | Description |
|-----|-------------|
| `partnerai://partners` | All partner records |
| `partnerai://deals` | Deal pipeline data |
| `partnerai://revenue` | Revenue metrics and analytics |
| `partnerai://audit-log` | Recent activity log |

## Prompts

Pre-built prompts for common queries:

| Prompt | Description |
|--------|-------------|
| `top_partners` | Top performing partners summary |
| `revenue_breakdown` | Detailed revenue analysis |
| `at_risk_deals` | At-risk deal identification |
| `partner_review` | Comprehensive partner review (requires `partnerId`) |
| `pipeline_forecast` | Revenue forecast from pipeline |
| `payout_summary` | Payout status summary |

## Example Queries

Once connected, you can ask your LLM:

- "Who are our top 5 partners?"
- "What's the total revenue this quarter?"
- "Which deals are at risk of missing their close date?"
- "Give me a performance review of TechStar Solutions"
- "What's the revenue breakdown by partner tier?"
- "Show me all pending payouts"
- "How does our pipeline look for next month?"

## Architecture

```
┌─────────────────┐     stdio      ┌──────────────────┐
│   LLM Client    │◄──────────────►│  MCP Server      │
│  (Claude, etc)  │                │  (this package)   │
└─────────────────┘                └──────┬───────────┘
                                          │
                                   ┌──────▼───────────┐
                                   │  Data Layer       │
                                   │  (Convex/Demo)    │
                                   └──────────────────┘
```

In production, the data layer connects to your Convex backend. In demo mode, it uses realistic sample data matching the PartnerAI frontend.

## Development

```bash
npm run dev   # Watch mode
npm run build # Build TypeScript
npm start     # Run server
```
