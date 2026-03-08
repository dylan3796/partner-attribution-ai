import { BLOG_POSTS } from "../posts";

const SITE_URL = "https://covant.ai";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRFC822(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toUTCString();
}

export function GET() {
  const items = BLOG_POSTS.map(
    (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${formatRFC822(post.date)}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`
  ).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Covant Blog — Partner Intelligence</title>
    <link>${SITE_URL}/blog</link>
    <description>Insights on partner attribution, commission automation, and partner program management from the Covant team.</description>
    <language>en-us</language>
    <lastBuildDate>${formatRFC822(BLOG_POSTS[0].date)}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.svg</url>
      <title>Covant Blog</title>
      <link>${SITE_URL}/blog</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
