# Covant Attribution Schema (CAS) — v0.1.0 (draft)

> A standardized, portable dataset for partner attribution. A vendor computes multi-touch
> partner attribution on its own CRM data and emits a **CAS document**; its partners consume
> that document — in a warehouse, a spreadsheet, or an agent — without screen-scraping a portal
> or reverse-engineering a bespoke API.

**Status:** draft. The wire format is stable enough to build against, but fields may be added
in `0.x` releases. **Machine schema:** [`covant-attribution.v0.schema.json`](./covant-attribution.v0.schema.json)
(JSON Schema draft 2020-12). **Examples:** [`examples/`](./examples).

---

## 1. Why a schema

Attribution data is the one dataset a vendor and its partner both need and neither trusts. The
vendor computes it inside a PRM or a spreadsheet; the partner sees a number in a portal with no
lineage. There is no shared format, so every vendor↔partner pair rebuilds the same pipe.

CAS makes the attribution dataset a **first-class, portable artifact**:

- **Portable** — one document, warehouse-friendly (snake_case, ISO 8601, ISO 4217).
- **Auditable** — every credited number carries the touchpoint trail that produced it.
- **Transparent** — a record can show the same credit under alternate models, so a partner can
  see how the number would move under a different policy.
- **Matchable** — optional `domain` / `identity_hash` fields let two vendors recognize a shared
  partner without exchanging PII, which is what makes a network effect possible.

## 2. Document shape

A CAS document is a single JSON object: envelope metadata plus an array of **records**. Each
record is *one partner's credit on one deal* under the document's `default_model`.

```
CAS document
├── schema_version        "0.1.0"
├── generated_at          ISO 8601 UTC — when this export was produced
├── source                { vendor_id, vendor_name?, environment? }
├── default_model         the model behind each record's canonical numbers
├── currency?             document-level default (ISO 4217), defaults to USD
├── record_count?         MUST equal records.length when present
└── records[]
    └── record
        ├── record_id           stable id for this attribution row
        ├── computed_at         ISO 8601 UTC — when attribution was calculated
        ├── deal                { id, name?, amount, currency?, status, closed_at?, product_name?, external_ids? }
        ├── partner             { id, name?, type, tier?, domain?, identity_hash? }
        ├── attribution         { model, credit_percentage, credited_amount }   ← under default_model
        ├── commission?         { rate, amount, currency?, status? }
        ├── touchpoints[]?      the interaction trail, oldest first
        ├── alternate_models[]? same deal+partner under other models
        └── extensions?         vendor-specific escape hatch
```

Why *one row per partner per deal* (not one row per deal with nested partners): it is the grain
that maps directly to a warehouse fact table, sums cleanly by partner, and matches how the
attribution engine already stores results.

## 3. Field reference

### 3.1 Envelope

| Field | Type | Req | Notes |
|---|---|---|---|
| `schema_version` | string | ✅ | Semver of the CAS release. `"0.1.0"` here. |
| `generated_at` | date-time | ✅ | ISO 8601 UTC. When the export was produced. |
| `source` | object | ✅ | See below. |
| `default_model` | enum | ✅ | One of the five models in §4. Governs each record's `attribution` block. |
| `currency` | string | | ISO 4217. Document-wide default. Omitted ⇒ `USD`. |
| `record_count` | integer | | If present, MUST equal `records.length`. Lets consumers detect truncation. |
| `records` | array | ✅ | The attribution records. May be empty. |
| `extensions` | object | | Vendor-specific keys. Consumers MUST ignore unknown keys. |

**`source`**

| Field | Type | Req | Notes |
|---|---|---|---|
| `vendor_id` | string | ✅ | Stable opaque id for the emitting vendor. |
| `vendor_name` | string | | Human-readable; omit for privacy. |
| `environment` | enum | | `production` \| `sandbox`. Omitted ⇒ `production`. |

### 3.2 Record

| Field | Type | Req | Notes |
|---|---|---|---|
| `record_id` | string | ✅ | Stable id for this attribution row. |
| `computed_at` | date-time | ✅ | ISO 8601 UTC. When the attribution was calculated. |
| `deal` | object | ✅ | §3.3 |
| `partner` | object | ✅ | §3.4 |
| `attribution` | object | ✅ | §3.5. Its `model` MUST equal the document `default_model`. |
| `commission` | object | | §3.6 |
| `touchpoints` | array | | §3.7. Oldest first. |
| `alternate_models` | array | | §3.8. Same deal+partner under other models. |
| `extensions` | object | | Vendor-specific keys. |

### 3.3 `deal`

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | ✅ | Stable id within the vendor namespace. |
| `name` | string | | |
| `amount` | money | ✅ | Total deal value, major units (dollars, not cents). |
| `currency` | string | | Overrides document currency for this deal. |
| `status` | enum | ✅ | `open` \| `won` \| `lost`. |
| `closed_at` | date-time | | Present when won/lost. |
| `product_name` | string | | Product/line the deal is attributed against. |
| `external_ids` | object | | `{ salesforce?, hubspot?, ... }` — string→string. Enables round-trip reconciliation. |

