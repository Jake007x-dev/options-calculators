"use client";

import { useMemo, useState } from "react";
import { impliedVolatility } from "@/lib/blackScholes";
import InputSlider from "@/components/calculators/InputSlider";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "SPY 30-Day ATM", S: 500, K: 500, dte: 30, mp: 8.5, r: 5.25, type: "call" as const },
  { label: "AAPL Pre-Earnings", S: 200, K: 205, dte: 7, mp: 4.2, r: 5.25, type: "call" as const },
  { label: "NVDA High IV", S: 130, K: 135, dte: 45, mp: 9.8, r: 5.25, type: "call" as const },
];

export default function ImpliedVolatilityPage() {
  const [stockPrice, setStockPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [dte, setDte] = useState(30);
  const [marketPrice, setMarketPrice] = useState(3.5);
  const [riskFreeRate, setRiskFreeRate] = useState(5.25);
  const [optionType, setOptionType] = useState<"call" | "put">("call");

  const result = useMemo(() => {
    const T = dte / 365;
    const r = riskFreeRate / 100;
    return impliedVolatility(marketPrice, stockPrice, strikePrice, T, r, 0, optionType);
  }, [stockPrice, strikePrice, dte, marketPrice, riskFreeRate, optionType]);

  const ivPct = result !== null ? result * 100 : null;
  const ivColor = ivPct === null ? "#9ca3af" : ivPct < 30 ? "#22c55e" : ivPct < 60 ? "#eab308" : "#ef4444";
  const ivLabel = ivPct === null ? "No solution" : ivPct < 30 ? "Low IV" : ivPct < 60 ? "Moderate IV" : "High IV";
  const ivBarValue = Math.min(ivPct ?? 0, 100);

  function applyPreset(p: typeof PRESETS[0]) {
    setStockPrice(p.S); setStrikePrice(p.K); setDte(p.dte);
    setMarketPrice(p.mp); setRiskFreeRate(p.r); setOptionType(p.type);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Implied Volatility</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Free Implied Volatility Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero output */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Implied Volatility</p>
          <p className="text-3xl font-bold" style={{ color: ivColor }}>{ivPct !== null ? `${ivPct.toFixed(1)}%` : "—"}</p>
          <p className="text-xs text-gray-400 mt-1">{ivLabel}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">IV Level</p>
          <div className="mt-2 h-3 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-3 rounded-full transition-all duration-300" style={{ width: `${ivBarValue}%`, backgroundColor: ivColor }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Low</span><span>Med</span><span>High</span></div>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signal</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{ivPct !== null ? (ivPct < 30 ? "Buy options" : ivPct < 60 ? "Neutral" : "Sell premium") : "—"}</p>
          <p className="text-xs text-gray-400 mt-1">{ivPct !== null ? (ivPct < 30 ? "IV is cheap" : ivPct < 60 ? "Fair value" : "IV is rich") : ""}</p>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-gray-500 self-center">Quick load:</span>
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => applyPreset(p)} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors">
            {p.label}
          </button>
        ))}
      </div>

      {/* Calculator widget */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-gray-800">Implied Volatility Calculator</p>
          <div className="flex gap-2">
            {(["call", "put"] as const).map((t) => (
              <button key={t} onClick={() => setOptionType(t)} className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${optionType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
          <InputSlider label="Strike Price ($)" value={strikePrice} onChange={setStrikePrice} min={1} max={1000} step={0.5} prefix="$" />
          <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={365} step={1} suffix=" days" decimals={0} />
          <InputSlider label="Option Market Price ($)" value={marketPrice} onChange={setMarketPrice} min={0.01} max={100} step={0.01} prefix="$" />
          <InputSlider label="Risk-Free Rate (%)" value={riskFreeRate} onChange={setRiskFreeRate} min={0} max={15} step={0.25} suffix="%" />
        </div>
      </div>

      <InlineCTA heading="Compare IV to your Greeks in real time" body="Use our Black-Scholes calculator to see how this IV affects option pricing and all five Greeks simultaneously." cta="Open Black-Scholes →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">What Is Implied Volatility?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Implied volatility (IV) is the market's forward-looking expectation of how much a stock will move, expressed as an annualized percentage. It's calculated by taking a real option's market price and back-solving the Black-Scholes model until the theoretical price matches the market price. This calculator does that in milliseconds using Newton-Raphson iteration.</p>
      <p className="text-gray-600 leading-relaxed mb-6">IV rises when traders expect large moves (earnings, FDA decisions, FOMC). It falls after those events resolve — this collapse is called a "volatility crush" and is one of the most costly surprises for new options buyers.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example — Reading IV Context</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">AAPL 30-Day ATM Call — IV Interpretation</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Stock at <strong>$200</strong>, ATM call trading at <strong>$5.50</strong>, 30 DTE</li>
          <li>• Back-solve gives IV = <strong>34%</strong></li>
          <li>• 52-week IV range: 18%–58% → IV Rank = <strong>43</strong> (moderately elevated)</li>
          <li>• Signal: options are slightly expensive — consider selling rather than buying</li>
          <li>• After earnings, IV collapses to 20% → the same call is now worth ~$2.80 even if the stock doesn't move</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">IV Interpretation Guide</h2>
      <div className="space-y-3 mb-8">
        {[
          { range: "IV < 30%", label: "Low IV", color: "border-green-200 bg-green-50", textColor: "text-green-700", action: "Options are cheap. Favor buying strategies: long calls, long puts, debit spreads, straddles. Rising IV will increase option value even before the stock moves." },
          { range: "IV 30–60%", label: "Moderate IV", color: "border-yellow-200 bg-yellow-50", textColor: "text-yellow-700", action: "Fair value. Both buying and selling strategies can work. Check IV Rank vs. the 52-week range to determine if it's trending up or down." },
          { range: "IV > 60%", label: "High IV", color: "border-red-200 bg-red-50", textColor: "text-red-700", action: "Options are expensive. Favor selling premium: iron condors, short strangles, covered calls. IV crush after events will rapidly deflate option prices." },
        ].map((row) => (
          <div key={row.range} className={`rounded-xl border ${row.color} px-4 py-3 text-sm`}>
            <span className={`font-bold ${row.textColor}`}>{row.range} ({row.label}): </span>
            <span className="text-gray-600">{row.action}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["IV is not direction", "High IV just means the market expects a big move — not which direction. You need a directional view separately."],
          ["IV is mean-reverting", "Extreme IV levels don't last. High IV tends to fall; low IV tends to rise. This creates opportunities to sell expensive or buy cheap options."],
          ["IV crush is the top killer of options buyers", "Buying options before earnings and seeing IV collapse after is the most common way traders lose money even with a correct direction call."],
          ["Use IV Rank for context", "Raw IV numbers mean nothing without historical context. An IV of 40% is high for one stock and low for another. Always check the 52-week range."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="implied-volatility" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
