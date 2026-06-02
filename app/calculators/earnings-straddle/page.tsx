"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const NAVY = "#051636";
const TEAL = "#1db2b0";
const BORDER = "rgba(29,178,176,0.18)";
const CARD = "rgba(10,34,72,0.8)";
const TEXT = "#f2f8fd";
const MUTED = "#9dbdd0";
const PROFIT = "#1dd1a1";
const LOSS = "#e05c6a";

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

  const edgeBorderColor = calc.edgeColor === "green" ? PROFIT : calc.edgeColor === "red" ? LOSS : "#eab308";

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Earnings Straddle</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Earnings Straddle Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      {/* ── TRADINGBLOCK WIDGET ── */}
      <div style={{
        width: "100%",
        fontFamily: "'Poppins', sans-serif",
        background: NAVY,
        borderRadius: 16,
        overflow: "hidden",
        color: TEXT,
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${BORDER}`,
        marginBottom: 8,
      }}>
        <div style={{ padding: "24px 24px 28px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ width: 42, height: 42, flexShrink: 0, background: "rgba(29,178,176,0.1)", border: "1px solid rgba(29,178,176,0.28)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" width={18} height={18} stroke={TEAL} fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Earnings Straddle Analyzer</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Implied vs. historical move — find the edge</div>
            </div>
          </div>

          {/* Edge signal bar */}
          <div style={{ padding: "12px 16px", marginBottom: 16, background: `${edgeBorderColor}14`, border: `1px solid ${edgeBorderColor}55`, borderRadius: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Edge Signal</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: edgeBorderColor }}>{calc.edgeLabel}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Implied move: <strong style={{ color: TEXT }}>{calc.impliedMovePct.toFixed(1)}%</strong> vs. historical avg of <strong style={{ color: TEXT }}>{historicalMove}%</strong></div>
          </div>

          {/* Presets */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => applyPreset(p)} type="button" style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, border: `1px solid ${BORDER}`, background: "rgba(29,178,176,0.07)", color: MUTED, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{p.label}</button>
            ))}
          </div>

          {/* Two-column body */}
          <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 20, alignItems: "start" }}>
            {/* Left: inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <SectionLabel>Market Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Stock Price ($)"><Stepper value={stockPrice} onChange={setStockPrice} min={1} step={1} /></Field>
                <Field label="ATM Call Price ($)"><Stepper value={callPrice} onChange={setCallPrice} min={0.01} step={0.25} /></Field>
                <Field label="ATM Put Price ($)"><Stepper value={putPrice} onChange={setPutPrice} min={0.01} step={0.25} /></Field>
                <Field label="Historical Move (%)"><Stepper value={historicalMove} onChange={setHistoricalMove} min={0.5} step={0.5} /></Field>
                <Field label="Days to Expiration"><Stepper value={dte} onChange={setDte} min={1} step={1} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Straddle Cost", value: `$${fmt(calc.straddlePrice)}`, color: TEAL, desc: "total premium paid" },
                  { label: "Implied Move", value: `±${calc.impliedMovePct.toFixed(1)}%`, color: "#b4e1e8", desc: "1σ expected range" },
                  { label: "Upper Breakeven", value: `$${fmt(calc.breakEvenUpper)}`, color: PROFIT, desc: "long straddle BE" },
                  { label: "Lower Breakeven", value: `$${fmt(calc.breakEvenLower)}`, color: LOSS, desc: "long straddle BE" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>P&amp;L at Expiration</div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calc.priceRange} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="price" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickFormatter={(v) => `$${Number(v).toFixed(0)}`} interval={7} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v, name) => [`$${Number(v).toFixed(2)}`, name === "longStraddle" ? "Long Straddle" : "Short Straddle"]} labelFormatter={(l) => `Stock: $${Number(l).toFixed(2)}`} />
                    <ReferenceLine y={0} stroke={MUTED} strokeDasharray="4 2" />
                    <ReferenceLine x={calc.breakEvenUpper} stroke={PROFIT} strokeDasharray="3 2" />
                    <ReferenceLine x={calc.breakEvenLower} stroke={PROFIT} strokeDasharray="3 2" />
                    <Line type="monotone" dataKey="longStraddle" stroke={TEAL} dot={false} strokeWidth={2} name="longStraddle" />
                    <Line type="monotone" dataKey="shortStraddle" stroke={LOSS} dot={false} strokeWidth={2} strokeDasharray="5 3" name="shortStraddle" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: TEAL, display: "inline-block" }} /> Long Straddle</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: LOSS, display: "inline-block" }} /> Short Straddle</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: PROFIT, display: "inline-block" }} /> Breakeven</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 20, padding: "14px 18px", background: "rgba(29,178,176,0.05)", border: "1px solid rgba(29,178,176,0.14)", borderRadius: 8, fontSize: 11, lineHeight: 1.65, color: MUTED }}>
            <svg viewBox="0 0 24 24" width={15} height={15} style={{ flexShrink: 0, marginTop: 2, stroke: TEAL, fill: "none", opacity: 0.8 }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong style={{ color: TEAL, fontWeight: 600 }}>For educational purposes only.</strong>{" "}
              Straddle analysis is theoretical. IV crush, liquidity, and early assignment can significantly affect real outcomes.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
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
      </div>

      <CTABanner />
    </CalcPageLayout>
  );
}

function Stepper({ value, onChange, min = 0, step = 1 }: { value: number; onChange: (v: number) => void; min?: number; step?: number }) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 10000) / 10000));
  const inc = () => onChange(Math.round((value + step) * 10000) / 10000);
  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <button onClick={dec} type="button" style={{ width: 28, flexShrink: 0, background: "rgba(29,178,176,0.08)", border: `1px solid ${BORDER}`, color: TEAL, fontSize: 16, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px 0 0 6px" }}>−</button>
      <input type="number" value={value} onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(Math.max(min, v)); }} style={{ flex: 1, textAlign: "center", background: "rgba(10,34,72,0.6)", border: `1px solid ${BORDER}`, borderLeft: "none", borderRight: "none", color: TEXT, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, padding: "5px 7px", outline: "none", width: "100%" }} />
      <button onClick={inc} type="button" style={{ width: 28, flexShrink: 0, background: "rgba(29,178,176,0.08)", border: `1px solid ${BORDER}`, color: TEAL, fontSize: 16, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 6px 6px 0" }}>+</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label style={{ fontSize: 10, fontWeight: 500, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#e0f0f8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, marginTop: 14 }}>
      {children}
    </div>
  );
}
