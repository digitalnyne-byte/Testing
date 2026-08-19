'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface DashboardMetrics {
  totalQuotes: number;
  totalContacts: number;
  newThisWeek: number;
  totalEnquiries: number;
  unreadCount: number;
  followupsDueToday: number;
  overdueFollowups: number;
  qualifiedLeads: number;
}

interface RecentEnquiry {
  id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  enquiry_type: 'quote' | 'contact';
  service: string | null;
  status: string;
  is_read: boolean;
  created_at: string;
}

type LoadState = 'loading' | 'loaded' | 'error';

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
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
}

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalQuotes: 0, totalContacts: 0, newThisWeek: 0, totalEnquiries: 0,
    unreadCount: 0, followupsDueToday: 0, overdueFollowups: 0, qualifiedLeads: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentEnquiry[]>([]);
  const [overdueItems, setOverdueItems] = useState<RecentEnquiry[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorRef, setErrorRef] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoadState('loading');
    try {
      const supabase = createClient();
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

      const [
        totalQR, totalCS,
        newQR, newCS,
        unreadQR, unreadCS,
        fuTodayQR, fuTodayCS,
        fuOverdueQR, fuOverdueCS,
        qualQR, qualCS,
        recentQR, recentCS,
        overdueQR, overdueCS,
      ] = await Promise.allSettled([
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).is('archived_at', null),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).is('archived_at', null),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString()).is('archived_at', null),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString()).is('archived_at', null),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('is_read', false).is('archived_at', null),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false).is('archived_at', null),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).gte('next_follow_up_at', todayStart.toISOString()).lte('next_follow_up_at', todayEnd.toISOString()).is('archived_at', null),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).gte('next_follow_up_at', todayStart.toISOString()).lte('next_follow_up_at', todayEnd.toISOString()).is('archived_at', null),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).lt('next_follow_up_at', todayStart.toISOString()).is('archived_at', null),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).lt('next_follow_up_at', todayStart.toISOString()).is('archived_at', null),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'qualified').is('archived_at', null),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'qualified').is('archived_at', null),
        supabase.from('quote_requests').select('id, full_name, email, phone, selected_services, status, is_read, created_at').is('archived_at', null).order('created_at', { ascending: false }).limit(10),
        supabase.from('contact_submissions').select('id, full_name, email, phone, service, status, is_read, created_at').is('archived_at', null).order('created_at', { ascending: false }).limit(10),
        supabase.from('quote_requests').select('id, full_name, email, phone, selected_services, status, is_read, created_at, next_follow_up_at').lt('next_follow_up_at', todayStart.toISOString()).is('archived_at', null).order('next_follow_up_at', { ascending: true }).limit(5),
        supabase.from('contact_submissions').select('id, full_name, email, phone, service, status, is_read, created_at, next_follow_up_at').lt('next_follow_up_at', todayStart.toISOString()).is('archived_at', null).order('next_follow_up_at', { ascending: true }).limit(5),
      ]);

      const safeCount = (r: PromiseSettledResult<any>) =>
        r.status === 'fulfilled' && !r.value.error ? (r.value.count ?? 0) : 0;
      const safeData = (r: PromiseSettledResult<any>): any[] =>
        r.status === 'fulfilled' && !r.value.error ? (r.value.data ?? []) : [];

      const tQ = safeCount(totalQR), tC = safeCount(totalCS);
      setMetrics({
        totalQuotes: tQ,
        totalContacts: tC,
        newThisWeek: safeCount(newQR) + safeCount(newCS),
        totalEnquiries: tQ + tC,
        unreadCount: safeCount(unreadQR) + safeCount(unreadCS),
        followupsDueToday: safeCount(fuTodayQR) + safeCount(fuTodayCS),
        overdueFollowups: safeCount(fuOverdueQR) + safeCount(fuOverdueCS),
        qualifiedLeads: safeCount(qualQR) + safeCount(qualCS),
      });

      const mapQuote = (q: any): RecentEnquiry => ({
        id: q.id, enquiry_type: 'quote',
        full_name: q.full_name || 'Not provided',
        email: q.email || '',
        mobile: q.phone || null,
        service: Array.isArray(q.selected_services) ? q.selected_services[0] || null : null,
        status: q.status || 'new',
        is_read: q.is_read ?? false,
        created_at: q.created_at || '',
      });
      const mapContact = (c: any): RecentEnquiry => ({
        id: c.id, enquiry_type: 'contact',
        full_name: c.full_name || 'Not provided',
        email: c.email || '',
        mobile: c.phone || null,
        service: c.service || null,
        status: c.status || 'new',
        is_read: c.is_read ?? false,
        created_at: c.created_at || '',
      });

      const allRecent = [
        ...safeData(recentQR).map(mapQuote),
        ...safeData(recentCS).map(mapContact),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
      setRecentItems(allRecent);

      const allOverdue = [
        ...safeData(overdueQR).map(mapQuote),
        ...safeData(overdueCS).map(mapContact),
      ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).slice(0, 5);
      setOverdueItems(allOverdue);

      setLoadState('loaded');
    } catch {
      setErrorRef('DASH-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      setLoadState('error');
    }
  };

  if (loadState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-300 text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm w-full bg-[#111827] rounded-xl border border-gray-700 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-white font-bold mb-1">Dashboard Error</h2>
          <p className="text-gray-300 text-sm mb-1">The dashboard could not be loaded.</p>
          {errorRef && <p className="text-gray-500 text-xs font-mono mb-4">REF: {errorRef}</p>}
          <button onClick={loadDashboard} className="w-full py-2 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm">Retry</button>
        </div>
      </div>
    );
  }

  interface StatCard {
    label: string;
    value: number;
    color: string;
    icon: string;
    filterParam: string;
    description: string;
  }

  const statCards: StatCard[] = [
    {
      label: 'Total Quote Requests',
      value: metrics.totalQuotes,
      color: 'yellow',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      filterParam: 'quote',
      description: 'View all quote requests',
    },
    {
      label: 'Total Contact Submissions',
      value: metrics.totalContacts,
      color: 'blue',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      filterParam: 'contact',
      description: 'View all contact form submissions',
    },
    {
      label: 'New This Week',
      value: metrics.newThisWeek,
      color: 'green',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      filterParam: 'new',
      description: 'View enquiries from this week',
    },
    {
      label: 'Total Enquiries',
      value: metrics.totalEnquiries,
      color: 'purple',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      filterParam: 'all',
      description: 'View all enquiries',
    },
    {
      label: 'Unread Enquiries',
      value: metrics.unreadCount,
      color: 'blue',
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      filterParam: 'unread',
      description: 'View unread enquiries',
    },
    {
      label: 'Follow-ups Due Today',
      value: metrics.followupsDueToday,
      color: 'orange',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      filterParam: 'followup',
      description: 'View follow-ups due today',
    },
    {
      label: 'Overdue Follow-ups',
      value: metrics.overdueFollowups,
      color: 'red',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      filterParam: 'followup',
      description: 'View overdue follow-ups',
    },
    {
      label: 'Qualified Leads',
      value: metrics.qualifiedLeads,
      color: 'cyan',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      filterParam: 'qualified',
      description: 'View qualified leads',
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    yellow: { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/20', icon: 'text-yellow-400' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/20', icon: 'text-blue-400' },
    green: { bg: 'bg-green-500/10', text: 'text-green-300', border: 'border-green-500/20', icon: 'text-green-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20', icon: 'text-purple-400' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-300', border: 'border-orange-500/20', icon: 'text-orange-400' },
    red: { bg: 'bg-red-500/10', text: 'text-red-300', border: 'border-red-500/20', icon: 'text-red-400' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/20', icon: 'text-cyan-400' },
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Overview</h1>
        <p className="text-gray-400 text-sm mt-0.5">DIGITALNYNE Admin Dashboard</p>
      </div>

      {/* Overdue Alert */}
      {metrics.overdueFollowups > 0 && (
        <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-red-300 text-sm font-medium">
              {metrics.overdueFollowups} overdue follow-up{metrics.overdueFollowups !== 1 ? 's' : ''} require attention
            </p>
          </div>
          <Link href="/admin/enquiries?tab=followup" className="text-xs text-red-400 hover:text-red-300 font-medium whitespace-nowrap">View →</Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((card) => {
          const c = colorMap[card.color] || colorMap.blue;
          return (
            <Link
              key={card.label}
              href={`/admin/enquiries?tab=${card.filterParam}`}
              aria-label={card.description}
              className={`group bg-[#111827] rounded-xl border ${c.border} p-4 hover:bg-gray-800/60 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <svg className={`w-4 h-4 ${c.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={card.icon} />
                  </svg>
                </div>
                <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
              <p className="text-2xl font-extrabold text-white mb-1">{card.value}</p>
              <p className="text-xs text-gray-400 leading-tight">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/50 mb-5">
        <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <h2 className="text-white font-bold text-sm">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded">
            View All Enquiries →
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="text-gray-300 text-sm font-medium">No enquiries have been received yet.</p>
            <p className="text-gray-500 text-xs mt-1">Quote requests and contact submissions will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {recentItems.map((item) => (
              <Link
                key={`${item.enquiry_type}-${item.id}`}
                href={`/admin/enquiries?open=${item.id}&type=${item.enquiry_type}`}
                className={`px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-700/30 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${!item.is_read ? 'bg-blue-500/5' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {!item.is_read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" aria-label="Unread" />}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.enquiry_type === 'quote' ? 'bg-yellow-400/10' : 'bg-blue-400/10'}`}>
                    <span className={`text-xs font-bold ${item.enquiry_type === 'quote' ? 'text-yellow-400' : 'text-blue-400'}`}>
                      {item.enquiry_type === 'quote' ? 'Q' : 'C'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-yellow-400 transition-colors">{item.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-gray-400 text-xs truncate">{item.email || 'No email'}</p>
                      {item.mobile && <p className="text-gray-500 text-xs">{item.mobile}</p>}
                      {item.service && <p className="text-gray-500 text-xs truncate hidden sm:block">· {item.service}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border hidden sm:inline-flex ${STATUS_COLORS[item.status] || 'bg-gray-700/30 text-gray-400 border-gray-600/30'}`}>
                    {item.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="text-gray-500 text-xs" title={formatDateTime(item.created_at)}>{relativeTime(item.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Overdue Follow-ups Panel */}
      {overdueItems.length > 0 && (
        <div className="bg-[#111827] rounded-xl border border-red-500/20">
          <div className="px-5 py-4 border-b border-red-500/20 flex items-center justify-between">
            <h2 className="text-red-300 font-bold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Overdue Follow-ups
            </h2>
            <Link href="/admin/enquiries?tab=followup" className="text-xs text-red-400 hover:text-red-300 font-medium">View All →</Link>
          </div>
          <div className="divide-y divide-gray-700/30">
            {overdueItems.map((item) => (
              <Link
                key={`overdue-${item.enquiry_type}-${item.id}`}
                href={`/admin/enquiries?open=${item.id}&type=${item.enquiry_type}`}
                className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-red-500/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.full_name}</p>
                  <p className="text-gray-400 text-xs truncate">{item.email}</p>
                </div>
                <span className="text-xs text-red-400 font-medium whitespace-nowrap">Overdue</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
