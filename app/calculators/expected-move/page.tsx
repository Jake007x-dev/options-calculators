"use client";

import { useMemo, useState } from "react";
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

function BellCurve({ stockPrice, moveAmount }: { stockPrice: number; moveAmount: number }) {
  const width = 340, height = 130, cx = width / 2;
  const points: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * width;
    const z = ((x - cx) / (width / 6)) * 3;
    const y = height - 10 - (height - 20) * Math.exp(-0.5 * z * z);
    points.push([x, y]);
  }
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const sigma1L = stockPrice - moveAmount, sigma1H = stockPrice + moveAmount;
  const sigma2L = stockPrice - moveAmount * 2, sigma2H = stockPrice + moveAmount * 2;
  const scaleX = (price: number) => cx + ((price - stockPrice) / (moveAmount * 3)) * (width / 2);
  return (
    <svg viewBox={`0 0 ${width} ${height + 30}`} style={{ width: "100%", maxWidth: 340, margin: "0 auto", display: "block" }}>
      <path d={`M ${scaleX(sigma2L)} ${height - 10} ${points.filter((p) => p[0] >= scaleX(sigma2L) && p[0] <= scaleX(sigma2H)).map((p, i) => `${i === 0 ? "L" : "L"} ${p[0]} ${p[1]}`).join(" ")} L ${scaleX(sigma2H)} ${height - 10} Z`} fill="rgba(29,178,176,0.08)" />
      <path d={`M ${scaleX(sigma1L)} ${height - 10} ${points.filter((p) => p[0] >= scaleX(sigma1L) && p[0] <= scaleX(sigma1H)).map((p, i) => `${i === 0 ? "L" : "L"} ${p[0]} ${p[1]}`).join(" ")} L ${scaleX(sigma1H)} ${height - 10} Z`} fill="rgba(29,178,176,0.18)" />
      <path d={pathD} fill="none" stroke={TEAL} strokeWidth="2" />
      <line x1={cx} y1={height - 10} x2={cx} y2={10} stroke={TEAL} strokeWidth="1.5" strokeDasharray="3 2" />
      <text x={cx} y={height + 20} textAnchor="middle" fill={MUTED} fontSize="9">${stockPrice.toFixed(0)}</text>
      <text x={scaleX(sigma1L)} y={height + 20} textAnchor="middle" fill={TEAL} fontSize="9">${sigma1L.toFixed(0)}</text>
      <text x={scaleX(sigma1H)} y={height + 20} textAnchor="middle" fill={TEAL} fontSize="9">${sigma1H.toFixed(0)}</text>
      <text x={scaleX(sigma2L)} y={height + 20} textAnchor="middle" fill={MUTED} fontSize="9">${sigma2L.toFixed(0)}</text>
      <text x={scaleX(sigma2H)} y={height + 20} textAnchor="middle" fill={MUTED} fontSize="9">${sigma2H.toFixed(0)}</text>
      <text x={scaleX(sigma1L) - 4} y={40} textAnchor="end" fill={TEAL} fontSize="8">±1σ 68%</text>
      <text x={scaleX(sigma2H) + 4} y={40} textAnchor="start" fill={MUTED} fontSize="8">±2σ 95%</text>
    </svg>
  );
}

const PRESETS = [
  { label: "SPY 7-Day", mode: "iv" as const, S: 500, iv: 15, dte: 7, call: 4.5, put: 4.2 },
  { label: "AAPL Earnings", mode: "straddle" as const, S: 200, iv: 45, dte: 1, call: 4.5, put: 4.2 },
  { label: "NVDA 30-Day", mode: "iv" as const, S: 130, iv: 55, dte: 30, call: 4.5, put: 4.2 },
];

