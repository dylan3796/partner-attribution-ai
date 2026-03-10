'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

export default function OnboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const provision = useMutation(api.users.provision);
  const ran = useRef(false);

  // Check if this Clerk user already has a Convex record
  const existingUser = useQuery(
    api.users.getByClerKId,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  useEffect(() => {
    if (!isLoaded || !user || existingUser === undefined) return; // still loading
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      const clerkId = user.id;
      const email = user.primaryEmailAddress?.emailAddress ?? '';
      const name = user.fullName ?? user.firstName ?? email;

      await provision({ clerkId, email, name });

      // Existing users → dashboard, new users → setup wizard
      if (existingUser !== null) {
        router.replace('/dashboard');
      } else {
        router.replace('/setup');
      }
    };

    run().catch(() => router.replace('/dashboard'));
  }, [isLoaded, user, existingUser, provision, router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#000',
      fontFamily: 'var(--font-inter), Inter, sans-serif',
      gap: 20,
    }}>
      <h1 style={{
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        margin: 0,
      }}>
        Covant.ai
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Spinner />
        <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
          Setting up your workspace…
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <>
      <style>{`
        @keyframes covant-spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: 28,
        height: 28,
        border: '2px solid #222',
        borderTop: '2px solid #fff',
        borderRadius: '50%',
        animation: 'covant-spin 0.8s linear infinite',
      }} />
    </>
  );
}
