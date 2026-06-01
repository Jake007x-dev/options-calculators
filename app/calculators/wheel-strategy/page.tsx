"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

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

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      income: Math.round(monthlyIncome),
    }));

    return {
      targetStrike,
      premiumPerCycle,
      annualizedYield,
      monthlyIncome,
      annualizedPremium,
      cyclesPerYear,
      effectiveCostBasis,
      monthlyData,
    };
  }, [stockPrice, otmPct, premium, dte, contracts, accountSize]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Wheel Strategy Income Calculator
            <InfoTooltip content="The Wheel Strategy involves selling cash-secured puts until assigned, then selling covered calls on the shares — generating income in both phases." />
          </h1>
          <p className="text-gray-400 text-sm">
            Project your income from running the Wheel strategy across a full year, assuming consistent execution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>
            <div>
              <label className="text-sm text-gray-300 font-medium block mb-1.5">Ticker Symbol</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="AAPL"
              />
            </div>
            <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
            <InputSlider label="Target Strike (% OTM)" value={otmPct} onChange={setOtmPct} min={0} max={20} step={0.5} suffix="%" />
            <InputSlider label="Premium per Contract ($)" value={premium} onChange={setPremium} min={0.01} max={50} step={0.01} prefix="$" />
            <InputSlider label="DTE per Cycle" value={dte} onChange={setDte} min={1} max={90} step={1} suffix=" days" decimals={0} />
            <InputSlider label="Number of Contracts" value={contracts} onChange={setContracts} min={1} max={100} step={1} suffix=" contracts" decimals={0} />
            <InputSlider label="Account Size ($)" value={accountSize} onChange={setAccountSize} min={1000} max={1000000} step={1000} prefix="$" />
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Target Strike"
                value={`$${fmt(calc.targetStrike)}`}
                explanation={`${otmPct}% OTM from $${stockPrice}`}
                color="blue"
              />
              <ResultCard
                label="Premium per Cycle"
                value={`$${fmt(calc.premiumPerCycle)}`}
                explanation={`${contracts} contracts × $${fmt(premium)} × 100`}
                color="green"
              />
              <ResultCard
                label="Annualized Yield"
                value={`${calc.annualizedYield.toFixed(1)}%`}
                explanation="Return on full account size"
                color={calc.annualizedYield > 20 ? "green" : calc.annualizedYield > 10 ? "yellow" : "neutral"}
              />
              <ResultCard
                label="Monthly Income"
                value={`$${fmt(calc.monthlyIncome)}`}
                explanation="Projected average monthly income"
                color="green"
              />
              <ResultCard
                label="Cycles per Year"
                value={calc.cyclesPerYear.toFixed(1)}
                explanation={`${dte}-day cycles in 365 days`}
                color="neutral"
              />
              <ResultCard
                label="Effective Cost Basis"
                value={`$${fmt(calc.effectiveCostBasis)}`}
                explanation="Strike minus premium collected if assigned"
                color="blue"
              />
            </div>

            {/* Chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
                Projected Monthly Income ({ticker})
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calc.monthlyData} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="#374151" />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      stroke="#374151"
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }}
                      formatter={(v) => [`$${Number(v).toLocaleString()}`, "Income"]}
                    />
                    <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Wheel generates income by repeatedly selling cash-secured puts below the stock price and, if assigned, selling covered calls above your cost basis. This calculator assumes consistent premium collection at the same strike and DTE each cycle — real results vary with market conditions and IV changes.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
