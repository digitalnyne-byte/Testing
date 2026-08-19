'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Enquiry {
  id: string;
  enquiry_type: 'quote' | 'contact';
  full_name: string;
  email: string;
  mobile: string | null;
  whatsapp_number: string | null;
  business_name: string | null;
  city: string | null;
  preferred_contact: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  timeline: string | null;
  subject: string | null;
  reference: string | null;
  status: string;
  is_read: boolean;
  priority: string;
  assigned_to: string | null;
  next_follow_up_at: string | null;
  estimated_value: number | null;
  lost_reason: string | null;
  archived_at: string | null;
  source_page: string | null;
  referrer_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  privacy_consent: boolean | null;
  marketing_consent: boolean | null;
  consent_timestamp: string | null;
  privacy_policy_version: string | null;
  created_at: string;
  updated_at: string;
}

type TabKey = 'all' | 'contact' | 'quote' | 'new' | 'followup' | 'qualified' | 'won' | 'lost' | 'spam';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'contact', label: 'Contact Forms' },
  { key: 'quote', label: 'Quote Requests' },
  { key: 'new', label: 'New' },
  { key: 'followup', label: 'Follow-up Due' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
  { key: 'spam', label: 'Spam' },
];

const STATUSES = ['new', 'contacted', 'qualified', 'strategy_call', 'proposal_sent', 'negotiation', 'won', 'lost', 'spam', 'archived'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  contacted: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  qualified: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  strategy_call: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  proposal_sent: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  negotiation: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  won: 'bg-green-500/15 text-green-300 border-green-500/30',
  lost: 'bg-red-500/15 text-red-300 border-red-500/30',
  spam: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  archived: 'bg-gray-600/15 text-gray-500 border-gray-600/30',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-gray-400',
  normal: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

function val(v: string | null | undefined): string {
  return v && v.trim() ? v.trim() : 'Not provided';
}

function relativeTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return ''; }
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return 'Not provided';
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return 'Invalid date'; }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Not provided';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return 'Invalid date'; }
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

interface DrawerProps {
  enquiry: Enquiry;
  adminEmail: string;
  onClose: () => void;
  onUpdate: (id: string, type: 'quote' | 'contact', changes: Partial<Enquiry>) => void;
}

interface Note {
  id: string;
  note_text: string;
  author_email: string;
  created_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  actor_email: string | null;
  created_at: string;
}

