"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, CartesianGrid } from "recharts";
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
  { label: "30-Day CSP", premium: 2.5, capital: 5000, dte: 30, contracts: 1 },
  { label: "45-Day Iron Condor", premium: 1.8, capital: 10000, dte: 45, contracts: 5 },
  { label: "7-Day Covered Call", premium: 0.8, capital: 15000, dte: 7, contracts: 10 },
];

export default function AnnualizedReturnPage() {
  const [premium, setPremium] = useState(3.5);
  const [capitalRequired, setCapitalRequired] = useState(5000);
  const [dte, setDte] = useState(30);
  const [contracts, setContracts] = useState(1);

  const calc = useMemo(() => {
    const totalPremium = premium * 100 * contracts;
    const rawReturn = (totalPremium / capitalRequired) * 100;
    const annualizedROC = rawReturn * (365 / dte);
    const comparisons = [
      { name: "This Trade", value: annualizedROC },
      { name: "S&P 500 Avg", value: 10 },
      { name: "HY Savings", value: 5 },
    ];
    return { totalPremium, rawReturn, annualizedROC, dollarProfit: totalPremium, comparisons };
  }, [premium, capitalRequired, dte, contracts]);

  const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  function applyPreset(p: typeof PRESETS[0]) {
    setPremium(p.premium); setCapitalRequired(p.capital); setDte(p.dte); setContracts(p.contracts);
  }

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Annualized Return</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Annualized Return on Capital Calculator</h1>
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
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Annualized Return Calculator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Standardize any options trade to an annual ROC</div>
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
              <SectionLabel>Trade Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Premium / Contract ($)"><Stepper value={premium} onChange={setPremium} min={0.01} step={0.25} /></Field>
                <Field label="Capital Required ($)"><Stepper value={capitalRequired} onChange={setCapitalRequired} min={100} step={500} /></Field>
                <Field label="Days to Expiration"><Stepper value={dte} onChange={setDte} min={1} step={1} /></Field>
                <Field label="Number of Contracts"><Stepper value={contracts} onChange={setContracts} min={1} step={1} /></Field>
              </div>
            </div>

            {/* Right: results */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              {/* Key metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Annualized ROC", value: `${calc.annualizedROC.toFixed(1)}%`, color: PROFIT, desc: "standardized to 1 year" },
                  { label: "Raw Return", value: `${calc.rawReturn.toFixed(2)}%`, color: TEAL, desc: `in ${dte} days` },
                  { label: "Total Premium", value: `$${fmt(calc.totalPremium)}`, color: "#b4e1e8", desc: `${contracts} contract${contracts > 1 ? "s" : ""}` },
                  { label: "vs S&P 500", value: `${calc.annualizedROC > 10 ? "+" : ""}${(calc.annualizedROC - 10).toFixed(1)}%`, color: calc.annualizedROC > 10 ? PROFIT : "#e05c6a", desc: "above/below 10% avg" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>Benchmark Comparison</div>
              <div style={{ width: "100%", height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calc.comparisons} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} stroke="transparent" tickFormatter={(v) => `${v.toFixed(0)}%`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} stroke="transparent" width={100} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v) => [`${Number(v).toFixed(1)}%`, "Annualized Return"]} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {calc.comparisons.map((_, i) => (
                        <Cell key={i} fill={i === 0 && calc.annualizedROC > 10 ? PROFIT : i === 0 ? "#eab308" : "rgba(29,178,176,0.25)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(29,178,176,0.06)", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 10, color: MUTED }}>
                Formula: Annualized ROC = (Premium ÷ Capital) × (365 ÷ DTE) × 100
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
              Annualized ROC is a theoretical projection. Actual returns depend on assignment risk, fees, and market conditions.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why Annualized ROC Matters</h2>
        <p className="text-gray-600 leading-relaxed mb-4">A 2% raw return sounds the same whether you earned it in 7 days or 60 days — but they're very different. In 7 days, that's a 104% annualized return. In 60 days, it's 12%. Annualizing puts every trade on the same scale so you can compare short-dated weekly premium to monthly income strategies to LEAPS.</p>
        <p className="text-gray-600 leading-relaxed mb-6">The 10% S&P 500 benchmark is the standard hurdle. If your annualized ROC consistently beats 10% with lower volatility, options income strategies are genuinely outperforming passive investing on a risk-adjusted basis.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Short DTE = high annualized ROC", "A 1% return in 7 days annualizes to 52%. Weekly strategies can look extraordinary — but they require much more active management."],
            ["Capital required drives everything", "A CSP on a $500 stock requires $50,000 capital. The premium may look great but the ROC could be low if capital is large."],
            ["Risk-adjust your comparison", "A 30% annualized ROC from selling naked puts is riskier than 30% from iron condors. Always weight ROC by the risk profile of the strategy."],
            ["Aim for 15–25% annualized in the Wheel", "Consistent wheel traders targeting 15–25% annualized ROC with high-quality stocks have a strong long-term edge over passive investing."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="annualized-return" />
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
