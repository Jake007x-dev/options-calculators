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

export default function EarningsStraddlePage() {
  const [stockPrice, setStockPrice] = useState(150);
  const [callPrice, setCallPrice] = useState(5.5);
  const [putPrice, setPutPrice] = useState(5.0);
  const [historicalMove, setHistoricalMove] = useState(8);
  const [dte, setDte] = useState(5);

  const calc = useMemo(() => {
    const straddlePrice = callPrice + putPrice;
    const impliedMoveDollar = straddlePrice;
    const impliedMovePct = (impliedMoveDollar / stockPrice) * 100;
    const historicalMoveDollar = stockPrice * (historicalMove / 100);

    const edgeRatio = impliedMovePct / historicalMove;
    let edgeLabel = "";
    let edgeColor: "green" | "red" | "yellow" = "yellow";

    if (edgeRatio > 1.1) {
      edgeLabel = "IV Rich — consider selling the straddle";
      edgeColor = "red";
    } else if (edgeRatio < 0.9) {
      edgeLabel = "IV Cheap — consider buying the straddle";
      edgeColor = "green";
    } else {
      edgeLabel = "Fairly priced — no clear edge";
      edgeColor = "yellow";
    }

    const breakEvenUpper = stockPrice + straddlePrice;
    const breakEvenLower = stockPrice - straddlePrice;

    // P&L across price range ±20%
    const priceRange = Array.from({ length: 41 }, (_, i) => {
      const finalPrice = stockPrice * (0.80 + i * 0.01);
      const longStraddle = Math.max(finalPrice - stockPrice, 0) + Math.max(stockPrice - finalPrice, 0) - straddlePrice;
      const shortStraddle = -longStraddle;
      return {
        price: parseFloat(finalPrice.toFixed(2)),
        longStraddle: parseFloat(longStraddle.toFixed(2)),
        shortStraddle: parseFloat(shortStraddle.toFixed(2)),
      };
    });

    return {
      straddlePrice,
      impliedMoveDollar,
      impliedMovePct,
      historicalMoveDollar,
      edgeLabel,
      edgeColor,
      breakEvenUpper,
      breakEvenLower,
      priceRange,
    };
  }, [stockPrice, callPrice, putPrice, historicalMove]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Earnings Straddle / Strangle Calculator
            <InfoTooltip content="An earnings straddle buys both a call and a put at the same strike to profit from a large move in either direction. This calculator tells you whether the options market is overpricing or underpricing the expected earnings move." />
          </h1>
          <p className="text-gray-400 text-sm">
            Analyze earnings plays by comparing implied vs. historical moves and modeling straddle P&L across all outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>
            <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={2000} step={0.5} prefix="$" />
            <InputSlider label="ATM Call Price ($)" value={callPrice} onChange={setCallPrice} min={0.01} max={200} step={0.01} prefix="$" />
            <InputSlider label="ATM Put Price ($)" value={putPrice} onChange={setPutPrice} min={0.01} max={200} step={0.01} prefix="$" />
            <InputSlider
              label="Historical Avg Earnings Move (%)"
              value={historicalMove}
              onChange={setHistoricalMove}
              min={0.5}
              max={50}
              step={0.5}
              suffix="%"
            />
            <InputSlider
              label="Days to Expiration"
              value={dte}
              onChange={setDte}
              min={1}
              max={30}
              step={1}
              suffix=" days"
              decimals={0}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Edge indicator */}
            <div className={`rounded-xl border p-4 ${
              calc.edgeColor === "green"
                ? "border-green-500/40 bg-green-900/10"
                : calc.edgeColor === "red"
                ? "border-red-500/40 bg-red-900/10"
                : "border-yellow-500/40 bg-yellow-900/10"
            }`}>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Edge Indicator</div>
              <div className={`font-semibold text-lg ${
                calc.edgeColor === "green" ? "text-green-400" : calc.edgeColor === "red" ? "text-red-400" : "text-yellow-400"
              }`}>
                {calc.edgeLabel}
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Implied move is {calc.impliedMovePct.toFixed(1)}% vs. historical avg of {historicalMove}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Implied Move ($)"
                value={`±$${fmt(calc.impliedMoveDollar)}`}
                explanation="Straddle price = implied 1σ move"
                color="blue"
              />
              <ResultCard
                label="Implied Move (%)"
                value={`±${calc.impliedMovePct.toFixed(1)}%`}
                explanation="As % of stock price"
                color="blue"
              />
              <ResultCard
                label="Historical Move ($)"
                value={`±$${fmt(calc.historicalMoveDollar)}`}
                explanation={`${historicalMove}% avg at $${stockPrice}`}
                color="yellow"
              />
              <ResultCard
                label="Straddle Cost"
                value={`$${fmt(calc.straddlePrice)}`}
                explanation="Total premium to buy long straddle"
                color="neutral"
              />
              <ResultCard
                label="Break-even Upper"
                value={`$${fmt(calc.breakEvenUpper)}`}
                explanation="Long straddle profitable above here"
                color="green"
              />
              <ResultCard
                label="Break-even Lower"
                value={`$${fmt(calc.breakEvenLower)}`}
                explanation="Long straddle profitable below here"
                color="red"
              />
            </div>

            {/* Payoff chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
                P&L at Expiration
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calc.priceRange} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="price"
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      stroke="#374151"
                      tickFormatter={(v) => `$${v.toFixed(0)}`}
                      interval={7}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      stroke="#374151"
                      tickFormatter={(v) => `$${v.toFixed(0)}`}
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }}
                      formatter={(v, name) => [`$${Number(v).toFixed(2)}`, String(name)]}
                      labelFormatter={(l) => `Final Price: $${parseFloat(l).toFixed(2)}`}
                    />
                    <ReferenceLine y={0} stroke="#374151" strokeWidth={1.5} />
                    <ReferenceLine x={stockPrice} stroke="#4b5563" strokeDasharray="3 3" label={{ value: "Entry", fill: "#6b7280", fontSize: 9 }} />
                    <ReferenceLine x={calc.breakEvenUpper} stroke="#22c55e" strokeDasharray="3 3" />
                    <ReferenceLine x={calc.breakEvenLower} stroke="#ef4444" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="longStraddle"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="Long Straddle"
                    />
                    <Line
                      type="monotone"
                      dataKey="shortStraddle"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      name="Short Straddle"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> Long Straddle</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block" /> Short Straddle</span>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The implied move is simply the combined ATM straddle price — the market's exact dollar estimate of how much the stock will move by expiration. Comparing it to the historical average earnings move tells you whether options are cheap (buy the straddle) or expensive (sell it). The payoff chart shows both sides of the trade across a ±20% price range.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
