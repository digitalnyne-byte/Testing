'use client';
import React, { useState } from 'react';

const faqs = [
  {
    q: 'What types of businesses do you work with?',
    a: 'We work with businesses of all sizes, from local shops and startups to established companies in Visakhapatnam and across India. Our services are adaptable to any industry including retail, food, healthcare, real estate, education, and professional services.',
  },
  {
    q: 'Can I select multiple services?',
    a: 'Absolutely. Many of our clients choose a combination of services such as branding + content creation, or advertising + landing pages. We offer bundled solutions and can design a custom package based on your specific needs.',
  },
  {
    q: 'Do you provide one-time and monthly packages?',
    a: 'Yes. We offer both one-time project-based services (like logo design or website development) and ongoing monthly retainer packages (like social media management or digital marketing). You can choose based on your requirement and budget.',
  },
  {
    q: 'How long does a project take?',
    a: 'Project timelines vary based on scope. A logo design might take 5–7 business days, while a full website could take 3–6 weeks. Monthly services run on agreed delivery schedules. We provide a clear timeline before starting any project.',
  },
  {
    q: 'Do you work only with businesses in Vizag?',
    a: "While we're based in Visakhapatnam and understand the local market well, we work with clients across India. Our digital services are location-independent, so we can collaborate with your business from anywhere.",
  },
  {
    q: 'How do I receive a quotation?',
    a: 'You can fill in our Request a Quote form with your requirements. We review your submission and send a detailed proposal within 1 to 2 business days. Alternatively, you can book a free strategy call or message us on WhatsApp.',
  },
  {
    q: 'Can I schedule an initial consultation?',
    a: "Yes! We offer a free 30-minute strategy call via Google Meet. You can book a slot using our online scheduling system. This call is completely free with no obligation. It's simply a chance to understand your business and see if we're the right fit.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-background" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            FAQ
          </span>
          <h2 id="faq-heading" className="text-section-xl font-extrabold text-foreground mb-4">
            Frequently Asked{' '}
            <span className="gradient-brand-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Answers to common questions about working with DIGITALNYNE.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs?.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
                aria-expanded={openIndex === i}
              >
                <span className="font-bold text-foreground text-sm sm:text-base pr-2">{faq?.q}</span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center transition-all duration-300 ${
                    openIndex === i ? 'gradient-brand border-transparent' : ''
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={openIndex === i ? 'white' : 'currentColor'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={`transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium border-t border-border pt-4">{faq?.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}