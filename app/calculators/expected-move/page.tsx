"use client";

import { useMemo, useState } from "react";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InputSlider from "@/components/calculators/InputSlider";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

function BellCurve({ stockPrice, moveAmount }: { stockPrice: number; moveAmount: number }) {
  const width = 340, height = 130, cx = width / 2;
  const points: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * width;
    const z = ((x - cx) / (width / 6)) * 3;
    const y = height - 10 - (height - 20) * Math.exp(-0.5 * z * z);
    points.push([x, y]);
  }
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const sigma1L = stockPrice - moveAmount, sigma1H = stockPrice + moveAmount;
  const sigma2L = stockPrice - moveAmount * 2, sigma2H = stockPrice + moveAmount * 2;
  const scaleX = (price: number) => cx + ((price - stockPrice) / (moveAmount * 3)) * (width / 2);
  return (
    <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full max-w-sm mx-auto">
      <path d={`M ${scaleX(sigma2L)} ${height - 10} ${points.filter((p) => p[0] >= scaleX(sigma2L) && p[0] <= scaleX(sigma2H)).map((p, i) => `${i === 0 ? "L" : "L"} ${p[0]} ${p[1]}`).join(" ")} L ${scaleX(sigma2H)} ${height - 10} Z`} fill="rgba(234,179,8,0.12)" />
      <path d={`M ${scaleX(sigma1L)} ${height - 10} ${points.filter((p) => p[0] >= scaleX(sigma1L) && p[0] <= scaleX(sigma1H)).map((p, i) => `${i === 0 ? "L" : "L"} ${p[0]} ${p[1]}`).join(" ")} L ${scaleX(sigma1H)} ${height - 10} Z`} fill="rgba(59,130,246,0.18)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />
      <line x1={cx} y1={height - 10} x2={cx} y2={10} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x={cx} y={height + 20} textAnchor="middle" fill="#6b7280" fontSize="9">${stockPrice.toFixed(0)}</text>
      <text x={scaleX(sigma1L)} y={height + 20} textAnchor="middle" fill="#60a5fa" fontSize="9">${sigma1L.toFixed(0)}</text>
      <text x={scaleX(sigma1H)} y={height + 20} textAnchor="middle" fill="#60a5fa" fontSize="9">${sigma1H.toFixed(0)}</text>
      <text x={scaleX(sigma2L)} y={height + 20} textAnchor="middle" fill="#eab308" fontSize="9">${sigma2L.toFixed(0)}</text>
      <text x={scaleX(sigma2H)} y={height + 20} textAnchor="middle" fill="#eab308" fontSize="9">${sigma2H.toFixed(0)}</text>
      <text x={scaleX(sigma1L) - 4} y={40} textAnchor="end" fill="#60a5fa" fontSize="8">±1σ 68%</text>
      <text x={scaleX(sigma2H) + 4} y={40} textAnchor="start" fill="#eab308" fontSize="8">±2σ 95%</text>
    </svg>
  );
}

const PRESETS = [
  { label: "SPY 7-Day", mode: "iv" as const, S: 500, iv: 15, dte: 7, call: 4.5, put: 4.2 },
  { label: "AAPL Earnings", mode: "straddle" as const, S: 200, iv: 45, dte: 1, call: 4.5, put: 4.2 },
  { label: "NVDA 30-Day", mode: "iv" as const, S: 130, iv: 55, dte: 30, call: 4.5, put: 4.2 },
];

