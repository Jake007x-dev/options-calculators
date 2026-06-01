"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

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

  // Build chart data — sample up to 100 paths to keep chart performant
  const chartData = useMemo(() => {
    const sampledPaths = sim.paths.filter((_, i) => i % Math.ceil(sim.paths.length / 100) === 0);
    const medianPath = sim.paths
      .slice()
      .sort((a, b) => a[a.length - 1] - b[b.length - 1])[Math.floor(sim.paths.length / 2)];

    return Array.from({ length: numTrades + 1 }, (_, i) => {
      const point: Record<string, number> = { trade: i };
      sampledPaths.forEach((path, pi) => {
        point[`p${pi}`] = path[i] ?? 0;
      });
      point["median"] = medianPath[i] ?? 0;
      return point;
    });
  }, [sim, numTrades]);

  const pathKeys = Object.keys(chartData[0] ?? {}).filter((k) => k.startsWith("p"));

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Monte Carlo Portfolio Simulator
            <InfoTooltip content="Monte Carlo simulation runs hundreds of random trade sequences using your win rate and average win/loss to estimate the probability distribution of outcomes." />
          </h1>
          <p className="text-gray-400 text-sm">
            Simulate hundreds of trading paths to understand your true risk of ruin and expected range of outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>
            <InputSlider label="Win Rate (%)" value={winRate} onChange={setWinRate} min={1} max={99} step={1} suffix="%" decimals={0} />
            <InputSlider label="Average Win ($)" value={avgWin} onChange={setAvgWin} min={1} max={10000} step={10} prefix="$" decimals={0} />
            <InputSlider label="Average Loss ($)" value={avgLoss} onChange={setAvgLoss} min={1} max={10000} step={10} prefix="$" decimals={0} />
            <InputSlider label="Starting Account ($)" value={startBalance} onChange={setStartBalance} min={1000} max={1000000} step={1000} prefix="$" decimals={0} />
            <InputSlider label="Number of Trades" value={numTrades} onChange={setNumTrades} min={10} max={500} step={10} suffix=" trades" decimals={0} />
            <InputSlider label="Simulation Paths" value={numPaths} onChange={setNumPaths} min={50} max={500} step={50} suffix=" paths" decimals={0} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Probability of Ruin"
                value={`${sim.ruin.toFixed(1)}%`}
                explanation="Paths with >50% drawdown at any point"
                color={sim.ruin > 30 ? "red" : sim.ruin > 10 ? "yellow" : "green"}
              />
              <ResultCard
                label="Median Ending Equity"
                value={`$${fmt(sim.median)}`}
                explanation="50th percentile outcome"
                color={sim.median > startBalance ? "green" : "red"}
              />
              <ResultCard
                label="Best Case"
                value={`$${fmt(sim.best)}`}
                explanation="Top path endpoint"
                color="green"
              />
              <ResultCard
                label="Worst Case"
                value={`$${fmt(sim.worst)}`}
                explanation="Bottom path endpoint"
                color="red"
              />
            </div>

            <ResultCard
              label="Expected Max Drawdown"
              value={`${sim.maxDD.toFixed(1)}%`}
              explanation="Largest peak-to-trough across all paths"
              color={sim.maxDD > 50 ? "red" : sim.maxDD > 25 ? "yellow" : "green"}
            />

            {/* Chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
                Simulation Paths
              </div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="trade" tick={{ fill: "#6b7280", fontSize: 10 }} stroke="#374151" label={{ value: "Trade #", position: "insideBottom", offset: -2, fill: "#6b7280", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} stroke="#374151" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [`$${fmt(Number(v))}`]}
                    />
                    <ReferenceLine y={startBalance} stroke="#374151" strokeDasharray="4 4" />
                    <ReferenceLine y={startBalance * 0.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "50% loss", fill: "#ef4444", fontSize: 9, position: "right" }} />
                    {pathKeys.map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke="#3b82f6"
                        strokeWidth={0.5}
                        dot={false}
                        opacity={0.2}
                        legendType="none"
                        name=""
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke="#22c55e"
                      strokeWidth={2.5}
                      dot={false}
                      name="Median Path"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Each simulation path plays out your exact trading statistics in random order. By running hundreds of paths simultaneously, you see the full distribution of outcomes — not just the "average." The ruin probability (red line at 50% loss) is the most important risk metric: it tells you how often your strategy fails catastrophically under realistic randomness.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