### 3.4 `partner`

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | ✅ | Stable id within the vendor namespace. |
| `name` | string | | |
| `type` | enum | ✅ | `affiliate` \| `referral` \| `reseller` \| `integration`. |
| `tier` | enum | | `bronze` \| `silver` \| `gold` \| `platinum`. |
| `domain` | string | | Primary web domain. Enables cross-vendor matching. |
| `identity_hash` | string | | `sha256:<64 hex>` of the normalized domain. Privacy-preserving match key. |

### 3.5 `attribution`

| Field | Type | Req | Notes |
|---|---|---|---|
| `model` | enum | ✅ | §4. MUST equal `default_model`. |
| `credit_percentage` | number | ✅ | 0–100. Across all records of a given deal+model, SHOULD sum to ~100. |
| `credited_amount` | money | ✅ | `deal.amount × credit_percentage / 100`. |

### 3.6 `commission`

| Field | Type | Req | Notes |
|---|---|---|---|
| `rate` | number | ✅ | **Fraction 0.0–1.0** (0.15 = 15%), not a percentage. |
| `amount` | money | ✅ | Commission owed for this record. |
| `currency` | string | | Overrides document currency. |
| `status` | enum | | `pending_approval` \| `approved` \| `rejected` \| `processing` \| `paid` \| `failed`. |

### 3.7 `touchpoints[]`

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | | |
| `type` | string | ✅ | Standard set: `referral`, `demo`, `content_share`, `introduction`, `proposal`, `negotiation`, `deal_registration`, `co_sell`, `technical_enablement`, `crm_sync`. Consumers SHOULD tolerate unknown values. |
| `occurred_at` | date-time | ✅ | ISO 8601 UTC. |
| `weight` | number | | Explicit weight used by weighted models. |

### 3.8 `alternate_models[]`

Each entry: `{ model, credit_percentage, credited_amount, commission_amount? }`. Same deal+partner,
different model — for sensitivity and dispute resolution ("under last-touch you'd get 100%").

## 4. Attribution models

CAS v0 defines exactly **five** models. These are the models the Covant engine computes today;
the enum is intentionally closed so "conforms to CAS v0" means something precise. New models are
added by minting a new schema version, not by inventing enum values in the wild.

| `model` | Credit rule |
|---|---|
| `equal_split` | Every distinct partner on the deal gets an equal share. |
| `first_touch` | 100% to the partner with the earliest touchpoint. |
| `last_touch` | 100% to the partner with the latest touchpoint. |
| `time_decay` | Exponential recency weighting across touchpoints, summed per partner. |
| `role_based` | Touchpoint *type* carries a weight; per-partner weights summed and normalized. |

> Note: the platform database currently enumerates additional experimental model identifiers,
> but the production attribution engine (`convex/lib/attribution/`) implements exactly these
> five. CAS v0 standardizes only what is actually computed.

## 5. Conventions

- **Timestamps** — ISO 8601 UTC strings (`2026-07-22T18:00:00Z`). Internally the platform stores
  unix-ms; emit converts to ISO 8601 at the boundary.
- **Money** — JSON numbers in **major units** (dollars, not cents), ≤2 decimals recommended.
- **Currency** — ISO 4217 three-letter codes. Absent ⇒ `USD`. (The current product assumes USD;
  the field exists so the format doesn't have to change when that stops being true.)
- **Commission `rate`** — a fraction (0.15), never a percentage (15). `credit_percentage` is the
  one field that is a percentage (0–100), by long-standing convention; everything else is a
  fraction or an absolute amount.
- **Unknown keys** — additive forward-compat: consumers MUST ignore keys they don't recognize;
  the JSON Schema is strict (`additionalProperties: false`) on core objects, with `extensions`
  as the sanctioned escape hatch.

## 6. Versioning

- Semver. `schema_version` in every document.
- `0.x` may add optional fields and relax constraints; consumers pin the **minor** they build
  against and ignore unknown keys.
- Adding an attribution model, removing a field, or tightening a constraint is a version bump
  (minor while `0.x`, major at `1.0`+). The `$id` URL is version-scoped.

## 7. Validation

```bash
pip install jsonschema
python3 - <<'PY'
import json
from jsonschema import Draft202012Validator
schema = json.load(open("schema/covant-attribution.v0.schema.json"))
doc    = json.load(open("schema/examples/single-model.json"))
Draft202012Validator(schema).validate(doc)   # raises on any violation
print("valid")
PY
```

All files in [`examples/`](./examples) validate against the schema; malformed documents
(out-of-range credit, unknown model, percentage-vs-fraction commission, extra fields) are
rejected.

## 8. Not in v0 (planned)

- **Alert / monitoring schema** — a companion format for the drift/anomaly alerts the monitoring
  agent emits (`partner attributed revenue dropped 38% QoQ with no stage change`). Kept separate
  so the data format and the agent's opinions version independently.
- **Delta exports** — `changed_since` cursor semantics for incremental pulls.
- **Signed envelopes** — detached signature over the document for tamper-evidence between vendor
  and partner.
