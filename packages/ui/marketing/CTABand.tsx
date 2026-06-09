import RequestDemo from "./RequestDemo";

/** Closing call-to-action band with the inline demo form. Anchored #demo. */
export default function CTABand({
  eyebrow = "Get started",
  heading = "See Covant on your own partners.",
  body = "We'll show you the partner portal, the partner scores, and your last 12 months of attribution on a pipeline that looks like yours.",
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
}) {
  return (
    <section id="demo" className="m-section m-section--ink">
      <div className="m-container">
        <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
          <div>
            <p className="m-eyebrow">{eyebrow}</p>
            <h2 className="m-h2">{heading}</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
              {body}
            </p>
          </div>
          <RequestDemo />
        </div>
      </div>
    </section>
  );
}
