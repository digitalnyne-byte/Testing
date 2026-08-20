'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

function NowAcceptingCard() {
  return (
    <div
      className="
        relative rounded-2xl overflow-hidden
        bg-[#0d1117] border border-white/10
        shadow-[0_8px_32px_rgba(0,207,117,0.12),0_2px_8px_rgba(0,0,0,0.4)]
        p-4 w-full
      "
      style={{ maxWidth: '280px' }}
    >
      {/* Soft green glow behind card */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 bg-accent/20 blur-2xl rounded-full pointer-events-none" />

      {/* Status heading */}
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
        </span>
        <span className="text-xs font-extrabold tracking-widest uppercase text-white">
          NOW ACCEPTING CLIENTS
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-3" />

      {/* Benefits */}
      <ul className="flex flex-col gap-2 mb-4">
        {[
          'Free strategy consultation',
          'Custom solutions for Vizag businesses',
          'One-time and monthly packages',
        ].map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            {/* Green circular check icon */}
            <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6l3 3 5-5" stroke="#00CF75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-xs font-medium text-white/75 leading-snug">{benefit}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        href="/request-a-quote"
        className="
          group relative block w-full text-center
          rounded-xl py-2.5 px-4
          text-xs font-bold text-white tracking-wide
          gradient-brand
          transition-all duration-200
          hover:opacity-90 hover:shadow-[0_4px_16px_rgba(7,88,249,0.4)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]
        "
      >
        Request a Quote
        <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = heroRef.current?.querySelectorAll('.hero-animate');
    elements?.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 0.12}s`;
      el.classList.add('fade-in-up');
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex items-center overflow-hidden bg-foreground"
      aria-label="Hero">
      
      {/* Background blobs */}
      <div className="blob-primary w-96 h-96 top-0 left-0 opacity-30" />
      <div className="blob-accent w-80 h-80 bottom-20 right-10 opacity-20" />
      <div className="blob-primary w-64 h-64 top-1/2 right-1/3 opacity-15" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      {/* Desktop: Now Accepting Clients card — top-right, below nav */}
      <div className="hidden lg:block absolute top-24 right-6 xl:right-10 z-20">
        <NowAcceptingCard />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Eyebrow */}
            <div className="hero-animate opacity-0 flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/70">DIGITALNYNE Growth Studio</span>
              </div>
            </div>

            {/* H1 */}
            <h1 className="hero-animate opacity-0 text-hero-xl font-extrabold text-white mb-6 leading-tight">
              Build Your Brand.{' '}
              <span className="gradient-brand-text">Reach More Customers.</span>{' '}
              Grow with Confidence.
            </h1>

            {/* Sub */}
            <p className="hero-animate opacity-0 text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-xl font-medium">
              DIGITALNYNE Growth Studio helps businesses strengthen their digital presence, create compelling content, run effective advertising campaigns, and generate measurable growth.
            </p>

            {/* CTAs */}
            <div className="hero-animate opacity-0 flex flex-wrap gap-3 mb-6">
              <Link href="/request-a-quote" className="btn-primary !py-3.5 !px-7 !text-base">
                Request a Quote
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || 'https://calendar.app.google/22GGnqKDoMrHeT6FA' || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !py-3.5 !px-7 !text-base !bg-white/10 !border-white/30 !text-white hover:!bg-white/20">
                Book Free Strategy Call
              </a>
            </div>

            {/* WhatsApp link */}
            <div className="hero-animate opacity-0">
              <a
                href="https://wa.me/919398461937?text=Hello%20DIGITALNYNE%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-bold text-white bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 hover:border-[#25D366]/80 px-4 py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_12px_rgba(37,211,102,0.15)] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Prefer WhatsApp? Chat with our team →
              </a>
            </div>
          </div>

          {/* Right: Visual Treatment */}
          <div className="hero-animate opacity-0 relative flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full gradient-brand opacity-10 blur-3xl" />
            </div>

            {/* Main card */}
            <div className="relative w-full max-w-md">
              {/* Hero visual card */}
              <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm p-1">
                <div className="rounded-xl overflow-hidden aspect-[4/3]">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_14ceff9ba-1767737281645.png"
                    alt="Digital marketing strategy dashboard with growth charts and analytics on dark background"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-full object-cover opacity-70" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                </div>

                {/* Overlay stat cards */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <p className="text-white/60 text-xs font-medium mb-1">Strategy-Led</p>
                    <p className="text-white font-bold text-sm">Growth Solutions</p>
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <p className="text-accent font-bold text-lg">100%</p>
                    <p className="text-white/60 text-xs font-medium">Transparent</p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 gradient-brand rounded-xl p-3 shadow-xl float-animation">
                <div className="text-center">
                  <p className="text-white font-extrabold text-xs">VIZAG&apos;S</p>
                  <p className="text-white/80 text-xs font-medium">Growth Studio</p>
                </div>
              </div>

              {/* Logo badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-2 shadow-xl">
                <AppImage
                  src="/assets/images/79213-1786009666378.png"
                  alt="DIGITALNYNE logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain" />
                
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Now Accepting Clients card — below hero content */}
        <div className="lg:hidden mt-10 flex justify-center">
          <div className="w-full max-w-sm">
            <NowAcceptingCard />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F6F8FB" />
        </svg>
      </div>
    </section>);

}