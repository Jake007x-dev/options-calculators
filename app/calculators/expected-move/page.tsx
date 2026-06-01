"use client";

import { useMemo, useState } from "react";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

// Simple bell curve SVG component
function BellCurve({ stockPrice, moveAmount }: { stockPrice: number; moveAmount: number }) {
  const width = 340;
  const height = 130;
  const cx = width / 2;

  // Generate bell curve path
  const points: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * width;
    const z = ((x - cx) / (width / 6)) * 3;
    const y = height - 10 - (height - 20) * Math.exp(-0.5 * z * z);
    points.push([x, y]);
  }
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  // Price labels
  const sigma1L = stockPrice - moveAmount;
  const sigma1H = stockPrice + moveAmount;
  const sigma2L = stockPrice - moveAmount * 2;
  const sigma2H = stockPrice + moveAmount * 2;

  const scaleX = (price: number) => {
    const range = moveAmount * 3;
    return cx + ((price - stockPrice) / range) * (width / 2);
  };

  return (
    <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full max-w-sm mx-auto">
      {/* 2σ shaded zone */}
      <path
        d={`M ${scaleX(sigma2L)} ${height - 10} ${points
          .filter((p) => p[0] >= scaleX(sigma2L) && p[0] <= scaleX(sigma2H))
          .map((p, i) => `${i === 0 ? "L" : "L"} ${p[0]} ${p[1]}`)
          .join(" ")} L ${scaleX(sigma2H)} ${height - 10} Z`}
        fill="rgba(234, 179, 8, 0.12)"
      />
      {/* 1σ shaded zone */}
      <path
        d={`M ${scaleX(sigma1L)} ${height - 10} ${points
          .filter((p) => p[0] >= scaleX(sigma1L) && p[0] <= scaleX(sigma1H))
          .map((p, i) => `${i === 0 ? "L" : "L"} ${p[0]} ${p[1]}`)
          .join(" ")} L ${scaleX(sigma1H)} ${height - 10} Z`}
        fill="rgba(59, 130, 246, 0.18)"
      />
      {/* Curve */}
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />
      {/* Center line */}
      <line x1={cx} y1={height - 10} x2={cx} y2={10} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Labels */}
      <text x={cx} y={height + 20} textAnchor="middle" fill="#9ca3af" fontSize="9">
        ${stockPrice.toFixed(0)}
      </text>
      <text x={scaleX(sigma1L)} y={height + 20} textAnchor="middle" fill="#60a5fa" fontSize="9">
        ${sigma1L.toFixed(0)}
      </text>
      <text x={scaleX(sigma1H)} y={height + 20} textAnchor="middle" fill="#60a5fa" fontSize="9">
        ${sigma1H.toFixed(0)}
      </text>
      <text x={scaleX(sigma2L)} y={height + 20} textAnchor="middle" fill="#eab308" fontSize="9">
        ${sigma2L.toFixed(0)}
      </text>
      <text x={scaleX(sigma2H)} y={height + 20} textAnchor="middle" fill="#eab308" fontSize="9">
        ${sigma2H.toFixed(0)}
      </text>
      <text x={scaleX(sigma1L) - 4} y={40} textAnchor="end" fill="#60a5fa" fontSize="8">±1σ 68%</text>
      <text x={scaleX(sigma2H) + 4} y={40} textAnchor="start" fill="#eab308" fontSize="8">±2σ 95%</text>
    </svg>
  );
}

export default function ExpectedMovePage() {
  const [mode, setMode] = useState<"iv" | "straddle">("iv");
  const [stockPrice, setStockPrice] = useState(150);
  const [iv, setIv] = useState(30);
  const [dte, setDte] = useState(30);
  const [callPrice, setCallPrice] = useState(4.5);
  const [putPrice, setPutPrice] = useState(4.2);

  const calc = useMemo(() => {
    let moveDollar = 0;
    if (mode === "iv") {
      moveDollar = stockPrice * (iv / 100) * Math.sqrt(dte / 365);
    } else {
      moveDollar = (callPrice + putPrice) * 0.85;
    }
    const movePct = (moveDollar / stockPrice) * 100;
    const upper = stockPrice + moveDollar;
    const lower = stockPrice - moveDollar;
    return { moveDollar, movePct, upper, lower };
  }, [mode, stockPrice, iv, dte, callPrice, putPrice]);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Expected Move Calculator
            <InfoTooltip content="The expected move is the options market's one-standard-deviation forecast for how much a stock will move by expiration. It covers approximately 68% of probable outcomes." />
          </h1>
          <p className="text-gray-400 text-sm">
            Calculate the market-implied expected price range using IV or the straddle price as the input.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("iv")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "iv" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Mode A: IV-Based
          </button>
          <button
            onClick={() => setMode("straddle")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "straddle" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Mode B: Straddle-Based
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>
            <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={2000} step={0.5} prefix="$" />
            {mode === "iv" ? (
              <>
                <InputSlider label="Implied Volatility (%)" value={iv} onChange={setIv} min={1} max={200} step={0.5} suffix="%" />
                <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={365} step={1} suffix=" days" decimals={0} />
              </>
            ) : (
              <>
                <InputSlider label="ATM Call Price ($)" value={callPrice} onChange={setCallPrice} min={0.01} max={100} step={0.01} prefix="$" />
                <InputSlider label="ATM Put Price ($)" value={putPrice} onChange={setPutPrice} min={0.01} max={100} step={0.01} prefix="$" />
                <div className="text-gray-500 text-xs bg-gray-800 rounded-lg p-3">
                  Using straddle × 0.85 approximation (accounts for the bid-ask spread and skew adjustments).
                </div>
              </>
            )}
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Expected Move ($)" value={`±$${fmt(calc.moveDollar)}`} explanation="One standard deviation" color="blue" />
              <ResultCard label="Expected Move (%)" value={`±${calc.movePct.toFixed(1)}%`} explanation="As % of stock price" color="blue" />
              <ResultCard label="Upper Target" value={`$${fmt(calc.upper)}`} explanation="+1σ price level" color="green" />
              <ResultCard label="Lower Target" value={`$${fmt(calc.lower)}`} explanation="−1σ price level" color="red" />
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
              <div className="text-blue-400 text-sm font-medium mb-1">68% Probability Range</div>
              <div className="text-gray-300 text-xs mb-4">
                There is a 68% chance the stock stays between ${fmt(calc.lower)} and ${fmt(calc.upper)} by expiration.
              </div>
              <BellCurve stockPrice={stockPrice} moveAmount={calc.moveDollar} />
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The IV-based method uses the formula: Expected Move = Stock Price × IV × √(DTE/365). The straddle method takes the combined at-the-money call and put prices multiplied by 0.85 — a widely used rule of thumb that adjusts for the options market's typical pricing friction. Both methods produce the market's best estimate of the one-standard-deviation range.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
