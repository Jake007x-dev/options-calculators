"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ClientOnly from "@/components/calculators/ClientOnly";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "Wheel Trader", winRate: 70, avgWin: 300, avgLoss: 450, tradesPerMonth: 8 },
  { label: "Iron Condor Seller", winRate: 65, avgWin: 200, avgLoss: 380, tradesPerMonth: 6 },
  { label: "Long Options Buyer", winRate: 40, avgWin: 900, avgLoss: 300, tradesPerMonth: 4 },
];

export default function TradeExpectancyPage() {
  const [winRate, setWinRate] = useState(65);
  const [avgWin, setAvgWin] = useState(300);
  const [avgLoss, setAvgLoss] = useState(450);
  const [tradesPerMonth, setTradesPerMonth] = useState(8);

  const calc = useMemo(() => {
    const lossRate = 1 - winRate / 100;
    const expectancy = (winRate / 100) * avgWin - lossRate * avgLoss;
    const monthlyExpectancy = expectancy * tradesPerMonth;
    const annualExpectancy = monthlyExpectancy * 12;
    const edgeRatio = (winRate / 100) * avgWin / (lossRate * avgLoss);
    const rMultiple = avgWin / avgLoss;
    const minWinRate = avgLoss / (avgWin + avgLoss) * 100;

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      cumulative: parseFloat((expectancy * tradesPerMonth * (i + 1)).toFixed(0)),
    }));

    const winRateCurve = Array.from({ length: 20 }, (_, i) => {
      const wr = 5 + i * 5;
      const exp = (wr / 100) * avgWin - (1 - wr / 100) * avgLoss;
      return { winRate: wr, expectancy: parseFloat(exp.toFixed(0)) };
    });

    return { expectancy, monthlyExpectancy, annualExpectancy, edgeRatio, rMultiple, minWinRate, monthlyData, winRateCurve };
  }, [winRate, avgWin, avgLoss, tradesPerMonth]);

  const fmt = (n: number) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const isPositive = calc.expectancy > 0;

  function applyPreset(p: typeof PRESETS[0]) {
    setWinRate(p.winRate); setAvgWin(p.avgWin); setAvgLoss(p.avgLoss); setTradesPerMonth(p.tradesPerMonth);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Trade Expectancy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Trade Expectancy Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className={`rounded-xl border p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center ${isPositive ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Per-Trade Edge</p><p className={`text-3xl font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>{isPositive ? "+" : "-"}${fmt(calc.expectancy)}</p><p className="text-xs text-gray-400 mt-1">expected per trade</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Monthly Income</p><p className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>{isPositive ? "+" : "-"}${fmt(calc.monthlyExpectancy)}</p><p className="text-xs text-gray-400 mt-1">{tradesPerMonth} trades/mo</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annual Expectancy</p><p className={`text-2xl font-bold ${isPositive ? "text-blue-600" : "text-red-500"}`}>{isPositive ? "+" : "-"}${fmt(calc.annualExpectancy)}</p><p className="text-xs text-gray-400 mt-1">projected</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Edge Ratio</p><p className={`text-2xl font-bold ${calc.edgeRatio > 1 ? "text-green-600" : "text-red-500"}`}>{calc.edgeRatio.toFixed(2)}x</p><p className="text-xs text-gray-400 mt-1">{calc.edgeRatio > 1 ? "positive edge" : "negative edge"}</p></div>
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
          <InputSlider label="Win Rate (%)" value={winRate} onChange={setWinRate} min={1} max={99} step={1} suffix="%" decimals={0} />
          <InputSlider label="Average Win ($)" value={avgWin} onChange={setAvgWin} min={1} max={10000} step={10} prefix="$" decimals={0} />
          <InputSlider label="Average Loss ($)" value={avgLoss} onChange={setAvgLoss} min={1} max={10000} step={10} prefix="$" decimals={0} />
          <InputSlider label="Trades per Month" value={tradesPerMonth} onChange={setTradesPerMonth} min={1} max={50} step={1} suffix=" trades" decimals={0} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 text-xs">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-gray-500 mb-1">R-Multiple</p>
            <p className="font-bold text-gray-800">{calc.rMultiple.toFixed(2)}</p>
            <p className="text-gray-400 text-xs">avg win / avg loss</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-gray-500 mb-1">Min Win Rate to Break Even</p>
            <p className="font-bold text-gray-800">{calc.minWinRate.toFixed(1)}%</p>
            <p className="text-gray-400 text-xs">current: {winRate}%</p>
          </div>
          <div className={`border rounded-lg p-3 text-center ${isPositive ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className="text-gray-500 mb-1">System Edge</p>
            <p className={`font-bold ${isPositive ? "text-green-700" : "text-red-600"}`}>{isPositive ? "Positive ✓" : "Negative ✗"}</p>
            <p className="text-gray-400 text-xs">{isPositive ? "profitable long-run" : "losing system"}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cumulative Expected Income Over 12 Months</p>
          <ClientOnly height={200}>
            <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calc.monthlyData} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="#e5e7eb" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Cumulative"]} />
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 2" />
                <Bar dataKey="cumulative" radius={[4, 4, 0, 0]}>
                  {calc.monthlyData.map((d, i) => (
                    <Cell key={i} fill={d.cumulative >= 0 ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>
      </div>

      <InlineCTA heading="Maximize your trade expectancy" body="Use the Monte Carlo Simulator to stress-test your edge across hundreds of random trade sequences." cta="Open Monte Carlo Simulator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why Expectancy Is the Most Important Trading Metric</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Win rate alone means nothing. A system that wins 90% of the time but loses 10× on the losers is a losing system. Trade expectancy combines win rate and average win/loss into a single number: the average dollar amount you expect to make on every trade in the long run.</p>
      <p className="text-gray-600 leading-relaxed mb-6">The formula is simple: <strong>Expectancy = (Win Rate × Avg Win) − (Loss Rate × Avg Loss)</strong>. If this number is positive, you have an edge. If it's negative, more trades make you lose faster. Understanding your expectancy lets you compare strategies objectively.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Win rate alone is misleading", "A 30% win rate with 4:1 reward-to-risk has higher expectancy than a 70% win rate with 1:3 reward-to-risk."],
          ["Options sellers have high win rate but tight reward/risk", "A 70% win rate selling puts might have an expectancy of only $50/trade. Sizing and frequency matter enormously."],
          ["Frequency multiplies your edge", "A $50 expectancy with 8 trades/month compounds to $4,800/year. Systematically finding high-expectancy setups is the professional edge."],
          ["Manage losers to protect expectancy", "A single outlier loss can wipe out 10 average wins. Cutting losses at 2× premium protects the long-run expectancy calculation."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="trade-expectancy" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
