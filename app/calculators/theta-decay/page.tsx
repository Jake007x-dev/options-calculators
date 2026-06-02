"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { blackScholes, thetaDecayCurve } from "@/lib/blackScholes";
import InputSlider from "@/components/calculators/InputSlider";
import ClientOnly from "@/components/calculators/ClientOnly";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "ATM Call 45 DTE", type: "call" as const, S: 150, K: 150, iv: 25, r: 5.25, dte: 45, perspective: "long" as const },
  { label: "CC Short 30 DTE", type: "call" as const, S: 150, K: 155, iv: 25, r: 5.25, dte: 30, perspective: "short" as const },
  { label: "LEAPS 365 DTE", type: "call" as const, S: 150, K: 150, iv: 25, r: 5.25, dte: 365, perspective: "long" as const },
];

export default function ThetaDecayPage() {
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [stockPrice, setStockPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [iv, setIv] = useState(25);
  const [riskFreeRate, setRiskFreeRate] = useState(5.25);
  const [totalDTE, setTotalDTE] = useState(60);
  const [perspective, setPerspective] = useState<"long" | "short">("long");

  const params = { S: stockPrice, K: strikePrice, sigma: iv / 100, r: riskFreeRate / 100, q: 0 };

  const curve = useMemo(() => thetaDecayCurve(params, totalDTE, optionType), [stockPrice, strikePrice, iv, riskFreeRate, totalDTE, optionType]);

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

  const chartData = useMemo(() => curve.map((p) => ({
    dte: p.dte,
    value: perspective === "long" ? p.value : todayValue - p.value,
  })), [curve, perspective, todayValue]);

  const fmt = (n: number) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function applyPreset(p: typeof PRESETS[0]) {
    setOptionType(p.type); setStockPrice(p.S); setStrikePrice(p.K);
    setIv(p.iv); setRiskFreeRate(p.r); setTotalDTE(p.dte); setPerspective(p.perspective);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Theta Decay Visualizer</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Theta Decay Visualizer</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Today's Value</p><p className="text-2xl font-bold text-blue-600">${fmt(todayValue)}</p><p className="text-xs text-gray-400 mt-1">theoretical price</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Daily Theta</p><p className="text-2xl font-bold text-red-500">-${fmt(currentTheta)}</p><p className="text-xs text-gray-400 mt-1">per calendar day</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Value at 7 DTE</p><p className="text-2xl font-bold text-orange-500">${fmt(at7DTE)}</p><p className="text-xs text-gray-400 mt-1">decay accelerates here</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Decay</p><p className="text-2xl font-bold text-gray-800">${fmt(todayValue - atExpiry)}</p><p className="text-xs text-gray-400 mt-1">{perspective === "short" ? "your profit" : "your cost if static"}</p></div>
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
              <button key={p} onClick={() => setPerspective(p)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${perspective === p ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p === "long" ? "Long (Buyer)" : "Short (Seller)"}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
          <InputSlider label="Strike Price ($)" value={strikePrice} onChange={setStrikePrice} min={1} max={1000} step={0.5} prefix="$" />
          <InputSlider label="Implied Volatility (%)" value={iv} onChange={setIv} min={1} max={200} step={0.5} suffix="%" />
          <InputSlider label="Risk-Free Rate (%)" value={riskFreeRate} onChange={setRiskFreeRate} min={0} max={15} step={0.25} suffix="%" />
          <InputSlider label="Total DTE" value={totalDTE} onChange={setTotalDTE} min={2} max={365} step={1} suffix=" days" decimals={0} />
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {perspective === "long" ? "Option Value Over Time (Buyer — value eroding)" : "Premium Collected Over Time (Seller — profit growing)"}
          </p>
          <ClientOnly height={240}>
            <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                <defs>
                  <linearGradient id="thetaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={perspective === "long" ? "#3b82f6" : "#22c55e"} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={perspective === "long" ? "#3b82f6" : "#22c55e"} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dte" reversed tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" label={{ value: "DTE", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `$${v.toFixed(2)}`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${Number(v).toFixed(2)}`, perspective === "long" ? "Option Value" : "Profit Accumulated"]} labelFormatter={(l) => `${l} DTE`} />
                {totalDTE >= 30 && <ReferenceLine x={30} stroke="#f59e0b" strokeDasharray="3 2" label={{ value: "30 DTE", fill: "#f59e0b", fontSize: 9 }} />}
                <ReferenceLine x={7} stroke="#ef4444" strokeDasharray="3 2" label={{ value: "7 DTE", fill: "#ef4444", fontSize: 9 }} />
                <Area type="monotone" dataKey="value" stroke={perspective === "long" ? "#3b82f6" : "#22c55e"} strokeWidth={2} fill="url(#thetaGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>
        {totalDTE >= 30 && (
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"><p className="text-gray-500 mb-0.5">At 30 DTE</p><p className="font-bold text-gray-800">${fmt(at30DTE)}</p></div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center"><p className="text-gray-500 mb-0.5">At 7 DTE</p><p className="font-bold text-orange-600">${fmt(at7DTE)}</p></div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"><p className="text-gray-500 mb-0.5">At Expiry</p><p className="font-bold text-gray-800">${fmt(atExpiry)}</p></div>
          </div>
        )}
      </div>

      <InlineCTA heading="Collect theta systematically" body="Run the Wheel Strategy or sell covered calls to put time decay to work in your portfolio every month." cta="Open Wheel Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why Theta Accelerates Near Expiration</h2>
      <p className="text-gray-600 leading-relaxed mb-4">An option's value is made up of intrinsic value (how far in the money it is) and extrinsic value (time + volatility premium). Theta erodes only the extrinsic portion. With 90 DTE, there's plenty of time for the stock to move — so the extrinsic premium is large and decays slowly. With 7 DTE, time is nearly gone — extrinsic value collapses fast.</p>
      <p className="text-gray-600 leading-relaxed mb-6">This non-linear decay is why income traders sell in the 30–45 DTE window. You're in the steep part of the curve — collecting meaningful daily theta — without the extreme gamma risk of the last week.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Theta is always negative for buyers", "Every day you hold a long option, you lose a small amount. Even if the stock doesn't move, the option is worth less tomorrow."],
          ["Sellers collect theta daily", "Short options positions earn theta each day. It's the reason professional traders often prefer selling premium to buying it."],
          ["ATM options have the highest theta", "The most extrinsic value sits at the ATM strike — so ATM options decay fastest in dollar terms."],
          ["Weekends cost 3x normal decay", "Options price in theta for all 7 days of the week. On Fridays, you pay 3 days of decay (Fri/Sat/Sun) but only see 1 trading day pass."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="theta-decay" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
