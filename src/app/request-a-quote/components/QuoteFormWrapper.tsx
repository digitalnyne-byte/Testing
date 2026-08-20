'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1
  selectedServices: string[];
  // Step 2
  fullName: string;
  businessName: string;
  industry: string;
  city: string;
  phone: string;
  email: string;
  websiteUrl: string;
  // Step 3
  projectDescription: string;
  preferredStartDate: string;
  projectType: 'one-time' | 'monthly' | '';
  budget: string;
  referenceLink: string;
  // Step 4
  consentChecked: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const SERVICES = [
  'Content Creation',
  'Video Editing',
  'Digital Presence',
  'Branding',
  'Sales & Lead Generation',
  'Advertising',
  'Digital Marketing',
  'Personal Branding',
  'Social Media Management',
  'Custom Requirement',
];

const BUDGETS = [
  'Below ₹10,000',
  '₹10,000 to ₹25,000',
  '₹25,000 to ₹50,000',
  '₹50,000 to ₹1,00,000',
  'Above ₹1,00,000',
  'Need guidance',
];

const INDUSTRIES = [
  'Retail / E-commerce',
  'Food & Beverage',
  'Healthcare',
  'Real Estate',
  'Education',
  'Technology',
  'Finance',
  'Manufacturing',
  'Hospitality',
  'Professional Services',
  'Other',
];

const STEPS = ['Services', 'Business Info', 'Requirements', 'Review'];

const WHATSAPP_NUMBER = '919398461937';
const GOOGLE_BOOKING_URL = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || 'https://calendar.app.google/22GGnqKDoMrHeT6FA' || '';

const initialFormData: FormData = {
  selectedServices: [],
  fullName: '',
  businessName: '',
  industry: '',
  city: '',
  phone: '',
  email: '',
  websiteUrl: '',
  projectDescription: '',
  preferredStartDate: '',
  projectType: '',
  budget: '',
  referenceLink: '',
  consentChecked: false,
};

function generateRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'DN-';
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < current
                  ? 'gradient-brand text-white'
                  : i === current
                  ? 'gradient-brand text-white shadow-md scale-110'
                  : 'bg-white border-2 border-border text-muted-foreground'
              }`}
            >
              {i < current ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-xs font-semibold hidden sm:block ${i === current ? 'text-primary' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`flex-1 h-0.5 max-w-12 transition-all duration-500 ${i < current ? 'gradient-brand' : 'bg-border'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Step 1: Services ─────────────────────────────────────────────────────────
function Step1({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  const toggle = (service: string) => {
    const current = data.selectedServices;
    onChange({
      selectedServices: current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service],
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-foreground mb-2">Select Services</h2>
      <p className="text-muted-foreground text-sm mb-6 font-medium">Choose one or more services you&apos;re interested in. You can select multiple.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((s) => {
          const selected = data.selectedServices.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-primary bg-primary/5' :'border-border bg-white hover:border-primary/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                  selected ? 'gradient-brand border-transparent' : 'border-border'
                }`}
              >
                {selected && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                )}
              </div>
              <span className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>{s}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Business Info ────────────────────────────────────────────────────
function Step2({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: FormErrors;
  onChange: (d: Partial<FormData>) => void;
}) {
  const field = (
    id: keyof FormData,
    label: string,
    type = 'text',
    placeholder = '',
    required = true
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-foreground mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={data[id] as string}
        onChange={(e) => onChange({ [id]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
          errors[id] ? 'border-red-400 focus:ring-red-300' : 'border-border focus:border-primary'
        }`}
      />
      {errors[id] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[id]}</p>}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-foreground mb-2">Business Information</h2>
      <p className="text-muted-foreground text-sm mb-6 font-medium">Tell us about yourself and your business so we can prepare a relevant proposal.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {field('fullName', 'Full Name', 'text', 'Your full name')}
        {field('businessName', 'Business Name', 'text', 'Your business name')}

        <div>
          <label htmlFor="industry" className="block text-sm font-bold text-foreground mb-1.5">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              errors.industry ? 'border-red-400' : 'border-border focus:border-primary'
            }`}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {errors.industry && <p className="text-red-500 text-xs mt-1 font-medium">{errors.industry}</p>}
        </div>

        {field('city', 'City', 'text', 'e.g. Visakhapatnam')}
        {field('phone', 'Phone Number', 'tel', '+91 98765 43210')}
        {field('email', 'Email Address', 'email', 'you@business.com')}
        <div className="sm:col-span-2">
          {field('websiteUrl', 'Website or Social Media URL', 'url', 'https://', false)}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Requirements ─────────────────────────────────────────────────────
function Step3({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: FormErrors;
  onChange: (d: Partial<FormData>) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-foreground mb-2">Project Requirements</h2>
      <p className="text-muted-foreground text-sm mb-6 font-medium">Help us understand your project in detail so we can prepare an accurate proposal.</p>

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-bold text-foreground mb-1.5">
            Project Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="projectDescription"
            rows={4}
            value={data.projectDescription}
            onChange={(e) => onChange({ projectDescription: e.target.value })}
            placeholder="Describe what you need. E.g. We need monthly social media management for our restaurant, including 20 posts per month..."
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
              errors.projectDescription ? 'border-red-400' : 'border-border focus:border-primary'
            }`}
          />
          {errors.projectDescription && <p className="text-red-500 text-xs mt-1 font-medium">{errors.projectDescription}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="preferredStartDate" className="block text-sm font-bold text-foreground mb-1.5">
              Preferred Start Date
            </label>
            <input
              id="preferredStartDate"
              type="date"
              value={data.preferredStartDate}
              onChange={(e) => onChange({ preferredStartDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm font-medium bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Project Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {(['one-time', 'monthly'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ projectType: type })}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all capitalize ${
                    data.projectType === type
                      ? 'border-primary bg-primary/5 text-primary' :'border-border bg-white text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {type === 'one-time' ? 'One-Time' : 'Monthly'}
                </button>
              ))}
            </div>
            {errors.projectType && <p className="text-red-500 text-xs mt-1 font-medium">{errors.projectType}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            Approximate Budget <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onChange({ budget: b })}
                className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                  data.budget === b
                    ? 'border-primary bg-primary/5 text-primary' :'border-border bg-white text-muted-foreground hover:border-primary/50'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          {errors.budget && <p className="text-red-500 text-xs mt-1 font-medium">{errors.budget}</p>}
        </div>

        <div>
          <label htmlFor="referenceLink" className="block text-sm font-bold text-foreground mb-1.5">
            Reference Link (Optional)
          </label>
          <input
            id="referenceLink"
            type="url"
            value={data.referenceLink}
            onChange={(e) => onChange({ referenceLink: e.target.value })}
            placeholder="A website or campaign you like / inspiration"
            className="w-full px-4 py-3 rounded-xl border border-border text-sm font-medium bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────
function Step4({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: FormErrors;
  onChange: (d: Partial<FormData>) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-foreground mb-2">Review Your Enquiry</h2>
      <p className="text-muted-foreground text-sm mb-6 font-medium">Please review your details before submitting.</p>

      <div className="flex flex-col gap-4">
        {/* Services */}
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Selected Services</p>
          <div className="flex flex-wrap gap-2">
            {data.selectedServices.length > 0 ? (
              data.selectedServices.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full gradient-brand text-white text-xs font-bold">{s}</span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None selected</span>
            )}
          </div>
        </div>

        {/* Business Info */}
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Business Information</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Name', data.fullName],
              ['Business', data.businessName],
              ['Industry', data.industry],
              ['City', data.city],
              ['Phone', data.phone],
              ['Email', data.email],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Project Requirements</p>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Description</p>
              <p className="text-sm font-medium text-foreground">{data.projectDescription || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Type</p>
                <p className="text-sm font-semibold text-foreground capitalize">{data.projectType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Budget</p>
                <p className="text-sm font-semibold text-foreground">{data.budget || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consent */}
        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
          data.consentChecked ? 'border-primary bg-primary/5' : errors.consentChecked ? 'border-red-400 bg-red-50' : 'border-border bg-white'
        }`}>
          <button
            type="button"
            onClick={() => onChange({ consentChecked: !data.consentChecked })}
            className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
              data.consentChecked ? 'gradient-brand border-transparent' : 'border-border bg-white'
            }`}
            aria-checked={data.consentChecked}
            role="checkbox"
          >
            {data.consentChecked && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            )}
          </button>
          <span className="text-sm font-medium text-foreground">
            I agree to be contacted by DIGITALNYNE regarding this enquiry and accept the{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Privacy Policy</a>{' '}
            and{' '}
            <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Terms &amp; Conditions</a>.{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consentChecked && <p className="text-red-500 text-xs font-semibold">{errors.consentChecked}</p>}
      </div>
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────
function SuccessState({ refNumber }: { refNumber: string }) {
  const handleBookingClick = () => {
    trackEvent('strategy_call_clicked', { source: 'quote_success' });
    if (GOOGLE_BOOKING_URL) {
      window.open(GOOGLE_BOOKING_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="text-center py-10">
      <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mx-auto mb-6 shadow-xl">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 className="text-2xl font-extrabold text-foreground mb-2">Enquiry Submitted!</h2>
      <p className="text-muted-foreground text-base font-medium mb-6 max-w-md mx-auto">
        Thank you for reaching out. We&apos;ve received your enquiry and will prepare a custom proposal within 1 to 2 business days.
      </p>

      {/* Reference Number */}
      <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/5 border-2 border-primary/20 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Enquiry Reference</p>
          <p className="text-2xl font-extrabold gradient-brand-text">{refNumber}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-medium mb-8">
        Please save this reference number. You can mention it in any future communication with our team.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello DIGITALNYNE, I just submitted a quote request. My reference number is ${refNumber}. I'd like to share some additional information.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          onClick={() => trackEvent('whatsapp_clicked', { source: 'quote_success' })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Send Additional Info on WhatsApp
        </a>
        {GOOGLE_BOOKING_URL ? (
          <button
            type="button"
            onClick={handleBookingClick}
            className="btn-secondary"
          >
            Book a Free Strategy Call
          </button>
        ) : (
          <span className="btn-secondary opacity-60 cursor-not-allowed" title="Google Calendar booking URL is TO BE CONFIGURED.">
            Book a Free Strategy Call
          </span>
        )}
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ─── Main Wrapper ─────────────────────────────────────────────────────────────
export default function QuoteFormWrapper() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [hasStartedTracked, setHasStartedTracked] = useState(false);

  const updateForm = (partial: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    // Track quote started on first interaction
    if (!hasStartedTracked) {
      trackEvent('request_quote_started');
      setHasStartedTracked(true);
    }
    // Clear errors for changed fields
    const clearedErrors: FormErrors = { ...errors };
    Object.keys(partial).forEach((k) => delete clearedErrors[k]);
    setErrors(clearedErrors);
  };

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (step === 0) {
      if (formData.selectedServices.length === 0) {
        newErrors.selectedServices = 'Please select at least one service.';
      }
    }

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
      if (!formData.industry) newErrors.industry = 'Please select an industry.';
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
      else if (!/^[+\d\s\-()]{7,15}$/.test(formData.phone.trim())) newErrors.phone = 'Enter a valid phone number.';
      if (!formData.email.trim()) newErrors.email = 'Email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address.';
    }

    if (step === 2) {
      if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Please describe your project.';
      else if (formData.projectDescription.trim().length < 30) newErrors.projectDescription = 'Please provide at least 30 characters.';
      if (!formData.projectType) newErrors.projectType = 'Please select a project type.';
      if (!formData.budget) newErrors.budget = 'Please select a budget range.';
    }

    if (step === 3) {
      if (!formData.consentChecked) newErrors.consentChecked = 'You must agree to be contacted before submitting.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    setSubmitError('');

    const ref = generateRef();

    try {
      const supabase = createClient();

      // Get UTM parameters from URL
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const utmSource = urlParams?.get('utm_source') || null;
      const utmMedium = urlParams?.get('utm_medium') || null;
      const utmCampaign = urlParams?.get('utm_campaign') || null;

      const { error: dbError } = await supabase.from('quote_requests').insert({
        reference_number: ref,
        selected_services: formData.selectedServices,
        full_name: formData.fullName,
        business_name: formData.businessName,
        industry: formData.industry,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        website_url: formData.websiteUrl || null,
        project_description: formData.projectDescription,
        preferred_start_date: formData.preferredStartDate || null,
        project_type: formData.projectType,
        budget: formData.budget,
        reference_link: formData.referenceLink || null,
        source_page: '/request-a-quote',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

      if (dbError) {
        console.error('Quote submission error:', dbError.message);
        setSubmitError('There was an error submitting your enquiry. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Fire GA4 event only after confirmed DB save
      trackEvent('request_quote_submitted', { enquiry_ref: ref });

      // Send emails via API route (non-blocking)
      try {
        await fetch('/api/send-quote-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refNumber: ref,
            fullName: formData.fullName,
            email: formData.email,
            businessName: formData.businessName,
            selectedServices: formData.selectedServices,
            projectDescription: formData.projectDescription,
            projectType: formData.projectType,
            budget: formData.budget,
            city: formData.city,
            phone: formData.phone,
            industry: formData.industry,
            preferredStartDate: formData.preferredStartDate,
            referenceLink: formData.referenceLink,
            utmSource: utmSource || '',
            utmMedium: utmMedium || '',
            utmCampaign: utmCampaign || '',
          }),
        });
      } catch (emailErr) {
        // Email failure does not block success
        console.error('Email send error:', emailErr);
      }

      setRefNumber(ref);
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Unexpected error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-background" aria-label="Quote request form">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {submitted ? (
          <div className="bg-white rounded-2xl border border-border shadow-card p-8 sm:p-10">
            <SuccessState refNumber={refNumber} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border shadow-card p-6 sm:p-10">
            <StepIndicator current={step} total={4} />

            {/* Step Content */}
            <div className="min-h-[320px]">
              {step === 0 && <Step1 data={formData} onChange={updateForm} />}
              {step === 1 && <Step2 data={formData} errors={errors} onChange={updateForm} />}
              {step === 2 && <Step3 data={formData} errors={errors} onChange={updateForm} />}
              {step === 3 && <Step4 data={formData} errors={errors} onChange={updateForm} />}
            </div>

            {/* Step-level error (services) */}
            {step === 0 && errors.selectedServices && (
              <p className="text-red-500 text-sm font-semibold mt-4 text-center">{errors.selectedServices}</p>
            )}

            {/* Submit error */}
            {submitError && (
              <p className="text-red-500 text-sm font-semibold mt-4 text-center bg-red-50 rounded-xl p-3">{submitError}</p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border transition-all ${
                  step === 0
                    ? 'opacity-0 pointer-events-none' :'border-border text-foreground hover:border-primary hover:text-primary'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back
              </button>

              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === step ? 'w-6 h-2 gradient-brand' : i < step ? 'w-2 h-2 bg-primary' : 'w-2 h-2 bg-border'
                    }`}
                  />
                ))}
              </div>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary !py-3 !px-6"
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary !py-3 !px-6 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}