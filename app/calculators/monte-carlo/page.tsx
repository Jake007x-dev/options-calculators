"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
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

function runSimulation(
  winRate: number,
  avgWin: number,
  avgLoss: number,
  startBalance: number,
  numTrades: number,
  numPaths: number
): { paths: number[][]; ruin: number; median: number; best: number; worst: number; maxDD: number } {
  const paths: number[][] = [];
  let ruinCount = 0;
  const endpoints: number[] = [];
  let overallMaxDD = 0;

  for (let p = 0; p < numPaths; p++) {
    const equity: number[] = [startBalance];
    let peak = startBalance;
    let pathMaxDD = 0;
    let isRuined = false;

    for (let t = 0; t < numTrades; t++) {
      const prev = equity[equity.length - 1];
      const win = Math.random() < winRate / 100;
      const next = win ? prev + avgWin : prev - avgLoss;
      const clamped = Math.max(next, 0);
      equity.push(clamped);
      if (clamped > peak) peak = clamped;
      const dd = ((peak - clamped) / peak) * 100;
      if (dd > pathMaxDD) pathMaxDD = dd;
      if (dd > 50) isRuined = true;
    }

    paths.push(equity);
    if (isRuined) ruinCount++;
    endpoints.push(equity[equity.length - 1]);
    if (pathMaxDD > overallMaxDD) overallMaxDD = pathMaxDD;
  }

  const sorted = [...endpoints].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const best = sorted[sorted.length - 1];
  const worst = sorted[0];
  const ruin = (ruinCount / numPaths) * 100;

  return { paths, ruin, median, best, worst, maxDD: overallMaxDD };
}

const PRESETS = [
  { label: "Conservative Wheel", winRate: 70, avgWin: 300, avgLoss: 400, balance: 50000, trades: 100, paths: 200 },
  { label: "Standard Trader", winRate: 60, avgWin: 500, avgLoss: 300, balance: 25000, trades: 50, paths: 200 },
  { label: "Aggressive Speculator", winRate: 55, avgWin: 1000, avgLoss: 600, balance: 10000, trades: 50, paths: 200 },
];