export default function ExpectedMovePage() {
  const [mode, setMode] = useState<"iv" | "straddle">("iv");
  const [stockPrice, setStockPrice] = useState(150);
  const [iv, setIv] = useState(30);
  const [dte, setDte] = useState(30);
  const [callPrice, setCallPrice] = useState(4.5);
  const [putPrice, setPutPrice] = useState(4.2);

  const calc = useMemo(() => {
    const moveDollar = mode === "iv" ? stockPrice * (iv / 100) * Math.sqrt(dte / 365) : (callPrice + putPrice) * 0.85;
    const movePct = (moveDollar / stockPrice) * 100;
    return { moveDollar, movePct, upper: stockPrice + moveDollar, lower: stockPrice - moveDollar };
  }, [mode, stockPrice, iv, dte, callPrice, putPrice]);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function applyPreset(p: typeof PRESETS[0]) {
    setMode(p.mode); setStockPrice(p.S); setIv(p.iv); setDte(p.dte); setCallPrice(p.call); setPutPrice(p.put);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Expected Move</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Free Expected Move Calculator</h1>
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
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Expected Move Calculator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>IV-based or straddle-based 1σ range</div>
            </div>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", background: "rgba(5,22,54,0.9)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 5, marginBottom: 16, gap: 4 }}>
            {(["iv", "straddle"] as const).map((m) => {
              const isActive = mode === m;
              return (
                <button key={m} type="button" onClick={() => setMode(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: isActive ? `rgba(29,178,176,0.18)` : "transparent", color: isActive ? TEAL : MUTED, transition: "all .2s" }}>
                  {m === "iv" ? "Mode A: IV-Based" : "Mode B: Straddle-Based"}
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
              <SectionLabel>Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Stock Price ($)"><Stepper value={stockPrice} onChange={setStockPrice} min={1} step={1} /></Field>
                {mode === "iv" ? (
                  <>
                    <Field label="Implied Volatility (%)"><Stepper value={iv} onChange={setIv} min={1} step={1} /></Field>
                    <Field label="Days to Expiration"><Stepper value={dte} onChange={setDte} min={1} step={1} /></Field>
                  </>
                ) : (
                  <>
                    <Field label="ATM Call Price ($)"><Stepper value={callPrice} onChange={setCallPrice} min={0.01} step={0.25} /></Field>
                    <Field label="ATM Put Price ($)"><Stepper value={putPrice} onChange={setPutPrice} min={0.01} step={0.25} /></Field>
                  </>
                )}
              </div>
            </div>

            {/* Right: results */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Expected Move", value: `±$${fmt(calc.moveDollar)}`, color: TEAL, desc: "1 standard deviation" },
                  { label: "Move %", value: `±${calc.movePct.toFixed(1)}%`, color: "#b4e1e8", desc: "of stock price" },
                  { label: "Upper Target", value: `$${fmt(calc.upper)}`, color: PROFIT, desc: "+1σ price level" },
                  { label: "Lower Target", value: `$${fmt(calc.lower)}`, color: LOSS, desc: "−1σ price level" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "14px 16px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, marginBottom: 4 }}>68% Probability Range</div>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 12 }}>Stock stays between ${fmt(calc.lower)} – ${fmt(calc.upper)} with 68% probability</div>
                <BellCurve stockPrice={stockPrice} moveAmount={calc.moveDollar} />
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
              Expected move represents a 1σ range — stocks end outside this range ~32% of the time.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">What Is the Expected Move?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">The expected move is the options market's consensus forecast for how much a stock will move by expiration, expressed as a one-standard-deviation range. It represents a 68% probability — meaning the market believes there's a 68% chance the stock ends inside the range and a 32% chance it ends outside.</p>
        <p className="text-gray-600 leading-relaxed mb-6">This number comes directly from the prices traders are paying for options. When IV is high, traders expect big moves and pay more — the expected move widens. When IV is low, moves are expected to be small. Reading the expected move tells you what the collective market intelligence is pricing in.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["68% probability, not a guarantee", "The stock ends outside the expected move 32% of the time — more often than most traders realize."],
            ["Use for strike selection", "Sell options outside the expected move for higher probability. Buy them inside for better delta."],
            ["Straddle method is more direct", "Multiplying the ATM straddle by 0.85 captures the market's actual risk pricing better than IV math in some cases."],
            ["Compare to historical moves", "If the expected move on AAPL earnings is 5% but AAPL has moved 9%+ on the last 4 earnings, the straddle is priced too cheaply."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="expected-move" />
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
