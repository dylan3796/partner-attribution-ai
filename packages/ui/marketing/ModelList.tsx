import { MODELS } from "@/lib/marketing";

/** The five attribution models, one line each. Mirrors the shipped engine. */
export default function ModelList() {
  return (
    <div className="m-list">
      {MODELS.map((m, i) => (
        <div className="m-list-item" key={m.id}>
          <span className="m-num">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="m-h3" style={{ marginBottom: ".35rem" }}>
              {m.label}
            </h3>
            <p className="m-body">{m.line}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
