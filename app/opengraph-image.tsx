import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Covant — Partner Intelligence Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#000',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48 }}>
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>
            covant
          </span>
          <span style={{
            marginLeft: 12, color: '#555', fontSize: 14,
            border: '1px solid #333', borderRadius: 4,
            padding: '2px 8px', letterSpacing: '0.05em',
          }}>
            BETA
          </span>
        </div>

        {/* Headline */}
        <div style={{
          color: '#fff', fontSize: 64, fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 1.1,
          marginBottom: 24, maxWidth: 800,
          display: 'flex', flexWrap: 'wrap',
        }}>
          Partner Intelligence Platform
        </div>

        {/* Subline */}
        <div style={{
          color: '#888', fontSize: 24, lineHeight: 1.5,
          maxWidth: 700, display: 'flex',
        }}>
          The rules engine that sits between "someone did something" and "someone gets paid."
        </div>

        {/* Bottom row */}
        <div style={{
          position: 'absolute', bottom: 80, left: 80, right: 80,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Attribution', 'Commission Rules', 'Partner Portal', 'Payouts'].map(f => (
              <span key={f} style={{ color: '#444', fontSize: 14 }}>{f}</span>
            ))}
          </div>
          <span style={{ color: '#333', fontSize: 14 }}>covant.ai</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
