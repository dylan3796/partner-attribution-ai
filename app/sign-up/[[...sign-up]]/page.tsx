import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#000',
      fontFamily: 'var(--font-inter), Inter, sans-serif',
    }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          covant
        </h1>
        <p style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>Partner Intelligence Platform</p>
      </div>
      <SignUp />
    </div>
  );
}
