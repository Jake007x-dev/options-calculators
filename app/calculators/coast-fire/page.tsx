"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
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
  { label: "Traditional Retirement (65)", currentAge: 35, retirementAge: 65, monthlyExpenses: 5000, annualReturn: 7, swr: 4, currentSavings: 75000, monthlyOptionsPremium: 800 },
  { label: "Early Retirement (55)", currentAge: 30, retirementAge: 55, monthlyExpenses: 4000, annualReturn: 8, swr: 3.5, currentSavings: 50000, monthlyOptionsPremium: 600 },
  { label: "Aggressive FIRE (45)", currentAge: 28, retirementAge: 45, monthlyExpenses: 3500, annualReturn: 9, swr: 3, currentSavings: 30000, monthlyOptionsPremium: 500 },
];

export default function CoastFIREPage() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [swr, setSwr] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(75000);
  const [monthlyOptionsPremium, setMonthlyOptionsPremium] = useState(800);

  function applyPreset(p: typeof PRESETS[0]) {
    setCurrentAge(p.currentAge); setRetirementAge(p.retirementAge);
    setMonthlyExpenses(p.monthlyExpenses); setAnnualReturn(p.annualReturn);
    setSwr(p.swr); setCurrentSavings(p.currentSavings);
    setMonthlyOptionsPremium(p.monthlyOptionsPremium);
  }

  const calc = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 1);
    const r = annualReturn / 100;
    const annualExpenses = monthlyExpenses * 12;
    const nestEgg = annualExpenses / (swr / 100);
    const coastNumber = nestEgg / Math.pow(1 + r, years);
    const annualOptionsIncome = monthlyOptionsPremium * 12;
    const reducedAnnualExpenses = Math.max(annualExpenses - annualOptionsIncome, 0);
    const reducedNestEgg = reducedAnnualExpenses / (swr / 100);
    const coastNumberWithOptions = reducedNestEgg / Math.pow(1 + r, years);
    const monthlyContribution = 1000;
    let bal = currentSavings;
    let yearsToCoast = 0;
    while (bal < coastNumber && yearsToCoast < 60) {
      bal = bal * (1 + r) + monthlyContribution * 12;
      yearsToCoast++;
    }
    let balOptions = currentSavings;
    let yearsToCoastOptions = 0;
    while (balOptions < coastNumberWithOptions && yearsToCoastOptions < 60) {
      balOptions = balOptions * (1 + r) + (monthlyContribution + monthlyOptionsPremium) * 12;
      yearsToCoastOptions++;
    }
    const chartData = Array.from({ length: years + 1 }, (_, yr) => {
      let std = currentSavings;
      let opts = currentSavings;
      for (let i = 0; i < yr; i++) {
        std = std * (1 + r) + monthlyContribution * 12;
        opts = opts * (1 + r) + (monthlyContribution + monthlyOptionsPremium) * 12;
      }
      return { age: currentAge + yr, standard: Math.round(std), withOptions: Math.round(opts) };
    });
    return { nestEgg, coastNumber, reducedNestEgg, coastNumberWithOptions, yearsToCoast, yearsToCoastOptions, chartData, annualExpenses, annualOptionsIncome };
  }, [currentAge, retirementAge, monthlyExpenses, annualReturn, swr, currentSavings, monthlyOptionsPremium]);

  const fmtK = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}k`;
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const alreadyCoasting = currentSavings >= calc.coastNumber;
  const alreadyCoastingWithOptions = currentSavings >= calc.coastNumberWithOptions;

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Coast FIRE Calculator</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Coast FIRE Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-800">
        <strong>What is Coast FIRE?</strong> Coast FIRE is the point where your savings are large enough that — even without another dollar of contributions — they'll grow to fully fund your retirement by your target age. Once you hit Coast FIRE, your job income only needs to cover current living expenses. Options premium can accelerate this dramatically.
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Coast FIRE Calculator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>How options premium accelerates your FIRE number</div>
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
              <SectionLabel>Retirement Inputs</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Current Age"><Stepper value={currentAge} onChange={setCurrentAge} min={18} step={1} /></Field>
                <Field label="Retirement Age"><Stepper value={retirementAge} onChange={setRetirementAge} min={35} step={1} /></Field>
                <Field label="Monthly Expenses ($)"><Stepper value={monthlyExpenses} onChange={setMonthlyExpenses} min={500} step={100} /></Field>
                <Field label="Annual Return (%)"><Stepper value={annualReturn} onChange={setAnnualReturn} min={1} step={0.5} /></Field>
                <Field label="Safe Withdrawal Rate (%)"><Stepper value={swr} onChange={setSwr} min={2} step={0.5} /></Field>
                <Field label="Current Savings ($)"><Stepper value={currentSavings} onChange={setCurrentSavings} min={0} step={5000} /></Field>
                <Field label="Monthly Options Premium ($)"><Stepper value={monthlyOptionsPremium} onChange={setMonthlyOptionsPremium} min={0} step={100} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Coast FIRE Number", value: fmtK(calc.coastNumber), color: TEAL, desc: "standard (no options)" },
                  { label: "With Options Income", value: fmtK(calc.coastNumberWithOptions), color: PROFIT, desc: "reduced target!" },
                  { label: "Years to Coast", value: alreadyCoasting ? "Already there! ✓" : `${calc.yearsToCoast} yrs`, color: "#eab308", desc: "at $1k/mo savings" },
                  { label: "Years + Options", value: alreadyCoastingWithOptions ? "Already there! ✓" : `${calc.yearsToCoastOptions} yrs`, color: "#b4e1e8", desc: "accelerated timeline" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "rgba(10,34,72,0.4)", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: MUTED, marginBottom: 3 }}>Full Nest Egg Needed</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#b4e1e8" }}>{fmtK(calc.nestEgg)}</div>
                  <div style={{ fontSize: 9, color: MUTED }}>${fmt(monthlyExpenses * 12)}/yr ÷ {swr}% SWR</div>
                </div>
                <div style={{ background: "rgba(29,209,161,0.07)", border: "1px solid rgba(29,209,161,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: MUTED, marginBottom: 3 }}>Nest Egg w/ Options</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: PROFIT }}>{fmtK(calc.reducedNestEgg)}</div>
                  <div style={{ fontSize: 9, color: MUTED }}>${fmt(monthlyOptionsPremium)}/mo premium offsets expenses</div>
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>Savings Trajectory</div>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calc.chartData} margin={{ top: 4, right: 16, left: 4, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="age" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `Age ${v}`} label={{ value: "Age", position: "insideBottom", offset: -12, fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`} width={60} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v, name) => [`$${Number(v).toLocaleString()}`, name === "withOptions" ? "With Options" : "Standard"]} labelFormatter={(l) => `Age ${l}`} />
                    <ReferenceLine y={calc.coastNumber} stroke={MUTED} strokeDasharray="4 3" label={{ value: "Coast FIRE", fill: MUTED, fontSize: 9, position: "right" }} />
                    <ReferenceLine y={calc.coastNumberWithOptions} stroke={PROFIT} strokeDasharray="4 3" label={{ value: "Coast + Options", fill: PROFIT, fontSize: 9, position: "right" }} />
                    <Line type="monotone" dataKey="standard" stroke="rgba(180,225,232,0.45)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="withOptions" stroke={TEAL} strokeWidth={2.5} dot={false} />
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
              Projections assume constant returns. Consult a financial advisor for personalized retirement planning.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">How Options Income Accelerates Coast FIRE</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Coast FIRE has two levers: how much you have saved now, and how much you need in retirement. Options income works on both. First, monthly premium reinvested into your portfolio gets you to the Coast FIRE number faster. Second, premium income in retirement reduces the amount your portfolio needs to withdraw, meaning a lower Coast FIRE target to begin with.</p>
        <p className="text-gray-600 leading-relaxed mb-6">A trader collecting $800/month in premium reduces their retirement expense gap by $9,600/year. At a 4% withdrawal rate, that means $240,000 less needed in the portfolio at retirement — which means a significantly lower Coast FIRE number today.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Options income shrinks the target", "Every dollar of monthly premium in retirement reduces the portfolio you need to fund that expense by 25× (at 4% SWR)."],
            ["Coast FIRE + side income is powerful", "You don't need to stop working at Coast FIRE — just stop worrying about retirement. Options premium can cover daily expenses while savings compound."],
            ["3.5% SWR for early retirees", "If you're retiring before 55, consider a more conservative 3–3.5% withdrawal rate to ensure your money lasts 40+ years."],
            ["Coast doesn't mean stop contributing", "Even after hitting Coast FIRE, adding more premium or savings speeds up your actual retirement date and builds a larger safety margin."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="coast-fire" />
        <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Projections are hypothetical. Consult a financial advisor for personalized retirement planning.
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
