"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, CartesianGrid } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "30-Day CSP", premium: 2.5, capital: 5000, dte: 30, contracts: 1 },
  { label: "45-Day Iron Condor", premium: 1.8, capital: 10000, dte: 45, contracts: 5 },
  { label: "7-Day Covered Call", premium: 0.8, capital: 15000, dte: 7, contracts: 10 },
];

export default function AnnualizedReturnPage() {
  const [premium, setPremium] = useState(3.5);
  const [capitalRequired, setCapitalRequired] = useState(5000);
  const [dte, setDte] = useState(30);
  const [contracts, setContracts] = useState(1);

  const calc = useMemo(() => {
    const totalPremium = premium * 100 * contracts;
    const rawReturn = (totalPremium / capitalRequired) * 100;
    const annualizedROC = rawReturn * (365 / dte);
    const comparisons = [
      { name: "This Trade", value: annualizedROC },
      { name: "S&P 500 Avg", value: 10 },
      { name: "HY Savings", value: 5 },
    ];
    return { totalPremium, rawReturn, annualizedROC, dollarProfit: totalPremium, comparisons };
  }, [premium, capitalRequired, dte, contracts]);

  const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  function applyPreset(p: typeof PRESETS[0]) {
    setPremium(p.premium); setCapitalRequired(p.capital); setDte(p.dte); setContracts(p.contracts);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Annualized Return</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Annualized Return on Capital Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annualized ROC</p><p className="text-3xl font-bold text-green-600">{calc.annualizedROC.toFixed(1)}%</p><p className="text-xs text-gray-400 mt-1">standardized to 1 year</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Raw Return</p><p className="text-3xl font-bold text-gray-800">{calc.rawReturn.toFixed(2)}%</p><p className="text-xs text-gray-400 mt-1">in {dte} days</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Premium</p><p className="text-3xl font-bold text-blue-600">${fmt(calc.totalPremium)}</p><p className="text-xs text-gray-400 mt-1">{contracts} contract{contracts > 1 ? "s" : ""}</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">vs S&P 500</p><p className="text-3xl font-bold" style={{ color: calc.annualizedROC > 10 ? "#22c55e" : "#ef4444" }}>{calc.annualizedROC > 10 ? "+" : ""}{(calc.annualizedROC - 10).toFixed(1)}%</p><p className="text-xs text-gray-400 mt-1">above/below 10% avg</p></div>
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
          <InputSlider label="Premium Collected per Contract ($)" value={premium} onChange={setPremium} min={0.01} max={100} step={0.01} prefix="$" />
          <InputSlider label="Capital Required ($)" value={capitalRequired} onChange={setCapitalRequired} min={100} max={500000} step={100} prefix="$" />
          <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={365} step={1} suffix=" days" decimals={0} />
          <InputSlider label="Number of Contracts" value={contracts} onChange={setContracts} min={1} max={100} step={1} suffix=" contracts" decimals={0} />
          <div className="sm:col-span-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-xs text-blue-700 font-medium">
            Formula: Annualized ROC = (Premium ÷ Capital) × (365 ÷ DTE) × 100
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Benchmark Comparison</p>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calc.comparisons} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `${v.toFixed(0)}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} stroke="#e5e7eb" width={110} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${Number(v).toFixed(1)}%`, "Annualized Return"]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {calc.comparisons.map((_, i) => (
                    <Cell key={i} fill={i === 0 && calc.annualizedROC > 10 ? "#22c55e" : i === 0 ? "#eab308" : "#d1d5db"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InlineCTA heading="Put your ROC to work" body="Find the best-yielding CSPs and covered calls with a live options chain and real-time Greeks." cta="Open a Live Account →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why Annualized ROC Matters</h2>
      <p className="text-gray-600 leading-relaxed mb-4">A 2% raw return sounds the same whether you earned it in 7 days or 60 days — but they're very different. In 7 days, that's a 104% annualized return. In 60 days, it's 12%. Annualizing puts every trade on the same scale so you can compare short-dated weekly premium to monthly income strategies to LEAPS.</p>
      <p className="text-gray-600 leading-relaxed mb-6">The 10% S&P 500 benchmark is the standard hurdle. If your annualized ROC consistently beats 10% with lower volatility, options income strategies are genuinely outperforming passive investing on a risk-adjusted basis.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Short DTE = high annualized ROC", "A 1% return in 7 days annualizes to 52%. Weekly strategies can look extraordinary — but they require much more active management."],
          ["Capital required drives everything", "A CSP on a $500 stock requires $50,000 capital. The premium may look great but the ROC could be low if capital is large."],
          ["Risk-adjust your comparison", "A 30% annualized ROC from selling naked puts is riskier than 30% from iron condors. Always weight ROC by the risk profile of the strategy."],
          ["Aim for 15–25% annualized in the Wheel", "Consistent wheel traders targeting 15–25% annualized ROC with high-quality stocks have a strong long-term edge over passive investing."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="annualized-return" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
