import React from 'react';

const pillars = [
  { icon: '🎯', label: 'Strategy-Led Solutions' },
  { icon: '🤝', label: 'Customer-Focused Execution' },
  { icon: '💬', label: 'Transparent Communication' },
  { icon: '📈', label: 'Measurable Growth' },
  { icon: '🔧', label: 'Flexible Service Options' },
];

export default function TrustStrip() {
  return (
    <section className="bg-background py-8 border-b border-border" aria-label="Trust pillars">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {pillars?.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-border shadow-sm">
              <span className="text-base">{p?.icon}</span>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{p?.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}