import { ConvexHttpClient } from "convex/browser";

export function getConvexClient(): ConvexHttpClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is not set. Configure it in the environment to call Convex from server routes."
    );
  }
  return new ConvexHttpClient(url);
}
