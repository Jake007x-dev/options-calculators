"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ClientOnly from "@/components/calculators/ClientOnly";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "Conservative Seller", winRate: 68, avgWin: 250, avgLoss: 400, accountSize: 50000, riskPct: 1 },
  { label: "Standard Trader", winRate: 58, avgWin: 400, avgLoss: 300, accountSize: 25000, riskPct: 2 },
  { label: "Aggressive Speculator", winRate: 50, avgWin: 700, avgLoss: 500, accountSize: 10000, riskPct: 5 },
];

function calcRoR(winRate: number, avgWin: number, avgLoss: number, riskPct: number): number {
  const wr = winRate / 100;
  const lr = 1 - wr;
  const edge = wr * avgWin - lr * avgLoss;
  const variance = wr * avgWin * avgWin + lr * avgLoss * avgLoss - edge * edge;
  if (variance <= 0 || edge <= 0) return 100;
  // Closed-form approximation: RoR = e^(-2 * edge * accountUnits / variance)
  // accountUnits = 1/riskPct (how many risk units in account)
  const accountUnits = 100 / riskPct;
  const ror = Math.exp(-2 * edge * accountUnits / variance) * 100;
  return Math.min(Math.max(ror, 0), 100);
}

export default function RiskOfRuinPage() {
  const [winRate, setWinRate] = useState(58);
  const [avgWin, setAvgWin] = useState(400);
  const [avgLoss, setAvgLoss] = useState(300);
  const [accountSize, setAccountSize] = useState(25000);
  const [riskPct, setRiskPct] = useState(2);

  function applyPreset(p: typeof PRESETS[0]) {
    setWinRate(p.winRate); setAvgWin(p.avgWin); setAvgLoss(p.avgLoss);
    setAccountSize(p.accountSize); setRiskPct(p.riskPct);
  }

  const calc = useMemo(() => {
    const wr = winRate / 100;
    const lr = 1 - wr;
    const expectancy = wr * avgWin - lr * avgLoss;
    const kellyPct = expectancy > 0 ? ((wr / avgLoss) - (lr / avgWin)) * 100 : 0;
    const safeKelly = Math.max(kellyPct / 4, 0); // quarter-Kelly for safety
    const riskPerTrade = accountSize * (riskPct / 100);
    const ror = calcRoR(winRate, avgWin, avgLoss, riskPct);

    // RoR curve across different position sizes
    const rorCurve = Array.from({ length: 20 }, (_, i) => {
      const pct = 0.5 + i * 0.5;
      return { riskPct: pct, ror: parseFloat(calcRoR(winRate, avgWin, avgLoss, pct).toFixed(1)) };
    });

    const rorColor = ror < 5 ? "text-green-600" : ror < 20 ? "text-orange-500" : "text-red-500";
    const rorLabel = ror < 5 ? "Safe" : ror < 20 ? "Moderate Risk" : "High Risk";

    return { expectancy, kellyPct, safeKelly, riskPerTrade, ror, rorCurve, rorColor, rorLabel };
  }, [winRate, avgWin, avgLoss, accountSize, riskPct]);

  const fmt = (n: number, d = 0) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Risk of Ruin</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Risk of Ruin Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Risk of Ruin</p><p className={`text-3xl font-bold ${calc.rorColor}`}>{calc.ror.toFixed(1)}%</p><p className="text-xs text-gray-400 mt-1">{calc.rorLabel}</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kelly % (Full)</p><p className="text-2xl font-bold text-gray-800">{calc.kellyPct > 0 ? calc.kellyPct.toFixed(1) : "—"}%</p><p className="text-xs text-gray-400 mt-1">optimal per-trade risk</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">¼ Kelly (Safe)</p><p className="text-2xl font-bold text-blue-600">{calc.safeKelly > 0 ? calc.safeKelly.toFixed(1) : "—"}%</p><p className="text-xs text-gray-400 mt-1">recommended max risk</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">$ per Trade</p><p className="text-2xl font-bold text-gray-800">${fmt(calc.riskPerTrade)}</p><p className="text-xs text-gray-400 mt-1">at {riskPct}% risk</p></div>
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
          <InputSlider label="Account Size ($)" value={accountSize} onChange={setAccountSize} min={1000} max={500000} step={1000} prefix="$" decimals={0} />
          <InputSlider label="Risk per Trade (%)" value={riskPct} onChange={setRiskPct} min={0.5} max={10} step={0.5} suffix="%" />
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Risk of Ruin vs. Position Size — lower is safer</p>
          <ClientOnly height={220}>
            <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calc.rorCurve} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="riskPct" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `${v}%`} label={{ value: "Risk per Trade", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${Number(v).toFixed(1)}%`, "Risk of Ruin"]} labelFormatter={(l) => `Risk per Trade: ${l}%`} />
                <ReferenceLine y={5} stroke="#22c55e" strokeDasharray="3 2" label={{ value: "5% target", fill: "#22c55e", fontSize: 9, position: "right" }} />
                <ReferenceLine x={riskPct} stroke="#f59e0b" strokeDasharray="3 2" label={{ value: "Current", fill: "#f59e0b", fontSize: 9 }} />
                <Line type="monotone" dataKey="ror" stroke="#ef4444" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>

        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
          <strong>Trade expectancy:</strong> ${calc.expectancy > 0 ? "+" : ""}{calc.expectancy.toFixed(0)} per trade. {calc.expectancy > 0 ? "Positive edge — your system is mathematically profitable." : "Negative edge — no position sizing can fix a losing system."}
        </div>
      </div>

      <InlineCTA heading="Size every trade within your ruin budget" body="Use the Position Size calculator to find the exact number of contracts that keeps your risk of ruin under 5%." cta="Open Position Size Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">What Is Risk of Ruin?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Risk of ruin is the probability that a trading system depletes an account beyond recovery given your win rate, average win/loss, and position sizing. Even with positive expectancy, it's mathematically possible to go broke if you size too aggressively — a bad early run of losses can reduce your account faster than your edge can recover it.</p>
      <p className="text-gray-600 leading-relaxed mb-6">The Kelly Criterion is the mathematically optimal bet size that maximizes long-run growth. However, full Kelly is extremely volatile, so professional traders use ¼ Kelly as a practical maximum. At ¼ Kelly, risk of ruin drops to near zero for any system with positive expectancy.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Keep RoR under 5%", "Professional traders target a risk of ruin below 5%. If yours is higher, reduce position size before changing your strategy."],
          ["Kelly tells you your ceiling", "Full Kelly is the mathematical maximum bet size. Going over Kelly guarantees long-run ruin — even with positive expectancy."],
          ["¼ Kelly is the practitioner standard", "Quarter Kelly dramatically reduces volatility while capturing most of the growth benefit. It's what most professional money managers use."],
          ["No position sizing saves a losing system", "If your expectancy is negative, the only fix is the strategy itself. Sizing down just loses more slowly."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="risk-of-ruin" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
