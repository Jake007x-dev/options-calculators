"use client";

import { useMemo, useState } from "react";
import { blackScholes } from "@/lib/blackScholes";
import InputSlider from "@/components/calculators/InputSlider";
import ResultCard from "@/components/calculators/ResultCard";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";

export default function BlackScholesPage() {
  const [stockPrice, setStockPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [dte, setDte] = useState(30);
  const [iv, setIv] = useState(25);
  const [riskFreeRate, setRiskFreeRate] = useState(5.25);
  const [divYield, setDivYield] = useState(0);

  const result = useMemo(() => {
    return blackScholes({
      S: stockPrice,
      K: strikePrice,
      T: dte / 365,
      sigma: iv / 100,
      r: riskFreeRate / 100,
      q: divYield / 100,
    });
  }, [stockPrice, strikePrice, dte, iv, riskFreeRate, divYield]);

  const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Black-Scholes Option Pricing Calculator
          </h1>
          <p className="text-gray-400 text-sm">
            Calculate theoretical call and put prices plus all five Greeks using the Black-Scholes-Merton model with continuous dividend yield adjustment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Inputs</h2>
            <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
            <InputSlider label="Strike Price ($)" value={strikePrice} onChange={setStrikePrice} min={1} max={1000} step={0.5} prefix="$" />
            <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={730} step={1} suffix=" days" decimals={0} />
            <InputSlider label="Implied Volatility (%)" value={iv} onChange={setIv} min={1} max={200} step={0.5} suffix="%" />
            <InputSlider label="Risk-Free Rate (%)" value={riskFreeRate} onChange={setRiskFreeRate} min={0} max={15} step={0.25} suffix="%" />
            <InputSlider label="Dividend Yield (%)" value={divYield} onChange={setDivYield} min={0} max={15} step={0.1} suffix="%" />
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Prices */}
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Call Price"
                value={`$${fmt(result.callPrice)}`}
                explanation="Theoretical call option value"
                color="green"
              />
              <ResultCard
                label="Put Price"
                value={`$${fmt(result.putPrice)}`}
                explanation="Theoretical put option value"
                color="red"
              />
            </div>

            {/* Greeks */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-1">
                The Greeks
                <InfoTooltip content="Greeks measure how sensitive the option price is to changes in underlying variables." />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    Delta (Call / Put)
                    <InfoTooltip content="How much the option price moves per $1 change in the stock price. Call delta is 0 to 1; put delta is -1 to 0." />
                  </div>
                  <div className="text-white font-semibold">
                    {fmt(result.delta.call, 4)} / {fmt(result.delta.put, 4)}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Call moves ~${fmt(result.delta.call, 2)} per $1 move in stock
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    Gamma
                    <InfoTooltip content="The rate of change of delta per $1 move in the stock. High gamma = delta changes rapidly." />
                  </div>
                  <div className="text-white font-semibold">{fmt(result.gamma, 4)}</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Delta changes by {fmt(result.gamma, 4)} per $1 stock move
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    Theta (Call / Put)
                    <InfoTooltip content="Daily time decay in dollars. Options lose this value each calendar day, all else equal." />
                  </div>
                  <div className="text-red-400 font-semibold">
                    ${fmt(result.theta.call, 4)} / ${fmt(result.theta.put, 4)}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Call loses ${Math.abs(result.theta.call).toFixed(4)}/day
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    Vega
                    <InfoTooltip content="How much the option price changes per 1% change in implied volatility." />
                  </div>
                  <div className="text-blue-400 font-semibold">${fmt(result.vega, 4)}</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    ${fmt(result.vega, 4)} per 1% IV change
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3 sm:col-span-2">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    Rho (Call / Put)
                    <InfoTooltip content="How much the option price changes per 1% change in the risk-free interest rate." />
                  </div>
                  <div className="text-yellow-400 font-semibold">
                    ${fmt(result.rho.call, 4)} / ${fmt(result.rho.put, 4)}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Value change per 1% rate move
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-medium mb-2">How This Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Black-Scholes-Merton model assumes the stock follows geometric Brownian motion and derives a closed-form price for European options. The Greeks tell you exactly how the position will respond to changes in price, time, volatility, and rates — giving you a complete risk profile before you trade.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
