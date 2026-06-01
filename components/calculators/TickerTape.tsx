"use client";

import { useEffect, useRef } from "react";

const TICKERS = [
  { sym: "SPY", price: "542.31", change: "+1.24", pct: "+0.23%", up: true },
  { sym: "QQQ", price: "461.87", change: "+2.10", pct: "+0.46%", up: true },
  { sym: "AAPL", price: "213.07", change: "-0.88", pct: "-0.41%", up: false },
  { sym: "TSLA", price: "248.50", change: "+5.32", pct: "+2.19%", up: true },
  { sym: "NVDA", price: "128.64", change: "+3.15", pct: "+2.51%", up: true },
  { sym: "MSFT", price: "415.20", change: "-1.43", pct: "-0.34%", up: false },
  { sym: "AMZN", price: "192.45", change: "+0.97", pct: "+0.51%", up: true },
  { sym: "META", price: "536.12", change: "+7.84", pct: "+1.48%", up: true },
  { sym: "GOOGL", price: "178.32", change: "-0.55", pct: "-0.31%", up: false },
  { sym: "VIX", price: "14.82", change: "-0.63", pct: "-4.08%", up: false },
  { sym: "GLD", price: "231.09", change: "+1.02", pct: "+0.44%", up: true },
  { sym: "TLT", price: "91.45", change: "-0.28", pct: "-0.31%", up: false },
  { sym: "IWM", price: "205.33", change: "+0.76", pct: "+0.37%", up: true },
  { sym: "DIA", price: "399.87", change: "+1.54", pct: "+0.39%", up: true },
];

export default function TickerTape() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-[#0F1629] border-b border-gray-800 overflow-hidden h-9 flex items-center">
      <div className="flex-shrink-0 bg-blue-600 text-white text-xs font-bold px-3 h-full flex items-center z-10">
        MARKETS
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={trackRef}
          className="flex gap-0 animate-ticker whitespace-nowrap"
          style={{ animation: "ticker 40s linear infinite" }}
        >
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-4 text-xs border-r border-gray-700 h-9">
              <span className="text-white font-semibold">{t.sym}</span>
              <span className="text-gray-300">{t.price}</span>
              <span className={t.up ? "text-green-400" : "text-red-400"}>
                {t.up ? "▲" : "▼"} {t.change} ({t.pct})
              </span>
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