function EnquiryDrawer({ enquiry, adminEmail, onClose, onUpdate }: DrawerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(enquiry.next_follow_up_at ? enquiry.next_follow_up_at.slice(0, 16) : '');
  const [estimatedValue, setEstimatedValue] = useState(enquiry.estimated_value?.toString() || '');
  const [lostReason, setLostReason] = useState(enquiry.lost_reason || '');
  const [assignedTo, setAssignedTo] = useState(enquiry.assigned_to || '');
  const [currentStatus, setCurrentStatus] = useState(enquiry.status);
  const [currentPriority, setCurrentPriority] = useState(enquiry.priority);
  const [copied, setCopied] = useState<string | null>(null);
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'activity'>('details');
  const drawerRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const table = enquiry.enquiry_type === 'quote' ? 'quote_requests' : 'contact_submissions';

  useEffect(() => {
    loadNotes();
    loadActivity();
    // Mark as read
    if (!enquiry.is_read) {
      markRead();
    }
  }, [enquiry.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const markRead = async () => {
    await supabase.from(table).update({ is_read: true }).eq('id', enquiry.id);
    onUpdate(enquiry.id, enquiry.enquiry_type, { is_read: true });
    await logActivity('enquiry_opened', 'Enquiry opened');
  };

  const loadNotes = async () => {
    const { data } = await supabase
      .from('enquiry_notes')
      .select('id, note_text, author_email, created_at')
      .eq('enquiry_id', enquiry.id)
      .eq('enquiry_type', enquiry.enquiry_type)
      .order('created_at', { ascending: false });
    setNotes(data || []);
  };

  const loadActivity = async () => {
    const { data } = await supabase
      .from('enquiry_activity')
      .select('id, activity_type, description, actor_email, created_at')
      .eq('enquiry_id', enquiry.id)
      .eq('enquiry_type', enquiry.enquiry_type)
      .order('created_at', { ascending: false });
    setActivities(data || []);
  };

  const logActivity = async (type: string, description: string, metadata?: object) => {
    await supabase.from('enquiry_activity').insert({
      enquiry_id: enquiry.id,
      enquiry_type: enquiry.enquiry_type,
      activity_type: type,
      description,
      actor_email: adminEmail,
      metadata: metadata || null,
    });
    loadActivity();
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSavingNote(true);
    const { error } = await supabase.from('enquiry_notes').insert({
      enquiry_id: enquiry.id,
      enquiry_type: enquiry.enquiry_type,
      note_text: newNote.trim(),
      author_email: adminEmail,
    });
    if (!error) {
      await logActivity('note_added', 'Internal note added');
      setNewNote('');
      loadNotes();
    }
    setSavingNote(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', enquiry.id);
    if (!error) {
      setCurrentStatus(newStatus);
      onUpdate(enquiry.id, enquiry.enquiry_type, { status: newStatus });
      await logActivity('status_changed', `Status changed to ${newStatus}`, { from: currentStatus, to: newStatus });
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    const { error } = await supabase.from(table).update({ priority: newPriority }).eq('id', enquiry.id);
    if (!error) {
      setCurrentPriority(newPriority);
      onUpdate(enquiry.id, enquiry.enquiry_type, { priority: newPriority });
    }
  };

  const handleSaveFollowUp = async () => {
    const dt = followUpDate ? new Date(followUpDate).toISOString() : null;
    const { error } = await supabase.from(table).update({ next_follow_up_at: dt }).eq('id', enquiry.id);
    if (!error) {
      onUpdate(enquiry.id, enquiry.enquiry_type, { next_follow_up_at: dt });
      await logActivity('followup_scheduled', `Follow-up scheduled for ${followUpDate || 'cleared'}`);
    }
  };

  const handleSaveValue = async () => {
    const v = estimatedValue ? parseFloat(estimatedValue) : null;
    await supabase.from(table).update({ estimated_value: v, assigned_to: assignedTo || null, lost_reason: lostReason || null }).eq('id', enquiry.id);
    onUpdate(enquiry.id, enquiry.enquiry_type, { estimated_value: v, assigned_to: assignedTo || null, lost_reason: lostReason || null });
    if (assignedTo !== enquiry.assigned_to) {
      await logActivity('assignment_changed', `Assigned to ${assignedTo || 'unassigned'}`);
    }
  };

  const handleArchive = async () => {
    const now = new Date().toISOString();
    await supabase.from(table).update({ archived_at: now }).eq('id', enquiry.id);
    onUpdate(enquiry.id, enquiry.enquiry_type, { archived_at: now });
    await logActivity('enquiry_archived', 'Enquiry archived');
    onClose();
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* ignore */ }
  };

  const hasMobile = !!(enquiry.mobile && enquiry.mobile.trim() && enquiry.mobile !== 'Not provided');
  const hasEmail = !!(enquiry.email && enquiry.email.trim() && enquiry.email !== 'Not provided');

  const whatsappNumber = (enquiry.whatsapp_number || enquiry.mobile || '').replace(/\D/g, '');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.startsWith('91') ? whatsappNumber : '91' + whatsappNumber}` : null;

  const Field = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div>
      <dt className="text-xs font-medium text-gray-400 mb-0.5">{label}</dt>
      <dd className="text-sm text-white break-words">{val(value)}</dd>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Enquiry from ${enquiry.full_name}`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        className="relative w-full max-w-2xl bg-[#0d1424] border-l border-gray-700/50 flex flex-col h-full overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-white font-bold text-base truncate">{enquiry.full_name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${enquiry.enquiry_type === 'quote' ? 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20' : 'bg-blue-400/10 text-blue-300 border-blue-400/20'}`}>
                {enquiry.enquiry_type === 'quote' ? 'Quote Request' : 'Contact Form'}
              </span>
              {!enquiry.is_read && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/30 font-medium">Unread</span>
              )}
            </div>
            <p className="text-gray-400 text-xs mt-0.5">{formatDateTime(enquiry.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700/60 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" aria-label="Close drawer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-5 py-3 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            <a
              href={hasMobile ? `tel:${enquiry.mobile}` : undefined}
              aria-disabled={!hasMobile}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${hasMobile ? 'bg-green-500/15 text-green-300 hover:bg-green-500/25 border border-green-500/30' : 'bg-gray-700/30 text-gray-500 cursor-not-allowed border border-gray-700/30'}`}
              onClick={() => hasMobile && logActivity('email_action', 'Call initiated')}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call
            </a>
            <a
              href={hasEmail ? `mailto:${enquiry.email}` : undefined}
              aria-disabled={!hasEmail}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${hasEmail ? 'bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30' : 'bg-gray-700/30 text-gray-500 cursor-not-allowed border border-gray-700/30'}`}
              onClick={() => hasEmail && logActivity('email_action', 'Email initiated')}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email
            </a>
            <a
              href={whatsappUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!whatsappUrl}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${whatsappUrl ? 'bg-green-600/15 text-green-300 hover:bg-green-600/25 border border-green-600/30' : 'bg-gray-700/30 text-gray-500 cursor-not-allowed border border-gray-700/30'}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <button
              onClick={() => hasMobile && copyToClipboard(enquiry.mobile!, 'phone')}
              disabled={!hasMobile}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${hasMobile ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-700 border border-gray-600/30' : 'bg-gray-700/30 text-gray-500 cursor-not-allowed border border-gray-700/30'}`}
            >
              {copied === 'phone' ? '✓ Copied' : 'Copy Phone'}
            </button>
            <button
              onClick={() => hasEmail && copyToClipboard(enquiry.email, 'email')}
              disabled={!hasEmail}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${hasEmail ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-700 border border-gray-600/30' : 'bg-gray-700/30 text-gray-500 cursor-not-allowed border border-gray-700/30'}`}
            >
              {copied === 'email' ? '✓ Copied' : 'Copy Email'}
            </button>
            {!archiveConfirm ? (
              <button
                onClick={() => setArchiveConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                Archive
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-300">Confirm archive?</span>
                <button onClick={handleArchive} className="px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-600 transition-colors">Yes</button>
                <button onClick={() => setArchiveConfirm(false)} className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">No</button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50 flex-shrink-0 px-5">
          {(['details', 'notes', 'activity'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${activeTab === t ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              {t === 'notes' ? `Notes (${notes.length})` : t === 'activity' ? `Activity (${activities.length})` : 'Details'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Contact Details */}
              <section>
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Contact Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Full Name" value={enquiry.full_name} />
                  <Field label="Mobile Number" value={enquiry.mobile} />
                  <Field label="WhatsApp Number" value={enquiry.whatsapp_number} />
                  <Field label="Email Address" value={enquiry.email} />
                  <Field label="Business / Brand" value={enquiry.business_name} />
                  <Field label="City" value={enquiry.city} />
                  <Field label="Preferred Contact" value={enquiry.preferred_contact} />
                </dl>
              </section>

              {/* Enquiry Details */}
              <section>
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Enquiry Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-gray-400 mb-0.5">Enquiry Type</dt>
                    <dd className="text-sm text-white">{enquiry.enquiry_type === 'quote' ? 'Quote Request' : 'Contact Form'}</dd>
                  </div>
                  <Field label="Service(s)" value={enquiry.service} />
                  <Field label="Budget Range" value={enquiry.budget} />
                  <Field label="Project Timeline" value={enquiry.timeline} />
                  <Field label="Subject" value={enquiry.subject} />
                  <Field label="Submission Date" value={formatDate(enquiry.created_at)} />
                  <Field label="Submission Time" value={enquiry.created_at ? new Date(enquiry.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null} />
                  <Field label="Landing Page" value={enquiry.source_page} />
                  <Field label="Referring Page" value={enquiry.referrer_page} />
                  <Field label="UTM Source" value={enquiry.utm_source} />
                  <Field label="UTM Medium" value={enquiry.utm_medium} />
                  <Field label="UTM Campaign" value={enquiry.utm_campaign} />
                  {enquiry.reference && <Field label="Reference Number" value={enquiry.reference} />}
                </dl>
                {enquiry.message && (
                  <div className="mt-3">
                    <dt className="text-xs font-medium text-gray-400 mb-1">Customer Message</dt>
                    <dd className="text-sm text-white bg-gray-800/60 rounded-lg p-3 whitespace-pre-wrap break-words border border-gray-700/50">{enquiry.message}</dd>
                  </div>
                )}
              </section>

              {/* Sales Details */}
              <section>
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Sales Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Status</label>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Priority</label>
                    <select
                      value={currentPriority}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Assigned To</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Email or name"
                      className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Estimated Value (₹)</label>
                    <input
                      type="number"
                      value={estimatedValue}
                      onChange={(e) => setEstimatedValue(e.target.value)}
                      placeholder="0"
                      className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Next Follow-up</label>
                    <input
                      type="datetime-local"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    />
                  </div>
                  {(currentStatus === 'lost') && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-400 mb-1 block">Lost Reason</label>
                      <input
                        type="text"
                        value={lostReason}
                        onChange={(e) => setLostReason(e.target.value)}
                        placeholder="Why was this lead lost?"
                        className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500"
                      />
                    </div>
                  )}
                  <div className="sm:col-span-2 flex gap-2">
                    <button
                      onClick={handleSaveFollowUp}
                      className="px-4 py-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg hover:bg-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                    >
                      Save Follow-up
                    </button>
                    <button
                      onClick={handleSaveValue}
                      className="px-4 py-2 bg-gray-700 text-gray-200 text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                    >
                      Save Sales Info
                    </button>
                  </div>
                </div>
              </section>

              {/* Privacy Details */}
              <section>
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Privacy Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-400 mb-0.5">Enquiry Consent</dt>
                    <dd className="text-sm text-white">{enquiry.privacy_consent === true ? 'Given' : enquiry.privacy_consent === false ? 'Not given' : 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 mb-0.5">Marketing Consent</dt>
                    <dd className="text-sm text-white">{enquiry.marketing_consent === true ? 'Given' : enquiry.marketing_consent === false ? 'Not given' : 'Not provided'}</dd>
                  </div>
                  <Field label="Consent Timestamp" value={enquiry.consent_timestamp ? formatDateTime(enquiry.consent_timestamp) : null} />
                  <Field label="Privacy Policy Version" value={enquiry.privacy_policy_version} />
                </dl>
              </section>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Add Internal Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write an internal note visible only to administrators..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500 resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={savingNote || !newNote.trim()}
                  className="mt-2 px-4 py-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  {savingNote ? 'Saving...' : 'Add Note'}
                </button>
              </div>
              {notes.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No notes yet. Add the first note above.</p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-yellow-400">{note.author_email}</span>
                        <span className="text-xs text-gray-500">{formatDateTime(note.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{note.note_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-2">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No activity recorded yet.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 py-2.5 border-b border-gray-700/30 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-yellow-400/60 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-200">{act.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {act.actor_email && <span className="text-xs text-gray-500">{act.actor_email}</span>}
                        <span className="text-xs text-gray-600">{formatDateTime(act.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Enquiries Page ──────────────────────────────────────────────────────

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [duplicates, setDuplicates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) setAdminEmail(session.user.email);
    });
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setLoadState('loading');
    try {
      const supabase = createClient();
      const [qResult, cResult] = await Promise.allSettled([
        supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
      ]);

      const quotes: Enquiry[] = (qResult.status === 'fulfilled' && !qResult.value.error ? qResult.value.data || [] : []).map((q: any) => ({
        id: q.id,
        enquiry_type: 'quote' as const,
        full_name: q.full_name || '',
        email: q.email || '',
        mobile: q.phone || null,
        whatsapp_number: q.whatsapp_number || null,
        business_name: q.business_name || null,
        city: q.city || null,
        preferred_contact: q.preferred_contact || null,
        service: Array.isArray(q.selected_services) ? q.selected_services.join(', ') : (q.selected_services || null),
        budget: q.budget || null,
        message: q.project_description || null,
        timeline: q.project_type || null,
        subject: null,
        reference: q.reference_number || null,
        status: q.status || 'new',
        is_read: q.is_read ?? false,
        priority: q.priority || 'normal',
        assigned_to: q.assigned_to || null,
        next_follow_up_at: q.next_follow_up_at || null,
        estimated_value: q.estimated_value || null,
        lost_reason: q.lost_reason || null,
        archived_at: q.archived_at || null,
        source_page: q.source_page || null,
        referrer_page: q.referrer_page || null,
        utm_source: q.utm_source || null,
        utm_medium: q.utm_medium || null,
        utm_campaign: q.utm_campaign || null,
        privacy_consent: q.privacy_consent ?? null,
        marketing_consent: q.marketing_consent ?? null,
        consent_timestamp: q.consent_timestamp || null,
        privacy_policy_version: q.privacy_policy_version || null,
        created_at: q.created_at || '',
        updated_at: q.updated_at || '',
      }));

      const contacts: Enquiry[] = (cResult.status === 'fulfilled' && !cResult.value.error ? cResult.value.data || [] : []).map((c: any) => ({
        id: c.id,
        enquiry_type: 'contact' as const,
        full_name: c.full_name || '',
        email: c.email || '',
        mobile: c.phone || null,
        whatsapp_number: c.whatsapp_number || null,
        business_name: c.business_name || null,
        city: c.city || null,
        preferred_contact: c.preferred_contact || null,
        service: c.service || null,
        budget: c.budget || null,
        message: c.message || null,
        timeline: null,
        subject: c.subject || null,
        reference: null,
        status: c.status || 'new',
        is_read: c.is_read ?? false,
        priority: c.priority || 'normal',
        assigned_to: c.assigned_to || null,
        next_follow_up_at: c.next_follow_up_at || null,
        estimated_value: c.estimated_value || null,
        lost_reason: c.lost_reason || null,
        archived_at: c.archived_at || null,
        source_page: c.source_page || null,
        referrer_page: c.referrer_page || null,
        utm_source: c.utm_source || null,
        utm_medium: c.utm_medium || null,
        utm_campaign: c.utm_campaign || null,
        privacy_consent: c.privacy_consent ?? null,
        marketing_consent: c.marketing_consent ?? null,
        consent_timestamp: c.consent_timestamp || null,
        privacy_policy_version: c.privacy_policy_version || null,
        created_at: c.created_at || '',
        updated_at: c.updated_at || '',
      }));

      const all = [...quotes, ...contacts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setEnquiries(all);

      // Detect duplicates by email or phone
      const emailMap = new Map<string, string[]>();
      const phoneMap = new Map<string, string[]>();
      all.forEach((e) => {
        if (e.email) {
          const k = e.email.toLowerCase();
          emailMap.set(k, [...(emailMap.get(k) || []), e.id]);
        }
        if (e.mobile) {
          const k = e.mobile.replace(/\D/g, '');
          if (k) phoneMap.set(k, [...(phoneMap.get(k) || []), e.id]);
        }
      });
      const dupSet = new Set<string>();
      emailMap.forEach((ids) => { if (ids.length > 1) ids.forEach((id) => dupSet.add(id)); });
      phoneMap.forEach((ids) => { if (ids.length > 1) ids.forEach((id) => dupSet.add(id)); });
      setDuplicates(dupSet);

      setLoadState('loaded');
    } catch {
      setLoadState('error');
    }
  };

  const handleUpdate = useCallback((id: string, type: 'quote\' | \'contact', changes: Partial<Enquiry>) => {
    setEnquiries((prev) => prev.map((e) => e.id === id && e.enquiry_type === type ? { ...e, ...changes } : e));
    if (selectedEnquiry?.id === id && selectedEnquiry?.enquiry_type === type) {
      setSelectedEnquiry((prev) => prev ? { ...prev, ...changes } : prev);
    }
  }, [selectedEnquiry]);

  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());

  const filtered = enquiries.filter((e) => {
    if (e.archived_at && activeTab !== 'all') return false;

    // Tab filter
    if (activeTab === 'contact' && e.enquiry_type !== 'contact') return false;
    if (activeTab === 'quote' && e.enquiry_type !== 'quote') return false;
    if (activeTab === 'new' && e.status !== 'new') return false;
    if (activeTab === 'followup') {
      if (!e.next_follow_up_at) return false;
      const fu = new Date(e.next_follow_up_at);
      if (fu > now) return false; // not yet due — show only due/overdue
    }
    if (activeTab === 'qualified' && e.status !== 'qualified') return false;
    if (activeTab === 'won' && e.status !== 'won') return false;
    if (activeTab === 'lost' && e.status !== 'lost') return false;
    if (activeTab === 'spam' && e.status !== 'spam') return false;

    // Additional filters
    if (filterStatus && e.status !== filterStatus) return false;
    if (filterPriority && e.priority !== filterPriority) return false;
    if (filterRead === 'unread' && e.is_read) return false;
    if (filterRead === 'read' && !e.is_read) return false;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const searchable = [e.full_name, e.email, e.mobile, e.business_name, e.message].filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'value': return (b.estimated_value || 0) - (a.estimated_value || 0);
      case 'followup': {
        if (!a.next_follow_up_at && !b.next_follow_up_at) return 0;
        if (!a.next_follow_up_at) return 1;
        if (!b.next_follow_up_at) return -1;
        return new Date(a.next_follow_up_at).getTime() - new Date(b.next_follow_up_at).getTime();
      }
      case 'name': return (a.full_name || '').localeCompare(b.full_name || '');
      case 'status': return (a.status || '').localeCompare(b.status || '');
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const exportCSV = () => {
    const headers = ['Name', 'Mobile', 'Email', 'Business', 'Type', 'Service', 'Budget', 'Status', 'Priority', 'Source', 'Assigned To', 'Received', 'Follow-up'];
    const rows = sorted.map((e) => [
      e.full_name, val(e.mobile), e.email, val(e.business_name),
      e.enquiry_type, val(e.service), val(e.budget), e.status, e.priority,
      val(e.source_page), val(e.assigned_to),
      formatDateTime(e.created_at),
      e.next_follow_up_at ? formatDateTime(e.next_follow_up_at) : 'Not set',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`));
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digitalnyne-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loadState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-300 text-sm">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm w-full bg-[#111827] rounded-xl border border-gray-700 p-6 text-center">
          <p className="text-white font-bold mb-2">Could not load enquiries</p>
          <p className="text-gray-400 text-sm mb-4">A database error occurred.</p>
          <button onClick={loadEnquiries} className="w-full py-2 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white">Enquiries</h1>
          <p className="text-gray-400 text-xs mt-0.5">{sorted.length} {sorted.length === 1 ? 'result' : 'results'}</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700/60 text-gray-200 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/50 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, business, message..."
              className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          <select value={filterRead} onChange={(e) => setFilterRead(e.target.value)} className="bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
            <option value="">Read & Unread</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="value">Highest Value</option>
            <option value="followup">Follow-up Date</option>
            <option value="name">Name A–Z</option>
            <option value="status">Status</option>
          </select>
          {(search || filterStatus || filterPriority || filterRead) && (
            <button
              onClick={() => { setSearch(''); setFilterStatus(''); setFilterPriority(''); setFilterRead(''); }}
              className="px-3 py-2 bg-red-500/15 text-red-400 hover:bg-red-500/25 rounded-lg text-sm font-medium transition-colors border border-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-700/50 mb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 py-2.5 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${activeTab === tab.key ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="bg-[#111827] rounded-xl border border-gray-700/50 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <p className="text-gray-300 font-medium">No enquiries found</p>
          <p className="text-gray-500 text-sm mt-1">{search || filterStatus || filterPriority || filterRead ? 'Try adjusting your filters.' : 'No enquiries have been received yet.'}</p>
        </div>
      ) : (
        <div className="bg-[#111827] rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  {['Name', 'Mobile', 'Email', 'Business', 'Type', 'Service', 'Budget', 'Status', 'Priority', 'Received', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {sorted.map((e) => (
                  <tr
                    key={`${e.enquiry_type}-${e.id}`}
                    onClick={() => setSelectedEnquiry(e)}
                    className={`cursor-pointer transition-colors hover:bg-gray-700/30 focus-within:bg-gray-700/30 ${!e.is_read ? 'bg-blue-500/5' : ''}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {!e.is_read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" aria-label="Unread" />}
                        {duplicates.has(e.id) && <span className="text-xs text-orange-400" title="Possible duplicate">⚠</span>}
                        <span className="text-white font-medium">{e.full_name || 'Not provided'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{val(e.mobile)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300 max-w-[180px] truncate">{e.email || 'Not provided'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{val(e.business_name)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${e.enquiry_type === 'quote' ? 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20' : 'bg-blue-400/10 text-blue-300 border-blue-400/20'}`}>
                        {e.enquiry_type === 'quote' ? 'Quote' : 'Contact'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 max-w-[140px] truncate">{val(e.service)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{val(e.budget)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[e.status] || 'bg-gray-700/30 text-gray-400 border-gray-600/30'}`}>
                        {e.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-medium capitalize ${PRIORITY_COLORS[e.priority] || 'text-gray-400'}`}>{e.priority}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-xs">{relativeTime(e.created_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={(ev) => { ev.stopPropagation(); setSelectedEnquiry(e); }}
                        className="text-xs text-yellow-400 hover:text-yellow-300 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
                        aria-label={`View details for ${e.full_name}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedEnquiry && (
        <EnquiryDrawer
          enquiry={selectedEnquiry}
          adminEmail={adminEmail}
          onClose={() => setSelectedEnquiry(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
