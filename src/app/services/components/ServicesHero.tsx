import React from 'react';
import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section className="relative bg-foreground pt-32 pb-20 overflow-hidden" aria-label="Services hero">
      <div className="blob-primary w-96 h-96 top-0 left-0 opacity-20" />
      <div className="blob-accent w-64 h-64 bottom-0 right-10 opacity-15" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest mb-6">
          Our Services
        </span>
        <h1 className="text-hero-xl font-extrabold text-white mb-5">
          Digital Services Built for{' '}
          <span className="gradient-brand-text">Real Business Growth</span>
        </h1>
        <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
          From content creation to advertising campaigns: every service we offer is designed to help your business grow its digital presence, attract more customers, and generate revenue.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/request-a-quote" className="btn-primary">
            Request a Quote
          </Link>
          <a
            href={`https://calendly.com/${process.env.NEXT_PUBLIC_BOOKING_URL || 'TO-BE-CONFIGURED'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !bg-white/10 !border-white/30 !text-white hover:!bg-white/20"
          >
            Book Free Strategy Call
          </a>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#F6F8FB" />
        </svg>
      </div>
    </section>
  );
}