export default function MonteCarloPage() {
  const [winRate, setWinRate] = useState(55);
  const [avgWin, setAvgWin] = useState(200);
  const [avgLoss, setAvgLoss] = useState(150);
  const [startBalance, setStartBalance] = useState(10000);
  const [numTrades, setNumTrades] = useState(100);
  const [numPaths, setNumPaths] = useState(200);

  const sim = useMemo(() => {
    return runSimulation(winRate, avgWin, avgLoss, startBalance, numTrades, Math.min(numPaths, 500));
  }, [winRate, avgWin, avgLoss, startBalance, numTrades, numPaths]);

  const VISIBLE_PATHS = 25;

  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(sim.paths.length / VISIBLE_PATHS));
    const sampledPaths = sim.paths.filter((_, i) => i % step === 0).slice(0, VISIBLE_PATHS);
    const sorted = sim.paths.slice().sort((a, b) => a[a.length - 1] - b[b.length - 1]);
    const medianPath = sorted[Math.floor(sorted.length / 2)];
    return Array.from({ length: numTrades + 1 }, (_, i) => {
      const point: Record<string, number> = { trade: i };
      sampledPaths.forEach((path, pi) => { point[`p${pi}`] = path[i] ?? 0; });
      point["median"] = medianPath[i] ?? 0;
      return point;
    });
  }, [sim, numTrades]);

  const pathKeys = useMemo(
    () => Object.keys(chartData[0] ?? {}).filter((k) => k.startsWith("p")),
    [chartData]
  );

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const ruinColor = sim.ruin > 30 ? LOSS : sim.ruin > 10 ? "#eab308" : PROFIT;
  const medianColor = sim.median > startBalance ? PROFIT : LOSS;
  const ddColor = sim.maxDD > 50 ? LOSS : sim.maxDD > 25 ? "#eab308" : PROFIT;

  function applyPreset(p: typeof PRESETS[0]) {
    setWinRate(p.winRate); setAvgWin(p.avgWin); setAvgLoss(p.avgLoss);
    setStartBalance(p.balance); setNumTrades(p.trades); setNumPaths(p.paths);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Monte Carlo Simulator</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Monte Carlo Portfolio Simulator</h1>
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
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Monte Carlo Simulator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>{numPaths} paths — sequence risk & ruin probability</div>
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
              <SectionLabel>Simulation Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Win Rate (%)"><Stepper value={winRate} onChange={setWinRate} min={1} step={1} /></Field>
                <Field label="Average Win ($)"><Stepper value={avgWin} onChange={setAvgWin} min={1} step={25} /></Field>
                <Field label="Average Loss ($)"><Stepper value={avgLoss} onChange={setAvgLoss} min={1} step={25} /></Field>
                <Field label="Starting Account ($)"><Stepper value={startBalance} onChange={setStartBalance} min={1000} step={1000} /></Field>
                <Field label="Number of Trades"><Stepper value={numTrades} onChange={setNumTrades} min={10} step={10} /></Field>
                <Field label="Simulation Paths"><Stepper value={numPaths} onChange={setNumPaths} min={50} step={50} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Prob. of Ruin", value: `${sim.ruin.toFixed(1)}%`, color: ruinColor, desc: ">50% drawdown" },
                  { label: "Median Equity", value: `$${fmt(sim.median)}`, color: medianColor, desc: "50th percentile" },
                  { label: "Best Case", value: `$${fmt(sim.best)}`, color: PROFIT, desc: "top path" },
                  { label: "Worst Case", value: `$${fmt(sim.worst)}`, color: LOSS, desc: "bottom path" },
                  { label: "Max Drawdown", value: `${sim.maxDD.toFixed(1)}%`, color: ddColor, desc: "peak-to-trough" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: "rgba(29,178,176,0.5)", display: "inline-block" }} /> Individual paths</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: PROFIT, display: "inline-block" }} /> Median path</span>
              </div>
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="trade" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} label={{ value: "Trade #", position: "insideBottom", offset: -12, fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v) => [`$${fmt(Number(v))}`]} labelFormatter={(l) => `Trade #${l}`} />
                    <ReferenceLine y={startBalance} stroke={MUTED} strokeDasharray="4 4" label={{ value: "Start", fill: MUTED, fontSize: 9, position: "right" }} />
                    <ReferenceLine y={startBalance * 0.5} stroke={LOSS} strokeDasharray="4 4" label={{ value: "50% loss", fill: LOSS, fontSize: 9, position: "right" }} />
                    {pathKeys.map((key) => (
                      <Line key={key} type="monotone" dataKey={key} stroke={TEAL} strokeWidth={1} dot={false} opacity={0.2} legendType="none" name="" isAnimationActive={false} />
                    ))}
                    <Line type="monotone" dataKey="median" stroke={PROFIT} strokeWidth={2.5} dot={false} name="Median Path" isAnimationActive={false} />
                  </LineChart>
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
              Monte Carlo uses random sampling. Re-run for different results. Use 200+ paths for stable estimates.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why Monte Carlo Matters for Traders</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Your trading statistics — win rate and average win/loss — describe the long-run average, but they don't tell you about the path. Two traders with identical stats can have very different experiences depending on the random sequence of wins and losses. Monte Carlo simulation runs hundreds of those random sequences simultaneously to reveal the full distribution of outcomes.</p>
        <p className="text-gray-600 leading-relaxed mb-6">The most important number isn't the median — it's the probability of ruin. A 60% win rate sounds great, but with poor position sizing or a wide win/loss ratio imbalance, the red reference line will catch a surprising number of paths. That's what blows up accounts that "should have worked."</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Expectancy drives long-run results", "Expectancy = (Win Rate × Avg Win) − (Loss Rate × Avg Loss). Positive expectancy over many trades is the only durable edge."],
            ["Sequence risk is real", "Even with positive expectancy, a run of early losses can reduce your account too far to recover. This is why position sizing matters."],
            ["Ruin probability below 5% is the target", "Professional traders size positions so the simulated ruin probability stays below 5%. If yours is higher, reduce position size first."],
            ["More paths = more reliable results", "Run 200–500 paths for a stable estimate. Fewer paths produces noisy results that change dramatically on each run."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="monte-carlo" />
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
