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

const PRESETS = [
  { label: "Conservative $50k", account: 50000, risk: 1, premium: 3.5, stop: 50, legs: 1 },
  { label: "Standard $100k", account: 100000, risk: 2, premium: 5, stop: 50, legs: 1 },
  { label: "Spreads $50k", account: 50000, risk: 2, premium: 2, stop: 100, legs: 2 },
];

export default function PositionSizePage() {
  const [accountSize, setAccountSize] = useState(50000);
  const [maxRiskPct, setMaxRiskPct] = useState(2);
  const [premium, setPremium] = useState(3.5);
  const [stopLossPct, setStopLossPct] = useState(50);
  const [legs, setLegs] = useState(1);

  const calc = useMemo(() => {
    const maxDollarRisk = accountSize * (maxRiskPct / 100);
    const dollarAtRiskPerContract = premium * 100 * (stopLossPct / 100) * legs;
    const maxContracts = dollarAtRiskPerContract > 0 ? Math.floor(maxDollarRisk / dollarAtRiskPerContract) : 0;
    const totalDollarRisk = maxContracts * dollarAtRiskPerContract;
    const positionValue = maxContracts * premium * 100 * legs;
    const portfolioPct = (positionValue / accountSize) * 100;
    const stopTriggerPrice = premium * (1 - stopLossPct / 100);
    return { maxDollarRisk, maxContracts, totalDollarRisk, positionValue, portfolioPct, stopTriggerPrice };
  }, [accountSize, maxRiskPct, premium, stopLossPct, legs]);

  const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  function applyPreset(p: typeof PRESETS[0]) {
    setAccountSize(p.account); setMaxRiskPct(p.risk); setPremium(p.premium); setStopLossPct(p.stop); setLegs(p.legs);
  }

  const riskColor = maxRiskPct < 1.5 ? PROFIT : maxRiskPct < 3 ? "#eab308" : LOSS;
  const riskLabel = maxRiskPct < 1.5 ? "Conservative" : maxRiskPct < 3 ? "Standard" : "Aggressive";

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Position Size & Risk</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Options Position Size & Risk Calculator</h1>
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
                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Position Size Calculator</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>Risk-based contract sizing for options trades</div>
            </div>
          </div>

          {/* Risk level indicator */}
          <div style={{ padding: "10px 16px", marginBottom: 16, background: `${riskColor}14`, border: `1px solid ${riskColor}44`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: riskColor, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: riskColor }}>{riskLabel} Risk Profile — {maxRiskPct}% per trade</div>
              <div style={{ fontSize: 10, color: MUTED }}>{maxRiskPct < 1.5 ? "Good capital preservation" : maxRiskPct < 3 ? "Professional standard range" : "High risk of account damage"}</div>
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
              <SectionLabel>Account & Risk</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field label="Account Size ($)"><Stepper value={accountSize} onChange={setAccountSize} min={1000} step={1000} /></Field>
                <Field label="Max Risk per Trade (%)"><Stepper value={maxRiskPct} onChange={setMaxRiskPct} min={0.5} step={0.5} /></Field>
                <Field label="Premium / Contract ($)"><Stepper value={premium} onChange={setPremium} min={0.01} step={0.25} /></Field>
                <Field label="Stop Loss (% of premium)"><Stepper value={stopLossPct} onChange={setStopLossPct} min={10} step={5} /></Field>
              </div>

              <div style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "12px 0" }} />
              <SectionLabel>Legs</SectionLabel>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2].map((l) => (
                  <button key={l} type="button" onClick={() => setLegs(l)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${legs === l ? TEAL : BORDER}`, background: legs === l ? "rgba(29,178,176,0.15)" : "rgba(10,34,72,0.4)", color: legs === l ? TEAL : MUTED, transition: "all .2s" }}>{l} leg{l > 1 ? "s" : ""}</button>
                ))}
              </div>
            </div>

            {/* Right: results */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {[
                  { label: "Max Contracts", value: `${calc.maxContracts}`, color: TEAL, desc: "at your risk limit" },
                  { label: "$ at Risk", value: `$${fmt(calc.totalDollarRisk, 0)}`, color: LOSS, desc: "if stop is hit" },
                  { label: "Position Value", value: `$${fmt(calc.positionValue, 0)}`, color: "#b4e1e8", desc: "total premium" },
                  { label: "Stop Trigger", value: `$${fmt(calc.stopTriggerPrice)}`, color: "#eab308", desc: "exit price/contract" },
                  { label: "Max $ Risk Budget", value: `$${fmt(calc.maxDollarRisk, 0)}`, color: MUTED, desc: `${maxRiskPct}% of account` },
                  { label: "Portfolio Weight", value: `${calc.portfolioPct.toFixed(1)}%`, color: MUTED, desc: "of account size" },
                ].map((m) => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.6 }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: MUTED }}>{m.desc}</div>
                  </div>
                ))}
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
              Position sizing is theoretical. Actual risk may exceed calculations due to gaps, liquidity, and early assignment.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">The 1–2% Rule</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Professional traders risk 1–2% of their account on any single trade. This rule sounds conservative but it has a powerful mathematical purpose: if you risk 2% per trade and have a 10-loss streak, you've only drawn down ~18%. At 5% per trade, the same streak draws you down ~40% — requiring a 67% gain just to break even.</p>
        <p className="text-gray-600 leading-relaxed mb-6">The stop loss level matters just as much as the risk percentage. A 50% stop on a long option means you exit when the option has lost half its value. Setting the stop too tight forces you out of good trades; too loose means you lose more than planned.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Risk is defined before you enter", "Calculate your max contracts BEFORE placing the order. Never work backwards from the position size you 'want'."],
            ["50% stop is the common benchmark", "Many professional options traders exit at 50% of max loss. It preserves capital and forces discipline."],
            ["1-leg vs. 2-leg changes everything", "A spread has two legs of premium — double the risk per contract. Factor this in when sizing defined-risk spreads."],
            ["Consistency compounds", "A trader risking exactly 1% per trade with consistent execution will dramatically outperform someone taking variable-sized gambles."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="position-size" />
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
