import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://covant.ai';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/beta`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/use-cases`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/security`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
