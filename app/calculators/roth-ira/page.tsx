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
  { label: "Young Investor (25)", currentAge: 25, retirementAge: 65, currentBalance: 10000, annualContribution: 7000, optionsReturn: 18, marketReturn: 10 },
  { label: "Mid-Career (40)", currentAge: 40, retirementAge: 65, currentBalance: 75000, annualContribution: 7000, optionsReturn: 18, marketReturn: 10 },
  { label: "Late Starter (52)", currentAge: 52, retirementAge: 67, currentBalance: 150000, annualContribution: 8000, optionsReturn: 15, marketReturn: 10 },
];

export default function RothIRAPage() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [annualContribution, setAnnualContribution] = useState(7000);
  const [optionsReturn, setOptionsReturn] = useState(18);
  const [marketReturn, setMarketReturn] = useState(10);

  function applyPreset(p: typeof PRESETS[0]) {
    setCurrentAge(p.currentAge); setRetirementAge(p.retirementAge);
    setCurrentBalance(p.currentBalance); setAnnualContribution(p.annualContribution);
    setOptionsReturn(p.optionsReturn); setMarketReturn(p.marketReturn);
  }

  const calc = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const oRate = optionsReturn / 100;
    const mRate = marketReturn / 100;

    let optBal = currentBalance;
    let mktBal = currentBalance;

    const chartData = Array.from({ length: years + 1 }, (_, yr) => {
      if (yr > 0) {
        optBal = optBal * (1 + oRate) + annualContribution;
        mktBal = mktBal * (1 + mRate) + annualContribution;
      }
      return {
        age: currentAge + yr,
        options: Math.round(optBal),
        market: Math.round(mktBal),
      };
    });

    const finalOptions = chartData[years].options;
    const finalMarket = chartData[years].market;
    const advantage = finalOptions - finalMarket;
    const totalContributions = currentBalance + annualContribution * years;
    const monthlyWithdrawalOptions = (finalOptions * 0.04) / 12;
    const monthlyWithdrawalMarket = (finalMarket * 0.04) / 12;

    return { chartData, finalOptions, finalMarket, advantage, totalContributions, monthlyWithdrawalOptions, monthlyWithdrawalMarket, years };
  }, [currentAge, retirementAge, currentBalance, annualContribution, optionsReturn, marketReturn]);

  const fmtK = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}k`;
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Roth IRA + Options Calculator</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Roth IRA + Options Growth Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>Why Roth IRA + Options?</strong> A Roth IRA is the most powerful account for options income strategies — all gains, including premium collected from selling covered calls and cash-secured puts, grow and withdraw completely <strong>tax-free</strong>. There are no capital gains taxes, no ordinary income taxes on distributions in retirement.
      </div>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Balance at Retirement</p><p className="text-3xl font-bold text-green-600">{fmtK(calc.finalOptions)}</p><p className="text-xs text-gray-400 mt-1">with options ({optionsReturn}% annual)</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">vs Market Only</p><p className="text-2xl font-bold text-gray-800">{fmtK(calc.finalMarket)}</p><p className="text-xs text-gray-400 mt-1">passive ({marketReturn}% annual)</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Options Advantage</p><p className="text-2xl font-bold text-blue-600">+{fmtK(calc.advantage)}</p><p className="text-xs text-gray-400 mt-1">extra tax-free wealth</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Monthly Withdrawal (4%)</p><p className="text-2xl font-bold text-purple-600">${fmt(calc.monthlyWithdrawalOptions)}</p><p className="text-xs text-gray-400 mt-1">tax-free retirement income</p></div>
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
          <InputSlider label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={70} step={1} suffix=" yrs" decimals={0} />
          <InputSlider label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={40} max={80} step={1} suffix=" yrs" decimals={0} />
          <InputSlider label="Current Roth Balance ($)" value={currentBalance} onChange={setCurrentBalance} min={0} max={500000} step={1000} prefix="$" decimals={0} />
          <InputSlider label="Annual Contribution ($)" value={annualContribution} onChange={setAnnualContribution} min={0} max={8000} step={500} prefix="$" decimals={0} />
          <InputSlider label="Options-Enhanced Return (%)" value={optionsReturn} onChange={setOptionsReturn} min={1} max={40} step={0.5} suffix="%" />
          <InputSlider label="Market-Only Return (%)" value={marketReturn} onChange={setMarketReturn} min={1} max={20} step={0.5} suffix="%" />
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Roth IRA Balance Over Time</p>
          <p className="text-xs text-gray-400 mb-3"><span className="text-blue-500 font-medium">Blue</span> = Options-enhanced ({optionsReturn}% annual) · <span className="text-gray-400 font-medium">Gray</span> = Market-only ({marketReturn}%)</p>
          <ClientOnly height={240}>
            <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calc.chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                <defs>
                  <linearGradient id="optIRAGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="mktIRAGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="age" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `Age ${v}`} label={{ value: "Age", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`} width={60} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v, name) => [`$${Number(v).toLocaleString()}`, name === "options" ? `Options (${optionsReturn}%)` : `Market (${marketReturn}%)`]} labelFormatter={(l) => `Age ${l}`} />
                <Area type="monotone" dataKey="market" stroke="#9ca3af" strokeWidth={1.5} fill="url(#mktIRAGrad)" dot={false} />
                <Area type="monotone" dataKey="options" stroke="#3b82f6" strokeWidth={2.5} fill="url(#optIRAGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-500 mb-1">Options — Monthly Retirement Income (4% rule)</p>
            <p className="font-bold text-green-700 text-base">${fmt(calc.monthlyWithdrawalOptions)}<span className="text-gray-400 font-normal text-xs">/mo tax-free</span></p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-500 mb-1">Passive — Monthly Retirement Income (4% rule)</p>
            <p className="font-bold text-gray-700 text-base">${fmt(calc.monthlyWithdrawalMarket)}<span className="text-gray-400 font-normal text-xs">/mo tax-free</span></p>
          </div>
        </div>
      </div>

      <InlineCTA heading="Put your Roth IRA to work with options" body="This calculator suite is open source — built with Next.js 14, Recharts, and Tailwind CSS by Jake Joseph." cta="View Source on GitHub →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why the Roth IRA Is Perfect for Options Income</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Most investors treat their Roth IRA as a passive index fund account. But the Roth's tax-free growth is even more powerful when combined with an active options income strategy. Every dollar of premium collected from selling covered calls or cash-secured puts grows and compounds tax-free — including any capital gains when assigned shares are eventually sold.</p>
      <p className="text-gray-600 leading-relaxed mb-6">In a taxable brokerage account, premium income is taxed as short-term capital gains (ordinary income rates). In a Roth, there's no tax drag at all. That difference in compounding — tax-free premium reinvested every month for 20–30 years — is the mathematical engine behind the options advantage shown in this calculator.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["All premium is tax-free in a Roth", "Short-term gains from options selling are taxed at your highest income rate in taxable accounts. In a Roth, it's zero."],
          ["Stick to defined-risk strategies in IRAs", "Most brokers only allow Level 1–2 options in IRAs (covered calls, cash-secured puts, spreads). Plan your strategy accordingly."],
          ["2024 contribution limit: $7,000 ($8,000 if 50+)", "Maximize annual contributions and put the full amount to work selling options premium each month."],
          ["Start early — the math is dramatic", "A 25-year-old with 40 years of tax-free compounding has an enormous advantage. Every year of delay costs more than the last."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="roth-ira" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Projections are hypothetical. Consult a tax advisor for personalized Roth IRA guidance.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
