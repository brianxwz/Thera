import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/callback',
        '/_next/',
        '/admin/',
        '/private/',
      ],
    },
    sitemap: 'https://liorajournal.com/sitemap.xml',
  }
} 