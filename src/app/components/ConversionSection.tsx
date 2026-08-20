'use client';
import React from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

const GOOGLE_BOOKING_URL = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || 'https://calendar.app.google/22GGnqKDoMrHeT6FA' || '';

function StrategyCallCard() {
  const handleBookingClick = () => {
    trackEvent('strategy_call_clicked', { source: 'conversion_section' });
    if (GOOGLE_BOOKING_URL) {
      window.open(GOOGLE_BOOKING_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="group bg-foreground rounded-2xl border-2 border-primary p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col relative overflow-hidden">
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent text-white text-xs font-bold">
        FREE
      </div>
      <div className="blob-primary w-32 h-32 top-0 right-0 opacity-20" />
      <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mb-5 group-hover:scale-110 transition-transform relative z-10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
      </div>
      <h3 className="text-xl font-extrabold text-white mb-2 relative z-10">Book a Free Strategy Call</h3>
      <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1 font-medium relative z-10">
        Schedule a 30-minute strategy call via Google Meet. We&apos;ll discuss your business goals and suggest the right growth approach.
      </p>
      {GOOGLE_BOOKING_URL ? (
        <button
          type="button"
          onClick={handleBookingClick}
          className="btn-primary w-full justify-center relative z-10"
        >
          Book Free Call
        </button>
      ) : (
        <span className="btn-primary w-full justify-center relative z-10 opacity-60 cursor-not-allowed text-center block">
          Book Free Call
        </span>
      )}
    </div>
  );
}

export default function ConversionSection() {
  return (
    <section id="get-started" className="py-20 bg-white" aria-labelledby="conversion-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Get Started
          </span>
          <h2 id="conversion-heading" className="text-section-xl font-extrabold text-foreground mb-4">
            Choose How You&apos;d Like to{' '}
            <span className="gradient-brand-text">Connect With Us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
            Three easy ways to start your growth journey with DIGITALNYNE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp */}
          <div className="group bg-background rounded-2xl border-2 border-[#25D366]/30 hover:border-[#25D366] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-foreground mb-2">Chat on WhatsApp</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 font-medium">
              Prefer a quick conversation? Message us on WhatsApp and get a response from our team within business hours.
            </p>
            <a
              href="https://wa.me/919398461937"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center"
              onClick={() => trackEvent('whatsapp_clicked', { source: 'conversion_section' })}
            >
              Open WhatsApp
            </a>
          </div>

          {/* Strategy Call */}
          <StrategyCallCard />

          {/* Quote */}
          <div className="group bg-background rounded-2xl border-2 border-primary/30 hover:border-primary p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            </div>
            <h3 className="text-xl font-extrabold text-foreground mb-2">Request a Custom Quote</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 font-medium">
              Fill in our detailed quote form with your requirements and budget. We&apos;ll prepare a tailored proposal for your business.
            </p>
            <Link href="/request-a-quote" className="btn-primary w-full justify-center">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}