export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 70, minHeight: "calc(100vh - 70px)", background: "var(--subtle)" }}>
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