export default function ExpectedMovePage() {
  const [mode, setMode] = useState<"iv" | "straddle">("iv");
  const [stockPrice, setStockPrice] = useState(150);
  const [iv, setIv] = useState(30);
  const [dte, setDte] = useState(30);
  const [callPrice, setCallPrice] = useState(4.5);
  const [putPrice, setPutPrice] = useState(4.2);

  const calc = useMemo(() => {
    const moveDollar = mode === "iv" ? stockPrice * (iv / 100) * Math.sqrt(dte / 365) : (callPrice + putPrice) * 0.85;
    const movePct = (moveDollar / stockPrice) * 100;
    return { moveDollar, movePct, upper: stockPrice + moveDollar, lower: stockPrice - moveDollar };
  }, [mode, stockPrice, iv, dte, callPrice, putPrice]);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function applyPreset(p: typeof PRESETS[0]) {
    setMode(p.mode); setStockPrice(p.S); setIv(p.iv); setDte(p.dte); setCallPrice(p.call); setPutPrice(p.put);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Expected Move</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Free Expected Move Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Expected Move</p><p className="text-2xl font-bold text-blue-600">±${fmt(calc.moveDollar)}</p><p className="text-xs text-gray-400 mt-1">1 standard deviation</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Move %</p><p className="text-2xl font-bold text-gray-800">±{calc.movePct.toFixed(1)}%</p><p className="text-xs text-gray-400 mt-1">of stock price</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Upper Target</p><p className="text-2xl font-bold text-green-600">${fmt(calc.upper)}</p><p className="text-xs text-gray-400 mt-1">+1σ price level</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lower Target</p><p className="text-2xl font-bold text-red-500">${fmt(calc.lower)}</p><p className="text-xs text-gray-400 mt-1">−1σ price level</p></div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-gray-500 self-center">Quick load:</span>
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => applyPreset(p)} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors">{p.label}</button>
        ))}
      </div>

      {/* Calculator */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
        <div className="flex gap-2 mb-5">
          {(["iv", "straddle"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {m === "iv" ? "Mode A: IV-Based" : "Mode B: Straddle-Based"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={2000} step={0.5} prefix="$" />
          {mode === "iv" ? (
            <>
              <InputSlider label="Implied Volatility (%)" value={iv} onChange={setIv} min={1} max={200} step={0.5} suffix="%" />
              <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={365} step={1} suffix=" days" decimals={0} />
            </>
          ) : (
            <>
              <InputSlider label="ATM Call Price ($)" value={callPrice} onChange={setCallPrice} min={0.01} max={100} step={0.01} prefix="$" />
              <InputSlider label="ATM Put Price ($)" value={putPrice} onChange={setPutPrice} min={0.01} max={100} step={0.01} prefix="$" />
            </>
          )}
        </div>
        <div className="mt-5 bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-blue-600 text-sm font-medium mb-1">68% Probability Range</p>
          <p className="text-gray-500 text-xs mb-4">Stock stays between ${fmt(calc.lower)} – ${fmt(calc.upper)} with 68% probability</p>
          <BellCurve stockPrice={stockPrice} moveAmount={calc.moveDollar} />
        </div>
      </div>

      <InlineCTA heading="Trade around the expected move" body="Use our Iron Condor or Straddle setups to position around the expected range with defined risk." cta="View Strategies →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">What Is the Expected Move?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">The expected move is the options market's consensus forecast for how much a stock will move by expiration, expressed as a one-standard-deviation range. It represents a 68% probability — meaning the market believes there's a 68% chance the stock ends inside the range and a 32% chance it ends outside.</p>
      <p className="text-gray-600 leading-relaxed mb-6">This number comes directly from the prices traders are paying for options. When IV is high, traders expect big moves and pay more — the expected move widens. When IV is low, moves are expected to be small. Reading the expected move tells you what the collective market intelligence is pricing in.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["68% probability, not a guarantee", "The stock ends outside the expected move 32% of the time — more often than most traders realize."],
          ["Use for strike selection", "Sell options outside the expected move for higher probability. Buy them inside for better delta."],
          ["Straddle method is more direct", "Multiplying the ATM straddle by 0.85 captures the market's actual risk pricing better than IV math in some cases."],
          ["Compare to historical moves", "If the expected move on AAPL earnings is 5% but AAPL has moved 9%+ on the last 4 earnings, the straddle is priced too cheaply."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="expected-move" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
