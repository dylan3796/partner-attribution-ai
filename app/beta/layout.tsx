import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beta Access — Covant',
  description: 'Join the Covant beta. Automate partner attribution, commission rules, and payouts for your B2B partner program. First 20 teams onboard free with hands-on support.',
  openGraph: {
    title: 'Join the Covant Beta — Partner Intelligence Platform',
    description: 'Automate attribution, commission rules, and payouts for your partner program. First 20 teams onboard free.',
    url: 'https://covant.ai/beta',
  },
};

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
