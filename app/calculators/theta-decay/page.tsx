"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { blackScholes, thetaDecayCurve } from "@/lib/blackScholes";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

export default function ThetaDecayPage() {
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [stockPrice, setStockPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [iv, setIv] = useState(25);
  const [riskFreeRate, setRiskFreeRate] = useState(5.25);
  const [totalDTE, setTotalDTE] = useState(60);
  const [perspective, setPerspective] = useState<"long" | "short">("long");

  const params = {
    S: stockPrice,
    K: strikePrice,
    sigma: iv / 100,
    r: riskFreeRate / 100,
    q: 0,
  };

  const curve = useMemo(() => {
    return thetaDecayCurve(params, totalDTE, optionType);
  }, [stockPrice, strikePrice, iv, riskFreeRate, totalDTE, optionType]);

  const todayValue = curve[0]?.value ?? 0;
  const at30DTE = curve.find((p) => p.dte === 30)?.value ?? 0;
  const at7DTE = curve.find((p) => p.dte === 7)?.value ?? 0;
  const atExpiry = curve[curve.length - 1]?.value ?? 0;

  const currentTheta = useMemo(() => {
    const T = totalDTE / 365;
    if (T <= 0) return 0;
    const bs = blackScholes({ ...params, T });
    return optionType === "call" ? bs.theta.call : bs.theta.put;
  }, [stockPrice, strikePrice, iv, riskFreeRate, totalDTE, optionType]);

  const chartData = useMemo(() => {
    return curve.map((p) => ({
      dte: p.dte,
      value: perspective === "long" ? p.value : todayValue - p.value,
    }));
  }, [curve, perspective, todayValue]);

  const fmt = (n: number) =>
    Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Theta Decay Visualizer
            <InfoTooltip content="Theta is the daily time decay of an option. This chart shows how the option's theoretical value changes every day from today to expiration." />
          </h1>
          <p className="text-gray-400 text-sm">
            Visualize how time decay accelerates as an option approaches expiration — from the perspective of a buyer or a seller.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>

            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">Option Type</label>
              <div className="flex gap-2">
                {(["call", "put"] as const).map((t) => (
                  <button key={t} onClick={() => setOptionType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${optionType === t ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
            <InputSlider label="Strike Price ($)" value={strikePrice} onChange={setStrikePrice} min={1} max={1000} step={0.5} prefix="$" />
            <InputSlider label="Implied Volatility (%)" value={iv} onChange={setIv} min={1} max={200} step={0.5} suffix="%" />
            <InputSlider label="Risk-Free Rate (%)" value={riskFreeRate} onChange={setRiskFreeRate} min={0} max={15} step={0.25} suffix="%" />
            <InputSlider label="Total DTE" value={totalDTE} onChange={setTotalDTE} min={2} max={365} step={1} suffix=" days" decimals={0} />

            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">View Perspective</label>
              <div className="flex gap-2">
                {(["long", "short"] as const).map((p) => (
                  <button key={p} onClick={() => setPerspective(p)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${perspective === p ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                    {p === "long" ? "Long (Buyer)" : "Short (Seller)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Today's Value"
                value={`$${fmt(todayValue)}`}
                explanation="Current theoretical option price"
                color="blue"
              />
              <ResultCard
                label="Daily Theta"
                value={`$${fmt(currentTheta)}/day`}
                explanation="Time decay cost per calendar day"
                color="red"
              />
              {totalDTE >= 30 && (
                <ResultCard
                  label="Value at 30 DTE"
                  value={`$${fmt(at30DTE)}`}
                  explanation="If stock stays flat"
                  color="yellow"
                />
              )}
              <ResultCard
                label="Value at 7 DTE"
                value={`$${fmt(at7DTE)}`}
                explanation="Decay accelerates here"
                color="yellow"
              />
              <ResultCard
                label="Value at Expiry"
                value={`$${fmt(atExpiry)}`}
                explanation="Intrinsic value only"
                color={atExpiry > 0 ? "green" : "neutral"}
              />
              <ResultCard
                label="Total Decay"
                value={`$${fmt(todayValue - atExpiry)}`}
                explanation={perspective === "short" ? "Profit if short" : "Loss if long and static"}
                color={perspective === "short" ? "green" : "red"}
              />
            </div>

            {/* Chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                {perspective === "long" ? "Option Value Over Time (Long Perspective — value eroding)" : "Premium Collected Over Time (Short Perspective — profit growing)"}
              </div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
                    <defs>
                      <linearGradient id="decayGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={perspective === "long" ? "#ef4444" : "#22c55e"} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={perspective === "long" ? "#ef4444" : "#22c55e"} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="dte"
                      reversed
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      stroke="#374151"
                      label={{ value: "Days to Expiration", position: "insideBottom", offset: -4, fill: "#6b7280", fontSize: 10 }}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      stroke="#374151"
                      tickFormatter={(v) => `$${v.toFixed(2)}`}
                      width={55}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [`$${Number(v).toFixed(2)}`, perspective === "long" ? "Option Value" : "Profit Collected"]}
                      labelFormatter={(l) => `${l} DTE`}
                    />
                    {totalDTE >= 30 && <ReferenceLine x={30} stroke="#eab308" strokeDasharray="3 3" label={{ value: "30d", fill: "#eab308", fontSize: 9 }} />}
                    <ReferenceLine x={7} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "7d", fill: "#ef4444", fontSize: 9 }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={perspective === "long" ? "#ef4444" : "#22c55e"}
                      strokeWidth={2}
                      fill="url(#decayGrad)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Theta decay is not linear — it accelerates dramatically in the final 30 days before expiration. Option sellers profit from this curve (the value moving toward zero), while buyers are fighting it. The chart shows the same mathematical curve from both perspectives: the long buyer sees value eroding, the short seller sees collected premium becoming more certain profit.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
