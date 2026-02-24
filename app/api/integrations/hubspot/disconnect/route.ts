import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

export async function POST(request: Request) {
  const { organizationId } = await request.json();
  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  await convex.mutation(api.integrations.disconnectHubSpot, {
    organizationId: organizationId as Id<'organizations'>,
  });

  return NextResponse.json({ success: true });
}
