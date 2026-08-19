import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import HeroSection from '@/app/components/HeroSection';
import TrustStrip from '@/app/components/TrustStrip';
import ServicesOverview from '@/app/components/ServicesOverview';
import WhyDigitalNyne from '@/app/components/WhyDigitalNyne';
import HowWeWork from '@/app/components/HowWeWork';
import ConversionSection from '@/app/components/ConversionSection';
import FAQSection from '@/app/components/FAQSection';
import FinalCTA from '@/app/components/FinalCTA';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import PromotionalCarousel from '@/components/PromotionalCarousel';

export const metadata: Metadata = {
  title: 'DIGITALNYNE Growth Studio | Digital Marketing Agency in Vizag',
  description: 'DIGITALNYNE Growth Studio helps businesses in Vizag with content creation, video editing, branding, websites, advertising, digital marketing, and lead generation.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'DIGITALNYNE Growth Studio | Digital Marketing Agency in Vizag',
    description: 'Helping businesses in Visakhapatnam grow with content, branding, advertising, and digital marketing.',
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

export default function HomePage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DIGITALNYNE Growth Studio | Digital Marketing Agency in Vizag',
    description: 'DIGITALNYNE Growth Studio helps businesses in Vizag with content creation, video editing, branding, websites, advertising, digital marketing, and lead generation.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    isPartOf: {
      '@type': 'WebSite',
      name: 'DIGITALNYNE Growth Studio',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does DIGITALNYNE offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DIGITALNYNE offers content creation, video editing, branding, website design, advertising, digital marketing, social media management, and lead generation services.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does DIGITALNYNE work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We follow a 4-step process: Understand your business goals, Strategize a tailored plan, Create compelling content and campaigns, and Grow by measuring and optimizing results.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is DIGITALNYNE based?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DIGITALNYNE Growth Studio is based in Visakhapatnam, Andhra Pradesh, India. We serve businesses locally and across India.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      {/* pt-16 on mobile (header h-16) and pt-20 on desktop (header h-20) */}
      <main className="pt-16 lg:pt-20">
        <PromotionalCarousel />
        {/* 20px gap on mobile, 24px on tablet, 32px on desktop between carousel and hero */}
        <div className="mt-5 sm:mt-6 lg:mt-8">
          <HeroSection />
        </div>
        <TrustStrip />
        <ServicesOverview />
        <WhyDigitalNyne />
        <HowWeWork />
        <TestimonialsSection />
        <ConversionSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}