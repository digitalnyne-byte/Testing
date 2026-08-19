'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type AuthState = 'loading' | 'unauthenticated' | 'unauthorized' | 'authorized' | 'error';

interface AdminUser {
  email: string;
  role: string;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  const fetchUnreadCount = useCallback(async () => {
    try {
      const supabase = createClient();
      const [qResult, cResult] = await Promise.allSettled([
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('is_read', false).is('archived_at', null),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false).is('archived_at', null),
      ]);
      const qCount = qResult.status === 'fulfilled' && !qResult.value.error ? (qResult.value.count ?? 0) : 0;
      const cCount = cResult.status === 'fulfilled' && !cResult.value.error ? (cResult.value.count ?? 0) : 0;
      setUnreadCount(qCount + cCount);
    } catch {
      // silently fail — badge is non-critical
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (!mounted) return;

        if (sessionError) {
          setErrorMessage('Session error: ' + sessionError.message);
          setAuthState('error');
          return;
        }

        if (!session) {
          setAuthState('unauthenticated');
          if (!isLoginPage) router.replace('/admin/login');
          return;
        }

        const { data: adminRecord, error: adminError } = await supabase
          .from('admin_users')
          .select('email, role, active')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!mounted) return;

        if (adminError) {
          setErrorMessage('Could not verify administrator access.');
          setAuthState('error');
          return;
        }

        if (!adminRecord || !adminRecord.active) {
          setAuthState('unauthorized');
          return;
        }

        setAdminUser({ email: session.user.email || adminRecord.email, role: adminRecord.role });
        setAuthState('authorized');
        fetchUnreadCount();

        if (isLoginPage) router.replace('/admin/dashboard');
      } catch {
        if (!mounted) return;
        setErrorMessage('Unexpected error during authentication.');
        setAuthState('error');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        setAuthState('unauthenticated');
        setAdminUser(null);
        if (!isLoginPage) router.replace('/admin/login');
        return;
      }
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (isLoginPage) return <>{children}</>;

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 font-medium text-sm">Loading DIGITALNYNE Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 font-medium text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (authState === 'unauthorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
        <div className="max-w-md w-full bg-[#111827] rounded-xl border border-gray-700 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300 text-sm mb-6">You are signed in, but this account does not have administrator access.</p>
          <button onClick={handleSignOut} className="w-full py-2.5 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (authState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
        <div className="max-w-md w-full bg-[#111827] rounded-xl border border-gray-700 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Dashboard Error</h1>
          <p className="text-gray-300 text-sm mb-2">The dashboard could not be loaded.</p>
          <p className="text-gray-500 text-xs mb-6 font-mono">REF: ADMIN-AUTH-ERR</p>
          <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="flex-1 py-2.5 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm">Retry</button>
            <button onClick={handleSignOut} className="flex-1 py-2.5 px-4 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-colors text-sm">Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: 'Overview',
      href: '/admin/dashboard',
      icon: <NavIcon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
      label: 'Enquiries',
      href: '/admin/enquiries',
      icon: <NavIcon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
      badge: unreadCount,
    },
    {
      label: 'Sales Pipeline',
      href: '/admin/pipeline',
      icon: <NavIcon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: <NavIcon d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: <NavIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-gray-700/50">
        <Link href="/admin/dashboard" className="flex flex-col items-start gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-lg" aria-label="DIGITALNYNE Admin Dashboard home">
          <Image
            src="/assets/images/79213-1786792642337.png"
            alt="DIGITALNYNE"
            width={160}
            height={40}
            className="object-contain max-h-10 w-auto brightness-0 invert group-hover:opacity-90 transition-opacity"
            priority
          />
          <span className="text-gray-400 text-xs font-medium tracking-wide mt-0.5">Admin Dashboard</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5" aria-label="Admin navigation">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                active
                  ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :'text-gray-300 hover:text-white hover:bg-gray-700/60 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={active ? 'text-yellow-400' : 'text-gray-400 group-hover:text-gray-200'}>{item.icon}</span>
                {item.label}
              </span>
              {item.badge != null && item.badge > 0 && (
                <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
            <span className="text-yellow-400 font-bold text-xs">
              {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{adminUser?.email}</p>
            <p className="text-gray-400 text-xs capitalize">{adminUser?.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full py-2 px-3 bg-gray-700/60 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0d1424] border-r border-gray-700/50 flex-col hidden lg:flex flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <aside className="relative w-72 bg-[#0d1424] border-r border-gray-700/50 flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-[#0d1424] border-b border-gray-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-gray-700/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image
              src="/assets/images/79213-1786792642337.png"
              alt="DIGITALNYNE"
              width={120}
              height={30}
              className="object-contain max-h-7 w-auto brightness-0 invert"
            />
          </Link>
          <button
            onClick={handleSignOut}
            className="text-gray-400 hover:text-white text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
          >
            Sign Out
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
