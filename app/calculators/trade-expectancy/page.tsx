"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from "recharts";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const NAVY = "#051636";
const TEAL = "#1db2b0";
const BORDER = "rgba(29,178,176,0.18)";
const CARD = "rgba(10,34,72,0.8)";
const TEXT = "#f2f8fd";
const MUTED = "#9dbdd0";
const PROFIT = "#1dd1a1";
const LOSS = "#e05c6a";

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

    return { expectancy, monthlyExpectancy, annualExpectancy, edgeRatio, rMultiple, minWinRate, monthlyData };
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
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      {/* ── TRADINGBLOCK WIDGET ── */}
      <div style={{
        width: "100%",
        fontFamily: "'Poppins', sans-serif",
        background: NAVY,
        borderRadius: 16,
        overflow: "hidden",
        color: TEXT,
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${BORDER}`,
        marginBottom: 8,
      }}>
        <div style={{ padding: "24px 24px 28px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ width: 42, height: 42, flexShrink: 0, background: "rgba(29,178,176,0.1)", border: "1px solid rgba(29,178,176,0.28)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" width={18} height={18} stroke={TEAL} fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Trade Expectancy</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Per-trade edge & projected monthly income</div>
            </div>
          </div>

          {/* Presets */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => applyPreset(p)} type="button" style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, border: `1px solid ${BORDER}`, background: "rgba(29,178,176,0.07)", color: MUTED, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{p.label}</button>
            ))}
          </div>

          {/* Two-column body */}
          <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 20, alignItems: "start" }}>
            {/* Left: inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <SectionLabel>Trading Stats</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Win Rate (%)"><Stepper value={winRate} onChange={setWinRate} min={1} step={1} /></Field>
                <Field label="Average Win ($)"><Stepper value={avgWin} onChange={setAvgWin} min={1} step={25} /></Field>
                <Field label="Average Loss ($)"><Stepper value={avgLoss} onChange={setAvgLoss} min={1} step={25} /></Field>
                <Field label="Trades per Month"><Stepper value={tradesPerMonth} onChange={setTradesPerMonth} min={1} step={1} /></Field>
              </div>

              <div style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "12px 0" }} />
              {[
                { label: "R-Multiple", value: calc.rMultiple.toFixed(2), desc: "avg win / avg loss" },
                { label: "Min Win Rate", value: `${calc.minWinRate.toFixed(1)}%`, desc: `to break even (vs ${winRate}%)` },
                { label: "System Edge", value: isPositive ? "Positive ✓" : "Negative ✗", desc: isPositive ? "profitable long-run" : "losing system" },
              ].map((m) => (
                <div key={m.label} style={{ background: "rgba(10,34,72,0.4)", borderRadius: 7, padding: "8px 10px", marginBottom: 6, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em" }}>{m.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isPositive && m.label === "System Edge" ? PROFIT : !isPositive && m.label === "System Edge" ? LOSS : "#b4e1e8" }}>{m.value}</div>
                  <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Per-Trade Edge", value: `${isPositive ? "+" : "-"}$${fmt(calc.expectancy)}`, color: isPositive ? PROFIT : LOSS, desc: "expected per trade" },
                  { label: "Monthly Income", value: `${isPositive ? "+" : "-"}$${fmt(calc.monthlyExpectancy)}`, color: isPositive ? PROFIT : LOSS, desc: `${tradesPerMonth} trades/mo` },
                  { label: "Annual Expectancy", value: `${isPositive ? "+" : "-"}$${fmt(calc.annualExpectancy)}`, color: isPositive ? TEAL : LOSS, desc: "projected" },
                  { label: "Edge Ratio", value: `${calc.edgeRatio.toFixed(2)}x`, color: calc.edgeRatio > 1 ? PROFIT : LOSS, desc: calc.edgeRatio > 1 ? "positive edge" : "negative edge" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>Cumulative Expected Income — 12 Months</div>
              <div style={{ width: "100%", height: 190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calc.monthlyData} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Cumulative"]} />
                    <ReferenceLine y={0} stroke={MUTED} strokeDasharray="4 2" />
                    <Bar dataKey="cumulative" radius={[4, 4, 0, 0]}>
                      {calc.monthlyData.map((d, i) => (
                        <Cell key={i} fill={d.cumulative >= 0 ? PROFIT : LOSS} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 20, padding: "14px 18px", background: "rgba(29,178,176,0.05)", border: "1px solid rgba(29,178,176,0.14)", borderRadius: 8, fontSize: 11, lineHeight: 1.65, color: MUTED }}>
            <svg viewBox="0 0 24 24" width={15} height={15} style={{ flexShrink: 0, marginTop: 2, stroke: TEAL, fill: "none", opacity: 0.8 }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong style={{ color: TEAL, fontWeight: 600 }}>For educational purposes only.</strong>{" "}
              Expectancy assumes a stationary distribution of wins/losses. Actual results depend on market conditions and consistency.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
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
      </div>

      <CTABanner />
    </CalcPageLayout>
  );
}

function Stepper({ value, onChange, min = 0, step = 1 }: { value: number; onChange: (v: number) => void; min?: number; step?: number }) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 10000) / 10000));
  const inc = () => onChange(Math.round((value + step) * 10000) / 10000);
  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <button onClick={dec} type="button" style={{ width: 28, flexShrink: 0, background: "rgba(29,178,176,0.08)", border: `1px solid ${BORDER}`, color: TEAL, fontSize: 16, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px 0 0 6px" }}>−</button>
      <input type="number" value={value} onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(Math.max(min, v)); }} style={{ flex: 1, textAlign: "center", background: "rgba(10,34,72,0.6)", border: `1px solid ${BORDER}`, borderLeft: "none", borderRight: "none", color: TEXT, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, padding: "5px 7px", outline: "none", width: "100%" }} />
      <button onClick={inc} type="button" style={{ width: 28, flexShrink: 0, background: "rgba(29,178,176,0.08)", border: `1px solid ${BORDER}`, color: TEAL, fontSize: 16, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 6px 6px 0" }}>+</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label style={{ fontSize: 10, fontWeight: 500, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#e0f0f8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, marginTop: 14 }}>
      {children}
    </div>
  );
}
