import { MetadataRoute } from 'next'
import { getAllArticles } from '@/services/content-service';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const articlesEn = await getAllArticles('en').catch(() => []);
  const articlesEs = await getAllArticles('es').catch(() => []);
  const allArticles = [...articlesEn, ...articlesEs];

  const articleEntries: MetadataRoute.Sitemap = allArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.createdAt?.toDate ? article.createdAt.toDate() : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleEntries,
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
