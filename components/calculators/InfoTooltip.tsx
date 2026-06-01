"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";

interface InfoTooltipProps {
  content: string;
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        className="text-gray-500 hover:text-gray-300 transition-colors ml-1"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label="More information"
      >
        <HelpCircle size={13} />
      </button>
      {open && (
        <span className="absolute left-5 bottom-0 z-50 w-56 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg p-2.5 shadow-xl leading-relaxed pointer-events-none">
          {content}
        </span>
      )}
    </span>
  );
}
