'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

interface Slide {
  src: string;
  alt: string;
  promotionName: string;
  destinationService: string;
  href: string;
}

const slides: Slide[] = [
  {
    src: '/assets/images/DIGITALNYNE-carousel-03-free-website-1920x840-1786346076717.png',
    alt: 'Free website offer for new businesses from DIGITALNYNE',
    promotionName: 'Free Website Offer',
    destinationService: 'Digital Presence & Branding',
    href: '/services#branding',
  },
  {
    src: '/assets/images/DIGITALNYNE-carousel-02-1000-offer-1920x840-1786346076719.png',
    alt: 'Try digital marketing starting at ₹1,000 from DIGITALNYNE',
    promotionName: 'Digital Marketing at ₹1,000',
    destinationService: 'Branding',
    href: '/services#branding',
  },
  {
    src: '/assets/images/DIGITALNYNE-carousel-01-personal-branding-logo-1920x840-1786346076748.png',
    alt: 'Personal branding and logo design package from DIGITALNYNE',
    promotionName: 'Personal Branding & Logo',
    destinationService: 'Personal Branding',
    href: '/services#personal-branding',
  },
];

/** Autoplay interval between slides (ms) */
const INTERVAL_MS = 4000;
/** Visual slide-transition duration (ms) — must match the CSS transition below */
const TRANSITION_MS = 1500;

export default function PromotionalCarousel() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Start autoplay only when the carousel is visible in the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    // Reduced-motion: disable autoplay entirely
    if (prefersReducedMotion) return;
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
  }, [prefersReducedMotion, stopTimer]);

  // Run/stop timer based on visibility and paused state
  useEffect(() => {
    if (isVisible && !paused) {
      startTimer();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [isVisible, paused, startTimer, stopTimer]);

  /** Navigate to a specific slide. Resets the autoplay timer so the full
   *  interval elapses before the next automatic advance. */
  const goTo = useCallback((index: number) => {
    setCurrent(index);
    if (!prefersReducedMotion && isVisible && !paused) {
      stopTimer();
      // Delay restarting the timer until after the transition completes so
      // the transition duration is NOT added on top of the interval.
      setTimeout(() => {
        startTimer();
      }, TRANSITION_MS);
    }
  }, [prefersReducedMotion, isVisible, paused, stopTimer, startTimer]);

  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  const handleSlideClick = () => {
    const slide = slides[current];
    trackEvent('promotion_carousel_clicked', {
      promotion_name: slide.promotionName,
      slide_position: current + 1,
      destination_service: slide.destinationService,
    });
    router.push(slide.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSlideClick(); }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next(); else prev();
    }
    touchStartX.current = null;
    // Resume after a brief pause so the slide settles before autoplay restarts
    setTimeout(() => setPaused(false), INTERVAL_MS * 0.5);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full"
      aria-label="Promotional offers"
    >
      <div
        className="relative overflow-hidden shadow-card"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        role="region"
        aria-label={`Promotional carousel, slide ${current + 1} of ${slides.length}`}
      >
        {/* Slides strip */}
        <div
          className="flex"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: prefersReducedMotion ? 'none' : `transform ${TRANSITION_MS}ms ease-in-out`,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-full relative cursor-pointer"
              role="button"
              tabIndex={i === current ? 0 : -1}
              aria-label={`${slide.alt} — click to learn more about ${slide.destinationService}`}
              onClick={i === current ? handleSlideClick : undefined}
              onKeyDown={i === current ? handleKeyDown : undefined}
            >
              {/* 16:7 aspect ratio — matches 1920×840 source images */}
              <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Prev arrow — 36px on mobile, 44px on sm+ */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 sm:w-11 sm:h-11
            rounded-full bg-white/90 border border-border shadow-md
            flex items-center justify-center
            hover:bg-white hover:border-primary
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Next arrow — 36px on mobile, 44px on sm+ */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 sm:w-11 sm:h-11
            rounded-full bg-white/90 border border-border shadow-md
            flex items-center justify-center
            hover:bg-white hover:border-primary
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10" role="tablist" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                i === current
                  ? 'w-6 h-2.5 bg-primary' :'w-2.5 h-2.5 bg-white/60 hover:bg-white/90'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
