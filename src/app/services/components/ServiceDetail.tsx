'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface ServiceData {
  id: string;
  icon: string;
  title: string;
  problem: string;
  description: string;
  deliverables: string[];
  suitableFor: string[];
  whatsappMsg: string;
}

const services: ServiceData[] = [
  {
    id: 'content-creation',
    icon: '✍️',
    title: 'Content Creation',
    problem: 'Struggling to produce consistent, engaging content that resonates with your audience?',
    description: 'We create high-quality written and visual content tailored to your brand voice and business goals. From daily social media posts to long-form blogs and product descriptions, every piece is crafted to attract, engage, and convert your target audience.',
    deliverables: ['Social media content calendar', 'Instagram & Facebook captions', 'Blog articles (SEO-optimized)', 'Website content & landing page copy', 'Product descriptions', 'Advertising scripts & ad copy'],
    suitableFor: ['E-commerce brands', 'Service businesses', 'Startups', 'Local businesses', 'Personal brands'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Content Creation services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'video-editing',
    icon: '🎬',
    title: 'Video Editing',
    problem: "You have raw video footage but lack the time or skills to turn it into polished content that performs on social media.",
    description: 'Our video editing team transforms your raw footage into compelling, platform-optimized video content. Whether it\'s a 30-second Reel or a 10-minute YouTube video, we ensure every frame serves your brand.',
    deliverables: ['Instagram Reels & Stories', 'YouTube Shorts & long-form videos', 'Promotional & product videos', 'Corporate & event videos', 'Advertisement editing', 'Captions, subtitles & motion graphics'],
    suitableFor: ['Content creators', 'Restaurants & food brands', 'Real estate businesses', 'Educational institutes', 'Event companies'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Video Editing services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'digital-presence',
    icon: '🌐',
    title: 'Digital Presence',
    problem: 'Customers are searching for your business online but cannot find you, or what they find does not represent you well.',
    description: 'We establish and strengthen your complete online presence, from building a professional website to optimizing your Google Business Profile and setting up social media accounts that attract local customers.',
    deliverables: ['Professional business website', 'Google Business Profile setup & optimization', 'Local SEO setup', 'Social media profile creation & optimization', 'Online reputation management', 'Directory listings'],
    suitableFor: ['New businesses', 'Local service providers', 'Retail stores', 'Healthcare providers', 'Restaurants & hospitality'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Digital Presence services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'branding',
    icon: '🎨',
    title: 'Branding',
    problem: "Your business lacks a consistent visual identity that communicates professionalism and builds trust.",
    description: "We design cohesive brand identities that tell your business's story visually. From your logo to your marketing materials, every element is crafted to create a strong, memorable impression.",
    deliverables: ['Logo design (primary + variations)', 'Brand identity guide', 'Business cards & stationery', 'Brochures & flyers', 'Social media templates', 'Marketing collateral design'],
    suitableFor: ['New businesses needing a brand', 'Businesses rebranding', 'Startups raising funding', 'Professional service firms', 'Product companies'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Branding services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'lead-generation',
    icon: '🎯',
    title: 'Sales & Lead Generation',
    problem: 'You have a product or service but struggle to consistently generate qualified leads and convert them into customers.',
    description: 'We build end-to-end lead generation systems that attract, capture, and nurture potential customers, so your sales pipeline stays full and your team focuses on closing deals.',
    deliverables: ['Lead generation campaign setup', 'Sales funnel design & build', 'Landing page creation', 'CRM setup & configuration', 'Lead capture forms & automation', 'Outreach support'],
    suitableFor: ['B2B service companies', 'Real estate businesses', 'Financial advisors', 'EdTech companies', 'Healthcare clinics'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Sales and Lead Generation services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'advertising',
    icon: '📢',
    title: 'Advertising',
    problem: 'Your paid advertising budget is being spent without generating enough leads, sales, or measurable returns.',
    description: "We plan, launch, and optimize paid advertising campaigns across Google and Meta platforms. Every campaign is built around your business objectives: generating leads, driving website traffic, or increasing sales.",
    deliverables: ['Google Search & Display Ads', 'Meta (Facebook & Instagram) Ads', 'Remarketing campaigns', 'Campaign strategy & creative', 'A/B testing & optimization', 'Monthly performance reports'],
    suitableFor: ['E-commerce businesses', 'Local service providers', 'Event organizers', 'Real estate companies', 'Healthcare & education'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Advertising (Google/Meta) services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'digital-marketing',
    icon: '📊',
    title: 'Digital Marketing',
    problem: "You need a consistent, comprehensive digital marketing effort but don't have the time or expertise to manage it in-house.",
    description: 'Our monthly digital marketing service gives your business a dedicated growth team. We handle everything from social media management and SEO to email marketing and campaign strategy, consistently, every month.',
    deliverables: ['Social media management (posts, stories, reels)', 'Monthly content calendar', 'Search engine optimization (on-page & local)', 'Email marketing campaigns', 'Campaign strategy & planning', 'Monthly performance report'],
    suitableFor: ['Growing businesses', 'Businesses without an in-house marketing team', 'E-commerce stores', 'Service companies', 'Franchises'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Digital Marketing services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'personal-branding',
    icon: '🌟',
    title: 'Personal Branding',
    problem: 'You have expertise and value to offer but struggle to communicate it consistently online and stand out in your field.',
    description: 'We help professionals, founders, and creators build a powerful personal brand with curated content strategy, professional profiles, thought leadership content, and a consistent online presence that sets you apart.',
    deliverables: ['Personal brand strategy', 'LinkedIn profile optimization', 'Content calendar & posting plan', 'Thought leadership articles', 'Professional bio & headshot guidance', 'Instagram & social media presence'],
    suitableFor: ['Founders & entrepreneurs', 'Consultants & coaches', 'Doctors & healthcare professionals', 'Lawyers & professionals', 'Content creators'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Personal Branding services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'social-media-management',
    icon: '📱',
    title: 'Social Media Management',
    problem: 'Your social media accounts are inconsistent, inactive, or not generating meaningful engagement with your target audience.',
    description: 'Build a consistent and engaging social media presence with strategy, content planning, publishing, community engagement, and performance monitoring tailored to your brand and audience.',
    deliverables: ['Social media strategy', 'Monthly content planning', 'Content calendar creation', 'Post scheduling and publishing', 'Caption and hashtag support', 'Community engagement', 'Account monitoring', 'Performance tracking and monthly reporting'],
    suitableFor: ['Small and medium businesses', 'Retail & e-commerce brands', 'Restaurants & hospitality', 'Healthcare & wellness', 'Professional service firms'],
    whatsappMsg: 'Hello DIGITALNYNE, I am interested in Social Media Management services. My business name is ________. I would like to discuss my requirements.',
  },
  {
    id: 'custom-solutions',
    icon: '⚡',
    title: 'Custom Solutions',
    problem: 'Your requirement is unique and doesn\'t fit neatly into standard service categories.',
    description: "We love complex, non-standard challenges. If you have a specific digital requirement that doesn't fit our listed services, tell us about it. We'll evaluate your needs and propose a tailored solution.",
    deliverables: ['Requirement analysis & consultation', 'Custom proposal & timeline', 'Dedicated project team', 'Clear milestone-based delivery', 'Post-project support'],
    suitableFor: ['Businesses with unique needs', 'Companies requiring integrated solutions', 'Enterprises with specific workflows', 'Non-profits & community organizations'],
    whatsappMsg: 'Hello DIGITALNYNE, I have a custom digital requirement. My business name is ________. I would like to discuss my unique needs.',
  },
];

export default function ServiceDetail() {
  const [activeService, setActiveService] = useState<string>('content-creation');

  return (
    <section className="py-16 bg-background" aria-label="Service details">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Nav Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveService(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeService === s.id
                  ? 'gradient-brand text-white border-transparent shadow-md'
                  : 'bg-white text-muted-foreground border-border hover:border-primary hover:text-primary'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Service Detail Panel */}
        {services.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className={activeService === s.id ? 'block' : 'hidden'}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left */}
              <div>
                <div className="icon-gradient w-14 h-14 mb-5">
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h2 className="text-section-xl font-extrabold text-foreground mb-4">{s.title}</h2>

                {/* Problem */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-sm font-bold text-amber-800 mb-1">The Challenge</p>
                  <p className="text-sm text-amber-700 font-medium">{s.problem}</p>
                </div>

                <p className="text-muted-foreground text-base leading-relaxed mb-8 font-medium">{s.description}</p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link href="/request-a-quote" className="btn-primary">
                    Request a Quote
                  </Link>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=${encodeURIComponent(s.whatsappMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    Enquire on WhatsApp
                  </a>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-6">
                {/* Deliverables */}
                <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
                  <h3 className="text-base font-extrabold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    Typical Deliverables
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {s.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground font-medium">
                        <svg className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suitable For */}
                <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
                  <h3 className="text-base font-extrabold text-foreground mb-4">Suitable For</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.suitableFor.map((type, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-white border border-primary/20 text-xs font-semibold text-primary"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}