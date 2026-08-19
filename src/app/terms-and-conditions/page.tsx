import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | DIGITALNYNE Growth Studio',
  description: 'Terms & Conditions for DIGITALNYNE Growth Studio. Read our terms of service, usage policies, and legal agreements.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/terms-and-conditions`,
  },
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/terms-and-conditions`,
    title: 'Terms & Conditions | DIGITALNYNE Growth Studio',
    description: 'Terms & Conditions for DIGITALNYNE Growth Studio. Read our terms of service, usage policies, and legal agreements.',
    images: [
      {
        url: '/assets/images/79213-1786009666378.png',
        width: 1200,
        height: 630,
        alt: 'DIGITALNYNE Growth Studio - Terms & Conditions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | DIGITALNYNE Growth Studio',
    description: 'Terms & Conditions for DIGITALNYNE Growth Studio. Read our terms of service, usage policies, and legal agreements.',
    images: ['/assets/images/79213-1786009666378.png'],
  },
};

export default function TermsAndConditionsPage() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Terms and Conditions</h1>
          <p className="text-white/60 text-sm font-medium">Effective date: 15 August 2026 &nbsp;·&nbsp; Last updated: 15 August 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-slate max-w-none">

          <p className="text-base text-slate-700 leading-relaxed mb-4">
            These Terms and Conditions govern your use of the DIGITALNYNE GROWTH STUDIO website and your purchase or use of our services.
          </p>
          <p className="text-base text-slate-700 leading-relaxed mb-4">For these Terms:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700 mb-6">
            <li>&ldquo;DIGITALNYNE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; mean DIGITALNYNE GROWTH STUDIO, located in Visakhapatnam, Andhra Pradesh, India.</li>
            <li>&ldquo;You&rdquo;, &ldquo;your&rdquo;, &ldquo;user&rdquo;, &ldquo;visitor&rdquo; and &ldquo;client&rdquo; mean any individual or organisation visiting our website, submitting an enquiry, accepting a quotation or purchasing our services.</li>
          </ul>
          <p className="text-base text-slate-700 leading-relaxed mb-4">
            By using our website or purchasing services from us, you agree to these Terms and any applicable quotation, proposal, scope of work or service agreement.
          </p>
          <p className="text-base text-slate-700 leading-relaxed mb-8">
            If a signed proposal or service agreement conflicts with these general Terms, the signed agreement will control for that specific engagement.
          </p>

          <Section title="1. Eligibility">
            <p>You must be at least 18 years old and legally capable of entering into a binding agreement.</p>
            <p>If you act on behalf of a business or organisation, you confirm that you have authority to accept these Terms on its behalf.</p>
          </Section>

          <Section title="2. Our Services">
            <p>DIGITALNYNE may provide services including:</p>
            <ul>
              {['Digital marketing', 'Social media management', 'Content creation', 'Photography and videography', 'Video editing', 'Personal branding', 'Brand strategy and design', 'Website design and development', 'Search engine optimisation', 'Paid advertising', 'Marketing analytics', 'Related digital growth services'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Website descriptions are general. The exact deliverables, fees, timelines, revisions and responsibilities for a project will be stated in the accepted quotation, proposal or service agreement.</p>
          </Section>

          <Section title="3. Website Content">
            <p>The content of our website may be changed without prior notice.</p>
            <p>We take reasonable steps to keep information accurate, but we do not guarantee that every description, price, timeline, example or other item will always be complete, current or error-free.</p>
            <p>Website information is provided for general informational purposes and should not be treated as a guaranteed service outcome.</p>
          </Section>

          <Section title="4. Enquiries and Quotations">
            <p>Submitting a form, contacting us or booking a strategy call does not automatically create a service contract.</p>
            <p>A project begins only after:</p>
            <ul>
              <li>DIGITALNYNE provides written confirmation or a proposal;</li>
              <li>The client accepts the agreed scope and commercial terms; and</li>
              <li>The required advance or initial payment is received.</li>
            </ul>
            <p>Unless stated otherwise, a quotation remains valid for 15 days from its issue date.</p>
            <p>DIGITALNYNE may accept or decline a project based on availability, suitability, legal concerns, conflicts of interest or other reasonable business considerations.</p>
          </Section>

          <Section title="5. Prices and Taxes">
            <p>Prices displayed on the website are indicative unless expressly described as fixed.</p>
            <p>Final pricing depends on the agreed scope, complexity, timeline, deliverables, revisions and third-party requirements.</p>
            <p>Any applicable taxes will be disclosed in the quotation or invoice. We will not collect or represent any tax as payable unless legally applicable.</p>
            <p>Third-party expenses may include:</p>
            <ul>
              {['Advertising spend', 'Domain registration', 'Website hosting', 'Premium software', 'Plugins', 'Stock images or footage', 'Fonts', 'Printing', 'Travel', 'Influencer fees', 'Platform charges'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Unless expressly included in writing, third-party expenses are payable separately by the client.</p>
          </Section>

          <Section title="6. Payments">
            <p>Payment amounts and milestones will be stated in the applicable proposal or invoice.</p>
            <p>Unless otherwise agreed in writing:</p>
            <ul>
              <li>The required advance must be paid before work begins.</li>
              <li>Work may be paused if a payment becomes overdue.</li>
              <li>Final deliverables may be withheld until all outstanding amounts are paid.</li>
              <li>Additional work outside the agreed scope will be quoted or charged separately.</li>
              <li>Bank, payment-gateway and currency-conversion charges are the client&apos;s responsibility.</li>
            </ul>
            <p>Payment of an invoice or advance constitutes acceptance of the corresponding scope and commercial terms.</p>
          </Section>

          <Section title="7. Scope and Revisions">
            <p>Only deliverables expressly included in the accepted quotation or proposal form part of the project.</p>
            <p>The number of included revisions will be specified in the proposal. If the proposal does not state a revision allowance, one reasonable revision round will be included for each applicable deliverable.</p>
            <p>A revision means a reasonable modification to an existing agreed concept. It does not include:</p>
            <ul>
              {['A new concept or direction', 'Work outside the original scope', 'Recreating approved work', 'Changes caused by incomplete or incorrect client instructions', 'Additional pages, videos, designs, campaigns or features'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Additional revisions and scope changes may require additional fees and time.</p>
          </Section>

          <Section title="8. Client Responsibilities">
            <p>The client must provide accurate and timely:</p>
            <ul>
              {['Project instructions', 'Content and copy', 'Logos and brand assets', 'Images, videos and other materials', 'Access credentials', 'Reviews and approvals', 'Payments', 'Information needed to perform the services'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>The client confirms that materials supplied to DIGITALNYNE are legally usable and do not infringe intellectual-property, privacy or other rights.</p>
            <p>Delays in providing materials, approval, access or payment may extend deadlines. DIGITALNYNE will not be responsible for delays caused by the client or a third-party platform.</p>
          </Section>

          <Section title="9. Timelines and Delivery">
            <p>Project timelines are estimates unless expressly guaranteed in writing.</p>
            <p>A delivery date may change because of:</p>
            <ul>
              {['Client delays', 'Scope changes', 'Additional revision requests', 'Third-party platform issues', 'Events outside our reasonable control'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>A deliverable will be considered provided when it is delivered through the agreed email, file-sharing system, website, social platform or other agreed method.</p>
          </Section>

          <Section title="10. Approvals">
            <p>The client is responsible for reviewing deliverables before publication or final approval.</p>
            <p>Once a deliverable is approved or published, further changes may be chargeable.</p>
            <p>If the client does not respond to a review request within 10 business days, DIGITALNYNE may pause the project and revise the delivery schedule.</p>
          </Section>

          <Section title="11. Refund Policy">
            <p>Payments are generally non-refundable because DIGITALNYNE reserves capacity and performs professional work based on the agreed engagement.</p>
            <p>A refund will be considered only when DIGITALNYNE fails to provide a paid service or deliverable expressly included in the accepted written scope and does not remedy that failure within a reasonable period after receiving written notice from the client.</p>
            <p>Any approved refund will be limited to the amount paid for the specific service or deliverable that DIGITALNYNE failed to provide.</p>
            <p>No refund will be provided for:</p>
            <ul>
              {['Work already completed or delivered', 'Work approved or published by the client', 'A change of mind', 'Dissatisfaction based solely on personal preference where the agreed scope was fulfilled', 'Client cancellation after work has begun', 'Delays caused by the client', 'Failure to provide content, access, feedback or approval', 'Rejection or restriction by Google, Meta, Instagram or another third-party platform', 'Results affected by market conditions or platform algorithms', 'Advertising spend', 'Domain, hosting, software, stock assets, plugins or other third-party charges', 'Work performed outside the original scope', 'Suspension caused by overdue payment or a client breach'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Nothing in this clause limits any mandatory right or remedy that cannot lawfully be excluded.</p>
            <p>Refund requests must be submitted in writing to <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a> with the relevant invoice, service and reason for the request.</p>
          </Section>

          <Section title="12. Cancellation">
            <p>A client may request cancellation by writing to <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a>.</p>
            <p>If a project is cancelled:</p>
            <ul>
              <li>The client must pay for work completed up to the cancellation date.</li>
              <li>The advance may be applied to completed work and reserved production capacity.</li>
              <li>Non-refundable third-party costs remain payable.</li>
              <li>Any refund will be governed by the Refund Policy above.</li>
              <li>Completed work will be delivered only after outstanding charges have been paid.</li>
            </ul>
            <p>Subscription services may have additional cancellation or notice requirements stated in the applicable proposal.</p>
          </Section>

          <Section title="13. Intellectual Property">
            <p>Client-provided materials remain the property of the client or their respective owners.</p>
            <p>DIGITALNYNE retains ownership of:</p>
            <ul>
              {['Pre-existing materials', 'Internal methods and processes', 'Reusable templates', 'Tools', 'Frameworks', 'Know-how', 'Unselected concepts', 'Working files not included in the agreed scope'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Unless stated otherwise, ownership of final custom deliverables transfers to the client only after full payment.</p>
            <p>Third-party assets, fonts, plugins, software and stock materials remain subject to their respective licences.</p>
            <p>Editable or source files are included only if expressly stated in the accepted proposal.</p>
          </Section>

          <Section title="14. Portfolio Use">
            <p>Unless confidentiality has been agreed in writing, DIGITALNYNE may identify the client and display completed, publicly released work in its portfolio, website, social media and promotional materials.</p>
            <p>A client may request a written confidentiality arrangement or portfolio restriction before the work is publicly displayed.</p>
          </Section>

          <Section title="15. Third-Party Platforms">
            <p>Our services may depend on platforms and providers such as Google, Meta, Instagram, YouTube, hosting providers, domain registrars and advertising networks.</p>
            <p>DIGITALNYNE does not control:</p>
            <ul>
              {['Platform availability', 'Algorithms', 'Account suspensions', 'Advertisement approval', 'Search-engine rankings', 'Policy changes', 'Third-party service interruptions', 'Third-party pricing', 'Data controlled by third-party platforms'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>We are not responsible for losses caused solely by third-party actions outside our reasonable control.</p>
          </Section>

          <Section title="16. No Guaranteed Results">
            <p>Marketing and creative results depend on many factors outside our control.</p>
            <p>Unless expressly guaranteed in a signed agreement, DIGITALNYNE does not guarantee:</p>
            <ul>
              {['A specific number of followers', 'Views, impressions or engagement', 'Viral content', 'Search-engine rankings', 'Leads or enquiries', 'Sales or revenue', 'Return on investment', 'Advertising approval', 'Customer acquisition costs', 'Business growth'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Examples, projections, case studies and testimonials do not guarantee that another client will receive identical results.</p>
          </Section>

          <Section title="17. Acceptable Use">
            <p>You must not use our website or services to:</p>
            <ul>
              {['Violate any applicable law', 'Submit unlawful, defamatory, fraudulent or misleading content', 'Infringe intellectual-property or privacy rights', 'Distribute malware or malicious code', 'Attempt unauthorised access', 'Interfere with website operation', 'Impersonate another person or organisation', 'Harass or abuse our team', 'Conduct spam or deceptive marketing'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>We may suspend or refuse services where a request is unlawful, abusive, misleading, technically harmful or inconsistent with platform policies.</p>
          </Section>

          <Section title="18. Website Intellectual Property">
            <p>Unless otherwise stated, the website&apos;s design, layout, graphics, text, branding and original content are owned by or licensed to DIGITALNYNE.</p>
            <p>You may view the website for lawful personal or business-evaluation purposes. You may not reproduce, distribute, modify, sell or commercially exploit our website content without prior written permission.</p>
            <p>Third-party trademarks displayed on the website remain the property of their respective owners.</p>
          </Section>

          <Section title="19. External Links">
            <p>Our website may contain links to third-party websites for convenience or additional information.</p>
            <p>DIGITALNYNE does not endorse or control every linked website and is not responsible for its content, availability, terms, security or privacy practices.</p>
          </Section>

          <Section title="20. Confidentiality">
            <p>Each party must use reasonable care to protect confidential business information received from the other party.</p>
            <p>Confidential information may be disclosed:</p>
            <ul>
              {["With the owner's permission", 'To authorised personnel or contractors who need it to perform the services', 'To professional advisers under confidentiality obligations', 'When required by applicable law or a valid legal process'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Information that is already public, independently developed or lawfully received from another source is not confidential.</p>
          </Section>

          <Section title="21. Suspension and Termination">
            <p>DIGITALNYNE may suspend or terminate services for:</p>
            <ul>
              {['Non-payment', 'Material breach of an agreement', 'Unlawful or infringing content', 'Fraudulent activity', 'Abusive conduct', 'Repeated failure to provide required materials or approvals', 'Security or reputational risks'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>Termination does not cancel payment obligations for work already completed or third-party costs already incurred.</p>
          </Section>

          <Section title="22. Limitation of Liability">
            <p>To the maximum extent permitted by law, DIGITALNYNE will not be liable for indirect, incidental, special or consequential loss, including loss of profits, anticipated revenue, business opportunity, goodwill or data.</p>
            <p>Where liability cannot be excluded, DIGITALNYNE&apos;s total aggregate liability relating to a specific service will not exceed the amount actually paid to DIGITALNYNE for that service during the three months preceding the event giving rise to the claim.</p>
            <p>Nothing in these Terms excludes liability that cannot legally be excluded or limits a consumer right that cannot lawfully be waived.</p>
          </Section>

          <Section title="23. Client Indemnity">
            <p>The client agrees to be responsible for claims, losses or expenses arising from:</p>
            <ul>
              {['Unlawful or infringing materials supplied by the client', 'False or misleading claims provided by the client', "The client's breach of these Terms", "The client's unauthorised use of a deliverable", 'Instructions requiring DIGITALNYNE to violate law or third-party rights'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>This obligation applies only to the extent permitted by law and to losses reasonably connected with the client&apos;s conduct.</p>
          </Section>

          <Section title="24. Force Majeure">
            <p>Neither party will be responsible for delay or failure caused by events beyond reasonable control, including natural disasters, government restrictions, civil disturbances, internet failures, cyber incidents, utility failures, platform outages or labour disruptions.</p>
            <p>The affected party must take reasonable steps to reduce the impact and resume performance when practicable.</p>
          </Section>

          <Section title="25. Promotional Offers">
            <p>Promotional offers, including free deliverables, introductory prices and bundled services, may be subject to separate eligibility and offer conditions.</p>
            <p>Unless stated otherwise:</p>
            <ul>
              {['Offers are available for a limited period or until withdrawn.', 'Offers cannot be exchanged for cash.', 'Offers cannot be combined.', 'Third-party costs are excluded.', 'Additional work outside the advertised offer is chargeable.', 'A customer may use an introductory offer only once.', 'Cancellation may result in the withdrawal of undelivered promotional benefits.'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>The specific terms shown with an offer or in an accepted proposal will apply to that offer.</p>
          </Section>

          <Section title="26. Privacy">
            <p>Personal information is handled according to our <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</Link>. The Privacy Policy forms part of these Terms.</p>
          </Section>

          <Section title="27. Governing Law and Disputes">
            <p>These Terms and any engagement with DIGITALNYNE are governed by the laws of India.</p>
            <p>The parties should first attempt to resolve a dispute through good-faith written discussions.</p>
            <p>Subject to any mandatory consumer jurisdiction or other legal right that cannot be excluded, courts having jurisdiction in Visakhapatnam, Andhra Pradesh, will have jurisdiction over disputes relating to these Terms or our services.</p>
          </Section>

          <Section title="28. Severability">
            <p>If any provision of these Terms is found invalid or unenforceable, the remaining provisions will continue in effect.</p>
          </Section>

          <Section title="29. No Waiver">
            <p>A delay or failure to enforce a right does not waive that right.</p>
          </Section>

          <Section title="30. Changes to These Terms">
            <p>We may update these Terms when our services, business practices or legal obligations change.</p>
            <p>The revised Terms will be published on this page with an updated &ldquo;Last updated&rdquo; date. Changes will not retroactively alter an already accepted project agreement unless agreed by both parties or required by law.</p>
          </Section>

          <Section title="31. Contact">
            <p>For questions about these Terms, contact:</p>
            <address className="not-italic bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 text-sm text-slate-700">
              <strong>DIGITALNYNE GROWTH STUDIO</strong><br />
              Visakhapatnam, Andhra Pradesh, India<br />
              Email: <a href="mailto:info@digitalnyne.com" className="text-primary hover:underline">info@digitalnyne.com</a>
            </address>
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
          <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-primary transition-colors">
            View Privacy Policy →
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
