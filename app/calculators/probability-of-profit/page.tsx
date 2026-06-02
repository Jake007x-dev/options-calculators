"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
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
  const popColor = !calc ? MUTED : calc.pop >= 70 ? PROFIT : calc.pop >= 50 ? TEAL : "#eab308";

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Probability of Profit</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Probability of Profit Calculator</h1>
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
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /><path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Probability of Profit</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>N(d₂) model — {position} {optionType}</div>
            </div>
          </div>

          {/* Type/Position toggles */}
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
                const isActive = position === p;
                return (
                  <button key={p} type="button" onClick={() => setPosition(p)} style={{ flex: 1, padding: "7px 0", borderRadius: 6, fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: isActive ? "rgba(29,178,176,0.18)" : "transparent", color: isActive ? TEAL : MUTED, transition: "all .2s" }}>{p === "long" ? "Long" : "Short"}</button>
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
                <Field label="Days to Expiration"><Stepper value={dte} onChange={setDte} min={1} step={1} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Prob. of Profit", value: calc ? `${fmt2(calc.pop)}%` : "—", color: popColor, desc: `${position} ${optionType}` },
                  { label: "Delta", value: calc ? calc.delta.toFixed(2) : "—", color: TEAL, desc: "directional exposure" },
                  { label: "Prob. OTM", value: calc ? `${fmt2(optionType === "call" ? (1 - calc.probITMCall) * 100 : (1 - calc.probITMPut) * 100)}%` : "—", color: "#b4e1e8", desc: "expires worthless" },
                  { label: "Prob. ITM", value: calc ? `${fmt2(optionType === "call" ? calc.probITMCall * 100 : calc.probITMPut * 100)}%` : "—", color: LOSS, desc: "expires in the money" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>PoP by Strike — Short Put (teal) · Short Call (green)</div>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calc?.strikeRange ?? []} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                    <defs>
                      <linearGradient id="putGradPoP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={TEAL} stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="callGradPoP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PROFIT} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={PROFIT} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="strike" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} label={{ value: "Strike Price", position: "insideBottom", offset: -12, fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name === "shortPut" ? "Short Put PoP" : "Short Call PoP"]} labelFormatter={(l) => `Strike: $${l}`} />
                    <ReferenceLine x={stockPrice} stroke={MUTED} strokeDasharray="3 2" label={{ value: "Stock", fill: MUTED, fontSize: 9 }} />
                    <ReferenceLine x={strikePrice} stroke="#eab308" strokeDasharray="3 2" label={{ value: "Strike", fill: "#eab308", fontSize: 9 }} />
                    <Area type="monotone" dataKey="shortPut" stroke={TEAL} strokeWidth={2} fill="url(#putGradPoP)" dot={false} />
                    <Area type="monotone" dataKey="shortCall" stroke={PROFIT} strokeWidth={2} fill="url(#callGradPoP)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
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
              PoP is derived from N(d₂) in Black-Scholes. Real PoP depends on early exit strategy and management.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
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
