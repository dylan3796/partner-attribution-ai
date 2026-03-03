export default function OnboardLoading() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: '#000', fontFamily: 'var(--font-inter), Inter, sans-serif', gap: 20,
    }}>
      <div style={{
        width: 40, height: 40, border: '3px solid #1a1a1a',
        borderTopColor: '#6366f1', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#555', fontSize: '0.9rem', margin: 0 }}>Setting up your account...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
