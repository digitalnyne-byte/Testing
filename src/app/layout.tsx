import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'DIGITALNYNE Growth Studio | Digital Marketing Agency in Vizag',
  description: 'DIGITALNYNE Growth Studio helps businesses in Vizag with content creation, video editing, branding, websites, advertising, digital marketing, and lead generation.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  icons: {
    icon: [
      { url: '/assets/images/app_logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/assets/images/app_logo.png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'DIGITALNYNE Growth Studio | Digital Marketing Agency in Vizag',
    description: 'Helping businesses in Visakhapatnam grow with content, branding, advertising, and digital marketing.',
    siteName: 'DIGITALNYNE Growth Studio',
    images: [
      {
        url: '/assets/images/79213-1786009666378.png',
        width: 1200,
        height: 630,
        alt: 'DIGITALNYNE Growth Studio - Digital Marketing Agency in Visakhapatnam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIGITALNYNE Growth Studio | Digital Marketing Agency in Vizag',
    description: 'Digital Marketing Agency in Visakhapatnam, Andhra Pradesh.',
    images: ['/assets/images/79213-1786009666378.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DIGITALNYNE Growth Studio',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/assets/images/app_logo.png`,
    description: 'Digital marketing agency in Visakhapatnam offering content creation, video editing, branding, websites, advertising, and lead generation.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Visakhapatnam',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.digitalnyne.com',
    ],
  };

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fdigitalnyn2062back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body className={plusJakartaSans.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}