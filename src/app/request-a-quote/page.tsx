import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import BackArrow from '@/components/BackArrow';
import QuoteFormWrapper from '@/app/request-a-quote/components/QuoteFormWrapper';

export const metadata: Metadata = {
  title: 'Request a Quote | DIGITALNYNE Growth Studio',
  description: 'Get a personalized quote for your digital marketing project. Tell us about your business, goals, and budget, and we will create a tailored proposal.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/request-a-quote`,
  },
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/request-a-quote`,
    title: 'Request a Quote | DIGITALNYNE Growth Studio',
    description: 'Get a personalized quote for your digital marketing project. Tell us about your business, goals, and budget.',
    images: [
      {
        url: '/assets/images/79213-1786009666378.png',
        width: 1200,
        height: 630,
        alt: 'DIGITALNYNE Growth Studio - Request a Quote',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a Quote | DIGITALNYNE Growth Studio',
    description: 'Get a personalized quote for your digital marketing project.',
    images: ['/assets/images/79213-1786009666378.png'],
  },
};

export default function RequestAQuotePage() {
  return (
    <>
      <Header />
      <BackArrow />
      <main>
        <QuoteFormWrapper />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}