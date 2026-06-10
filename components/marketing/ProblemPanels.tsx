import { PROBLEM_PANELS } from "@/lib/marketing";
import Reveal from "./Reveal";

/** The three places the partner experience breaks today: the PRM, the inbox, the program. */
export default function ProblemPanels() {
  return (
    <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
      {PROBLEM_PANELS.map((panel) => (
        <Reveal className="m-card" key={panel.title}>
          <p className="m-eyebrow" style={{ marginBottom: ".6rem" }}>
            {panel.tool}
          </p>
          <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
            {panel.title}
          </h3>
          <p className="m-body">{panel.body}</p>
        </Reveal>
      ))}
    </div>
  );
}
