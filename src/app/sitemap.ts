import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${base}/services`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/request-a-quote`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), priority: 0.5 },
    { url: `${base}/terms-and-conditions`, lastModified: new Date(), priority: 0.5 },
  ];
}