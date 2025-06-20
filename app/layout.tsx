import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SupabaseAuthProvider } from "@/components/supabase-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Liora Journal - Your Personal Wellness Companion",
    template: "%s | Liora Journal"
  },
  description: "A safe, judgment-free space where AI meets compassion. Get emotional support, track your wellness journey, and build healthier mental habits with your personal wellness companion.",
  keywords: [
    "mental health",
    "wellness companion",
    "AI therapy",
    "journaling",
    "emotional support",
    "mental wellness",
    "self-care",
    "mindfulness",
    "therapy app",
    "mental health app",
    "wellness journal",
    "AI mental health",
    "emotional wellness",
    "mental health support",
    "wellness tracking",
  ],
  authors: [{ name: "Liora Journal Team" }],
  creator: "Liora Journal",
  publisher: "Liora Journal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://liorajournal.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://liorajournal.com',
    siteName: 'Liora Journal',
    title: 'Liora Journal - Your Personal Wellness Companion',
    description: 'A safe, judgment-free space where AI meets compassion. Get emotional support, track your wellness journey, and build healthier mental habits.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Liora Journal - AI-powered wellness companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@liorajournal',
    creator: '@liorajournal',
    title: 'Liora Journal - Your Personal Wellness Companion',
    description: 'A safe, judgment-free space where AI meets compassion. Get emotional support, track your wellness journey, and build healthier mental habits.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Liora Journal",
              "description": "A safe, judgment-free space where AI meets compassion. Get emotional support, track your wellness journey, and build healthier mental habits.",
              "url": "https://liorajournal.com",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Liora Journal"
              },
              "featureList": [
                "AI Chat Support",
                "Smart Journaling",
                "Wellness Insights",
                "Mood Tracking",
                "24/7 Availability"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
