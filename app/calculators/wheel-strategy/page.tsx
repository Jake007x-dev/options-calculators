"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
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

const PRESETS = [
  { label: "SPY Wheel", stock: 500, otm: 2, premium: 1.8, dte: 30, contracts: 1, account: 50000, ticker: "SPY" },
  { label: "AAPL Wheel", stock: 180, otm: 5, premium: 2.5, dte: 30, contracts: 5, account: 90000, ticker: "AAPL" },
  { label: "QQQ Wheel", stock: 470, otm: 3, premium: 3.2, dte: 21, contracts: 2, account: 94000, ticker: "QQQ" },
];

export default function WheelStrategyPage() {
  const [stockPrice, setStockPrice] = useState(100);
  const [otmPct, setOtmPct] = useState(5);
  const [premium, setPremium] = useState(1.5);
  const [dte, setDte] = useState(30);
  const [contracts, setContracts] = useState(5);
  const [accountSize, setAccountSize] = useState(50000);
  const [ticker, setTicker] = useState("AAPL");

  const calc = useMemo(() => {
    const targetStrike = stockPrice * (1 - otmPct / 100);
    const premiumPerCycle = premium * 100 * contracts;
    const cyclesPerYear = 365 / dte;
    const annualizedPremium = premiumPerCycle * cyclesPerYear;
    const annualizedYield = (annualizedPremium / accountSize) * 100;
    const monthlyIncome = annualizedPremium / 12;
    const effectiveCostBasis = targetStrike - premium;
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, income: Math.round(monthlyIncome) }));
    return { targetStrike, premiumPerCycle, annualizedYield, monthlyIncome, annualizedPremium, cyclesPerYear, effectiveCostBasis, monthlyData };
  }, [stockPrice, otmPct, premium, dte, contracts, accountSize]);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function applyPreset(p: typeof PRESETS[0]) {
    setTicker(p.ticker); setStockPrice(p.stock); setOtmPct(p.otm); setPremium(p.premium);
    setDte(p.dte); setContracts(p.contracts); setAccountSize(p.account);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Wheel Strategy Income</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Wheel Strategy Income Calculator</h1>
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
                <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Wheel Strategy — {ticker}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>CSP income projection & annualized yield</div>
            </div>
          </div>

          {/* Ticker input + presets */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: MUTED }}>Ticker:</span>
            <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} maxLength={6} style={{ width: 64, padding: "5px 8px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "rgba(10,34,72,0.6)", color: TEXT, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, outline: "none" }} />
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => applyPreset(p)} type="button" style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, border: `1px solid ${BORDER}`, background: "rgba(29,178,176,0.07)", color: MUTED, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{p.label}</button>
            ))}
          </div>

          {/* Two-column body */}
          <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 20, alignItems: "start" }}>
            {/* Left: inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <SectionLabel>CSP Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Stock Price ($)"><Stepper value={stockPrice} onChange={setStockPrice} min={1} step={1} /></Field>
                <Field label="Target Strike (% OTM)"><Stepper value={otmPct} onChange={setOtmPct} min={0} step={0.5} /></Field>
                <Field label="Premium / Contract ($)"><Stepper value={premium} onChange={setPremium} min={0.01} step={0.25} /></Field>
                <Field label="DTE per Cycle"><Stepper value={dte} onChange={setDte} min={1} step={1} /></Field>
                <Field label="Number of Contracts"><Stepper value={contracts} onChange={setContracts} min={1} step={1} /></Field>
                <Field label="Account Size ($)"><Stepper value={accountSize} onChange={setAccountSize} min={1000} step={1000} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Target Strike", value: `$${fmt(calc.targetStrike)}`, color: TEAL, desc: `${otmPct}% OTM` },
                  { label: "Premium / Cycle", value: `$${fmt(calc.premiumPerCycle)}`, color: PROFIT, desc: `${contracts} contracts` },
                  { label: "Monthly Income", value: `$${fmt(calc.monthlyIncome)}`, color: "#b4e1e8", desc: "projected avg" },
                  { label: "Annualized Yield", value: `${calc.annualizedYield.toFixed(1)}%`, color: PROFIT, desc: "on account size" },
                  { label: "Cycles / Year", value: `${calc.cyclesPerYear.toFixed(1)}`, color: MUTED, desc: `at ${dte} DTE` },
                  { label: "Effective Cost Basis", value: `$${fmt(calc.effectiveCostBasis)}`, color: MUTED, desc: "if assigned" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>Projected Monthly Income — {ticker}</div>
              <div style={{ width: "100%", height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calc.monthlyData} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Income"]} />
                    <Bar dataKey="income" fill={TEAL} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                  </BarChart>
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
              Income projections assume constant premium and no assignment. Actual results depend on market conditions and management.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">How the Wheel Generates Income</h2>
        <p className="text-gray-600 leading-relaxed mb-4">The Wheel turns on three phases: sell a cash-secured put below the stock price → if assigned, sell covered calls above cost basis → if called away, repeat. Premium flows in at every step, regardless of whether the stock moves up or down.</p>
        <p className="text-gray-600 leading-relaxed mb-6">The key insight is that you're always getting paid. If the put expires worthless, you keep the premium and sell again. If you're assigned, you now own the stock at below-market prices AND you can immediately start selling covered calls to generate more income. Assignment isn't a loss — it's Phase 2.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Only run the Wheel on stocks you want to own", "If assigned, you hold the shares. Never run the Wheel on a stock you wouldn't hold long-term."],
            ["30 DTE is the income sweet spot", "Captures the steepest part of the theta decay curve while giving you enough time before earnings risk."],
            ["High IV environments maximize income", "Premium is fatter when IV is elevated. Check IV Rank before selling — ideally IVR > 30."],
            ["Avoid running through earnings", "A big post-earnings gap can put you far underwater on shares. Check the earnings date before each cycle."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="wheel-strategy" />
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
