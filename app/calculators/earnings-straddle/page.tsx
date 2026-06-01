"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "AAPL Earnings", stock: 200, call: 5.5, put: 5.0, hist: 8, dte: 1 },
  { label: "NVDA Earnings", stock: 130, call: 8.0, put: 7.5, hist: 12, dte: 1 },
  { label: "SPY Weekly", stock: 500, call: 4.0, put: 3.8, hist: 2, dte: 7 },
];

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
    let edgeLabel = "", edgeColor: "green" | "red" | "yellow" = "yellow";
    if (edgeRatio > 1.1) { edgeLabel = "IV Rich — consider selling the straddle"; edgeColor = "red"; }
    else if (edgeRatio < 0.9) { edgeLabel = "IV Cheap — consider buying the straddle"; edgeColor = "green"; }
    else { edgeLabel = "Fairly priced — no clear edge"; edgeColor = "yellow"; }
    const breakEvenUpper = stockPrice + straddlePrice;
    const breakEvenLower = stockPrice - straddlePrice;
    const priceRange = Array.from({ length: 41 }, (_, i) => {
      const finalPrice = stockPrice * (0.80 + i * 0.01);
      const longStraddle = Math.max(finalPrice - stockPrice, 0) + Math.max(stockPrice - finalPrice, 0) - straddlePrice;
      return { price: parseFloat(finalPrice.toFixed(2)), longStraddle: parseFloat(longStraddle.toFixed(2)), shortStraddle: parseFloat((-longStraddle).toFixed(2)) };
    });
    return { straddlePrice, impliedMoveDollar, impliedMovePct, historicalMoveDollar, edgeLabel, edgeColor, breakEvenUpper, breakEvenLower, priceRange };
  }, [stockPrice, callPrice, putPrice, historicalMove]);

  const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  function applyPreset(p: typeof PRESETS[0]) {
    setStockPrice(p.stock); setCallPrice(p.call); setPutPrice(p.put); setHistoricalMove(p.hist); setDte(p.dte);
  }

  const edgeBg = calc.edgeColor === "green" ? "bg-green-50 border-green-200" : calc.edgeColor === "red" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200";
  const edgeText = calc.edgeColor === "green" ? "text-green-700" : calc.edgeColor === "red" ? "text-red-700" : "text-yellow-700";

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Earnings Straddle</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Earnings Straddle Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      {/* Hero */}
      <div className={`rounded-xl border ${edgeBg} p-6 mb-6`}>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Edge Signal</p>
        <p className={`text-2xl font-bold mb-1 ${edgeText}`}>{calc.edgeLabel}</p>
        <p className="text-sm text-gray-600">Implied move is <strong>{calc.impliedMovePct.toFixed(1)}%</strong> vs. historical avg of <strong>{historicalMove}%</strong></p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Straddle Cost</p><p className="text-2xl font-bold text-gray-800">${fmt(calc.straddlePrice)}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Implied Move</p><p className="text-2xl font-bold text-blue-600">±{calc.impliedMovePct.toFixed(1)}%</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Upper BE</p><p className="text-2xl font-bold text-green-600">${fmt(calc.breakEvenUpper)}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lower BE</p><p className="text-2xl font-bold text-red-500">${fmt(calc.breakEvenLower)}</p></div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={2000} step={0.5} prefix="$" />
          <InputSlider label="ATM Call Price ($)" value={callPrice} onChange={setCallPrice} min={0.01} max={200} step={0.01} prefix="$" />
          <InputSlider label="ATM Put Price ($)" value={putPrice} onChange={setPutPrice} min={0.01} max={200} step={0.01} prefix="$" />
          <InputSlider label="Historical Avg Earnings Move (%)" value={historicalMove} onChange={setHistoricalMove} min={0.5} max={50} step={0.5} suffix="%" />
          <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={30} step={1} suffix=" days" decimals={0} />
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">P&L at Expiration</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calc.priceRange} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="price" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `$${Number(v).toFixed(0)}`} interval={7} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v, name) => [`$${Number(v).toFixed(2)}`, name === "longStraddle" ? "Long Straddle" : "Short Straddle"]} labelFormatter={(l) => `Stock: $${Number(l).toFixed(2)}`} />
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 2" />
                <ReferenceLine x={calc.breakEvenUpper} stroke="#22c55e" strokeDasharray="3 2" />
                <ReferenceLine x={calc.breakEvenLower} stroke="#22c55e" strokeDasharray="3 2" />
                <Line type="monotone" dataKey="longStraddle" stroke="#3b82f6" dot={false} strokeWidth={2} name="Long Straddle" />
                <Line type="monotone" dataKey="shortStraddle" stroke="#ef4444" dot={false} strokeWidth={2} strokeDasharray="5 3" name="Short Straddle" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-blue-500 inline-block" /> Long Straddle</span>
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-red-500 inline-block border-dashed" /> Short Straddle</span>
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-green-500 inline-block" /> Breakeven</span>
          </div>
        </div>
      </div>

      <InlineCTA heading="Learn the full straddle strategy" body="See when to buy vs. sell a straddle around earnings and how to manage the IV crush risk." cta="Read the Strategy Guide →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">How to Use This Calculator</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Enter the ATM call and put prices from your options chain the day before earnings. The calculator tells you whether the implied move (what the options are pricing) is larger or smaller than the historical average move. If the implied move is significantly larger than historical, the straddle is overpriced — consider selling. If smaller, consider buying.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["The straddle price = implied move", "The combined ATM call + put price directly tells you what move the market is pricing in. A $10 straddle on a $150 stock implies a ±6.7% move."],
          ["IV crush is the main risk for buyers", "After earnings, IV collapses 40–70%. Even a large move can lose money if the actual move doesn't exceed the implied move."],
          ["Selling straddles is high-risk, high-reward", "Short straddles profit from IV crush but face unlimited theoretical loss if the stock moves dramatically. Use only with proper risk management."],
          ["Historical moves are your edge finder", "If a stock has moved 12% on the last 4 earnings but the straddle implies only 7%, you have a statistical edge buying the straddle."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="earnings-straddle" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
