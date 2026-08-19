'use client';

import React from 'react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">Analytics</h1>
        <p className="text-gray-400 text-xs mt-0.5">Visitor and enquiry analytics</p>
      </div>

      {/* Visitor Analytics Notice */}
      <div className="bg-[#111827] rounded-xl border border-blue-500/20 p-5 mb-5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">Visitor Analytics</h3>
            <p className="text-gray-300 text-sm">
              Anonymous visitor data (page views, sessions, device types, traffic sources) is tracked via Google Analytics.
              Visitor identities — names, phone numbers, email addresses — are <strong className="text-white">only available after a visitor voluntarily submits a form</strong>.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              No visitor fingerprinting or anonymous identity resolution is performed.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] rounded-xl border border-gray-700/50 p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Analytics Dashboard</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">Detailed analytics charts and conversion tracking coming soon.</p>
        <Link href="/admin/dashboard" className="inline-block mt-6 px-5 py-2.5 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm">
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
