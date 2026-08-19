import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import BackArrow from '@/components/BackArrow';
import ServicesHero from '@/app/services/components/ServicesHero';
import ServiceDetail from '@/app/services/components/ServiceDetail';

export const metadata: Metadata = {
  title: 'Digital Marketing Services in Vizag | DIGITALNYNE Growth Studio',
  description: 'Explore content creation, video editing, branding, advertising, digital marketing, social media management, and lead generation services from DIGITALNYNE in Visakhapatnam.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services`,
  },
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services`,
    title: 'Digital Marketing Services in Vizag | DIGITALNYNE Growth Studio',
    description: 'Explore content creation, video editing, branding, advertising, digital marketing, social media management, and lead generation services.',
    images: [
      {
        url: '/assets/images/79213-1786009666378.png',
        width: 1200,
        height: 630,
        alt: 'DIGITALNYNE Growth Studio Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Services in Vizag | DIGITALNYNE Growth Studio',
    description: 'Explore content creation, video editing, branding, advertising, digital marketing, social media management, and lead generation services.',
    images: ['/assets/images/79213-1786009666378.png'],
  },
};

export default function ServicesPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Digital Marketing Services in Vizag | DIGITALNYNE Growth Studio',
    description: 'Explore content creation, video editing, branding, advertising, digital marketing, social media management, and lead generation services from DIGITALNYNE in Visakhapatnam.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/services`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'DIGITALNYNE Growth Studio',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Header />
      <BackArrow />
      <main>
        <ServicesHero />
        <ServiceDetail />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}