"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { blackScholes, normCDF } from "@/lib/blackScholes";
import CTABanner from "@/components/calculators/CTABanner";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";

// ── helpers ────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function bsPrice(S: number, K: number, T: number, r: number, sigma: number, q: number, type: "call" | "put") {
  if (T <= 0) return type === "call" ? Math.max(0, S - K) : Math.max(0, K - S);
  const bs = blackScholes({ S, K, T, sigma, r, q });
  return type === "call" ? bs.callPrice : bs.putPrice;
}

// ── stepper input ──────────────────────────────────────────────────────────

function Stepper({
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 10000) / 10000));
  const inc = () => onChange(Math.round((value + step) * 10000) / 10000);

  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <button onClick={dec} type="button" style={stepBtnStyle("left")}>−</button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) onChange(Math.max(min, v));
        }}
        style={stepInputStyle}
      />
      <button onClick={inc} type="button" style={stepBtnStyle("right")}>+</button>
    </div>
  );
}

// ── styles ─────────────────────────────────────────────────────────────────

const NAVY = "#051636";
const NAVY2 = "#0a2248";
const TEAL = "#1db2b0";
const BORDER = "rgba(29,178,176,0.18)";
const CARD = "rgba(10,34,72,0.8)";
const TEXT = "#f2f8fd";
const MUTED = "#9dbdd0";
const PROFIT = "#1dd1a1";
const LOSS = "#e05c6a";

const stepBtnBase: React.CSSProperties = {
  width: 28,
  flexShrink: 0,
  background: "rgba(29,178,176,0.08)",
  border: `1px solid ${BORDER}`,
  color: TEAL,
  fontSize: 16,
  cursor: "pointer",
  fontFamily: "'Poppins', sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function stepBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    ...stepBtnBase,
    borderRadius: side === "left" ? "6px 0 0 6px" : "0 6px 6px 0",
  };
}

const stepInputStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  background: "rgba(10,34,72,0.6)",
  border: `1px solid ${BORDER}`,
  borderLeft: "none",
  borderRight: "none",
  color: TEXT,
  fontFamily: "'Poppins', sans-serif",
  fontSize: 14,
  fontWeight: 600,
  padding: "5px 7px",
  outline: "none",
  MozAppearance: "textfield" as React.CSSProperties["MozAppearance"],
  width: "100%",
};

// ── tooltip ────────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const today = payload.find((p) => p.name === "today")?.value ?? 0;
  const expiry = payload.find((p) => p.name === "expiry")?.value ?? 0;
  const tv = Math.max(0, today - expiry);
  return (
    <div style={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, padding: "10px 14px", fontFamily: "'Poppins', sans-serif" }}>
      <p style={{ color: "#b4e1e8", fontSize: 11, marginBottom: 4 }}>Stock @ ${label}</p>
      <p style={{ color: "#e8f4f8", fontSize: 12, fontWeight: 600 }}>
        Today: ${today.toFixed(2)} <span style={{ color: MUTED, fontWeight: 400 }}>(TV: ${tv.toFixed(2)})</span>
      </p>
      <p style={{ color: "#e8f4f8", fontSize: 12, fontWeight: 600 }}>Expiry: ${expiry.toFixed(2)}</p>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────

