import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background:'#f9fafb',
      fontFamily: 'var(--font-inter), Inter, sans-serif',
    }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ color:'#0a0a0a', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Covant.ai
        </h1>
        <p style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>Partner Intelligence Platform</p>
      </div>
      <SignUp
        fallbackRedirectUrl="/onboard"
        appearance={{
          elements: {
            formFieldInput__username: { display: 'none' },
            formFieldLabel__username: { display: 'none' },
            formFieldRow__username: { display: 'none' },
            formFieldInput__phoneNumber: { display: 'none' },
            formFieldLabel__phoneNumber: { display: 'none' },
            formFieldRow__phoneNumber: { display: 'none' },
          }
        }}
      />
    </div>
  );
}
