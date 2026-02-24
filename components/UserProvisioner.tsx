"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Invisible component that provisions a Convex user record
 * from the Clerk identity on first dashboard visit.
 */
export function UserProvisioner() {
  const { user, isLoaded } = useUser();
  const provision = useMutation(api.users.provision);
  const provisioned = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || provisioned.current) return;
    provisioned.current = true;

    provision({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      name: user.fullName ?? undefined,
    }).catch(() => {
      // Non-critical — user record creation failed, queries fall back to demo org
    });
  }, [isLoaded, user, provision]);

  return null;
}
