"use client";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function TopNav() {
  const { theme, toggle } = useTheme();
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/calculators" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0F1629] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 20 20" fill="white" width="14" height="14">
              <rect x="2" y="2" width="6" height="6" rx="1" />
              <rect x="12" y="2" width="6" height="6" rx="1" />
              <rect x="2" y="12" width="6" height="6" rx="1" />
              <rect x="12" y="12" width="6" height="6" rx="1" />
            </svg>
          </div>
          <div className="leading-none">
            <p className="font-bold text-gray-900 dark:text-white text-sm">TradingBlock</p>
            <p className="text-gray-400 text-[10px] mt-0.5">Options Hub · by Jake Joseph</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link
            href="/open-account"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Open a Live Account →
          </Link>
        </div>
      </div>
    </header>
  );
}
