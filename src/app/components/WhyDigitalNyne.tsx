'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const reasons = [
  {
    icon: '🧩',
    title: 'Solutions Customized for Each Business',
    desc: 'We never use cookie-cutter strategies. Every plan is built around your specific business goals, industry, and target audience.',
  },
  {
    icon: '🔍',
    title: 'Clear Communication & Transparent Processes',
    desc: "You always know what we're working on, why we're doing it, and what results to expect. No surprises.",
  },
  {
    icon: '💡',
    title: 'Creative Ideas Supported by Strategy',
    desc: 'Our creative output is always backed by research and strategic thinking, not just aesthetics.',
  },
  {
    icon: '📍',
    title: 'Local Understanding with a Growth Focus',
    desc: 'Based in Visakhapatnam, we understand the local market deeply while applying proven digital growth frameworks.',
  },
  {
    icon: '🔄',
    title: 'Flexible One-Time and Monthly Options',
    desc: 'Whether you need a one-time project or ongoing monthly support, we have service options to match your needs.',
  },
];

export default function WhyDigitalNyne() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.why-animate');
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('fade-in-up'), i * 100);
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
    <section ref={sectionRef} id="why-us" className="py-20 bg-white" aria-labelledby="why-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="why-animate opacity-100">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Why DIGITALNYNE
            </span>
            <h2 id="why-heading" className="text-section-xl font-extrabold text-foreground mb-6">
              A Growth Partner,{' '}
              <span className="gradient-brand-text">Not Just an Agency</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-medium">
              We work as an extension of your team, understanding your business deeply before recommending any strategy. Our goal is your growth, not just billing hours.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { value: '9+', label: 'Service Categories' },
                { value: '100%', label: 'Transparent Pricing' },
                { value: 'Vizag', label: 'Local Expertise' },
                { value: '2-Way', label: 'Communication' },
              ]?.map((stat, i) => (
                <div key={i} className="bg-background rounded-xl p-4 border border-border">
                  <p className="text-2xl font-extrabold gradient-brand-text mb-1">{stat?.value}</p>
                  <p className="text-sm font-semibold text-muted-foreground">{stat?.label}</p>
                </div>
              ))}
            </div>

            <Link href="/request-a-quote" className="btn-primary">
              Start Your Growth Journey
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Right: Reasons */}
          <div className="flex flex-col gap-4">
            {reasons?.map((r, i) => (
              <div
                key={i}
                className="why-animate opacity-100 flex items-start gap-4 p-5 rounded-xl bg-background border border-border hover:border-primary hover:shadow-card transition-all duration-300"
              >
                <div className="icon-gradient flex-shrink-0">
                  <span className="text-lg">{r?.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">{r?.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{r?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}