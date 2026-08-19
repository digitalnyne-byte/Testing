'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Ravi Kumar',
    role: 'Owner, Ravi Electronics',
    location: 'Visakhapatnam',
    text: 'DIGITALNYNE transformed our online presence completely. Our Google Business profile now gets consistent enquiries every week. The team is transparent, responsive, and truly understands local businesses.',
    rating: 5,
    service: 'Digital Presence',
    initials: 'RK',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Founder, Bloom Boutique',
    location: 'Vizag',
    text: 'The content creation and social media management by DIGITALNYNE has been a game changer. Our Instagram engagement tripled within the first two months. Highly recommend their monthly packages.',
    rating: 5,
    service: 'Content Creation',
    initials: 'PS',
    color: 'from-green-500 to-emerald-700',
  },
  {
    id: 3,
    name: 'Suresh Reddy',
    role: 'Director, SR Constructions',
    location: 'Visakhapatnam',
    text: 'We needed a professional brand identity and a website that converts. DIGITALNYNE delivered both on time and within budget. The strategy call helped us understand exactly what we needed.',
    rating: 5,
    service: 'Branding & Website',
    initials: 'SR',
    color: 'from-purple-500 to-purple-700',
  },
  {
    id: 4,
    name: 'Ananya Patel',
    role: 'CEO, FreshMart Organics',
    location: 'Vizag',
    text: 'Their lead generation campaigns brought us qualified enquiries from day one. The team is creative, strategic, and always available to discuss progress. Best investment we made this year.',
    rating: 5,
    service: 'Lead Generation',
    initials: 'AP',
    color: 'from-orange-500 to-orange-700',
  },
];

const TESTIMONIAL_INTERVAL_MS = 4000;
const TESTIMONIAL_TRANSITION_MS = 1500;

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, TESTIMONIAL_INTERVAL_MS);
  }, [stopTimer]);

  useEffect(() => {
    if (!paused) {
      startTimer();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [paused, startTimer, stopTimer]);

  const goTo = useCallback((index: number) => {
    setActive(index);
    stopTimer();
    setTimeout(() => {
      startTimer();
    }, TESTIMONIAL_TRANSITION_MS);
  }, [stopTimer, startTimer]);

  return (
    <section
      className="py-20 bg-muted/40"
      aria-label="Customer Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">What Our Clients Say</span>
          <h2 className="text-section-xl font-extrabold text-foreground mb-4">
            Real Stories,{' '}
            <span className="gradient-brand-text">Real Growth</span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-xl mx-auto">
            Businesses across Visakhapatnam trust DIGITALNYNE to help them grow. Here&apos;s what they have to say.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2 font-medium italic">
            * Placeholder testimonials — to be replaced with real client reviews
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {testimonials?.map((t, i) => (
            <button
              key={t?.id}
              onClick={() => goTo(i)}
              className={`text-left bg-card rounded-2xl p-6 shadow-card border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                active === i
                  ? 'border-primary/40 shadow-card-hover scale-[1.02]'
                  : 'border-border hover:shadow-card-hover hover:border-primary/20'
              }`}
              aria-pressed={active === i}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t?.rating })?.map((_, idx) => (
                  <StarIcon key={idx} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4 line-clamp-4">
                &ldquo;{t?.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t?.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-extrabold text-white">{t?.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground leading-tight">{t?.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{t?.role}</p>
                </div>
              </div>

              {/* Service tag */}
              <div className="mt-3">
                <span className="inline-block text-xs font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-full border border-primary/15">
                  {t?.service}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Active testimonial expanded view */}
        <div
          className="bg-foreground rounded-2xl p-8 md:p-10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          style={{ transition: `opacity ${TESTIMONIAL_TRANSITION_MS}ms ease` }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Quote mark */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonials?.[active]?.rating })?.map((_, idx) => (
                  <StarIcon key={idx} />
                ))}
              </div>

              {/* Full quote */}
              <p className="text-white/80 font-medium leading-relaxed text-base md:text-lg mb-6">
                &ldquo;{testimonials?.[active]?.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials?.[active]?.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-sm font-extrabold text-white">{testimonials?.[active]?.initials}</span>
                </div>
                <div>
                  <p className="font-extrabold text-white">{testimonials?.[active]?.name}</p>
                  <p className="text-sm text-white/60 font-medium">{testimonials?.[active]?.role} · {testimonials?.[active]?.location}</p>
                </div>
                <div className="ml-auto hidden sm:block">
                  <span className="inline-block text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                    {testimonials?.[active]?.service}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials?.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  active === i ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
