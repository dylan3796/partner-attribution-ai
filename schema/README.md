# Covant Attribution Schema (CAS)

The **standardized dataset for partner attribution** — a portable JSON format a vendor emits from
its CRM data and its partners consume directly, without scraping a portal or reverse-engineering a
one-off API.

This is the standardization layer behind Covant's headless positioning: compute attribution once,
emit a clean dataset, let partners (and an LLM monitoring agent) read it anywhere.

## Contents

| File | What it is |
|---|---|
| [`covant-attribution-schema.v0.md`](./covant-attribution-schema.v0.md) | Human-readable specification — field reference, models, conventions, versioning. |
| [`covant-attribution.v0.schema.json`](./covant-attribution.v0.schema.json) | Machine schema (JSON Schema draft 2020-12) for validation and codegen. |
| [`examples/minimal.json`](./examples/minimal.json) | Smallest valid document. |
| [`examples/single-model.json`](./examples/single-model.json) | A won deal split across two partners under `time_decay`. |
| [`examples/multi-model.json`](./examples/multi-model.json) | One record showing credit under the default model **and** four alternates. |

## 30-second view

```json
{
  "schema_version": "0.1.0",
  "generated_at": "2026-07-22T18:00:00Z",
  "source": { "vendor_id": "org_8fa21c" },
  "default_model": "time_decay",
  "records": [{
    "record_id": "attr_001",
    "computed_at": "2026-07-22T17:58:12Z",
    "deal":   { "id": "deal_9c1f0a", "amount": 50000, "status": "won" },
    "partner":{ "id": "partner_3ab77e", "type": "reseller" },
    "attribution": { "model": "time_decay", "credit_percentage": 62.5, "credited_amount": 31250 },
    "commission":  { "rate": 0.15, "amount": 4687.5 }
  }]
}
```

One record = one partner's credit on one deal, with the touchpoint trail that produced it. Full
field reference in the [spec](./covant-attribution-schema.v0.md).

## Validate

```bash
pip install jsonschema
python3 - <<'PY'
import json
from jsonschema import Draft202012Validator
schema = json.load(open("schema/covant-attribution.v0.schema.json"))
for name in ("minimal", "single-model", "multi-model"):
    doc = json.load(open(f"schema/examples/{name}.json"))
    Draft202012Validator(schema).validate(doc)
    print(name, "valid")
PY
```

## Status

**v0.1.0 — draft.** Stable enough to build against; `0.x` may add optional fields. Not yet
covered: the monitoring-agent alert schema, incremental/delta exports, and signed envelopes — see
§8 of the spec.
