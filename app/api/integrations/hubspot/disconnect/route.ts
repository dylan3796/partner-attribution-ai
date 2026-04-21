import { NextResponse } from 'next/server';
import { getConvexClient } from '@/lib/convex-server';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export async function POST(request: Request) {
  const { organizationId } = await request.json();
  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  const convex = getConvexClient();
  await convex.mutation(api.integrations.disconnectHubSpot, {
    organizationId: organizationId as Id<'organizations'>,
  });

  return NextResponse.json({ success: true });
}
