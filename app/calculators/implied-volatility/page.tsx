"use client";

import { useMemo, useState } from "react";
import { impliedVolatility } from "@/lib/blackScholes";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

export default function ImpliedVolatilityPage() {
  const [stockPrice, setStockPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [dte, setDte] = useState(30);
  const [marketPrice, setMarketPrice] = useState(3.5);
  const [riskFreeRate, setRiskFreeRate] = useState(5.25);
  const [optionType, setOptionType] = useState<"call" | "put">("call");

  const result = useMemo(() => {
    const T = dte / 365;
    const r = riskFreeRate / 100;
    const iv = impliedVolatility(marketPrice, stockPrice, strikePrice, T, r, 0, optionType);
    return iv;
  }, [stockPrice, strikePrice, dte, marketPrice, riskFreeRate, optionType]);

  const ivPct = result !== null ? result * 100 : null;

  const ivColor = ivPct === null ? "neutral" : ivPct < 30 ? "green" : ivPct < 60 ? "yellow" : "red";
  const ivLabel =
    ivPct === null
      ? "No solution"
      : ivPct < 30
      ? "Low IV"
      : ivPct < 60
      ? "Moderate IV"
      : "High IV";

  // IV context bar segments
  const ivBarValue = Math.min(ivPct ?? 0, 100);

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Implied Volatility Calculator
            <InfoTooltip content="Implied Volatility (IV) is the market's forecast of how much a stock will move. It's derived by back-solving Black-Scholes from the current option price." />
          </h1>
          <p className="text-gray-400 text-sm">
            Enter an option's market price to back-solve for its implied volatility using Newton-Raphson iteration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>

            {/* Option type toggle */}
            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">Option Type</label>
              <div className="flex gap-2">
                {(["call", "put"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOptionType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      optionType === t
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <InputSlider
              label="Current Stock Price ($)"
              value={stockPrice}
              onChange={setStockPrice}
              min={1}
              max={1000}
              step={0.5}
              prefix="$"
            />
            <InputSlider
              label="Strike Price ($)"
              value={strikePrice}
              onChange={setStrikePrice}
              min={1}
              max={1000}
              step={0.5}
              prefix="$"
            />
            <InputSlider
              label="Days to Expiration"
              value={dte}
              onChange={setDte}
              min={1}
              max={365}
              step={1}
              suffix=" days"
              decimals={0}
            />
            <InputSlider
              label="Option Market Price ($)"
              value={marketPrice}
              onChange={setMarketPrice}
              min={0.01}
              max={100}
              step={0.01}
              prefix="$"
            />
            <InputSlider
              label="Risk-Free Rate (%)"
              value={riskFreeRate}
              onChange={setRiskFreeRate}
              min={0}
              max={15}
              step={0.25}
              suffix="%"
            />
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <ResultCard
              label="Implied Volatility"
              value={ivPct !== null ? `${ivPct.toFixed(1)}%` : "No solution"}
              explanation={`${ivLabel} — ${
                ivPct !== null
                  ? ivPct < 30
                    ? "Options are cheaply priced relative to historical norms."
                    : ivPct < 60
                    ? "Options carry a moderate volatility premium."
                    : "Options are expensive — elevated fear or event risk priced in."
                  : "Check your inputs. The option price may be below intrinsic value."
              }`}
              color={ivColor}
            />

            {/* IV Context Bar */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                  IV Context
                </span>
                <InfoTooltip content="Shows where the calculated IV falls relative to typical market ranges. Most stocks average 20–40% IV." />
              </div>
              <div className="relative h-4 rounded-full overflow-hidden bg-gray-800">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${ivBarValue}%`,
                    background:
                      ivColor === "green"
                        ? "#22c55e"
                        : ivColor === "yellow"
                        ? "#eab308"
                        : "#ef4444",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className="text-green-500">Low &lt;30%</span>
                <span className="text-yellow-500">Med 30–60%</span>
                <span className="text-red-500">High &gt;60%</span>
                <span>100%</span>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="flex-1 bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Low Threshold</div>
                  <div className="text-green-400 font-semibold">15%</div>
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Medium Threshold</div>
                  <div className="text-yellow-400 font-semibold">40%</div>
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">High Threshold</div>
                  <div className="text-red-400 font-semibold">70%</div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Implied volatility is the market's consensus forecast of future price movement, expressed as an annualized percentage. This calculator uses the Newton-Raphson method to iteratively solve Black-Scholes until the theoretical price matches your entered market price. A higher IV means traders expect larger price swings and are willing to pay more for options protection.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
