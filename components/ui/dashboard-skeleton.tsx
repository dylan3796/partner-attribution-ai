/**
 * Reusable dashboard loading skeletons.
 * Variants match the common page layouts across the product.
 */

const shimmerCSS = `
@keyframes skeleton-shimmer {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}
`;

function Block({ w, h, r = 6, o = 0.3, mb = 0 }: { w: number | string; h: number; r?: number; o?: number; mb?: number }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "var(--border)",
        borderRadius: r,
        opacity: o,
        marginBottom: mb,
        animation: "skeleton-shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

function StatsRow({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`, gap: "1rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center", animation: "skeleton-shimmer 1.5s ease-in-out infinite" }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--border)", opacity: 0.25 }} />
          <div>
            <Block w={70} h={11} o={0.35} mb={6} />
            <Block w={50} h={22} o={0.25} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  const widths = [140, 100, 80, 120, 60, 90];
  return (
    <div className="card" style={{ padding: "1.25rem", animation: "skeleton-shimmer 1.5s ease-in-out infinite" }}>
      {/* Table header */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Block key={i} w={widths[i % widths.length]} h={12} o={0.4} />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: "2rem", alignItems: "center", padding: "10px 0", borderBottom: i < rows - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Block key={j} w={widths[j % widths.length]} h={14} o={0.2 + (j === 0 ? 0.1 : 0)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Header({ titleW = 200, subtitleW = 300 }: { titleW?: number; subtitleW?: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Block w={titleW} h={28} o={0.35} mb={8} r={8} />
        <Block w={subtitleW} h={14} o={0.2} />
      </div>
      <Block w={100} h={36} o={0.15} r={8} />
    </div>
  );
}

function CardGrid({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{ padding: "1.25rem", animation: "skeleton-shimmer 1.5s ease-in-out infinite" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <Block w={120} h={16} o={0.35} />
            <Block w={60} h={20} o={0.2} r={10} />
          </div>
          <Block w="80%" h={12} o={0.2} mb={8} />
          <Block w="60%" h={12} o={0.15} />
        </div>
      ))}
    </div>
  );
}

function ChartArea() {
  return (
    <div className="card" style={{ padding: "1.25rem", animation: "skeleton-shimmer 1.5s ease-in-out infinite" }}>
      <Block w={140} h={18} o={0.35} mb={20} />
      <div style={{ height: 220, display: "flex", alignItems: "flex-end", gap: 6, paddingTop: 20 }}>
        {[40, 65, 50, 80, 70, 90, 55, 75, 85, 60, 95, 45].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: "var(--border)",
              borderRadius: "4px 4px 0 0",
              opacity: 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SettingsSections({ sections = 3 }: { sections?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {Array.from({ length: sections }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{ padding: "1.5rem", animation: "skeleton-shimmer 1.5s ease-in-out infinite" }}
        >
          <Block w={160} h={18} o={0.35} mb={16} />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: j < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div>
                <Block w={140 + j * 20} h={14} o={0.3} mb={4} />
                <Block w={200 + j * 30} h={11} o={0.15} />
              </div>
              <Block w={44} h={24} o={0.2} r={12} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Filter/search bar skeleton */
function FilterBar() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Block w={240} h={36} o={0.15} r={8} />
      <Block w={100} h={36} o={0.12} r={8} />
      <Block w={100} h={36} o={0.12} r={8} />
    </div>
  );
}

// --- Exported layout presets ---

/** Stats + table (partners, deals, payouts, contracts, etc.) */
export function TablePageSkeleton({ stats = 4, rows = 6, cols = 4 }: { stats?: number; rows?: number; cols?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <style>{shimmerCSS}</style>
      <Header />
      <StatsRow count={stats} />
      <FilterBar />
      <TableRows rows={rows} cols={cols} />
    </div>
  );
}

/** Stats + card grid (products, notifications, applications, etc.) */
export function CardPageSkeleton({ stats = 3, cards = 6 }: { stats?: number; cards?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <style>{shimmerCSS}</style>
      <Header />
      <StatsRow count={stats} />
      <FilterBar />
      <CardGrid count={cards} />
    </div>
  );
}

/** Stats + chart + table (reports, forecasting, benchmarks) */
export function ChartPageSkeleton({ stats = 4 }: { stats?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <style>{shimmerCSS}</style>
      <Header />
      <StatsRow count={stats} />
      <ChartArea />
      <TableRows rows={4} cols={3} />
    </div>
  );
}

/** Settings sections */
export function SettingsPageSkeleton({ sections = 3 }: { sections?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <style>{shimmerCSS}</style>
      <Header titleW={160} subtitleW={250} />
      <SettingsSections sections={sections} />
    </div>
  );
}

/** Simple page with header + content card */
export function SimplePageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <style>{shimmerCSS}</style>
      <Header />
      <div className="card" style={{ padding: "2rem", animation: "skeleton-shimmer 1.5s ease-in-out infinite" }}>
        <Block w="70%" h={14} o={0.25} mb={12} />
        <Block w="90%" h={12} o={0.18} mb={8} />
        <Block w="50%" h={12} o={0.15} mb={20} />
        <Block w="100%" h={200} o={0.1} r={10} />
      </div>
    </div>
  );
}
