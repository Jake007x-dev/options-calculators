"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function CTABanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("cta-dismissed");
    if (!dismissed) {
      setVisible(true);
      return;
    }
    const dismissedAt = parseInt(dismissed, 10);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - dismissedAt > twentyFourHours) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("cta-dismissed", String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 border-t border-blue-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-white font-medium text-sm sm:text-base truncate">
            Ready to put this to work?
          </span>
          <a
            href="/open-account"
            className="flex-shrink-0 bg-white text-blue-600 font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Open a live account →
          </a>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-blue-200 hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
