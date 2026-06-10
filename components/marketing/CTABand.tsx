import RequestDemo from "./RequestDemo";

/**
 * Closing call-to-action band. Anchored #demo (the nav and demo topbar link
 * here). Pages can swap in their own form — home passes EarlyAccessForm.
 */
export default function CTABand({
  eyebrow = "Get started",
  heading = "See Covant on your own partners.",
  body = "We'll show you the partner portal, the partner scores, and your last 12 months of attribution on a pipeline that looks like yours.",
  form,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  form?: React.ReactNode;
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
          {form ?? <RequestDemo />}
        </div>
      </div>
    </section>
  );
}
