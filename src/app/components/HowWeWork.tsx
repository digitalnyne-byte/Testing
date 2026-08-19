'use client';
import React, { useEffect, useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Understand',
    desc: 'We start by learning about your business, audience, goals, and current digital footprint through a focused discovery session.',
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Strategize',
    desc: "We build a custom growth plan with clear objectives, timelines, service mix, and measurable outcomes. No guesswork.",
    icon: '🧠',
  },
  {
    number: '03',
    title: 'Create',
    desc: 'Our team executes the strategy — creating content, building assets, launching campaigns, and setting up systems.',
    icon: '⚙️',
  },
  {
    number: '04',
    title: 'Grow',
    desc: 'We monitor performance, optimize continuously, and report transparently so your business keeps growing month after month.',
    icon: '📈',
  },
];

export default function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.step-animate');
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('fade-in-up'), i * 120);
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
    <section ref={sectionRef} id="how-we-work" className="py-20 bg-background" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
            How We Work
          </span>
          <h2 id="process-heading" className="text-section-xl font-extrabold text-foreground mb-4">
            A Simple, Proven{' '}
            <span className="gradient-brand-text">4-Step Process</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
            From first conversation to measurable results: here&apos;s how we take your business forward.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps?.map((step, i) => (
            <div
              key={i}
              className="step-animate opacity-100 relative bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              {/* Connector line (desktop) */}
              {i < steps?.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+0px)] w-6 z-10">
                  <div className="h-0.5 w-full gradient-brand opacity-30" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent opacity-50" />
                </div>
              )}

              {/* Step number */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-extrabold gradient-brand-text opacity-30">{step?.number}</span>
                <div className="icon-gradient w-10 h-10">
                  <span className="text-base">{step?.icon}</span>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-foreground mb-3">{step?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{step?.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}