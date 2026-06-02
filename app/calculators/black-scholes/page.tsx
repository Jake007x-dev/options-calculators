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
      <div className="mt-10 prose prose-gray max-w-none">

        <h2 className="text-2xl font-bold text-gray-900 mb-3">About the Black-Scholes Calculator</h2>
        <p className="text-gray-600 leading-relaxed">
          The Black-Scholes-Merton (BSM) model is the foundational formula for pricing European-style options. Developed in 1973 by Fischer Black, Myron Scholes, and Robert Merton — earning a Nobel Prize in Economics — it derives a closed-form price for an option using five observable inputs: the current stock price, the strike price, time to expiration, the risk-free interest rate, and implied volatility. Our calculator outputs both the theoretical call and put price, plus all five Greeks that describe how the option price changes as market conditions shift.
        </p>

        <InlineCTA
          heading="Use Black-Scholes on real trades"
          body="Model your options positions before you enter. Open a live account and trade with professional-grade order routing."
        />

        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Black-Scholes Option Pricing — Example Trade</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Let&apos;s walk through a real example using the calculator above.
        </p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
          <p className="font-bold text-gray-800 mb-3">LONG CALL — Example Setup</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Stock trading at <strong>$150.00</strong></li>
            <li>• Buy the <strong>$155 call</strong> expiring in <strong>30 days</strong></li>
            <li>• Implied volatility: <strong>25%</strong>, Risk-free rate: <strong>5.25%</strong></li>
            <li>• BSM theoretical call price: <strong>~$2.40</strong></li>
            <li>• Breakeven at expiration: <strong>$157.40</strong></li>
            <li>• Max loss: <strong>$240 per contract</strong> (premium paid)</li>
            <li>• Max profit: <strong>Unlimited</strong></li>
            <li>• If stock closes at $162, profit = <strong>$460 per contract</strong></li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">The Five Greeks — Explained Simply</h2>
        <p className="text-gray-600 mb-5 leading-relaxed">
          The Greeks quantify your option&apos;s sensitivity to every major market variable. Professional traders use them to manage risk precisely — not just know whether a trade is profitable, but exactly <em>why</em> it&apos;s moving.
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              greek: "Delta (Δ)",
              range: "0 to 1 for calls · −1 to 0 for puts",
              explain: "The most important Greek. Delta tells you how much the option price moves for every $1 change in the stock. A call with a delta of 0.50 gains approximately $0.50 when the stock rises $1. Delta also approximates the probability the option expires in the money.",
              example: "Stock up $5 · Delta 0.50 call → option up ~$2.50",
            },
            {
              greek: "Gamma (Γ)",
              range: "Always positive",
              explain: "Gamma measures how fast delta changes as the stock moves. High gamma means delta can swing rapidly — great for long options buyers, dangerous for sellers near expiration. ATM options have the highest gamma.",
              example: "Delta 0.50, Gamma 0.04 · Stock up $1 → new delta ≈ 0.54",
            },
            {
              greek: "Theta (Θ)",
              range: "Negative for buyers · Positive for sellers",
              explain: "The daily cost of time decay. Every day that passes, an option loses the theta amount in value (all else equal). Theta decay accelerates dramatically in the last 30 days — one reason option sellers prefer short-dated positions.",
              example: "Option worth $3.00 · Theta −$0.08 → worth ~$2.92 tomorrow",
            },
            {
              greek: "Vega (ν)",
              range: "Always positive",
              explain: "How much the option price changes for every 1% move in implied volatility. Long options benefit from rising IV; short options are hurt. Vega is highest for longer-dated options and ATM strikes.",
              example: "Vega $0.12 · IV rises from 25% to 26% → option gains $0.12",
            },
            {
              greek: "Rho (ρ)",
              range: "Positive for calls · Negative for puts",
              explain: "Sensitivity to changes in the risk-free interest rate. Rho matters most for long-dated options (LEAPS) and in volatile rate environments. For short-term options it is typically the least significant Greek.",
              example: "Rho $0.05 · Rates rise 1% → call gains $0.05",
            },
          ].map((g) => (
            <div key={g.greek} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-gray-900">{g.greek}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{g.range}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{g.explain}</p>
              <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 font-medium">
                Example: {g.example}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">History of the Black-Scholes Model</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Before Black-Scholes, options were priced through negotiation and intuition. In 1973, Fischer Black and Myron Scholes published &ldquo;The Pricing of Options and Corporate Liabilities&rdquo; in the <em>Journal of Political Economy</em>, and Robert Merton published a companion paper extending the model to continuous-time stochastic calculus. The Chicago Board Options Exchange (CBOE) opened the same year — coincidence or not, the two developments transformed derivatives markets forever.
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          In 1997, Scholes and Merton were awarded the Nobel Memorial Prize in Economic Sciences. Black had passed away in 1995 and was ineligible, but the Prize committee acknowledged his foundational contribution. Today, Black-Scholes remains the industry standard for pricing European options, benchmarking implied volatility, and computing Greeks — even though practitioners routinely adjust it for real-world factors like volatility skew, early assignment, and discrete dividends.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Black-Scholes Assumptions &amp; Limitations</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          The model makes several simplifying assumptions. In practice, traders know these limitations and adjust accordingly:
        </p>
        <ul className="space-y-2 text-sm text-gray-700 mb-6 list-none">
          {[
            ["Constant volatility", "Real markets exhibit volatility smile and skew — IV varies by strike and expiration."],
            ["Log-normal returns", "Actual returns have fat tails — extreme moves happen more often than the model predicts."],
            ["European-style only", "BSM does not account for early assignment risk on American-style options."],
            ["No dividends (base model)", "The Merton extension handles continuous dividends; discrete cash dividends require adjustment."],
            ["Continuous trading", "The model assumes you can delta-hedge continuously — real trading has frictions and gaps."],
          ].map(([name, desc]) => (
            <li key={name} className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-2.5">
              <span className="text-yellow-500 mt-0.5 flex-shrink-0">⚠</span>
              <span><strong className="text-gray-800">{name}:</strong> {desc}</span>
            </li>
          ))}
        </ul>

        <InlineCTA
          heading="Ready to apply these concepts?"
          body="Open a live account and access real-time options chains, Greeks, and professional order types."
          cta="Open an Account →"
        />

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
