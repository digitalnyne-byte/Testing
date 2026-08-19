'use client';

import React from 'react';
import Link from 'next/link';

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">{title}</h1>
      </div>
      <div className="bg-[#111827] rounded-xl border border-gray-700/50 p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-white font-bold text-lg mb-2">{title}</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">{description}</p>
        <Link href="/admin/dashboard" className="inline-block mt-6 px-5 py-2.5 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
          Back to Overview
        </Link>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <ComingSoon
      title="Sales Pipeline"
      description="Track your leads through the sales funnel — from first contact to closed deal. Coming soon."
    />
  );
}
