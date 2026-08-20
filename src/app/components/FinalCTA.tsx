'use client';
import React from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

const GOOGLE_BOOKING_URL = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || 'https://calendar.app.google/22GGnqKDoMrHeT6FA' || '';

export default function FinalCTA() {
  const handleBookingClick = () => {
    trackEvent('strategy_call_clicked', { source: 'final_cta' });
    if (GOOGLE_BOOKING_URL) {
      window.open(GOOGLE_BOOKING_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="final-cta" className="py-20 bg-foreground relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="blob-primary w-96 h-96 top-0 left-0 opacity-20" />
      <div className="blob-accent w-80 h-80 bottom-0 right-0 opacity-15" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest mb-6">
          Ready to Grow?
        </span>
        <h2 id="cta-heading" className="text-section-xl font-extrabold text-white mb-5">
          Ready to Grow Your Business?
        </h2>
        <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto font-medium">
          Join businesses in Visakhapatnam that are growing their digital presence with DIGITALNYNE Growth Studio.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/request-a-quote" className="btn-primary !py-4 !px-8 !text-base">
            Request a Quote
          </Link>
          {GOOGLE_BOOKING_URL ? (
            <button
              type="button"
              onClick={handleBookingClick}
              className="btn-secondary !py-4 !px-8 !text-base !bg-white/10 !border-white/30 !text-white hover:!bg-white/20"
            >
              Book Free Strategy Call
            </button>
          ) : (
            <span className="btn-secondary !py-4 !px-8 !text-base !bg-white/10 !border-white/30 !text-white opacity-60 cursor-not-allowed">
              Book Free Strategy Call
            </span>
          )}
          <a
            href="https://wa.me/919398461937"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !py-4 !px-8 !text-base"
            onClick={() => trackEvent('whatsapp_clicked', { source: 'final_cta' })}
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}