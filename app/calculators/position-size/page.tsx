"use client";

import { useMemo, useState } from "react";
import InputSlider from "@/components/calculators/InputSlider";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

function RiskGauge({ pct }: { pct: number }) {
  const clamped = Math.min(pct, 10);
  const angle = (clamped / 10) * 180;
  const cx = 80, cy = 80, r = 60;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcStart = { x: cx - r, y: cy };
  const arcEnd = { x: cx + r * Math.cos(Math.PI - toRad(angle)), y: cy - r * Math.sin(toRad(angle)) };
  const needleX = cx + (r - 10) * Math.cos(Math.PI - toRad(angle));
  const needleY = cy - (r - 10) * Math.sin(toRad(angle));
  const color = pct < 1.5 ? "#22c55e" : pct < 3 ? "#eab308" : "#ef4444";
  return (
    <svg viewBox="0 0 160 100" className="w-36 mx-auto">
      <path d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
      <path d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${angle > 90 ? 1 : 0} 1 ${arcEnd.x} ${arcEnd.y}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#374151" />
      <text x={cx - r - 4} y={cy + 16} textAnchor="middle" fill="#9ca3af" fontSize="8">0%</text>
      <text x={cx + r + 4} y={cy + 16} textAnchor="middle" fill="#9ca3af" fontSize="8">10%</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill={color} fontSize="13" fontWeight="600">{pct.toFixed(1)}%</text>
    </svg>
  );
}

const PRESETS = [
  { label: "Conservative $50k", account: 50000, risk: 1, premium: 3.5, stop: 50, legs: 1 },
  { label: "Standard $100k", account: 100000, risk: 2, premium: 5, stop: 50, legs: 1 },
  { label: "Spreads $50k", account: 50000, risk: 2, premium: 2, stop: 100, legs: 2 },
];

export default function PositionSizePage() {
  const [accountSize, setAccountSize] = useState(50000);
  const [maxRiskPct, setMaxRiskPct] = useState(2);
  const [premium, setPremium] = useState(3.5);
  const [stopLossPct, setStopLossPct] = useState(50);
  const [legs, setLegs] = useState(1);

  const calc = useMemo(() => {
    const maxDollarRisk = accountSize * (maxRiskPct / 100);
    const dollarAtRiskPerContract = premium * 100 * (stopLossPct / 100) * legs;
    const maxContracts = dollarAtRiskPerContract > 0 ? Math.floor(maxDollarRisk / dollarAtRiskPerContract) : 0;
    const totalDollarRisk = maxContracts * dollarAtRiskPerContract;
    const positionValue = maxContracts * premium * 100 * legs;
    const portfolioPct = (positionValue / accountSize) * 100;
    const stopTriggerPrice = premium * (1 - stopLossPct / 100);
    return { maxDollarRisk, maxContracts, totalDollarRisk, positionValue, portfolioPct, stopTriggerPrice };
  }, [accountSize, maxRiskPct, premium, stopLossPct, legs]);

  const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  function applyPreset(p: typeof PRESETS[0]) {
    setAccountSize(p.account); setMaxRiskPct(p.risk); setPremium(p.premium); setStopLossPct(p.stop); setLegs(p.legs);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Position Size & Risk</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Options Position Size & Risk Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Contracts</p><p className="text-3xl font-bold text-blue-600">{calc.maxContracts}</p><p className="text-xs text-gray-400 mt-1">at your risk limit</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">$ at Risk</p><p className="text-3xl font-bold text-red-500">${fmt(calc.totalDollarRisk, 0)}</p><p className="text-xs text-gray-400 mt-1">if stop is hit</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Position Value</p><p className="text-3xl font-bold text-gray-800">${fmt(calc.positionValue, 0)}</p><p className="text-xs text-gray-400 mt-1">total premium</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Stop Trigger</p><p className="text-3xl font-bold text-orange-500">${fmt(calc.stopTriggerPrice)}</p><p className="text-xs text-gray-400 mt-1">exit price per contract</p></div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="sm:col-span-2 flex items-center justify-center gap-8">
            <RiskGauge pct={maxRiskPct} />
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-1">{maxRiskPct < 1.5 ? "Conservative" : maxRiskPct < 3 ? "Standard" : "Aggressive"}</p>
              <p className="text-xs text-gray-500">{maxRiskPct < 1.5 ? "Good capital preservation" : maxRiskPct < 3 ? "Professional standard range" : "High risk of account damage"}</p>
            </div>
          </div>
          <InputSlider label="Account Size ($)" value={accountSize} onChange={setAccountSize} min={1000} max={1000000} step={1000} prefix="$" decimals={0} />
          <InputSlider label="Max Risk per Trade (%)" value={maxRiskPct} onChange={setMaxRiskPct} min={0.5} max={5} step={0.5} suffix="%" />
          <InputSlider label="Option Premium per Contract ($)" value={premium} onChange={setPremium} min={0.01} max={100} step={0.01} prefix="$" />
          <InputSlider label="Stop Loss Level (% of premium)" value={stopLossPct} onChange={setStopLossPct} min={10} max={100} step={5} suffix="%" decimals={0} />
          <div>
            <label className="text-sm text-gray-700 font-medium block mb-2">Number of Legs</label>
            <div className="flex gap-2">
              {[1, 2].map((l) => (
                <button key={l} onClick={() => setLegs(l)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${legs === l ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{l} leg{l > 1 ? "s" : ""}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InlineCTA heading="Size your positions with confidence" body="Open a live account with risk controls and position limits built into every order." cta="Open a Live Account →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">The 1–2% Rule</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Professional traders risk 1–2% of their account on any single trade. This rule sounds conservative but it has a powerful mathematical purpose: if you risk 2% per trade and have a 10-loss streak, you've only drawn down ~18%. At 5% per trade, the same streak draws you down ~40% — requiring a 67% gain just to break even.</p>
      <p className="text-gray-600 leading-relaxed mb-6">The stop loss level matters just as much as the risk percentage. A 50% stop on a long option means you exit when the option has lost half its value. Setting the stop too tight forces you out of good trades; too loose means you lose more than planned.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Risk is defined before you enter", "Calculate your max contracts BEFORE placing the order. Never work backwards from the position size you 'want'."],
          ["50% stop is the common benchmark", "Many professional options traders exit at 50% of max loss. It preserves capital and forces discipline."],
          ["1-leg vs. 2-leg changes everything", "A spread has two legs of premium — double the risk per contract. Factor this in when sizing defined-risk spreads."],
          ["Consistency compounds", "A trader risking exactly 1% per trade with consistent execution will dramatically outperform someone taking variable-sized gambles."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="position-size" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
