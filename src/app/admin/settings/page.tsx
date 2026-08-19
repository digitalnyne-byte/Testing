'use client';

import React from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">Settings</h1>
        <p className="text-gray-400 text-xs mt-0.5">Admin configuration</p>
      </div>
      <div className="bg-[#111827] rounded-xl border border-gray-700/50 p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Settings</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">Admin user management, notification preferences, and configuration coming soon.</p>
        <Link href="/admin/dashboard" className="inline-block mt-6 px-5 py-2.5 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm">
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
