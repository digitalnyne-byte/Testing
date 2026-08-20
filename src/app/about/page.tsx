import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import BackArrow from '@/components/BackArrow';

export const metadata: Metadata = {
  title: 'About Us | DIGITALNYNE Growth Studio Visakhapatnam',
  description: 'Learn about DIGITALNYNE Growth Studio — a customer-focused digital marketing agency based in Visakhapatnam, Andhra Pradesh. Our mission, vision, values, and team.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/about`,
  },
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/about`,
    title: 'About Us | DIGITALNYNE Growth Studio Visakhapatnam',
    description: 'Learn about DIGITALNYNE Growth Studio — a customer-focused digital marketing agency based in Visakhapatnam, Andhra Pradesh.',
    images: [
      {
        url: '/assets/images/79213-1786009666378.png',
        width: 1200,
        height: 630,
        alt: 'DIGITALNYNE Growth Studio - About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | DIGITALNYNE Growth Studio Visakhapatnam',
    description: 'Learn about DIGITALNYNE Growth Studio — a customer-focused digital marketing agency based in Visakhapatnam, Andhra Pradesh.',
    images: ['/assets/images/79213-1786009666378.png'],
  },
};

const values = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Transparency',
    desc: 'Clear communication and honest reporting at every stage of your project.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: 'Consistency',
    desc: 'Reliable delivery and dependable execution — every time, without excuses.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Creativity',
    desc: 'Fresh ideas backed by strategy — not just aesthetics, but purposeful design.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Customer-First',
    desc: 'Your business goals drive every decision we make — we succeed when you succeed.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Growth-Focused',
    desc: 'Every campaign, piece of content, and strategy is designed to move the needle.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Local Understanding',
    desc: 'Deep roots in Visakhapatnam — we understand the local market, culture, and opportunities.',
  },
];

const steps = [
  { num: '01', title: 'Understand', desc: 'We start by deeply understanding your business, audience, and goals through a focused discovery session.' },
  { num: '02', title: 'Strategize', desc: 'We craft a tailored digital strategy aligned with your objectives and budget.' },
  { num: '03', title: 'Create', desc: 'Our team executes with precision — content, design, campaigns, and more.' },
  { num: '04', title: 'Grow', desc: 'We measure, optimize, and scale what works to deliver consistent, measurable growth.' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <BackArrow />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-foreground pt-32 pb-20 overflow-hidden">
          <div className="blob-primary w-96 h-96 top-0 right-0 opacity-20" />
          <div className="blob-accent w-64 h-64 bottom-0 left-10 opacity-15" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-white/70">About DIGITALNYNE</span>
            </div>
            <h1 className="text-hero-xl font-extrabold text-white mb-6 leading-tight">
              We Are a{' '}
              <span className="gradient-brand-text">Growth Studio</span>{' '}
              Built for Vizag Businesses
            </h1>
            <p className="text-lg text-white/60 leading-relaxed font-medium max-w-2xl mx-auto">
              DIGITALNYNE is a customer-focused digital marketing agency based in Visakhapatnam, Andhra Pradesh. We help businesses build their brand, reach more customers, and grow with confidence.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <h2 className="text-xl font-extrabold text-foreground mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  To empower businesses in Visakhapatnam and beyond with creative, strategy-led digital solutions that generate real, measurable growth — delivered with transparency and care.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h2 className="text-xl font-extrabold text-foreground mb-3">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  To become Vizag&apos;s most trusted growth partner — a studio where every business, regardless of size, gets access to world-class digital marketing expertise and honest guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-20 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">Who We Are</span>
                <h2 className="text-section-xl font-extrabold text-foreground mb-6 leading-tight">
                  A Studio That Puts{' '}
                  <span className="gradient-brand-text">Your Growth First</span>
                </h2>
                <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                  <p>
                    DIGITALNYNE Growth Studio was founded with a simple belief: every business deserves a digital partner that truly understands their goals, communicates clearly, and delivers results that matter.
                  </p>
                  <p>
                    We work with startups, small businesses, and established brands across Visakhapatnam and beyond — helping them build a strong digital presence, create compelling content, run effective advertising campaigns, and generate consistent leads.
                  </p>
                  <p>
                    Whether you need a one-time project or ongoing monthly support, we offer flexible packages designed to fit your budget and ambitions.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Services Offered', value: '9+' },
                  { label: 'Flexible Packages', value: '✓' },
                  { label: 'Based in Vizag', value: '📍' },
                  { label: 'Client-Focused', value: '100%' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-2xl p-6 shadow-card border border-border text-center">
                    <p className="text-3xl font-extrabold gradient-brand-text mb-2">{stat.value}</p>
                    <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">What We Stand For</span>
              <h2 className="text-section-xl font-extrabold text-foreground mb-4">
                Our <span className="gradient-brand-text">Core Values</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-shadow duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {v.icon}
                  </div>
                  <h3 className="text-base font-extrabold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-20 bg-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">Our Process</span>
              <h2 className="text-section-xl font-extrabold text-white mb-4">
                How We <span className="gradient-brand-text">Work</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s) => (
                <div key={s.num} className="relative bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-4xl font-extrabold gradient-brand-text mb-4 leading-none">{s.num}</p>
                  <h3 className="text-base font-extrabold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/60 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder / Team placeholder */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">The People Behind the Work</span>
              <h2 className="text-section-xl font-extrabold text-foreground mb-4">
                Meet the <span className="gradient-brand-text">Team</span>
              </h2>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto">
                A passionate team of strategists, creatives, and digital specialists dedicated to your growth.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
  {[
    {
      name: 'P.Yaswanth',
      role: 'Co-Founder & Creative Director',
      email: 'yaswanth@digitalnyne.com',
      photo: '/assets/images/team-member-1.jpg',
    },
    {
      name: 'AJ Santosh Kumar',
      role: 'Co-Founder & Business Director',
      email: 'ajsantosh@digitalnyne.com',
      photo: '/assets/images/Team_mem_2.jpeg',
    },
    {
      name: 'U.Charishma',
      role: 'Marketing & Growth Lead',
      email: 'charishma@digitalnyne.com',
      photo: '/assets/images/team-member-3.jpg',
    },
    {
      name: 'P.Laya',
      role: 'Technology and Data Lead',
      email: 'laya@digitalnyne.com',
      photo: '/assets/images/team_member_4.jpeg',
    },
  ].map((member) => (
    <div
      key={member.email}
      className="bg-card rounded-2xl p-6 shadow-card border border-border text-center flex flex-col items-center"
    >
      {/* Team Member Photo */}
      <div className="w-36 h-36 rounded-full mx-auto mb-4 overflow-hidden flex-shrink-0">
        <img
          src={member.photo}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Name */}
      <p className="text-sm font-extrabold text-foreground mb-1">
        {member.name}
      </p>

      {/* Role */}
      <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">
        {member.role}
      </p>

      {/* Email Button */}
      <a
        href={`mailto:${member.email}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-accent transition-colors"
        aria-label={`Email ${member.name}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>

        {member.email}
      </a>
    </div>
  ))}
</div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-muted/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-section-xl font-extrabold text-foreground mb-4">
              Ready to <span className="gradient-brand-text">Grow Together?</span>
            </h2>
            <p className="text-muted-foreground font-medium mb-8 text-lg">
              Let&apos;s start with a free strategy consultation — no commitment, just clarity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/request-a-quote" className="btn-primary !py-3.5 !px-8 !text-base">
                Request a Quote
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/contact" className="btn-secondary !py-3.5 !px-8 !text-base">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
