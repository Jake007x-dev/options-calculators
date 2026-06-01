"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  CartesianGrid,
} from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

export default function AnnualizedReturnPage() {
  const [premium, setPremium] = useState(3.5);
  const [capitalRequired, setCapitalRequired] = useState(5000);
  const [dte, setDte] = useState(30);
  const [contracts, setContracts] = useState(1);

  const calc = useMemo(() => {
    const totalPremium = premium * 100 * contracts;
    const rawReturn = (totalPremium / capitalRequired) * 100;
    const annualizedROC = rawReturn * (365 / dte);
    const dollarProfit = totalPremium;

    const comparisons = [
      { name: "This Trade", value: annualizedROC, color: "#3b82f6" },
      { name: "S&P 500 Avg", value: 10, color: "#6b7280" },
      { name: "High-Yield Savings", value: 5, color: "#6b7280" },
    ];

    return { totalPremium, rawReturn, annualizedROC, dollarProfit, comparisons };
  }, [premium, capitalRequired, dte, contracts]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Annualized Return on Capital Calculator
            <InfoTooltip content="Annualized ROC standardizes returns across different DTE positions so you can compare apples to apples. A 2% return in 14 days is much better than 2% in 60 days." />
          </h1>
          <p className="text-gray-400 text-sm">
            Convert any options premium into an annualized return on capital and compare it to benchmark investments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>
            <InputSlider label="Premium Collected per Contract ($)" value={premium} onChange={setPremium} min={0.01} max={100} step={0.01} prefix="$" />
            <InputSlider label="Capital Required ($)" value={capitalRequired} onChange={setCapitalRequired} min={100} max={500000} step={100} prefix="$" />
            <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={365} step={1} suffix=" days" decimals={0} />
            <InputSlider label="Number of Contracts" value={contracts} onChange={setContracts} min={1} max={100} step={1} suffix=" contracts" decimals={0} />

            <div className="bg-gray-800 rounded-lg p-3 text-sm">
              <div className="text-gray-400 mb-1">Formula</div>
              <code className="text-blue-300 text-xs">
                Annualized ROC = (Premium / Capital) × (365 / DTE) × 100
              </code>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Total Premium"
                value={`$${fmt(calc.totalPremium)}`}
                explanation={`${contracts} contract${contracts > 1 ? "s" : ""} × $${fmt(premium)} × 100`}
                color="green"
              />
              <ResultCard
                label="Raw Return"
                value={`${calc.rawReturn.toFixed(2)}%`}
                explanation={`If expired worthless in ${dte} days`}
                color="green"
              />
              <ResultCard
                label="Annualized ROC"
                value={`${calc.annualizedROC.toFixed(1)}%`}
                explanation="Standardized to a full year"
                color={calc.annualizedROC > 30 ? "green" : calc.annualizedROC > 15 ? "yellow" : "neutral"}
              />
              <ResultCard
                label="Dollar Profit"
                value={`$${fmt(calc.dollarProfit)}`}
                explanation="If all contracts expire worthless"
                color="green"
              />
            </div>

            {/* Comparison chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-1 text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
                Benchmark Comparison
                <InfoTooltip content="S&P 500 historical average is ~10% annualized. High-yield savings currently around 5%. This trade's annualized ROC vs. those benchmarks." />
              </div>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={calc.comparisons}
                    layout="vertical"
                    margin={{ top: 4, right: 40, left: 10, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      stroke="#374151"
                      tickFormatter={(v) => `${v.toFixed(0)}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#d1d5db", fontSize: 11 }}
                      stroke="#374151"
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [`${Number(v).toFixed(1)}%`, "Annualized Return"]}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {calc.comparisons.map((entry, i) => (
                        <Cell key={i} fill={i === 0 && calc.annualizedROC > 10 ? "#22c55e" : i === 0 ? "#eab308" : "#374151"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Annualizing your return on capital puts every trade on the same scale, regardless of DTE. A short-dated trade with a smaller raw return can dramatically outperform on an annualized basis compared to a longer-dated trade. Compare against the S&P 500's 10% historical average to judge whether your premium income justifies the risk.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