export default function BlackScholesPage() {
  const [optType, setOptType] = useState<"call" | "put">("call");
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(100);
  const [dte, setDte] = useState(30);
  const [iv, setIv] = useState(20);
  const [riskFreeRate, setRiskFreeRate] = useState(3.5);
  const [divYield, setDivYield] = useState(0);

  const T = clamp(dte, 1, 9999) / 365;
  const sigma = iv / 100;
  const r = riskFreeRate / 100;
  const q = divYield / 100;
  const S = stockPrice;
  const K = strikePrice;

  const bs = useMemo(
    () => blackScholes({ S, K, T, sigma, r, q }),
    [S, K, T, sigma, r, q]
  );

  const greeks = useMemo(() => {
    const delta = optType === "call" ? bs.delta.call : bs.delta.put;
    const theta = optType === "call" ? bs.theta.call : bs.theta.put;
    const probITM = optType === "call" ? normCDF(bs.d2) : normCDF(-bs.d2);
    return { delta, gamma: bs.gamma, theta, vega: bs.vega, probITM };
  }, [bs, optType]);

  const chartData = useMemo(() => {
    const lo = Math.max(1, Math.round(K * 0.72));
    const hi = Math.round(K * 1.28);
    const data = [];
    for (let sp = lo; sp <= hi; sp++) {
      data.push({
        sp,
        today: parseFloat(bsPrice(sp, K, T, r, sigma, q, optType).toFixed(3)),
        expiry: parseFloat((optType === "call" ? Math.max(0, sp - K) : Math.max(0, K - sp)).toFixed(3)),
      });
    }
    return data;
  }, [K, T, r, sigma, q, optType]);

  const callActive = optType === "call";

  return (
    <CalcPageLayout>
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <a href="/calculators" className="hover:text-blue-600">Calculators</a>
        <span>›</span>
        <span className="text-gray-800">Black-Scholes Pricing</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        Free Black-Scholes Option Pricing Calculator
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        By: <span className="font-medium text-gray-700">Jake Joseph</span>
        &nbsp;·&nbsp; Updated June 2026
      </p>

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
                <path d="M2 2 L22 22 M7 2 Q12 12 17 2 M7 22 Q12 12 17 22" strokeWidth={2} />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Option Greeks Calculator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>
                Long {callActive ? "Call" : "Put"} — delta, gamma, theta &amp; vega
              </div>
            </div>
          </div>

          {/* Call/Put toggle */}
          <div style={{ display: "flex", background: "rgba(5,22,54,0.9)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 5, marginBottom: 18, gap: 4 }}>
            {(["call", "put"] as const).map((type) => {
              const isActive = optType === type;
              const color = type === "call" ? PROFIT : LOSS;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOptType(type)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 8,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    background: isActive
                      ? `linear-gradient(135deg, ${color}33, ${color}0f)`
                      : "transparent",
                    color: isActive ? color : MUTED,
                    boxShadow: isActive ? `0 0 0 1px ${color}66, 0 2px 10px ${color}1f` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all .2s",
                    letterSpacing: ".01em",
                  }}
                >
                  <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    {type === "call"
                      ? <polyline points="2,18 7,18 11,6 21,6" />
                      : <polyline points="2,6 7,6 11,18 21,18" />}
                  </svg>
                  {type === "call" ? "Call Option" : "Put Option"}
                </button>
              );
            })}
          </div>

          {/* Body — two-column */}
          <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 20, alignItems: "start" }}>

            {/* Left panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <SectionLabel>Option Parameters</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Stock Price ($)"><Stepper value={stockPrice} onChange={setStockPrice} min={0.01} step={1} /></Field>
                <Field label="Strike Price ($)"><Stepper value={strikePrice} onChange={setStrikePrice} min={0.01} step={1} /></Field>
                <Field label="Days to Expiration"><Stepper value={dte} onChange={setDte} min={1} step={1} /></Field>
              </div>

              <div style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "12px 0" }} />
              <SectionLabel>Model Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Implied Vol (%)"><Stepper value={iv} onChange={setIv} min={0.1} step={1} /></Field>
                <Field label="Interest Rate (%)"><Stepper value={riskFreeRate} onChange={setRiskFreeRate} min={0} step={0.25} /></Field>
                <Field label="Dividend Yield (%)"><Stepper value={divYield} onChange={setDivYield} min={0} step={0.25} /></Field>
              </div>
            </div>

            {/* Right panel */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

              {/* Greeks grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 18 }}>
                {[
                  { cls: "delta", color: PROFIT, name: "Delta", value: greeks.delta.toFixed(3), desc: "Price sensitivity per $1 move" },
                  { cls: "gamma", color: "#b4e1e8", name: "Gamma", value: greeks.gamma.toFixed(3), desc: "Delta change per $1 move" },
                  { cls: "theta", color: LOSS, name: "Theta", value: greeks.theta.toFixed(3), desc: "Daily time decay ($)" },
                  { cls: "vega", color: "#f59e0b", name: "Vega", value: greeks.vega.toFixed(3), desc: "Value change per 1% IV move" },
                  { cls: "prob", color: "#a78bfa", name: "Prob ITM", value: (greeks.probITM * 100).toFixed(1) + "%", desc: "Probability of expiring ITM" },
                ].map((g) => (
                  <div key={g.name} style={{
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 9,
                    padding: "12px 12px 10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: g.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em", lineHeight: 1 }}>{g.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: g.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{g.value}</div>
                    <div style={{ fontSize: 9, color: MUTED, lineHeight: 1.4, marginTop: 2 }}>{g.desc}</div>
                  </div>
                ))}
              </div>

              {/* Chart header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#b4e1e8" }}>Option Value — Today vs Expiration</span>
                <span style={{ fontSize: 10, color: TEAL, background: "rgba(29,178,176,0.1)", border: "1px solid rgba(29,178,176,0.25)", borderRadius: 4, padding: "3px 8px", letterSpacing: "0.07em", textTransform: "uppercase" }}>{dte} Days</span>
              </div>

              {/* Chart legend */}
              <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}>
                  <span style={{ width: 22, height: 2, borderRadius: 1, background: TEAL, display: "inline-block" }} />
                  Today (with time value)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}>
                  <span style={{ width: 22, height: 0, borderTop: "2px dashed rgba(180,225,232,0.5)", display: "inline-block" }} />
                  At Expiration (intrinsic only)
                </span>
              </div>

              {/* Chart */}
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis
                      dataKey="sp"
                      tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }}
                      tickFormatter={(v) => `$${v}`}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }}
                      tickFormatter={(v) => `$${v.toFixed(2)}`}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine
                      x={K}
                      stroke="rgba(167,139,250,0.7)"
                      strokeDasharray="5 4"
                      strokeWidth={1.5}
                      label={{ value: "ATM", fill: "#a78bfa", fontSize: 10, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}
                    />
                    <Line dataKey="today" name="today" stroke={TEAL} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#fff", stroke: TEAL, strokeWidth: 2 }} />
                    <Line dataKey="expiry" name="expiry" stroke="rgba(180,225,232,0.45)" strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 4, fill: "#fff", stroke: "#b4e1e8" }} />
                  </LineChart>
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
              Greeks are theoretical values calculated using Black-Scholes. Actual Greeks may differ based on market conditions, liquidity, and model assumptions.
            </span>
          </div>

        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">

        {/* ── What Is Black-Scholes ── */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is the Black-Scholes Model and Fair Price?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The <strong>Black-Scholes model</strong> (also called Black-Scholes-Merton, or BSM) is the industry-standard formula for pricing European-style options. Published in 1973 by Fischer Black and Myron Scholes — with a companion paper by Robert Merton — it gave the market a mathematical framework for what an option is theoretically worth.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Today, every options trader encounters Black-Scholes whether they know it or not. It&apos;s the engine behind the <strong>implied volatility (IV)</strong> number you see on your broker platform, the Greeks displayed on your options chain, and the fair-value estimates your risk system runs in real time. In practice, the calculator also works as an <strong>options calculator</strong>, using the inputs provided to output the theoretical prices for both a call option and a put option.
        </p>
        <ul className="space-y-1.5 text-sm text-gray-700 mb-5">
          <li>✅ Enter a stock price, strike price, and expiration</li>
          <li>✅ Add implied volatility and the risk-free rate</li>
          <li>✅ Get a theoretical call price, put price, and all five Greeks instantly</li>
        </ul>

        {/* Pro tip */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-8">
          <span className="text-xl leading-none mt-0.5">👨</span>
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong>Pro Tip:</strong> The Black-Scholes calculator works best as a <em>relative</em> tool. Use it to compare theoretical value against the market price of an option to spot whether a contract is rich or cheap before you trade.
          </p>
        </div>

        <InlineCTA
          heading="Use Black-Scholes on real trades"
          body="Model your options positions before you enter. Open a live account and trade with professional-grade order routing."
        />

        {/* ── Formula Inputs ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">Black-Scholes Formula Inputs: Implied Volatility</h2>
        <p className="text-gray-600 leading-relaxed mb-5">
          The BSM model requires six variables in the calculator version, with dividend yield added as the sixth input in modified versions. Here&apos;s what each one means and where to find it:
        </p>

        <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Input</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">What It Is</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Where to Find It</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Stock Price (S)", "Current stock price, or current price of the underlying asset", "Live quote on your broker platform"],
                ["Strike Price (K)", "The price at which the option can be exercised", "Options chain"],
                ["Days to Expiration (DTE)", "Calendar days until expiration", "Options chain"],
                ["Implied Volatility (IV)", "Market's expected 1-year price move, annualized", "Options chain or TradingBlock platform"],
                ["Risk-Free Rate (r)", "Yield on a theoretically riskless investment over the life of the option", "U.S. Treasury website or broker data feed"],
                ["Dividend Yield (q)", "Annual dividend as a % of stock price", "Broker quote or company IR page"],
              ].map(([input, what, where]) => (
                <tr key={input} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{input}</td>
                  <td className="px-4 py-3 text-gray-600">{what}</td>
                  <td className="px-4 py-3 text-gray-500">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-10">
          <span className="text-xl leading-none mt-0.5">👨</span>
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong>Pro Tip:</strong> Implied volatility is the <em>only</em> input the market sets — all others are observable facts. When you &ldquo;back-solve&rdquo; the Black-Scholes formula using the actual market price of an option, the volatility that makes the formula balance is called <strong>implied volatility</strong>. This is exactly how IV is calculated on every options chain.
          </p>
        </div>

        {/* ── Greeks ── */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Option Greeks: What They Mean</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          The calculator outputs five Greeks. These are the risk sensitivities every options trader must understand.
        </p>

        <div className="space-y-4 mb-8">

          {/* Delta */}
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">Delta (Δ)</h3>
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-0.5 rounded-full">0 to +1 calls · −1 to 0 puts</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Delta measures how much the option price changes for every <strong>$1 move in the stock</strong>. An at-the-money (ATM) option has a delta of roughly ±0.50. Delta also serves as a rough <strong>probability of expiring in the money</strong> — a 0.30 delta call has approximately a 30% chance of finishing ITM at expiration.
            </p>
            <ul className="space-y-1 text-sm text-gray-600 mb-3">
              <li>• Call delta: 0 to +1</li>
              <li>• Put delta: −1 to 0</li>
            </ul>
            <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 font-medium">
              Example: Stock up $5 · Delta 0.50 call → option up ~$2.50
            </p>
          </div>

          {/* Gamma */}
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">Gamma (Γ)</h3>
              <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2.5 py-0.5 rounded-full">Always positive</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Gamma measures how fast delta changes as the stock moves — it&apos;s the <em>acceleration</em> of your position. Gamma is highest for ATM options near expiration, making it a major risk factor for short sellers.
            </p>
            <ul className="space-y-1 text-sm text-gray-600 mb-3">
              <li>• Long options have positive gamma (delta increases as the trade goes your way)</li>
              <li>• Short options have negative gamma (delta works against you as the stock moves)</li>
            </ul>
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 mb-3">
              <span className="text-yellow-500 flex-shrink-0">⚠️</span>
              <p className="text-xs text-gray-700">Short gamma is the primary risk in strategies like short straddles and naked calls. As expiration approaches, gamma spikes and even small stock moves can produce large losses.</p>
            </div>
            <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 font-medium">
              Example: Delta 0.50, Gamma 0.04 · Stock up $1 → new delta ≈ 0.54
            </p>
          </div>

          {/* Theta */}
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">Theta (Θ)</h3>
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2.5 py-0.5 rounded-full">Negative for buyers · Positive for sellers</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Theta is the <strong>daily time decay</strong> of an option — the dollar amount the option loses each day assuming all else is equal. Theta decay accelerates sharply in the final 30 days before expiration. More time remaining generally increases the value of both calls and puts.
            </p>
            <ul className="space-y-1 text-sm text-gray-600 mb-3">
              <li>• Option buyers pay theta (negative theta)</li>
              <li>• Option sellers collect theta (positive theta)</li>
            </ul>
            <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 font-medium">
              Example: Option worth $3.00 · Theta −$0.08 → worth ~$2.92 tomorrow
            </p>
          </div>

          {/* Vega */}
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">Vega (ν)</h3>
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-0.5 rounded-full">Always positive</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Vega measures the option&apos;s sensitivity to <strong>implied volatility</strong> — how much the option price changes for every 1% move in IV. Vega is highest for longer-dated options.
            </p>
            <ul className="space-y-1 text-sm text-gray-600 mb-3">
              <li>• Long options benefit when IV rises (long vega)</li>
              <li>• Short options are hurt when IV rises (short vega)</li>
            </ul>
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3">
              <span className="text-xl leading-none mt-0.5">👨</span>
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>Pro Tip:</strong> Buying options before a major catalyst (earnings, Fed announcement) means paying elevated IV. If the move doesn&apos;t materialize, IV collapses and you lose money even if the stock moves in your direction. This is called an <strong>IV crush</strong>.
              </p>
            </div>
            <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 font-medium">
              Example: Vega $0.12 · IV rises from 25% to 26% → option gains $0.12
            </p>
          </div>

          {/* Prob ITM */}
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">Probability ITM</h3>
              <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full">Derived from N(d2)</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Not a traditional Greek, but one of the most practical outputs of the Black-Scholes model. It&apos;s derived from the <strong>d2</strong> term in the formula and represents the model&apos;s estimated probability that the option expires in the money.
            </p>
          </div>
        </div>

        {/* ── Trade Example: Long Call ── */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Black-Scholes Trade Example — Long Call</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Let&apos;s walk through a real example using the calculator.</p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-5">
          <p className="font-bold text-gray-800 mb-3">Setup:</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Underlying: <strong>SPY trading at $580</strong></li>
            <li>• Buy the <strong>$590 call</strong> expiring in <strong>45 days</strong></li>
            <li>• Implied volatility: <strong>18%</strong> | Risk-free rate: <strong>4.25%</strong></li>
            <li>• Black-Scholes theoretical call price: <strong>~$4.20</strong></li>
          </ul>
        </div>

        <p className="text-sm font-bold text-gray-700 mb-2">Greeks at entry:</p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Greek</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Value</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Delta", "+0.38", "Option gains ~$0.38 per $1 stock rise"],
                ["Gamma", "0.021", "Delta increases by 0.021 per $1 move"],
                ["Theta", "−$0.09", "Loses ~$9 per day per contract"],
                ["Vega", "+$0.22", "Gains $0.22 per 1% IV increase"],
                ["Prob ITM", "35%", "35% chance of expiring in the money"],
              ].map(([g, v, i]) => (
                <tr key={g} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{g}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{v}</td>
                  <td className="px-4 py-3 text-gray-600">{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          When the underlying stock rises, a call option contract becomes more valuable while puts become less valuable. A higher strike price lowers call values and raises put values, which helps determine the fair price.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Cost to Enter", value: "$420 / contract", sub: "$4.20 × 100 shares", color: "gray" },
            { label: "Breakeven", value: "$594.20", sub: "$590 strike + $4.20 premium", color: "blue" },
            { label: "Max Loss", value: "$420", sub: "Premium paid", color: "red" },
            { label: "Max Profit", value: "Unlimited", sub: "Above $594.20 at expiry", color: "green" },
          ].map((s) => (
            <div key={s.label} className={`rounded-lg border p-3 ${
              s.color === "green" ? "bg-green-50 border-green-200" :
              s.color === "red" ? "bg-red-50 border-red-200" :
              s.color === "blue" ? "bg-blue-50 border-blue-200" :
              "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
              <p className={`text-lg font-bold ${
                s.color === "green" ? "text-green-600" :
                s.color === "red" ? "text-red-500" :
                s.color === "blue" ? "text-blue-600" :
                "text-gray-800"
              }`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-3">
          <p className="font-bold text-gray-800 mb-3">45 days later, SPY is at $598:</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Stock moved up <strong>$18</strong></li>
            <li>• Option profit: ($598 − $590) − $4.20 = <strong>$3.80 per share ($380 total)</strong></li>
            <li>• Return: <strong className="text-green-600">90% on the premium paid</strong></li>
          </ul>
        </div>

        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-10 font-medium">
          📖 Use the calculator above to model this exact setup — adjust stock price, DTE, and IV to see how the Greeks and theoretical price shift in real time.
        </p>

        {/* ── Trade Example: Long Put ── */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Black-Scholes Trade Example — Long Put</h2>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-5">
          <p className="font-bold text-gray-800 mb-3">Setup:</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Underlying: <strong>SPY at $580</strong></li>
            <li>• Buy the <strong>$570 put</strong> expiring in <strong>30 days</strong></li>
            <li>• IV: <strong>20%</strong> | Risk-free rate: <strong>4.25%</strong></li>
            <li>• Theoretical put price: <strong>~$3.60</strong></li>
          </ul>
        </div>

        <p className="text-sm font-bold text-gray-700 mb-2">Greeks at entry:</p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Greek</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Value</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Delta", "−0.32", "Option gains ~$0.32 per $1 stock decline"],
                ["Theta", "−$0.11", "Loses ~$11 per day per contract"],
                ["Vega", "+$0.18", "Long volatility — benefits from IV spike"],
                ["Prob ITM", "30%", "30% chance of expiring in the money"],
              ].map(([g, v, i]) => (
                <tr key={g} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{g}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{v}</td>
                  <td className="px-4 py-3 text-gray-600">{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-4">
          <p className="font-bold text-gray-800 mb-3">30 days later, SPY sells off to $558:</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Stock dropped <strong>$22</strong></li>
            <li>• Option profit: ($570 − $558) − $3.60 = <strong>$8.40 per share ($840 total)</strong></li>
            <li>• Return: <strong className="text-green-600">233% on premium paid</strong></li>
          </ul>
        </div>

        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 mb-10">
          <span className="text-yellow-500 flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm text-gray-700">Long options have a time decay cost every single day. If the stock doesn&apos;t move fast enough or far enough, theta decay will erode the value of your option even if you&apos;re directionally correct.</p>
        </div>

        <InlineCTA
          heading="Ready to apply these concepts?"
          body="Open a live account and access real-time options chains, Greeks, and professional order types."
          cta="Open an Account →"
        />

        {/* ── Assumptions ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">Black-Scholes Assumptions &amp; Limitations</h2>
        <p className="text-gray-600 leading-relaxed mb-5">
          The Black-Scholes model makes several simplifying assumptions as a mathematical model for option pricing. Traders who understand these limitations use it more effectively:
        </p>

        <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Assumption</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Real-World Reality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Constant volatility", "Volatility is assumed constant throughout the life of the option, but IV changes daily — volatility smile and skew mean OTM and ITM options trade at different IVs"],
                ["Log-normal returns", "Stock prices are assumed to follow a lognormal distribution and markets are treated as efficient, so the model cannot predict future market movements; actual returns have fat tails — crashes and gaps happen more than the model predicts"],
                ["European-style only", "The model is best suited for European options because exercise is assumed only at the expiration date, so it doesn't account for early assignment risk on American-style equity options"],
                ["Continuous trading", "The model assumes the ability to continuously trade the underlying asset, but real markets have gaps, halts, and liquidity constraints"],
                ["Constant risk-free rate", "The risk-free interest rate is assumed to remain constant until the expiration date, which does not reflect real market conditions"],
                ["No transaction costs", "Commissions, spreads, slippage, and taxes affect real P&L"],
              ].map(([assumption, reality]) => (
                <tr key={assumption} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 align-top w-1/3">{assumption}</td>
                  <td className="px-4 py-3 text-gray-600">{reality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-10">
          <span className="text-xl leading-none mt-0.5">👨</span>
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong>Pro Tip:</strong> Because of volatility skew, the &ldquo;Black-Scholes implied volatility&rdquo; of an option varies by strike. This is why traders watch the <strong>IV rank</strong> and <strong>IV percentile</strong> of the underlying rather than a single IV number — it tells you whether the current IV is historically cheap or expensive relative to its own history.
          </p>
        </div>

        {/* ── Greeks Table ── */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Greeks by Position Type</h2>
        <p className="text-gray-600 leading-relaxed mb-5">
          The table below shows how option Greeks apply to common Black-Scholes use cases:
        </p>

        <div className="rounded-xl border border-gray-200 overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Greek</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Long Call</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Long Put</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Short Call</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Short Put</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Delta", "Positive", "Negative", "Negative", "Positive"],
                ["Gamma", "Positive", "Positive", "Negative", "Negative"],
                ["Theta", "Negative (pays decay)", "Negative (pays decay)", "Positive (collects decay)", "Positive (collects decay)"],
                ["Vega", "Positive (long vol)", "Positive (long vol)", "Negative (short vol)", "Negative (short vol)"],
              ].map(([greek, lc, lp, sc, sp]) => (
                <tr key={greek} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{greek}</td>
                  <td className="px-4 py-3 text-green-700">{lc}</td>
                  <td className="px-4 py-3 text-green-700">{lp}</td>
                  <td className="px-4 py-3 text-red-600">{sc}</td>
                  <td className="px-4 py-3 text-red-600">{sp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── FAQ ── */}
        <h2 className="text-2xl font-bold text-gray-900 mb-5">FAQ</h2>
        <div className="space-y-3 mb-10">
          {[
            {
              q: "What does the Black-Scholes calculator tell you?",
              a: "It estimates the fair price of a stock option and helps options traders decide whether to buy or sell. Enter the inputs and market price and it outputs the theoretical fair value of a call or put — including a European call — based on five inputs: stock price, strike price, time to expiration, implied volatility, and the risk-free rate. It also outputs five Greeks — delta, gamma, theta, vega, and rho — which describe how the option price will respond to changes in market conditions.",
            },
            {
              q: "Is Black-Scholes accurate for stock options?",
              a: "Black-Scholes is highly accurate for European-style options on non-dividend-paying stocks, though the original model is primarily for European options and dividends require adjustment. For American-style equity options (which can be exercised early) or dividend-paying stocks, adjustments are needed. Most professional traders use it as a benchmark and adjust for real-world factors like volatility skew.",
            },
            {
              q: "What is implied volatility in Black-Scholes?",
              a: "Implied volatility is the volatility that, when plugged into the Black-Scholes formula, produces a theoretical price equal to the current market price of the option. It reflects the market's collective expectation of future price movement — not historical volatility. This back-solving process is how traders estimate IV for a European call when they know the market price.",
            },
            {
              q: "How do you use Black-Scholes to find cheap options?",
              a: "Compare the theoretical price from the calculator against what the option is actually trading for. If the market price is above the theoretical price, the option may be overpriced (IV is high). If it's below, the option may be underpriced. This is the basis of volatility arbitrage.",
            },
            {
              q: "What is the difference between delta and probability ITM?",
              a: "Delta approximates the probability that an option expires in the money, but they're not exactly the same. The true probability of expiring ITM comes from the N(d2) term in the Black-Scholes formula — what this calculator shows as \"Prob ITM.\" Delta uses N(d1), which is slightly higher because it accounts for the magnitude of the payoff.",
            },
          ].map(({ q, a }) => (
            <details key={q} className="group rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-800 text-sm hover:bg-gray-50 list-none">
                {q}
                <span className="text-gray-400 text-lg group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                {a}
              </div>
            </details>
          ))}
        </div>

        {/* ── Disclaimer ── */}
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 mb-8">
          <span className="text-yellow-500 flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-xs text-gray-700 leading-relaxed">
            Besides premium paid, it is essential to consider the commissions and fees associated with options transactions when calculating net profit or loss. These can significantly impact your return and should be factored into every trade. Be sure to read <em>Characteristics and Risks of Standardized Options</em> before trading options.
          </p>
        </div>

        <EmailCapture />
        <RelatedCalculators currentSlug="black-scholes" />

        <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Disclaimer:</strong> This calculator is provided for educational and informational purposes only. Results are hypothetical and based on the Black-Scholes-Merton theoretical model. They do not represent actual trading outcomes and should not be relied upon as investment advice. Options trading involves substantial risk and is not appropriate for all investors. Past performance is not indicative of future results.
        </div>
      </div>

      <CTABanner />
    </CalcPageLayout>
  );
}

// ── small helper components ────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#e0f0f8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, marginTop: 14 }}>
      {children}
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
