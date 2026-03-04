import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://covant.ai';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/beta`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/product`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/integrations`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/roi`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/use-cases`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/assessment`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/security`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/dpa`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
