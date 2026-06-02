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
const LOSS = "#e05c6a";

const PRESETS = [
  { label: "Conservative Seller", winRate: 68, avgWin: 250, avgLoss: 400, accountSize: 50000, riskPct: 1 },
  { label: "Standard Trader", winRate: 58, avgWin: 400, avgLoss: 300, accountSize: 25000, riskPct: 2 },
  { label: "Aggressive Speculator", winRate: 50, avgWin: 700, avgLoss: 500, accountSize: 10000, riskPct: 5 },
];

function calcRoR(winRate: number, avgWin: number, avgLoss: number, riskPct: number): number {
  const wr = winRate / 100;
  const lr = 1 - wr;
  const edge = wr * avgWin - lr * avgLoss;
  const variance = wr * avgWin * avgWin + lr * avgLoss * avgLoss - edge * edge;
  if (variance <= 0 || edge <= 0) return 100;
  const accountUnits = 100 / riskPct;
  const ror = Math.exp(-2 * edge * accountUnits / variance) * 100;
  return Math.min(Math.max(ror, 0), 100);
}

export default function RiskOfRuinPage() {
  const [winRate, setWinRate] = useState(58);
  const [avgWin, setAvgWin] = useState(400);
  const [avgLoss, setAvgLoss] = useState(300);
  const [accountSize, setAccountSize] = useState(25000);
  const [riskPct, setRiskPct] = useState(2);

  function applyPreset(p: typeof PRESETS[0]) {
    setWinRate(p.winRate); setAvgWin(p.avgWin); setAvgLoss(p.avgLoss);
    setAccountSize(p.accountSize); setRiskPct(p.riskPct);
  }

  const calc = useMemo(() => {
    const wr = winRate / 100;
    const lr = 1 - wr;
    const expectancy = wr * avgWin - lr * avgLoss;
    const kellyPct = expectancy > 0 ? ((wr / avgLoss) - (lr / avgWin)) * 100 : 0;
    const safeKelly = Math.max(kellyPct / 4, 0);
    const riskPerTrade = accountSize * (riskPct / 100);
    const ror = calcRoR(winRate, avgWin, avgLoss, riskPct);

    const rorCurve = Array.from({ length: 20 }, (_, i) => {
      const pct = 0.5 + i * 0.5;
      return { riskPct: pct, ror: parseFloat(calcRoR(winRate, avgWin, avgLoss, pct).toFixed(1)) };
    });

    const rorColor = ror < 5 ? PROFIT : ror < 20 ? "#eab308" : LOSS;
    const rorLabel = ror < 5 ? "Safe" : ror < 20 ? "Moderate Risk" : "High Risk";

    return { expectancy, kellyPct, safeKelly, riskPerTrade, ror, rorCurve, rorColor, rorLabel };
  }, [winRate, avgWin, avgLoss, accountSize, riskPct]);

  const fmt = (n: number, d = 0) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Risk of Ruin</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Risk of Ruin Calculator</h1>
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
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Risk of Ruin Calculator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Kelly criterion & account survival probability</div>
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
              <SectionLabel>Trade Stats</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Win Rate (%)"><Stepper value={winRate} onChange={setWinRate} min={1} step={1} /></Field>
                <Field label="Average Win ($)"><Stepper value={avgWin} onChange={setAvgWin} min={1} step={50} /></Field>
                <Field label="Average Loss ($)"><Stepper value={avgLoss} onChange={setAvgLoss} min={1} step={50} /></Field>
                <Field label="Account Size ($)"><Stepper value={accountSize} onChange={setAccountSize} min={1000} step={1000} /></Field>
                <Field label="Risk per Trade (%)"><Stepper value={riskPct} onChange={setRiskPct} min={0.5} step={0.5} /></Field>
              </div>
            </div>

            {/* Right: results + chart */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Risk of Ruin", value: `${calc.ror.toFixed(1)}%`, color: calc.rorColor, desc: calc.rorLabel },
                  { label: "Kelly % (Full)", value: calc.kellyPct > 0 ? `${calc.kellyPct.toFixed(1)}%` : "—", color: TEAL, desc: "optimal per-trade risk" },
                  { label: "¼ Kelly (Safe)", value: calc.safeKelly > 0 ? `${calc.safeKelly.toFixed(1)}%` : "—", color: "#b4e1e8", desc: "recommended max risk" },
                  { label: "$ per Trade", value: `$${fmt(calc.riskPerTrade)}`, color: MUTED, desc: `at ${riskPct}% risk` },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 500, color: "#b4e1e8", marginBottom: 8 }}>Risk of Ruin vs. Position Size</div>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calc.rorCurve} margin={{ top: 4, right: 8, left: 4, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,96,146,0.18)" />
                    <XAxis dataKey="riskPct" tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} label={{ value: "Risk per Trade", position: "insideBottom", offset: -12, fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: "'Poppins', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "rgba(5,22,54,0.97)", border: "1px solid rgba(29,178,176,0.4)", borderRadius: 8, fontSize: 11, fontFamily: "'Poppins', sans-serif" }} formatter={(v) => [`${Number(v).toFixed(1)}%`, "Risk of Ruin"]} labelFormatter={(l) => `Risk per Trade: ${l}%`} />
                    <ReferenceLine y={5} stroke={PROFIT} strokeDasharray="3 2" label={{ value: "5% target", fill: PROFIT, fontSize: 9, position: "right" }} />
                    <ReferenceLine x={riskPct} stroke="#eab308" strokeDasharray="3 2" label={{ value: "Current", fill: "#eab308", fontSize: 9 }} />
                    <Line type="monotone" dataKey="ror" stroke={LOSS} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ marginTop: 10, padding: "10px 14px", background: calc.expectancy > 0 ? "rgba(29,209,161,0.08)" : "rgba(224,92,106,0.08)", border: `1px solid ${calc.expectancy > 0 ? "rgba(29,209,161,0.25)" : "rgba(224,92,106,0.25)"}`, borderRadius: 8, fontSize: 11, color: MUTED }}>
                <strong style={{ color: calc.expectancy > 0 ? PROFIT : LOSS }}>Trade expectancy: ${calc.expectancy > 0 ? "+" : ""}{calc.expectancy.toFixed(0)} per trade.</strong>{" "}
                {calc.expectancy > 0 ? "Positive edge — your system is mathematically profitable." : "Negative edge — no position sizing can fix a losing system."}
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
              Risk of ruin uses a closed-form approximation. Actual drawdown risk depends on trade sequence and market conditions.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">What Is Risk of Ruin?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Risk of ruin is the probability that a trading system depletes an account beyond recovery given your win rate, average win/loss, and position sizing. Even with positive expectancy, it's mathematically possible to go broke if you size too aggressively — a bad early run of losses can reduce your account faster than your edge can recover it.</p>
        <p className="text-gray-600 leading-relaxed mb-6">The Kelly Criterion is the mathematically optimal bet size that maximizes long-run growth. However, full Kelly is extremely volatile, so professional traders use ¼ Kelly as a practical maximum. At ¼ Kelly, risk of ruin drops to near zero for any system with positive expectancy.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Keep RoR under 5%", "Professional traders target a risk of ruin below 5%. If yours is higher, reduce position size before changing your strategy."],
            ["Kelly tells you your ceiling", "Full Kelly is the mathematical maximum bet size. Going over Kelly guarantees long-run ruin — even with positive expectancy."],
            ["¼ Kelly is the practitioner standard", "Quarter Kelly dramatically reduces volatility while capturing most of the growth benefit. It's what most professional money managers use."],
            ["No position sizing saves a losing system", "If your expectancy is negative, the only fix is the strategy itself. Sizing down just loses more slowly."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="risk-of-ruin" />
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
