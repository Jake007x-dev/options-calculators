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

  // Cap visible paths at 25 so Recharts doesn't stall
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

  const ruinColor = sim.ruin > 30 ? "text-red-500" : sim.ruin > 10 ? "text-orange-500" : "text-green-600";
  const medianColor = sim.median > startBalance ? "text-green-600" : "text-red-500";
  const ddColor = sim.maxDD > 50 ? "text-red-500" : sim.maxDD > 25 ? "text-orange-500" : "text-green-600";

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

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prob. of Ruin</p><p className={`text-2xl font-bold ${ruinColor}`}>{sim.ruin.toFixed(1)}%</p><p className="text-xs text-gray-400 mt-1">&gt;50% drawdown</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Median Equity</p><p className={`text-2xl font-bold ${medianColor}`}>${fmt(sim.median)}</p><p className="text-xs text-gray-400 mt-1">50th percentile</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best Case</p><p className="text-2xl font-bold text-green-600">${fmt(sim.best)}</p><p className="text-xs text-gray-400 mt-1">top path</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Worst Case</p><p className="text-2xl font-bold text-red-500">${fmt(sim.worst)}</p><p className="text-xs text-gray-400 mt-1">bottom path</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Drawdown</p><p className={`text-2xl font-bold ${ddColor}`}>{sim.maxDD.toFixed(1)}%</p><p className="text-xs text-gray-400 mt-1">peak-to-trough</p></div>
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
          <InputSlider label="Starting Account ($)" value={startBalance} onChange={setStartBalance} min={1000} max={1000000} step={1000} prefix="$" decimals={0} />
          <InputSlider label="Number of Trades" value={numTrades} onChange={setNumTrades} min={10} max={500} step={10} suffix=" trades" decimals={0} />
          <InputSlider label="Simulation Paths" value={numPaths} onChange={setNumPaths} min={50} max={500} step={50} suffix=" paths" decimals={0} />
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Simulation Paths — <span className="text-blue-600">blue</span> = individual paths, <span className="text-green-600">green</span> = median</p>
          <ClientOnly height={260}>
            <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="trade" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" label={{ value: "Trade #", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${fmt(Number(v))}`]} labelFormatter={(l) => `Trade #${l}`} />
                <ReferenceLine y={startBalance} stroke="#9ca3af" strokeDasharray="4 4" label={{ value: "Start", fill: "#9ca3af", fontSize: 9, position: "right" }} />
                <ReferenceLine y={startBalance * 0.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "50% loss", fill: "#ef4444", fontSize: 9, position: "right" }} />
                {pathKeys.map((key) => (
                  <Line key={key} type="monotone" dataKey={key} stroke="#3b82f6" strokeWidth={1} dot={false} opacity={0.25} legendType="none" name="" isAnimationActive={false} />
                ))}
                <Line type="monotone" dataKey="median" stroke="#22c55e" strokeWidth={2.5} dot={false} name="Median Path" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>
      </div>

      <InlineCTA heading="Apply simulated edge to real trades" body="Use the Wheel Strategy Calculator to find consistent premium-selling setups that match your win rate target." cta="Open Wheel Calculator →" />

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
      <CTABanner />
    </CalcPageLayout>
  );
}
