import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml` : '/sitemap.xml';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/', 
    },
    sitemap: sitemapUrl,
  }
}
