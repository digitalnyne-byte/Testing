'use client';
import React, { useState } from 'react';

const WHATSAPP_NUMBER = '919398461937';

const routingOptions = [
  { id: 'marketing', label: 'Digital Marketing Services', icon: '📊', message: "Hello DIGITALNYNE, I am interested in Digital Marketing services. My business name is ________. I would like to discuss my requirements." },
  { id: 'website', label: 'Website or Digital Presence', icon: '🌐', message: "Hello DIGITALNYNE, I am interested in Website / Digital Presence services. My business name is ________. I would like to discuss my requirements." },
  { id: 'content', label: 'Content Creation', icon: '✍️', message: "Hello DIGITALNYNE, I am interested in Content Creation services. My business name is ________. I would like to discuss my requirements." },
  { id: 'video', label: 'Video Editing', icon: '🎬', message: "Hello DIGITALNYNE, I am interested in Video Editing services. My business name is ________. I would like to discuss my requirements." },
  { id: 'branding', label: 'Branding', icon: '🎨', message: "Hello DIGITALNYNE, I am interested in Branding services. My business name is ________. I would like to discuss my requirements." },
  { id: 'leads', label: 'Sales and Lead Generation', icon: '🎯', message: "Hello DIGITALNYNE, I am interested in Sales and Lead Generation services. My business name is ________. I would like to discuss my requirements." },
  { id: 'advertising', label: 'Advertising (Google / Meta)', icon: '📢', message: "Hello DIGITALNYNE, I am interested in Advertising services. My business name is ________. I would like to discuss my requirements." },
  { id: 'choose', label: 'Help Me Choose', icon: '🤝', message: "Hello DIGITALNYNE, I need help choosing the right service for my business. My business name is ________. Could you guide me?" },
  { id: 'support', label: 'Existing Client Support', icon: '💬', message: "Hello DIGITALNYNE, I am an existing client and need support. My business name is ________." },
];

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  const handleOption = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Routing Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="gradient-brand p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">Chat with DIGITALNYNE</p>
                <p className="text-white/80 text-xs mt-0.5">Select a topic to get started</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Close WhatsApp panel"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-3 max-h-80 overflow-y-auto">
            {routingOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleOption(opt.message)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left group"
              >
                <span className="text-xl w-8 flex-shrink-0">{opt.icon}</span>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                <svg className="ml-auto w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center whatsapp-pulse transition-transform hover:scale-110"
        aria-label="Open WhatsApp chat"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
    </>
  );
}