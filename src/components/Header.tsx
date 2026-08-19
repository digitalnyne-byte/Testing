'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { trackEvent } from '@/lib/analytics';

const GOOGLE_BOOKING_URL = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || '';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Request a Quote', href: '/request-a-quote' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleBookingClick = () => {
    trackEvent('strategy_call_clicked', { source: 'header' });
    if (GOOGLE_BOOKING_URL) {
      window.open(GOOGLE_BOOKING_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-white/90 backdrop-blur-sm shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop header row */}
          <div className="hidden lg:flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="DIGITALNYNE — Go to Home">
              <AppLogo
                src="/assets/images/79213-1786009666378.png"
                size={36}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                DIGITAL<span className="gradient-brand-text">NYNE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="flex items-center gap-8">
              {navLinks?.slice(0, 4)?.map((link) => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  className="nav-link-underline text-sm font-600 text-muted-foreground hover:text-foreground transition-colors duration-200 font-semibold"
                >
                  {link?.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="flex items-center gap-3">
              {GOOGLE_BOOKING_URL ? (
                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="btn-secondary !py-2.5 !px-5 !text-sm"
                >
                  Book Free Strategy Call
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="btn-secondary !py-2.5 !px-5 !text-sm opacity-60 cursor-not-allowed"
                  title="Google Calendar booking URL is TO BE CONFIGURED."
                  disabled
                >
                  Book Free Strategy Call
                </button>
              )}
              <Link href="/request-a-quote" className="btn-primary !py-2.5 !px-5 !text-sm">
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Mobile header row — 64px tall, centred brand, hamburger on right */}
          <div className="lg:hidden relative flex items-center h-16">
            {/* Centred brand — absolutely positioned so it stays mathematically centred
                regardless of the hamburger button width */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
              aria-label="DIGITALNYNE — Go to Home"
            >
              <AppLogo
                src="/assets/images/79213-1786009666378.png"
                size={28}
                className="transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
              />
              <span className="font-extrabold text-base tracking-tight text-foreground whitespace-nowrap">
                DIGITAL<span className="gradient-brand-text">NYNE</span>
              </span>
            </Link>

            {/* Hamburger — pushed to the right via ml-auto */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-auto flex flex-col justify-center items-center w-11 h-11 gap-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
            >
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu-panel"
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <AppLogo src="/assets/images/79213-1786009666378.png" size={32} />
            <span className="font-extrabold text-base tracking-tight">
              DIGITAL<span className="gradient-brand-text">NYNE</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1 flex-1">
          {navLinks?.map((link) => (
            <Link
              key={link?.href}
              href={link?.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              {link?.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-3">
          {GOOGLE_BOOKING_URL ? (
            <button
              type="button"
              onClick={() => { setMobileOpen(false); handleBookingClick(); }}
              className="btn-secondary w-full text-center !py-3"
            >
              Book Free Strategy Call
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="btn-secondary w-full text-center !py-3 opacity-60 cursor-not-allowed"
              title="Google Calendar booking URL is TO BE CONFIGURED."
            >
              Book Free Strategy Call
            </button>
          )}
          <Link
            href="/request-a-quote"
            className="btn-primary w-full text-center !py-3"
            onClick={() => setMobileOpen(false)}
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </>
  );
}