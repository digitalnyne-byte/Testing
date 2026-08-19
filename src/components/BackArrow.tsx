'use client';
import React, { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const STACK_KEY = 'dn_nav_stack';
const SITE_ORIGIN =
  typeof window !== 'undefined' ? window.location.origin : '';

function getStack(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(sessionStorage.getItem(STACK_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStack(stack: string[]) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STACK_KEY, JSON.stringify(stack));
  } catch {
    // ignore
  }
}

/** Call this from every page to push the current path onto the stack. */
export function useNavStackPush() {
  const pathname = usePathname();
  useEffect(() => {
    const stack = getStack();
    const last = stack[stack.length - 1];
    // Avoid duplicate entries caused by rerenders or same-route navigations
    if (last !== pathname) {
      stack.push(pathname);
      // Keep the stack bounded to 50 entries
      if (stack.length > 50) stack.shift();
      saveStack(stack);
    }
  }, [pathname]);
}

export default function BackArrow() {
  const router = useRouter();
  const pathname = usePathname();

  // Push current path onto the stack on every navigation
  useNavStackPush();

  // Hide completely on the Home page — no element rendered, no spacing
  if (pathname === '/') return null;

  const handleBack = useCallback(() => {
    const stack = getStack();
    // The last entry is the current page; we want the one before it
    // Find the most recent entry that differs from the current path
    let prevPath: string | null = null;
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i] !== pathname) {
        prevPath = stack[i];
        // Trim the stack so we don't revisit the same entry again
        saveStack(stack.slice(0, i + 1));
        break;
      }
    }

    if (prevPath) {
      // Ensure it's an internal path (starts with '/')
      if (prevPath.startsWith('/')) {
        router.push(prevPath);
        return;
      }
    }

    // Fallback: go to Home
    router.push('/');
  }, [router, pathname]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBack();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      onKeyDown={handleKeyDown}
      aria-label="Go back"
      className="fixed top-20 left-4 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-border shadow-md hover:shadow-lg hover:border-primary hover:text-primary text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:top-24 md:left-6"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  );
}
