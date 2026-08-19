import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | DIGITALNYNE Growth Studio',
  description: 'Privacy Policy for DIGITALNYNE Growth Studio. Learn how we collect, use, store and protect your personal information.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/privacy-policy`,
  },
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/privacy-policy`,
    title: 'Privacy Policy | DIGITALNYNE Growth Studio',
    description: 'Privacy Policy for DIGITALNYNE Growth Studio. Learn how we collect, use, store and protect your personal information.',
    images: [
      {
        url: '/assets/images/79213-1786009666378.png',
        width: 1200,
        height: 630,
        alt: 'DIGITALNYNE Growth Studio - Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | DIGITALNYNE Growth Studio',
    description: 'Privacy Policy for DIGITALNYNE Growth Studio. Learn how we collect, use, store and protect your personal information.',
    images: ['/assets/images/79213-1786009666378.png'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-foreground text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/60 text-sm font-medium">Effective date: 19 August 2026 &nbsp;·&nbsp; Last updated: 19 August 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-slate max-w-none">

          <p className="text-base text-slate-700 leading-relaxed mb-8">
            DIGITALNYNE GROWTH STUDIO respects your privacy and is committed to handling personal information responsibly.
            This Privacy Policy explains how we collect, use, store, disclose and protect information when you visit our website,
            submit an enquiry, request a quotation, book a meeting or purchase services from us.
          </p>

          <Section title="1. About Us">
            <p>For this Privacy Policy, &ldquo;DIGITALNYNE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to:</p>
            <address className="not-italic bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 text-sm text-slate-700">
              <strong>DIGITALNYNE GROWTH STUDIO</strong><br />
              Visakhapatnam, Andhra Pradesh, India<br />
              Email: <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a>
            </address>
            <p>&ldquo;You&rdquo;, &ldquo;your&rdquo;, &ldquo;user&rdquo; and &ldquo;visitor&rdquo; refer to any individual or organisation visiting our website, contacting us or using our services.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>Depending on how you interact with us, we may collect:</p>
            <h4 className="font-bold text-slate-800 mt-4 mb-2">Information provided by you</h4>
            <ul>
              {['Name', 'Email address', 'Phone number', 'Business, company or brand name', 'Services in which you are interested', 'Budget range and expected timeline', 'Project requirements', 'Messages and enquiry details', 'Files, content or brand materials you provide', 'Meeting and appointment information', 'Billing and transaction-related information', 'Communications between you and DIGITALNYNE'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              Please do not submit passwords, financial credentials, government identification numbers, medical information or other sensitive personal information through our general enquiry forms.
            </p>
            <h4 className="font-bold text-slate-800 mt-4 mb-2">Information collected automatically</h4>
            <p>When you visit or interact with our website, we may collect:</p>
            <ul>
              {['Internet Protocol address', 'Browser and device type', 'Operating system', 'Approximate location derived from technical information', 'Pages visited', 'Time spent on the website', 'Referring source and landing page', 'Website interactions', 'Quote-form activity', 'Booking-link clicks', 'UTM source, medium and campaign information', 'Cookie and analytics identifiers', 'Website performance and error information'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="3. How We Collect Information">
            <p>We may collect information when you:</p>
            <ul>
              {['Visit or interact with our website', 'Submit a contact or quotation form', 'Request information about our services', 'Subscribe to a service or promotional offer', 'Book a strategy call or meeting', 'Contact us through email, telephone or social media', 'Enter into a proposal, quotation or service agreement with us', 'Provide feedback or respond to our communications', 'Consent to analytics or marketing communications'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="4. How We Use Information">
            <p>We may use your information to:</p>
            <ul>
              {['Respond to enquiries', 'Understand your requirements', 'Prepare quotations, proposals and service recommendations', 'Schedule and conduct meetings', 'Deliver agreed services', 'Manage client relationships and projects', 'Send enquiry confirmations and transactional communications', 'Process payments and maintain business records', 'Provide customer support', 'Prevent spam, fraud, misuse and security incidents', 'Diagnose technical problems', 'Improve our website, services and visitor experience', 'Measure website and marketing performance', 'Comply with legal, regulatory, tax and accounting obligations', 'Establish, exercise or defend legal claims', 'Send promotional communications when appropriate consent has been provided'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>We will not use your personal information for an unrelated purpose without appropriate notice or consent where required.</p>
          </Section>

          <Section title="5. Consent">
            <p>When you submit an enquiry or request a quotation, you consent to DIGITALNYNE processing the information you provide for reviewing and responding to your request.</p>
            <p>Consent to promotional emails must be collected separately. You must be able to submit an enquiry without agreeing to promotional communications.</p>
            <p>Where processing is based on consent, you may withdraw that consent by emailing <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a>. Withdrawal will not affect processing completed before consent was withdrawn or information that must be retained for lawful purposes.</p>
          </Section>

          <Section title="6. Cookies and Analytics">
            <p>Our website may use cookies, local storage and similar technologies.</p>
            <h4 className="font-bold text-slate-800 mt-4 mb-2">Essential technologies may be used to:</h4>
            <ul>
              {['Operate the website', 'Maintain security', 'Prevent misuse', 'Support forms', 'Remember privacy preferences'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4 className="font-bold text-slate-800 mt-4 mb-2">Subject to applicable consent requirements, analytics technologies may be used to:</h4>
            <ul>
              {['Measure website traffic', 'Understand how visitors use the website', 'Measure campaign performance', 'Improve website content, usability and performance'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>We may use Google Analytics 4 or similar analytics services. These providers may process technical and usage information according to their own privacy policies.</p>
            <p>Where consent is required, non-essential analytics should not be activated until consent is provided. Visitors should be able to accept or reject analytics and change their preferences later.</p>
          </Section>

          <Section title="7. Service Providers">
            <p>We may use third-party providers to operate our website and business, including:</p>
            <ul>
              {['Supabase for database and enquiry storage', 'Resend or another email provider for transactional emails', 'Google Analytics for website analytics', 'Google Calendar and Google Meet for scheduling and meetings', 'Website hosting, domain, security and infrastructure providers', 'Payment processors, if online payments are enabled', 'Professional advisers and authorised contractors'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>These providers may process information only as necessary to provide their services, subject to their applicable terms, privacy policies and contractual obligations.</p>
          </Section>

          <Section title="8. Sharing and Disclosure">
            <p>We do not sell or rent personal information.</p>
            <p>We may disclose information:</p>
            <ul>
              {['To service providers supporting our website and operations', 'To authorised employees, contractors or professional advisers', 'When required by applicable law, legal process or a lawful government request', 'To investigate fraud, misuse or security threats', 'To protect the rights, safety or property of DIGITALNYNE, our clients or others', 'During a merger, restructuring, acquisition or transfer of the business, subject to appropriate safeguards'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>We do not authorise service providers to use personal information for unrelated marketing.</p>
          </Section>

          <Section title="9. International Processing">
            <p>Some of our technology providers may store or process information outside India.</p>
            <p>Where international processing occurs, we will take reasonable steps to use reputable providers and appropriate safeguards, subject to applicable Indian law and any restrictions imposed by the Government of India.</p>
          </Section>

          <Section title="10. Data Retention">
            <p>We retain personal information only for as long as reasonably necessary.</p>
            <p>As a general practice:</p>
            <ul>
              <li>Enquiries that do not become active projects may be retained for up to 12 months after the last meaningful interaction.</li>
              <li>Active client information may be retained throughout the engagement.</li>
              <li>Contracts, invoices, payment records and important communications may be retained as required for legal, accounting and dispute-resolution purposes.</li>
              <li>Analytics information is retained according to the configured settings of the analytics provider.</li>
              <li>Security and fraud-prevention records may be retained for as long as reasonably necessary.</li>
            </ul>
            <p>Information may be retained longer when required by law or necessary to establish, exercise or defend a legal claim.</p>
            <p>When information is no longer required, we will take reasonable steps to delete, anonymise or securely dispose of it.</p>
          </Section>

          <Section title="11. Data Security">
            <p>We use reasonable technical and organisational measures intended to protect personal information. These may include:</p>
            <ul>
              {['Access controls', 'Restricted database permissions', 'Secure server-side processing', 'Input validation', 'Protected credentials', 'Encryption during transmission', 'Authentication controls', 'Monitoring and backup measures', 'Access limited according to operational need'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>No website, database or internet transmission is completely secure. Therefore, we cannot guarantee absolute security.</p>
          </Section>

          <Section title="12. Your Rights and Choices">
            <p>Subject to applicable law, you may request that we:</p>
            <ul>
              {['Confirm whether we hold personal information about you', 'Explain how your information is being used', 'Correct inaccurate or incomplete information', 'Delete information that is no longer required', 'Withdraw consent', 'Stop promotional communications', 'Review a privacy-related complaint or grievance'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Send requests to <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a>.</p>
            <p>We may need to verify your identity before acting on a request. A request may be limited or declined where retention or processing is required or permitted by law.</p>
          </Section>

          <Section title="13. Marketing Communications">
            <p>We will send promotional communications only where consent has been provided or where otherwise permitted by law.</p>
            <p>Promotional emails will include an unsubscribe facility. Transactional communications concerning an enquiry, quotation, booking, payment or active service are not promotional communications.</p>
          </Section>

          <Section title="14. Children's Privacy">
            <p>Our website and services are intended for businesses and individuals who are at least 18 years old.</p>
            <p>We do not knowingly collect personal information from children. If you believe that a child has submitted personal information, contact <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a>.</p>
          </Section>

          <Section title="15. Third-Party Links">
            <p>Our website may contain links to Google services, social media platforms, payment providers and other third-party websites.</p>
            <p>DIGITALNYNE does not control the content, availability, security or privacy practices of third-party websites. You should review their terms and privacy policies before providing information.</p>
          </Section>

          <Section title="16. Business Transfers">
            <p>If DIGITALNYNE undergoes a merger, acquisition, restructuring or transfer of business assets, relevant personal information may be transferred as part of that transaction.</p>
            <p>Where required, reasonable steps will be taken to ensure that the recipient handles the information consistently with this Privacy Policy and applicable law.</p>
          </Section>

          <Section title="17. Legal Disclosure">
            <p>We may disclose information to courts, government authorities, law-enforcement bodies, tax authorities or other legally authorised persons when required by applicable law or a valid legal process.</p>
            <p>We may also disclose information when reasonably necessary to investigate unlawful activity, protect public safety or protect the legal rights of DIGITALNYNE or another person.</p>
          </Section>

          <Section title="18. Changes to This Privacy Policy">
            <p>We may update this Privacy Policy when our services, providers, technology or legal obligations change.</p>
            <p>The revised policy will be published on this page with an updated &ldquo;Last updated&rdquo; date. Where reasonably required, we may provide additional notice of material changes.</p>
          </Section>

          <Section title="19. Contact and Grievances">
            <p>For privacy questions, requests, complaints or grievances, contact:</p>
            <address className="not-italic bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 text-sm text-slate-700">
              <strong>Privacy and Grievance Contact</strong><br />
              DIGITALNYNE GROWTH STUDIO<br />
              Visakhapatnam, Andhra Pradesh, India<br />
              Email: <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a>
            </address>
            <p>We will review privacy grievances within a reasonable period and take appropriate action based on the circumstances and applicable law.</p>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Home
          </Link>
          <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-primary transition-colors">
            View Terms &amp; Conditions →
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-200">{title}</h2>
      <div className="text-slate-700 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-slate-700 [&_p]:text-slate-700">
        {children}
      </div>
    </section>
  );
}
