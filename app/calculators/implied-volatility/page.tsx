"use client";

import { useMemo, useState } from "react";
import { impliedVolatility } from "@/lib/blackScholes";
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
  { label: "SPY 30-Day ATM", S: 500, K: 500, dte: 30, mp: 8.5, r: 5.25, type: "call" as const },
  { label: "AAPL Pre-Earnings", S: 200, K: 205, dte: 7, mp: 4.2, r: 5.25, type: "call" as const },
  { label: "NVDA High IV", S: 130, K: 135, dte: 45, mp: 9.8, r: 5.25, type: "call" as const },
];

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
    return impliedVolatility(marketPrice, stockPrice, strikePrice, T, r, 0, optionType);
  }, [stockPrice, strikePrice, dte, marketPrice, riskFreeRate, optionType]);

  const ivPct = result !== null ? result * 100 : null;
  const ivColor = ivPct === null ? MUTED : ivPct < 30 ? PROFIT : ivPct < 60 ? "#eab308" : LOSS;
  const ivLabel = ivPct === null ? "No solution" : ivPct < 30 ? "Low IV" : ivPct < 60 ? "Moderate IV" : "High IV";
  const ivBarValue = Math.min(ivPct ?? 0, 100);

  function applyPreset(p: typeof PRESETS[0]) {
    setStockPrice(p.S); setStrikePrice(p.K); setDte(p.dte);
    setMarketPrice(p.mp); setRiskFreeRate(p.r); setOptionType(p.type);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Implied Volatility</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Free Implied Volatility Calculator</h1>
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
                <path d="M2 12 Q6 4 12 12 Q18 20 22 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Implied Volatility Calculator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Back-solve IV from a live option market price</div>
            </div>
          </div>

          {/* Call/Put toggle */}
          <div style={{ display: "flex", background: "rgba(5,22,54,0.9)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 5, marginBottom: 16, gap: 4 }}>
            {(["call", "put"] as const).map((t) => {
              const isActive = optionType === t;
              const color = t === "call" ? PROFIT : LOSS;
              return (
                <button key={t} type="button" onClick={() => setOptionType(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: isActive ? `${color}22` : "transparent", color: isActive ? color : MUTED, transition: "all .2s" }}>
                  {t === "call" ? "Call" : "Put"}
                </button>
              );
            })}
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
              <SectionLabel>Option Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Stock Price ($)"><Stepper value={stockPrice} onChange={setStockPrice} min={1} step={1} /></Field>
                <Field label="Strike Price ($)"><Stepper value={strikePrice} onChange={setStrikePrice} min={1} step={1} /></Field>
                <Field label="Days to Expiration"><Stepper value={dte} onChange={setDte} min={1} step={1} /></Field>
                <Field label="Option Market Price ($)"><Stepper value={marketPrice} onChange={setMarketPrice} min={0.01} step={0.25} /></Field>
                <Field label="Risk-Free Rate (%)"><Stepper value={riskFreeRate} onChange={setRiskFreeRate} min={0} step={0.25} /></Field>
              </div>
            </div>

            {/* Right: results */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              {/* IV result card */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: ivColor, opacity: 0.7 }} />
                <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>Implied Volatility</div>
                <div style={{ fontSize: 42, fontWeight: 700, color: ivColor, letterSpacing: "-0.03em", lineHeight: 1 }}>{ivPct !== null ? `${ivPct.toFixed(1)}%` : "—"}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{ivLabel}</div>

                {/* IV bar */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ height: 6, borderRadius: 4, background: "rgba(29,178,176,0.12)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${ivBarValue}%`, background: ivColor, borderRadius: 4, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: MUTED, marginTop: 4 }}>
                    <span>Low (&lt;30%)</span><span>Moderate</span><span>High (&gt;60%)</span>
                  </div>
                </div>
              </div>

              {/* Signal cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Signal", value: ivPct !== null ? (ivPct < 30 ? "Buy options" : ivPct < 60 ? "Neutral" : "Sell premium") : "—", color: ivColor, desc: ivPct !== null ? (ivPct < 30 ? "IV is cheap" : ivPct < 60 ? "Fair value" : "IV is rich") : "" },
                  { label: "IV Range", value: ivPct !== null ? (ivPct < 30 ? "< 30%" : ivPct < 60 ? "30–60%" : "> 60%") : "—", color: TEAL, desc: "annualized 1-year" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
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
              IV is solved via Newton-Raphson iteration using Black-Scholes. Actual market IV may differ due to skew and model assumptions.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">What Is Implied Volatility?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Implied volatility (IV) is the market's forward-looking expectation of how much a stock will move, expressed as an annualized percentage. It's calculated by taking a real option's market price and back-solving the Black-Scholes model until the theoretical price matches the market price. This calculator does that in milliseconds using Newton-Raphson iteration.</p>
        <p className="text-gray-600 leading-relaxed mb-6">IV rises when traders expect large moves (earnings, FDA decisions, FOMC). It falls after those events resolve — this collapse is called a "volatility crush" and is one of the most costly surprises for new options buyers.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Example — Reading IV Context</h2>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
          <p className="font-bold text-gray-800 mb-3">AAPL 30-Day ATM Call — IV Interpretation</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Stock at <strong>$200</strong>, ATM call trading at <strong>$5.50</strong>, 30 DTE</li>
            <li>• Back-solve gives IV = <strong>34%</strong></li>
            <li>• 52-week IV range: 18%–58% → IV Rank = <strong>43</strong> (moderately elevated)</li>
            <li>• Signal: options are slightly expensive — consider selling rather than buying</li>
            <li>• After earnings, IV collapses to 20% → the same call is now worth ~$2.80 even if the stock doesn't move</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">IV Interpretation Guide</h2>
        <div className="space-y-3 mb-8">
          {[
            { range: "IV < 30%", label: "Low IV", color: "border-green-200 bg-green-50", textColor: "text-green-700", action: "Options are cheap. Favor buying strategies: long calls, long puts, debit spreads, straddles. Rising IV will increase option value even before the stock moves." },
            { range: "IV 30–60%", label: "Moderate IV", color: "border-yellow-200 bg-yellow-50", textColor: "text-yellow-700", action: "Fair value. Both buying and selling strategies can work. Check IV Rank vs. the 52-week range to determine if it's trending up or down." },
            { range: "IV > 60%", label: "High IV", color: "border-red-200 bg-red-50", textColor: "text-red-700", action: "Options are expensive. Favor selling premium: iron condors, short strangles, covered calls. IV crush after events will rapidly deflate option prices." },
          ].map((row) => (
            <div key={row.range} className={`rounded-xl border ${row.color} px-4 py-3 text-sm`}>
              <span className={`font-bold ${row.textColor}`}>{row.range} ({row.label}): </span>
              <span className="text-gray-600">{row.action}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["IV is not direction", "High IV just means the market expects a big move — not which direction. You need a directional view separately."],
            ["IV is mean-reverting", "Extreme IV levels don't last. High IV tends to fall; low IV tends to rise. This creates opportunities to sell expensive or buy cheap options."],
            ["IV crush is the top killer of options buyers", "Buying options before earnings and seeing IV collapse after is the most common way traders lose money even with a correct direction call."],
            ["Use IV Rank for context", "Raw IV numbers mean nothing without historical context. An IV of 40% is high for one stock and low for another. Always check the 52-week range."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="implied-volatility" />
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
