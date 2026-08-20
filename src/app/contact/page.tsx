'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import BackArrow from '@/components/BackArrow';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';
import { FaInstagram, FaYoutube, FaEnvelope, FaFacebook } from 'react-icons/fa';

const WHATSAPP_NUMBER = '919398461937';
const WHATSAPP_DISPLAY = '+919398461937';
const GOOGLE_BOOKING_URL = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || '';

function GlowingWhatsAppIcon() {
  return (
    <span className="relative inline-flex items-center justify-center">
      <span className="absolute w-14 h-14 rounded-full bg-[#25D366]/20 animate-ping" style={{ animationDuration: '2s' }} />
      <span className="absolute w-10 h-10 rounded-full bg-[#25D366]/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
      <span className="relative z-10 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.6)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </span>
    </span>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [enquiryRef, setEnquiryRef] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double-submit
    setLoading(true);
    setSubmitError('');

    try {
      const supabase = createClient();
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const utmSource = urlParams?.get('utm_source') || null;
      const utmMedium = urlParams?.get('utm_medium') || null;
      const utmCampaign = urlParams?.get('utm_campaign') || null;

      // Generate enquiry reference
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let ref = 'DNC-';
      for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];

      const { error: dbError } = await supabase.from('contact_submissions').insert({
        full_name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
        source_page: '/contact',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

      if (dbError) {
        console.error('Contact submission error:', dbError.message);
        setSubmitError('There was an error sending your message. Please try again.');
        setLoading(false);
        return;
      }

      // Fire GA4 event only after confirmed DB save
      trackEvent('contact_form_submitted');

      setEnquiryRef(ref);

      // Send emails via API route (non-blocking — email failure does not affect success)
      fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNumber: ref,
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          utmSource: utmSource || '',
          utmMedium: utmMedium || '',
          utmCampaign: utmCampaign || '',
        }),
      }).catch((emailErr) => console.error('[contact] Email send error:', emailErr));

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello DIGITALNYNE, I would like to get in touch regarding your services.')}`;

  const handleBookingClick = () => {
    trackEvent('strategy_call_clicked', { source: 'contact_page' });
    if (GOOGLE_BOOKING_URL) {
      window.open(GOOGLE_BOOKING_URL, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_clicked', { source: 'contact_page' });
  };

  return (
    <>
      <Header />
      <BackArrow />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-foreground pt-32 pb-20 overflow-hidden">
          <div className="blob-primary w-80 h-80 top-0 right-0 opacity-20" />
          <div className="blob-accent w-64 h-64 bottom-0 left-10 opacity-15" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-white/70">Get in Touch</span>
            </div>
            <h1 className="text-hero-xl font-extrabold text-white mb-6 leading-tight">
              Let&apos;s Start a{' '}
              <span className="gradient-brand-text">Conversation</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed font-medium max-w-2xl mx-auto">
              Have a question, a project in mind, or just want to explore how we can help? Reach out. We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center gap-3 hover:border-[#25D366]/40"
                aria-label="Chat on WhatsApp"
                onClick={handleWhatsAppClick}
              >
                <GlowingWhatsAppIcon />
                <div>
                  <p className="text-sm font-extrabold text-foreground mb-1">WhatsApp</p>
                  <p className="text-xs text-muted-foreground font-medium">{WHATSAPP_DISPLAY}</p>
                  <p className="text-xs text-[#25D366] font-semibold mt-1">Chat with us</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@digitalnyne.com"
                aria-label="Email DIGITALNYNE at info@digitalnyne.com"
                className="group bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0758F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground mb-1">Email</p>
                  <p className="text-xs text-primary font-semibold">info@digitalnyne.com</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Send us a message</p>
                </div>
              </a>

              {/* Website */}
              <a
                href="https://www.digitalnyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00CF75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground mb-1">Website</p>
                  <p className="text-xs text-accent font-semibold">www.digitalnyne.com</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Visit our website</p>
                </div>
              </a>

              {/* Location */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0758F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground mb-1">Location</p>
                  <p className="text-xs text-muted-foreground font-medium">504, 5th floor, Kotu Empire, VIP Rd, Siripuram, Visakhapatnam,</p>
                  <p className="text-xs text-muted-foreground font-medium">Andhrapradesh, 530003 India</p>
                </div>
              </div>
            </div>

            {/* Main grid: Form + Info */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                  <h2 className="text-xl font-extrabold text-foreground mb-1">Send Us a Message</h2>
                  <p className="text-sm text-muted-foreground font-medium mb-6">We typically respond within 1 business day.</p>

                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00CF75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-extrabold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground font-medium text-sm mb-4">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
                      {enquiryRef && (
                        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/5 border border-primary/20 mb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Enquiry Reference</p>
                            <p className="text-lg font-extrabold text-primary">{enquiryRef}</p>
                          </div>
                        </div>
                      )}
                      <p className="text-muted-foreground font-medium text-sm mb-6">Please save this reference for future communication.</p>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#1ebe5d] transition-colors"
                        onClick={handleWhatsAppClick}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Follow up on WhatsApp
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-xs font-bold text-foreground mb-1.5">Full Name <span className="text-red-500">*</span></label>
                          <input
                            id="name" name="name" type="text" required
                            value={form.name} onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs font-bold text-foreground mb-1.5">Email Address <span className="text-red-500">*</span></label>
                          <input
                            id="email" name="email" type="email" required
                            value={form.email} onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-foreground mb-1.5">Phone Number</label>
                        <input
                          id="phone" name="phone" type="tel"
                          value={form.phone} onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-xs font-bold text-foreground mb-1.5">Subject <span className="text-red-500">*</span></label>
                        <select
                          id="subject" name="subject" required
                          value={form.subject} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Enquiry</option>
                          <option value="services">Services Information</option>
                          <option value="quote">Request a Quote</option>
                          <option value="support">Existing Client Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-xs font-bold text-foreground mb-1.5">Message <span className="text-red-500">*</span></label>
                        <textarea
                          id="message" name="message" required rows={4}
                          value={form.message} onChange={handleChange}
                          placeholder="Tell us how we can help you..."
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                        />
                      </div>
                      {submitError && (
                        <p className="text-red-500 text-sm font-semibold bg-red-50 rounded-xl p-3">{submitError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full !py-3 !text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                            Sending...
                          </span>
                        ) : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Info sidebar */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {/* WhatsApp CTA */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#0d1117] border border-[#25D366]/30 rounded-2xl p-6 flex items-center gap-4 hover:border-[#25D366]/60 transition-all duration-300 shadow-[0_4px_24px_rgba(37,211,102,0.08)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.18)]"
                  aria-label="Chat on WhatsApp"
                  onClick={handleWhatsAppClick}
                >
                  <GlowingWhatsAppIcon />
                  <div>
                    <p className="text-sm font-extrabold text-white mb-0.5">Chat on WhatsApp</p>
                    <p className="text-xs text-white/50 font-medium">Fastest way to reach us</p>
                    <p className="text-xs text-[#25D366] font-semibold mt-1">{WHATSAPP_DISPLAY}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="ml-auto opacity-40 group-hover:opacity-80 transition-opacity">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>

                {/* Book a Call */}
                {GOOGLE_BOOKING_URL ? (
                  <button
                    type="button"
                    onClick={handleBookingClick}
                    className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-foreground mb-0.5">Book a Free Strategy Call</p>
                      <p className="text-xs text-muted-foreground font-medium">Schedule a Google Meet session</p>
                    </div>
                  </button>
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 opacity-60">
                    <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-foreground mb-0.5">Book a Free Strategy Call</p>
                      <p className="text-xs text-muted-foreground font-medium">Google Calendar booking URL is TO BE CONFIGURED.</p>
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-extrabold text-foreground mb-4 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0758F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    {[
                      { day: 'Monday to Saturday', hours: '9:00 AM to 6:00 PM' },   
                      { day: 'Sunday', hours: 'Closed'},
                    ].map((row) => (
                      <div key={row.day} className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">{row.day}</span>
                        <span className="text-foreground font-semibold">{row.hours}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 font-medium">IST (Indian Standard Time)</p>
                </div>

                {/* Social placeholders */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-extrabold text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-3">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/digitalnyne_growth_studio?igsh=dXhzdzdvOTExZ3Ay"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="w-9 h-9 rounded-lg bg-primary hover:bg-accent transition-colors flex items-center justify-center"
  >
    <img
      src="/assets/images/Instagram_icon.png"
      alt="Instagram"
      className="w-9 h-9 object-contain hover:scale-110 transition-transform"
    />
  </a>

  {/* YouTube */}
  <a
    href="https://youtube.com/@digitalnynegrowthstudio?si=YvcfAvwctvynralz"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
    className="w-9 h-9 rounded-lg bg-primary hover:bg-accent transition-colors flex items-center justify-center"
  >
    <img
      src="assets/images/youtube-logo.png"
      alt="Instagram"
      className="w-9 h-9 object-contain hover:scale-110 transition-transform"
    />
  </a>

  {/* Email */}
  <a
    href="mailto:info@digitalnyne.com"
    aria-label="Email"
    className="w-9 h-9 rounded-lg bg-primary hover:bg-accent transition-colors flex items-center justify-center"
  >
    <img
      src="/assets/images/Gmail-logo.png"
      alt="Instagram"
      className="w-9 h-9 object-contain hover:scale-110 transition-transform"
    />
  </a>

  {/* FaceBook*/}
    <a
    href="https://www.facebook.com/share/1DHB7rfiZb/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="FaceBook"
    className="w-9 h-9 rounded-lg bg-primary hover:bg-accent transition-colors flex items-center justify-center"
  >
    <img
      src="/assets/images/Facebook_Logo_.png"
      alt="Instagram"
      className="w-9 h-9 object-contain hover:scale-110 transition-transform"
    />
  </a>
</div>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote CTA */}
        <section className="py-16 bg-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-3">
              Ready to start a project?
            </h2>
            <p className="text-white/60 font-medium mb-6">
              Fill out our detailed quote form and we&apos;ll prepare a tailored proposal within 1 to 2 business days.
            </p>
            <Link href="/request-a-quote" className="btn-primary !py-3.5 !px-8 !text-base">
              Request a Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
