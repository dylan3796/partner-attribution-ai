/**
 * Illustrative snapshot of a partner's home base in the portal: where they
 * stand, what's owed, and the next move Covant recommends. Clearly labelled
 * as an example — not live customer data. Mirrors real portal surface
 * (app/portal/** dashboard, commissions, tier progress).
 */
export default function NextMoveVisual() {
  return (
    <div
      className="m-split"
      role="img"
      aria-label="Example partner portal view showing tier progress, earnings status, and a recommended next move"
    >
      <div className="m-split-head">
        <span>Partner portal · Meridian Consulting</span>
        <span>Example</span>
      </div>
      <div className="m-next-body">
        <div className="m-next-row">
          <span className="m-next-label">Tier</span>
          <span className="m-next-value">
            Silver — 2 won deals from Gold
            <span className="m-split-track m-next-track">
              <span className="m-split-fill" style={{ width: "70%" }} />
            </span>
          </span>
        </div>
        <div className="m-next-row">
          <span className="m-next-label">Owed</span>
          <span className="m-next-value">
            $18,400 earned · $6,200 pending approval · $4,100 projected next quarter
          </span>
        </div>
        <div className="m-next-move">
          <span className="m-next-move-tag">Next move</span>
          <span>
            Register the Northwind expansion — your eval work is already credited on the
            account.
          </span>
        </div>
      </div>
    </div>
  );
}
