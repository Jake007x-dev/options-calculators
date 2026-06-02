"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
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
  { label: "Wheel $50k Account", startBalance: 50000, monthlyPremium: 800, years: 20, annualReturn: 7 },
  { label: "Covered Call $100k", startBalance: 100000, monthlyPremium: 1400, years: 20, annualReturn: 7 },
  { label: "Starter $25k — 30yr", startBalance: 25000, monthlyPremium: 400, years: 30, annualReturn: 8 },
];

export default function PremiumReinvestmentPage() {
  const [startBalance, setStartBalance] = useState(50000);
  const [monthlyPremium, setMonthlyPremium] = useState(800);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(7);

  function applyPreset(p: typeof PRESETS[0]) {
    setStartBalance(p.startBalance); setMonthlyPremium(p.monthlyPremium);
    setYears(p.years); setAnnualReturn(p.annualReturn);
  }

  const calc = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const spRate = 10 / 100 / 12;

    const chartData = Array.from({ length: years + 1 }, (_, yr) => {
      let optionsBalance = startBalance;
      let passiveBalance = startBalance;
      for (let m = 0; m < yr * 12; m++) {
        optionsBalance = optionsBalance * (1 + monthlyRate) + monthlyPremium;
        passiveBalance = passiveBalance * (1 + spRate);
      }
      return { year: yr, options: Math.round(optionsBalance), passive: Math.round(passiveBalance) };
    });

    const finalOptions = chartData[years].options;
    const finalPassive = chartData[years].passive;
    const totalPremium = monthlyPremium * 12 * years;
    const totalGrowth = finalOptions - startBalance - totalPremium;
    const advantage = finalOptions - finalPassive;

    return { chartData, finalOptions, finalPassive, totalPremium, totalGrowth, advantage };
  }, [startBalance, monthlyPremium, years, annualReturn]);

  const fmt = (n: number) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtK = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}k`;

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">What If I Invested My Premium?</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">"What If I Reinvested My Options Premium?" Calculator</h1>
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
                <path d="M5 3 Q12 10 19 3" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Premium Reinvestment Simulator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Compound premium vs. passive S&P 500</div>
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
              <SectionLabel>Portfolio Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Starting Account ($)"><Stepper value={startBalance} onChange={setStartBalance} min={1000} step={5000} /></Field>
                <Field label="Monthly Premium ($)"><Stepper value={monthlyPremium} onChange={setMonthlyPremium} min={50} step={100} /></Field>
                <Field label="Time Horizon (years)"><Stepper value={years} onChange={setYears} min={1} step={1} /></Field>
                <Field label="Annual Return (%)"><Stepper value={annualReturn} onChange={setAnnualReturn} min={1} step={0.5} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Ending Balance", value: fmtK(calc.finalOptions), color: PROFIT, desc: "options + reinvestment" },
                  { label: "Total Premium", value: `$${fmt(calc.totalPremium)}`, color: TEAL, desc: `collected over ${years} yrs` },
                  { label: "Compounding Gain", value: `$${fmt(calc.totalGrowth)}`, color: "#a78bfa", desc: "growth on top of premium" },
                  { label: "vs Passive S&P", value: `+${fmtK(calc.advantage)}`, color: "#eab308", desc: "additional wealth" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: TEAL, display: "inline-block" }} /> Options strategy</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: "rgba(180,225,232,0.45)", display: "inline-block" }} /> Passive S&P 500</span>
              </div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calc.chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                    <defs>
                      <linearGradient id="optGradPR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={TEAL} stopOpacity={0.03} />
                      </linearGradient>
                      <linearGradient id="passGradPR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b4e1e8" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#b4e1e8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `Yr ${v}`} label={{ value: "Years", position: "insideBottom", offset: -12, fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`} width={60} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v, name) => [`$${Number(v).toLocaleString()}`, name === "options" ? "Options Strategy" : "Passive S&P"]} labelFormatter={(l) => `Year ${l}`} />
                    <Area type="monotone" dataKey="passive" stroke="rgba(180,225,232,0.45)" strokeWidth={1.5} fill="url(#passGradPR)" dot={false} />
                    <Area type="monotone" dataKey="options" stroke={TEAL} strokeWidth={2.5} fill="url(#optGradPR)" dot={false} />
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
              Projections are hypothetical and assume constant returns. Actual results will vary.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">The Power of Reinvesting Options Premium</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Passive investing in the S&P 500 relies entirely on price appreciation and dividends — averaging around 10% annually. Options income strategies add a third income stream: premium. When that monthly premium is reinvested into the same portfolio (buying more shares, adding to your account, or selling more contracts), compounding accelerates dramatically.</p>
        <p className="text-gray-600 leading-relaxed mb-6">The key insight is that premium income doesn't require the market to go up. In flat markets — where passive investors make nothing — the wheel trader still collects premium every month. That income, reinvested consistently, creates a significant wealth gap over 20–30 years.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Premium + compounding is a wealth multiplier", "Monthly premium that gets reinvested compounds just like dividends — the longer the horizon, the bigger the gap vs. passive."],
            ["Start early, stay consistent", "The difference between 20 years and 30 years of reinvesting premium is enormous. Time is your biggest edge."],
            ["Market-neutral income matters in flat years", "The S&P returned near zero in 2015, 2018, and 2022. Options sellers still collected premium in all three years."],
            ["Match premium to account size", "Collecting $800/month on a $10k account means taking enormous risk. Target 1–2% monthly premium on total account value."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="premium-reinvestment" />
        <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Projections are hypothetical and do not guarantee future results.
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
