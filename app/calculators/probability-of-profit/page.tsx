"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ClientOnly from "@/components/calculators/ClientOnly";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

function normCDF(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1 / (1 + p * Math.abs(x));
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * (2 * y - 1));
}

const PRESETS = [
  { label: "30-Delta Short Put", type: "put" as const, pos: "short" as const, S: 150, K: 144, iv: 25, r: 5.25, dte: 30 },
  { label: "ATM Short Call", type: "call" as const, pos: "short" as const, S: 150, K: 150, iv: 25, r: 5.25, dte: 45 },
  { label: "16-Delta Iron Condor Wing", type: "call" as const, pos: "short" as const, S: 150, K: 160, iv: 25, r: 5.25, dte: 30 },
];

export default function ProbabilityOfProfitPage() {
  const [optionType, setOptionType] = useState<"call" | "put">("put");
  const [position, setPosition] = useState<"long" | "short">("short");
  const [stockPrice, setStockPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(144);
  const [iv, setIv] = useState(25);
  const [riskFreeRate, setRiskFreeRate] = useState(5.25);
  const [dte, setDte] = useState(30);

  function applyPreset(p: typeof PRESETS[0]) {
    setOptionType(p.type); setPosition(p.pos); setStockPrice(p.S);
    setStrikePrice(p.K); setIv(p.iv); setRiskFreeRate(p.r); setDte(p.dte);
  }

  const calc = useMemo(() => {
    const T = dte / 365;
    if (T <= 0 || iv <= 0) return null;
    const sigma = iv / 100;
    const r = riskFreeRate / 100;
    const d1 = (Math.log(stockPrice / strikePrice) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const deltaCall = normCDF(d1);
    const deltaPut = normCDF(d1) - 1;
    const probITMCall = normCDF(d2);
    const probITMPut = normCDF(-d2);

    let pop: number;
    let delta: number;
    if (optionType === "call") {
      delta = deltaCall;
      pop = position === "short" ? (1 - probITMCall) * 100 : probITMCall * 100;
    } else {
      delta = deltaPut;
      pop = position === "short" ? (1 - probITMPut) * 100 : probITMPut * 100;
    }

    // PoP curve across strikes
    const strikeRange = Array.from({ length: 41 }, (_, i) => {
      const k = stockPrice * (0.80 + i * 0.01);
      const d2k = (Math.log(stockPrice / k) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T)) - sigma * Math.sqrt(T);
      const popShortPut = normCDF(d2k) * 100;
      const popShortCall = (1 - normCDF(d2k)) * 100;
      return { strike: parseFloat(k.toFixed(1)), shortPut: parseFloat(popShortPut.toFixed(1)), shortCall: parseFloat(popShortCall.toFixed(1)) };
    });

    return { pop, delta: Math.abs(delta), d2, probITMCall, probITMPut, strikeRange };
  }, [stockPrice, strikePrice, iv, riskFreeRate, dte, optionType, position]);

  const fmt2 = (n: number) => n.toFixed(1);
  const popColor = !calc ? "text-gray-400" : calc.pop >= 70 ? "text-green-600" : calc.pop >= 50 ? "text-blue-600" : "text-orange-500";

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Probability of Profit</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Probability of Profit Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prob. of Profit</p><p className={`text-3xl font-bold ${popColor}`}>{calc ? fmt2(calc.pop) : "—"}%</p><p className="text-xs text-gray-400 mt-1">{position} {optionType}</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Delta</p><p className="text-2xl font-bold text-gray-800">{calc ? calc.delta.toFixed(2) : "—"}</p><p className="text-xs text-gray-400 mt-1">directional exposure</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prob. OTM</p><p className="text-2xl font-bold text-blue-600">{calc ? fmt2(optionType === "call" ? (1 - calc.probITMCall) * 100 : (1 - calc.probITMPut) * 100) : "—"}%</p><p className="text-xs text-gray-400 mt-1">expires worthless</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prob. ITM</p><p className="text-2xl font-bold text-orange-500">{calc ? fmt2(optionType === "call" ? calc.probITMCall * 100 : calc.probITMPut * 100) : "—"}%</p><p className="text-xs text-gray-400 mt-1">expires in the money</p></div>
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
        <div className="flex gap-2 mb-5">
          <div className="flex gap-2 flex-1">
            {(["call", "put"] as const).map((t) => (
              <button key={t} onClick={() => setOptionType(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${optionType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-1">
            {(["long", "short"] as const).map((p) => (
              <button key={p} onClick={() => setPosition(p)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${position === p ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p === "long" ? "Long (Buyer)" : "Short (Seller)"}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
          <InputSlider label="Strike Price ($)" value={strikePrice} onChange={setStrikePrice} min={1} max={1000} step={0.5} prefix="$" />
          <InputSlider label="Implied Volatility (%)" value={iv} onChange={setIv} min={1} max={200} step={0.5} suffix="%" />
          <InputSlider label="Risk-Free Rate (%)" value={riskFreeRate} onChange={setRiskFreeRate} min={0} max={15} step={0.25} suffix="%" />
          <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={365} step={1} suffix=" days" decimals={0} />
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PoP by Strike — Short Put <span className="text-blue-500">blue</span> · Short Call <span className="text-green-500">green</span></p>
          <ClientOnly height={220}>
            <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calc?.strikeRange ?? []} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                <defs>
                  <linearGradient id="putGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="callGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="strike" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `$${v}`} label={{ value: "Strike Price", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name === "shortPut" ? "Short Put PoP" : "Short Call PoP"]} labelFormatter={(l) => `Strike: $${l}`} />
                <ReferenceLine x={stockPrice} stroke="#9ca3af" strokeDasharray="3 2" label={{ value: "Stock", fill: "#9ca3af", fontSize: 9 }} />
                <ReferenceLine x={strikePrice} stroke="#f59e0b" strokeDasharray="3 2" label={{ value: "Strike", fill: "#f59e0b", fontSize: 9 }} />
                <Area type="monotone" dataKey="shortPut" stroke="#3b82f6" strokeWidth={2} fill="url(#putGrad)" dot={false} />
                <Area type="monotone" dataKey="shortCall" stroke="#22c55e" strokeWidth={2} fill="url(#callGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>
      </div>

      <InlineCTA heading="Find high-PoP trades systematically" body="Use the Wheel Strategy to sell puts at your target delta and collect premium with defined probability of profit every cycle." cta="Open Wheel Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">How Probability of Profit Works</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Probability of Profit (PoP) is derived from the Black-Scholes model using the N(d₂) term — the risk-neutral probability of an option expiring in the money. For an option seller, PoP equals the probability the option expires worthless. For a buyer, it's the probability it expires in the money.</p>
      <p className="text-gray-600 leading-relaxed mb-6">Delta is the quickest approximation: a 30-delta put has roughly a 30% chance of expiring ITM, meaning a 70% PoP for the seller. Most professional premium sellers target 70–85% PoP (roughly 15–30 delta) to balance income and probability.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Higher PoP = lower premium", "There's no free lunch. A 90% PoP option pays very little. Most income traders find the sweet spot at 70–80% PoP."],
          ["Delta ≈ PoP for short options", "For OTM options, the absolute value of delta is a close approximation of the probability of expiring ITM."],
          ["PoP doesn't account for early exit", "If you manage winners at 50% of max profit, your real PoP is higher than the at-expiration model shows."],
          ["IV increases all PoP values", "Higher implied volatility widens strike ranges and shifts PoP curves — the same strike has different PoP in a low vs. high IV environment."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="probability-of-profit" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
