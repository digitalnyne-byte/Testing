'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const services = [
  {
    icon: '✍️',
    title: 'Content Creation & Video Editing',
    desc: 'Social media content, captions, blogs, website copy, advertising scripts, Instagram Reels, YouTube Shorts, and promotional videos that engage and captivate your audience.',
    href: '/services#content-creation',
  },
  {
    icon: '🌐',
    title: 'Digital Presence',
    desc: 'Business websites, Google Business Profile, local SEO, and social media setup to grow your visibility.',
    href: '/services#digital-presence',
  },
  {
    icon: '🎨',
    title: 'Branding',
    desc: 'Logo design, brand identity, brochures, and marketing collateral that make your business memorable.',
    href: '/services#branding',
  },
  {
    icon: '🎯',
    title: 'Sales & Lead Generation',
    desc: 'Lead campaigns, sales funnels, CRM setup, and landing pages designed to convert prospects into customers.',
    href: '/services#lead-generation',
  },
  {
    icon: '📢',
    title: 'Advertising',
    desc: 'Google Ads, Meta Ads, Instagram Ads, and remarketing campaigns optimized for maximum ROI.',
    href: '/services#advertising',
  },
  {
    icon: '📊',
    title: 'Digital Marketing',
    desc: 'Social media management, email marketing, SEO, and monthly marketing support for consistent growth.',
    href: '/services#digital-marketing',
  },
  {
    icon: '🌟',
    title: 'Personal Branding',
    desc: 'Build a powerful personal brand with curated content strategy, professional profiles, thought leadership, and a consistent online presence that sets you apart.',
    href: '/services#personal-branding',
  },
  {
    icon: '📱',
    title: 'Social Media Management',
    desc: 'Strategy, content planning, scheduling, community engagement, and monthly performance reporting to build a consistent and engaging social media presence.',
    href: '/services#social-media-management',
  },
  {
    icon: '⚡',
    title: 'Custom Solutions',
    desc: "Have a unique requirement? We build tailored digital solutions that don't fit standard categories.",
    href: '/services#custom-solutions',
  },
];

export default function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-animate');
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add('fade-in-up');
              }, i * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="services-overview" className="py-20 bg-background" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Our Services
          </span>
          <h2 id="services-heading" className="text-section-xl font-extrabold text-foreground mb-4">
            Everything Your Business Needs to{' '}
            <span className="gradient-brand-text">Grow Online</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            From content to campaigns, branding to websites: we provide end-to-end digital marketing solutions tailored for businesses in Vizag and beyond.
          </p>
        </div>

        {/* Grid: 9 cards — 3+3+3 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {services?.map((s, i) => (
            <div key={i} className="service-animate opacity-100 service-card group">
              <div className="icon-gradient mb-4">
                <span className="text-xl">{s?.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-medium">{s?.desc}</p>
              <div className="flex items-center gap-3 mt-auto">
                <Link
                  href={s?.href}
                  className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
                <Link
                  href="/request-a-quote"
                  className="ml-auto text-xs font-bold text-muted-foreground hover:text-primary transition-colors border border-border hover:border-primary rounded-lg px-3 py-1.5"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/services" className="btn-primary">
            View All Services
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}