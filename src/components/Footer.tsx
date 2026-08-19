import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const WHATSAPP_NUMBER = '919398461937';
const WHATSAPP_DISPLAY = '+91 79952 91377';
const GOOGLE_BOOKING_URL = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || '';

const serviceLinks = [
  { label: 'Content Creation', href: '/services#content-creation' },
  { label: 'Video Editing', href: '/services#video-editing' },
  { label: 'Digital Presence', href: '/services#digital-presence' },
  { label: 'Branding', href: '/services#branding' },
  { label: 'Advertising', href: '/services#advertising' },
  { label: 'Digital Marketing', href: '/services#digital-marketing' },
  { label: 'Personal Branding', href: '/services#personal-branding' },
  { label: 'Social Media Management', href: '/services#social-media-management' },
  { label: 'Custom Solutions', href: '/services#custom-solutions' },
];

const companyLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Request a Quote', href: '/request-a-quote' },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <AppLogo src="/assets/images/79213-1786009666378.png" size={36} />
              <span className="font-extrabold text-lg tracking-tight text-white">
                DIGITAL<span className="gradient-brand-text">NYNE</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-5 font-medium">
              Growth Studio for businesses in Visakhapatnam and beyond.
            </p>
import { FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa';
<div className="flex gap-3">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/digitalnyne_growth_studio?igsh=dXhzdzdvOTExZ3Ay"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
  >
    <FaInstagram className="text-white text-lg" />
  </a>

  {/* YouTube */}
  <a
    href="https://youtube.com/@digitalnynegrowthstudio?si=YvcfAvwctvynralz"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
  >
    <FaYoutube className="text-white text-lg" />
  </a>

  {/* Email */}
  <a
    href="mailto:hello@digitalnyne.com"
    aria-label="Email"
    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
  >
    <FaEnvelope className="text-white text-lg" />
  </a>
</div>


          {/* Services */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Services</p>
            <ul className="flex flex-col gap-3">
              {serviceLinks?.map((l) => (
                <li key={l?.href}>
                  <Link href={l?.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    {l?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Company</p>
            <ul className="flex flex-col gap-3">
              {companyLinks?.map((l) => (
                <li key={l?.href}>
                  <Link href={l?.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    {l?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Get in Touch</p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello DIGITALNYNE, I would like to enquire about your services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {WHATSAPP_DISPLAY}
              </a>
              <a
                href="mailto:info@digitalnyne.com"
                className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                info@digitalnyne.com
              </a>
              <a
                href="https://www.digitalnyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                www.digitalnyne.com
              </a>
              {GOOGLE_BOOKING_URL ? (
                <a
                  href={GOOGLE_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
                >
                  Book Free Strategy Call
                </a>
              ) : (
                <span className="text-sm font-semibold text-white/40">
                  Book Free Strategy Call
                </span>
              )}
              <p className="text-sm text-white/50 font-medium">Visakhapatnam, Andhra Pradesh</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-xs text-white/30 font-medium">
            &copy; {new Date()?.getFullYear()} DIGITALNYNE Growth Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white/40 hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white/40 hover:text-white/70 transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
