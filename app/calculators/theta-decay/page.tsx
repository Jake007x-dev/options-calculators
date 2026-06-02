"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { blackScholes, thetaDecayCurve } from "@/lib/blackScholes";
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

  const lineColor = perspective === "long" ? LOSS : PROFIT;

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Theta Decay Visualizer</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Theta Decay Visualizer</h1>
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
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Theta Decay Visualizer</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Time value erosion — buyer vs. seller perspective</div>
            </div>
          </div>

          {/* Type/Perspective toggles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", background: "rgba(5,22,54,0.9)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, gap: 4 }}>
              {(["call", "put"] as const).map((t) => {
                const isActive = optionType === t;
                const color = t === "call" ? PROFIT : LOSS;
                return (
                  <button key={t} type="button" onClick={() => setOptionType(t)} style={{ flex: 1, padding: "7px 0", borderRadius: 6, fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: isActive ? `${color}22` : "transparent", color: isActive ? color : MUTED, transition: "all .2s", textTransform: "capitalize" }}>{t}</button>
                );
              })}
            </div>
            <div style={{ display: "flex", background: "rgba(5,22,54,0.9)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, gap: 4 }}>
              {(["long", "short"] as const).map((p) => {
                const isActive = perspective === p;
                return (
                  <button key={p} type="button" onClick={() => setPerspective(p)} style={{ flex: 1, padding: "7px 0", borderRadius: 6, fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: isActive ? "rgba(29,178,176,0.18)" : "transparent", color: isActive ? TEAL : MUTED, transition: "all .2s" }}>{p === "long" ? "Long (Buyer)" : "Short (Seller)"}</button>
                );
              })}
            </div>
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
                <Field label="Implied Volatility (%)"><Stepper value={iv} onChange={setIv} min={1} step={1} /></Field>
                <Field label="Risk-Free Rate (%)"><Stepper value={riskFreeRate} onChange={setRiskFreeRate} min={0} step={0.25} /></Field>
                <Field label="Total DTE"><Stepper value={totalDTE} onChange={setTotalDTE} min={2} step={1} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Today's Value", value: `$${fmt(todayValue)}`, color: TEAL, desc: "theoretical price" },
                  { label: "Daily Theta", value: `-$${fmt(currentTheta)}`, color: LOSS, desc: "per calendar day" },
                  { label: "Value at 7 DTE", value: `$${fmt(at7DTE)}`, color: "#eab308", desc: "decay accelerates here" },
                  { label: "Total Decay", value: `$${fmt(todayValue - atExpiry)}`, color: "#b4e1e8", desc: perspective === "short" ? "your profit" : "your cost if static" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>
                {perspective === "long" ? "Option Value Over Time (Buyer)" : "Premium Collected Over Time (Seller)"}
              </div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                    <defs>
                      <linearGradient id="thetaGradTB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={lineColor} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="dte" reversed tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} label={{ value: "DTE", position: "insideBottom", offset: -12, fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v) => [`$${Number(v).toFixed(2)}`, perspective === "long" ? "Option Value" : "Profit Accumulated"]} labelFormatter={(l) => `${l} DTE`} />
                    {totalDTE >= 30 && <ReferenceLine x={30} stroke="#eab308" strokeDasharray="3 2" label={{ value: "30 DTE", fill: "#eab308", fontSize: 9 }} />}
                    <ReferenceLine x={7} stroke={LOSS} strokeDasharray="3 2" label={{ value: "7 DTE", fill: LOSS, fontSize: 9 }} />
                    <Area type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} fill="url(#thetaGradTB)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {totalDTE >= 30 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
                  {[
                    { label: "At 30 DTE", value: `$${fmt(at30DTE)}`, color: MUTED },
                    { label: "At 7 DTE", value: `$${fmt(at7DTE)}`, color: "#eab308" },
                    { label: "At Expiry", value: `$${fmt(atExpiry)}`, color: MUTED },
                  ].map((m) => (
                    <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: MUTED }}>{m.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 20, padding: "14px 18px", background: "rgba(29,178,176,0.05)", border: "1px solid rgba(29,178,176,0.14)", borderRadius: 8, fontSize: 11, lineHeight: 1.65, color: MUTED }}>
            <svg viewBox="0 0 24 24" width={15} height={15} style={{ flexShrink: 0, marginTop: 2, stroke: TEAL, fill: "none", opacity: 0.8 }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong style={{ color: TEAL, fontWeight: 600 }}>For educational purposes only.</strong>{" "}
              Theta decay assumes constant IV and no stock price movement. Real decay varies with market conditions.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
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
