import { LIFECYCLE_STEPS } from "@/lib/marketing";

/**
 * The ecosystem lifecycle as an animated chain: a pulse travels the track
 * between nodes (pure CSS; static under prefers-reduced-motion).
 */
export default function LifecycleFlow() {
  return (
    <div className="m-flow">
      <div className="m-flow-track" aria-hidden>
        <span className="m-flow-dot" />
      </div>
      <div className="m-flow-nodes">
        {LIFECYCLE_STEPS.map((step, i) => (
          <div className="m-flow-node" key={step.title}>
            <span className="m-flow-node-num">{i + 1}</span>
            <div className="m-flow-node-text">
              <h3 className="m-h3">{step.title}</h3>
              <p className="m-body">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
