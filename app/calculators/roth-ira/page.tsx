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
  { label: "Young Investor (25)", currentAge: 25, retirementAge: 65, currentBalance: 10000, annualContribution: 7000, optionsReturn: 18, marketReturn: 10 },
  { label: "Mid-Career (40)", currentAge: 40, retirementAge: 65, currentBalance: 75000, annualContribution: 7000, optionsReturn: 18, marketReturn: 10 },
  { label: "Late Starter (52)", currentAge: 52, retirementAge: 67, currentBalance: 150000, annualContribution: 8000, optionsReturn: 15, marketReturn: 10 },
];

export default function RothIRAPage() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [annualContribution, setAnnualContribution] = useState(7000);
  const [optionsReturn, setOptionsReturn] = useState(18);
  const [marketReturn, setMarketReturn] = useState(10);

  function applyPreset(p: typeof PRESETS[0]) {
    setCurrentAge(p.currentAge); setRetirementAge(p.retirementAge);
    setCurrentBalance(p.currentBalance); setAnnualContribution(p.annualContribution);
    setOptionsReturn(p.optionsReturn); setMarketReturn(p.marketReturn);
  }

  const calc = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const oRate = optionsReturn / 100;
    const mRate = marketReturn / 100;

    let optBal = currentBalance;
    let mktBal = currentBalance;

    const chartData = Array.from({ length: years + 1 }, (_, yr) => {
      if (yr > 0) {
        optBal = optBal * (1 + oRate) + annualContribution;
        mktBal = mktBal * (1 + mRate) + annualContribution;
      }
      return { age: currentAge + yr, options: Math.round(optBal), market: Math.round(mktBal) };
    });

    const finalOptions = chartData[years].options;
    const finalMarket = chartData[years].market;
    const advantage = finalOptions - finalMarket;
    const totalContributions = currentBalance + annualContribution * years;
    const monthlyWithdrawalOptions = (finalOptions * 0.04) / 12;
    const monthlyWithdrawalMarket = (finalMarket * 0.04) / 12;

    return { chartData, finalOptions, finalMarket, advantage, totalContributions, monthlyWithdrawalOptions, monthlyWithdrawalMarket, years };
  }, [currentAge, retirementAge, currentBalance, annualContribution, optionsReturn, marketReturn]);

  const fmtK = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}k`;
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Roth IRA + Options Calculator</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Roth IRA + Options Growth Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>Why Roth IRA + Options?</strong> A Roth IRA is the most powerful account for options income strategies — all gains, including premium collected from selling covered calls and cash-secured puts, grow and withdraw completely <strong>tax-free</strong>. There are no capital gains taxes, no ordinary income taxes on distributions in retirement.
      </div>

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
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Roth IRA + Options Simulator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Tax-free compounding — options vs. market-only</div>
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
              <SectionLabel>Account Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Current Age"><Stepper value={currentAge} onChange={setCurrentAge} min={18} step={1} /></Field>
                <Field label="Retirement Age"><Stepper value={retirementAge} onChange={setRetirementAge} min={40} step={1} /></Field>
                <Field label="Current Roth Balance ($)"><Stepper value={currentBalance} onChange={setCurrentBalance} min={0} step={1000} /></Field>
                <Field label="Annual Contribution ($)"><Stepper value={annualContribution} onChange={setAnnualContribution} min={0} step={500} /></Field>
                <Field label="Options Return (%)"><Stepper value={optionsReturn} onChange={setOptionsReturn} min={1} step={0.5} /></Field>
                <Field label="Market-Only Return (%)"><Stepper value={marketReturn} onChange={setMarketReturn} min={1} step={0.5} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Balance at Retirement", value: fmtK(calc.finalOptions), color: PROFIT, desc: `options (${optionsReturn}% annual)` },
                  { label: "vs Market Only", value: fmtK(calc.finalMarket), color: TEAL, desc: `passive (${marketReturn}% annual)` },
                  { label: "Options Advantage", value: `+${fmtK(calc.advantage)}`, color: "#b4e1e8", desc: "extra tax-free wealth" },
                  { label: "Monthly Withdrawal (4%)", value: `$${fmt(calc.monthlyWithdrawalOptions)}`, color: "#a78bfa", desc: "tax-free income" },
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
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: TEAL, display: "inline-block" }} /> Options ({optionsReturn}%)</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: MUTED }}><span style={{ width: 22, height: 2, background: "rgba(180,225,232,0.45)", display: "inline-block" }} /> Market ({marketReturn}%)</span>
              </div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calc.chartData} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                    <defs>
                      <linearGradient id="optIRAGradTB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={TEAL} stopOpacity={0.03} />
                      </linearGradient>
                      <linearGradient id="mktIRAGradTB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b4e1e8" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#b4e1e8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="age" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `Age ${v}`} label={{ value: "Age", position: "insideBottom", offset: -12, fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`} width={60} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v, name) => [`$${Number(v).toLocaleString()}`, name === "options" ? `Options (${optionsReturn}%)` : `Market (${marketReturn}%)`]} labelFormatter={(l) => `Age ${l}`} />
                    <Area type="monotone" dataKey="market" stroke="rgba(180,225,232,0.45)" strokeWidth={1.5} fill="url(#mktIRAGradTB)" dot={false} />
                    <Area type="monotone" dataKey="options" stroke={TEAL} strokeWidth={2.5} fill="url(#optIRAGradTB)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                <div style={{ background: "rgba(29,209,161,0.07)", border: "1px solid rgba(29,209,161,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: MUTED, marginBottom: 3 }}>Options — Monthly Income (4% rule)</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: PROFIT }}>${fmt(calc.monthlyWithdrawalOptions)}<span style={{ fontSize: 10, color: MUTED, fontWeight: 400 }}>/mo tax-free</span></div>
                </div>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: MUTED, marginBottom: 3 }}>Passive — Monthly Income (4% rule)</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#b4e1e8" }}>${fmt(calc.monthlyWithdrawalMarket)}<span style={{ fontSize: 10, color: MUTED, fontWeight: 400 }}>/mo tax-free</span></div>
                </div>
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
              Projections are hypothetical. Consult a tax advisor for personalized Roth IRA guidance.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why the Roth IRA Is Perfect for Options Income</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Most investors treat their Roth IRA as a passive index fund account. But the Roth's tax-free growth is even more powerful when combined with an active options income strategy. Every dollar of premium collected from selling covered calls or cash-secured puts grows and compounds tax-free — including any capital gains when assigned shares are eventually sold.</p>
        <p className="text-gray-600 leading-relaxed mb-6">In a taxable brokerage account, premium income is taxed as short-term capital gains (ordinary income rates). In a Roth, there's no tax drag at all. That difference in compounding — tax-free premium reinvested every month for 20–30 years — is the mathematical engine behind the options advantage shown in this calculator.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["All premium is tax-free in a Roth", "Short-term gains from options selling are taxed at your highest income rate in taxable accounts. In a Roth, it's zero."],
            ["Stick to defined-risk strategies in IRAs", "Most brokers only allow Level 1–2 options in IRAs (covered calls, cash-secured puts, spreads). Plan your strategy accordingly."],
            ["2024 contribution limit: $7,000 ($8,000 if 50+)", "Maximize annual contributions and put the full amount to work selling options premium each month."],
            ["Start early — the math is dramatic", "A 25-year-old with 40 years of tax-free compounding has an enormous advantage. Every year of delay costs more than the last."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="roth-ira" />
        <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Projections are hypothetical. Consult a tax advisor for personalized Roth IRA guidance.
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
