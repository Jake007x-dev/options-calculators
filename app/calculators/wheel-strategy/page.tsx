"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ClientOnly from "@/components/calculators/ClientOnly";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "SPY Wheel", stock: 500, otm: 2, premium: 1.8, dte: 30, contracts: 1, account: 50000, ticker: "SPY" },
  { label: "AAPL Wheel", stock: 180, otm: 5, premium: 2.5, dte: 30, contracts: 5, account: 90000, ticker: "AAPL" },
  { label: "QQQ Wheel", stock: 470, otm: 3, premium: 3.2, dte: 21, contracts: 2, account: 94000, ticker: "QQQ" },
];

export default function WheelStrategyPage() {
  const [stockPrice, setStockPrice] = useState(100);
  const [otmPct, setOtmPct] = useState(5);
  const [premium, setPremium] = useState(1.5);
  const [dte, setDte] = useState(30);
  const [contracts, setContracts] = useState(5);
  const [accountSize, setAccountSize] = useState(50000);
  const [ticker, setTicker] = useState("AAPL");

  const calc = useMemo(() => {
    const targetStrike = stockPrice * (1 - otmPct / 100);
    const premiumPerCycle = premium * 100 * contracts;
    const cyclesPerYear = 365 / dte;
    const annualizedPremium = premiumPerCycle * cyclesPerYear;
    const annualizedYield = (annualizedPremium / accountSize) * 100;
    const monthlyIncome = annualizedPremium / 12;
    const effectiveCostBasis = targetStrike - premium;
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, income: Math.round(monthlyIncome) }));
    return { targetStrike, premiumPerCycle, annualizedYield, monthlyIncome, annualizedPremium, cyclesPerYear, effectiveCostBasis, monthlyData };
  }, [stockPrice, otmPct, premium, dte, contracts, accountSize]);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function applyPreset(p: typeof PRESETS[0]) {
    setTicker(p.ticker); setStockPrice(p.stock); setOtmPct(p.otm); setPremium(p.premium);
    setDte(p.dte); setContracts(p.contracts); setAccountSize(p.account);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Wheel Strategy Income</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Wheel Strategy Income Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target Strike</p><p className="text-2xl font-bold text-gray-800">${fmt(calc.targetStrike)}</p><p className="text-xs text-gray-400 mt-1">{otmPct}% OTM</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Premium / Cycle</p><p className="text-2xl font-bold text-green-600">${fmt(calc.premiumPerCycle)}</p><p className="text-xs text-gray-400 mt-1">{contracts} contracts</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Monthly Income</p><p className="text-2xl font-bold text-blue-600">${fmt(calc.monthlyIncome)}</p><p className="text-xs text-gray-400 mt-1">projected avg</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annualized Yield</p><p className="text-2xl font-bold text-green-600">{calc.annualizedYield.toFixed(1)}%</p><p className="text-xs text-gray-400 mt-1">on account size</p></div>
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
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-gray-800">Wheel Strategy Calculator</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Ticker:</span>
            <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} maxLength={6} className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-900 focus:outline-none focus:border-blue-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
          <InputSlider label="Target Strike (% OTM)" value={otmPct} onChange={setOtmPct} min={0} max={20} step={0.5} suffix="%" />
          <InputSlider label="Premium per Contract ($)" value={premium} onChange={setPremium} min={0.01} max={50} step={0.01} prefix="$" />
          <InputSlider label="DTE per Cycle" value={dte} onChange={setDte} min={1} max={90} step={1} suffix=" days" decimals={0} />
          <InputSlider label="Number of Contracts" value={contracts} onChange={setContracts} min={1} max={100} step={1} suffix=" contracts" decimals={0} />
          <InputSlider label="Account Size ($)" value={accountSize} onChange={setAccountSize} min={1000} max={1000000} step={1000} prefix="$" />
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Projected Monthly Income — {ticker}</p>
          <ClientOnly height={180}>
            <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calc.monthlyData} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="#e5e7eb" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="#e5e7eb" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Income"]} />
                <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3"><p className="text-gray-500 mb-0.5">Cycles per Year</p><p className="font-bold text-gray-800">{calc.cyclesPerYear.toFixed(1)}</p></div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3"><p className="text-gray-500 mb-0.5">Effective Cost Basis</p><p className="font-bold text-gray-800">${fmt(calc.effectiveCostBasis)}</p></div>
        </div>
      </div>

      <InlineCTA heading="Learn the full Wheel Strategy" body="See the complete 3-phase income cycle — CSP, assignment, and covered call — with a worked AAPL example." cta="Read the Strategy Guide →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">How the Wheel Generates Income</h2>
      <p className="text-gray-600 leading-relaxed mb-4">The Wheel turns on three phases: sell a cash-secured put below the stock price → if assigned, sell covered calls above cost basis → if called away, repeat. Premium flows in at every step, regardless of whether the stock moves up or down.</p>
      <p className="text-gray-600 leading-relaxed mb-6">The key insight is that you're always getting paid. If the put expires worthless, you keep the premium and sell again. If you're assigned, you now own the stock at below-market prices AND you can immediately start selling covered calls to generate more income. Assignment isn't a loss — it's Phase 2.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Only run the Wheel on stocks you want to own", "If assigned, you hold the shares. Never run the Wheel on a stock you wouldn't hold long-term."],
          ["30 DTE is the income sweet spot", "Captures the steepest part of the theta decay curve while giving you enough time before earnings risk."],
          ["High IV environments maximize income", "Premium is fatter when IV is elevated. Check IV Rank before selling — ideally IVR > 30."],
          ["Avoid running through earnings", "A big post-earnings gap can put you far underwater on shares. Check the earnings date before each cycle."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="wheel-strategy" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
