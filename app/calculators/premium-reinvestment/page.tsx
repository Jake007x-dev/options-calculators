"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ClientOnly from "@/components/calculators/ClientOnly";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "Wheel $50k Account", startBalance: 50000, monthlyPremium: 800, years: 20, annualReturn: 7 },
  { label: "Covered Call $100k", startBalance: 100000, monthlyPremium: 1400, years: 20, annualReturn: 7 },
  { label: "Starter $25k — 30yr", startBalance: 25000, monthlyPremium: 400, years: 30, annualReturn: 8 },
];

export default function PremiumReinvestmentPage() {
  const [startBalance, setStartBalance] = useState(50000);
  const [monthlyPremium, setMonthlyPremium] = useState(800);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(7);

  function applyPreset(p: typeof PRESETS[0]) {
    setStartBalance(p.startBalance); setMonthlyPremium(p.monthlyPremium);
    setYears(p.years); setAnnualReturn(p.annualReturn);
  }

  const calc = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const spRate = 10 / 100 / 12; // S&P 500 passive (no premium)

    const chartData = Array.from({ length: years + 1 }, (_, yr) => {
      let optionsBalance = startBalance;
      let passiveBalance = startBalance;
      for (let m = 0; m < yr * 12; m++) {
        optionsBalance = optionsBalance * (1 + monthlyRate) + monthlyPremium;
        passiveBalance = passiveBalance * (1 + spRate);
      }
      return {
        year: yr,
        options: Math.round(optionsBalance),
        passive: Math.round(passiveBalance),
      };
    });

    const finalOptions = chartData[years].options;
    const finalPassive = chartData[years].passive;
    const totalPremium = monthlyPremium * 12 * years;
    const totalGrowth = finalOptions - startBalance - totalPremium;
    const advantage = finalOptions - finalPassive;

    return { chartData, finalOptions, finalPassive, totalPremium, totalGrowth, advantage };
  }, [startBalance, monthlyPremium, years, annualReturn]);

  const fmt = (n: number) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtK = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}k`;

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">What If I Invested My Premium?</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">"What If I Reinvested My Options Premium?" Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ending Balance</p><p className="text-3xl font-bold text-green-600">{fmtK(calc.finalOptions)}</p><p className="text-xs text-gray-400 mt-1">options + reinvestment</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Premium</p><p className="text-2xl font-bold text-blue-600">${fmt(calc.totalPremium)}</p><p className="text-xs text-gray-400 mt-1">collected over {years} yrs</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Compounding Gain</p><p className="text-2xl font-bold text-purple-600">${fmt(calc.totalGrowth)}</p><p className="text-xs text-gray-400 mt-1">growth on top of premium</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">vs. Passive S&P</p><p className="text-2xl font-bold text-orange-500">+{fmtK(calc.advantage)}</p><p className="text-xs text-gray-400 mt-1">additional wealth</p></div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <InputSlider label="Starting Account ($)" value={startBalance} onChange={setStartBalance} min={1000} max={1000000} step={1000} prefix="$" decimals={0} />
          <InputSlider label="Monthly Premium Collected ($)" value={monthlyPremium} onChange={setMonthlyPremium} min={50} max={20000} step={50} prefix="$" decimals={0} />
          <InputSlider label="Time Horizon (years)" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" years" decimals={0} />
          <InputSlider label="Annual Portfolio Return (%)" value={annualReturn} onChange={setAnnualReturn} min={1} max={20} step={0.5} suffix="%" />
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Portfolio Growth Over Time</p>
          <p className="text-xs text-gray-400 mb-3"><span className="text-blue-500 font-medium">Blue</span> = Options strategy + reinvestment · <span className="text-gray-400 font-medium">Gray</span> = Passive S&P 500 (10% avg, no premium)</p>
          <ClientOnly height={240}>
            <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calc.chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                <defs>
                  <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `Yr ${v}`} label={{ value: "Years", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`} width={60} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v, name) => [`$${Number(v).toLocaleString()}`, name === "options" ? "Options Strategy" : "Passive S&P"]} labelFormatter={(l) => `Year ${l}`} />
                <Area type="monotone" dataKey="passive" stroke="#9ca3af" strokeWidth={1.5} fill="url(#passGrad)" dot={false} />
                <Area type="monotone" dataKey="options" stroke="#3b82f6" strokeWidth={2.5} fill="url(#optGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>
      </div>

      <InlineCTA heading="Start collecting premium to reinvest" body="The Wheel Strategy is the most systematic way to generate consistent monthly premium from stocks you already want to own." cta="Open Wheel Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">The Power of Reinvesting Options Premium</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Passive investing in the S&P 500 relies entirely on price appreciation and dividends — averaging around 10% annually. Options income strategies add a third income stream: premium. When that monthly premium is reinvested into the same portfolio (buying more shares, adding to your account, or selling more contracts), compounding accelerates dramatically.</p>
      <p className="text-gray-600 leading-relaxed mb-6">The key insight is that premium income doesn't require the market to go up. In flat markets — where passive investors make nothing — the wheel trader still collects premium every month. That income, reinvested consistently, creates a significant wealth gap over 20–30 years.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Premium + compounding is a wealth multiplier", "Monthly premium that gets reinvested compounds just like dividends — the longer the horizon, the bigger the gap vs. passive."],
          ["Start early, stay consistent", "The difference between 20 years and 30 years of reinvesting premium is enormous. Time is your biggest edge."],
          ["Market-neutral income matters in flat years", "The S&P returned near zero in 2015, 2018, and 2022. Options sellers still collected premium in all three years."],
          ["Match premium to account size", "Collecting $800/month on a $10k account means taking enormous risk. Target 1–2% monthly premium on total account value."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="premium-reinvestment" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Projections are hypothetical and do not guarantee future results.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
