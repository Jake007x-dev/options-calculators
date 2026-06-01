"use client";

import { useMemo, useState } from "react";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

// Simple SVG risk gauge arc
function RiskGauge({ pct }: { pct: number }) {
  const clamped = Math.min(pct, 10);
  const normalized = clamped / 10; // 0 to 1 for 0% to 10%+
  const angle = normalized * 180; // 0 to 180 degrees

  const cx = 80, cy = 80, r = 60;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcStart = { x: cx - r, y: cy };
  const arcEnd = {
    x: cx + r * Math.cos(Math.PI - toRad(angle)),
    y: cy - r * Math.sin(toRad(angle)),
  };

  const needleX = cx + (r - 10) * Math.cos(Math.PI - toRad(angle));
  const needleY = cy - (r - 10) * Math.sin(toRad(angle));

  const color = pct < 1.5 ? "#22c55e" : pct < 3 ? "#eab308" : "#ef4444";

  return (
    <svg viewBox="0 0 160 100" className="w-40 mx-auto">
      {/* Background arc */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#1f2937"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Colored arc */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${angle > 90 ? 1 : 0} 1 ${arcEnd.x} ${arcEnd.y}`}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="white" />
      {/* Labels */}
      <text x={cx - r - 4} y={cy + 16} textAnchor="middle" fill="#6b7280" fontSize="8">0%</text>
      <text x={cx + r + 4} y={cy + 16} textAnchor="middle" fill="#6b7280" fontSize="8">10%</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill={color} fontSize="13" fontWeight="600">{pct.toFixed(1)}%</text>
    </svg>
  );
}

export default function PositionSizePage() {
  const [accountSize, setAccountSize] = useState(50000);
  const [maxRiskPct, setMaxRiskPct] = useState(2);
  const [premium, setPremium] = useState(3.5);
  const [stopLossPct, setStopLossPct] = useState(50);
  const [legs, setLegs] = useState(1);

  const calc = useMemo(() => {
    const maxDollarRisk = accountSize * (maxRiskPct / 100);
    const dollarAtRiskPerContract = premium * 100 * (stopLossPct / 100) * legs;
    const maxContracts = dollarAtRiskPerContract > 0
      ? Math.floor(maxDollarRisk / dollarAtRiskPerContract)
      : 0;
    const totalDollarRisk = maxContracts * dollarAtRiskPerContract;
    const positionValue = maxContracts * premium * 100 * legs;
    const portfolioPct = (positionValue / accountSize) * 100;
    const stopTriggerPrice = premium * (1 - stopLossPct / 100);

    return {
      maxDollarRisk,
      maxContracts,
      totalDollarRisk,
      positionValue,
      portfolioPct,
      stopTriggerPrice,
    };
  }, [accountSize, maxRiskPct, premium, stopLossPct, legs]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Options Position Size & Risk Calculator
            <InfoTooltip content="Position sizing tells you the maximum number of contracts you can trade while keeping your risk within your defined limit per trade." />
          </h1>
          <p className="text-gray-400 text-sm">
            Calculate your maximum safe position size based on account risk tolerance and stop loss level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>
            <InputSlider label="Account Size ($)" value={accountSize} onChange={setAccountSize} min={1000} max={1000000} step={1000} prefix="$" decimals={0} />
            <InputSlider
              label="Max Risk per Trade (%)"
              value={maxRiskPct}
              onChange={setMaxRiskPct}
              min={0.5}
              max={5}
              step={0.5}
              suffix="%"
            />
            <InputSlider label="Option Premium per Contract ($)" value={premium} onChange={setPremium} min={0.01} max={100} step={0.01} prefix="$" />
            <InputSlider
              label="Stop Loss Level (% of premium)"
              value={stopLossPct}
              onChange={setStopLossPct}
              min={10}
              max={100}
              step={5}
              suffix="%"
              decimals={0}
            />
            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">Number of Legs</label>
              <div className="flex gap-2">
                {[1, 2].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLegs(l)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      legs === l ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {l} leg{l > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            {/* Risk Gauge */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex flex-col items-center">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 self-start">
                Portfolio at Risk
              </div>
              <RiskGauge pct={maxRiskPct} />
              <div className="text-gray-500 text-xs mt-1">
                {maxRiskPct < 1.5 ? "Conservative — good capital preservation" : maxRiskPct < 3 ? "Moderate — standard professional range" : "Aggressive — high risk of account damage"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Max Contracts"
                value={calc.maxContracts.toString()}
                explanation="Based on your risk limit"
                color="blue"
              />
              <ResultCard
                label="Total $ at Risk"
                value={`$${fmt(calc.totalDollarRisk)}`}
                explanation="Max loss if stop is hit"
                color={maxRiskPct > 3 ? "red" : "neutral"}
              />
              <ResultCard
                label="Position Value"
                value={`$${fmt(calc.positionValue)}`}
                explanation="Total premium committed"
                color="neutral"
              />
              <ResultCard
                label="Stop Trigger Price"
                value={`$${fmt(calc.stopTriggerPrice)}`}
                explanation={`Exit if option drops to this level`}
                color="yellow"
              />
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional traders typically risk 1–2% of their account per trade. This calculator enforces that discipline by working backwards from your risk budget to your maximum contract count. The stop loss percentage defines how much of the premium you're willing to lose before exiting — a 50% stop means you exit when the option has lost half its value.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
