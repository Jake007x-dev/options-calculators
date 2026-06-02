"use client";

import { useState } from "react";
import Link from "next/link";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";

const NAVY = "#051636";
const NAVY2 = "#0a2248";
const TEAL = "#1db2b0";
const BORDER = "rgba(29,178,176,0.18)";
const CARD = "rgba(10,34,72,0.8)";
const TEXT = "#f2f8fd";
const MUTED = "#9dbdd0";
const PROFIT = "#1dd1a1";
const LOSS = "#e05c6a";

type Outlook = "bullish" | "bearish" | "neutral" | "volatile";
type Risk = "conservative" | "aggressive";
type Horizon = "short" | "medium" | "long";

interface Strategy {
  name: string;
  description: string;
  maxProfit: string;
  maxLoss: string;
  link?: string;
}

const matrix: Record<Outlook, Record<Risk, Record<Horizon, [Strategy, Strategy]>>> = {
  bullish: {
    conservative: {
      short: [
        { name: "Bull Call Spread", description: "Buy a lower-strike call and sell a higher-strike call for a defined-risk bullish bet.", maxProfit: "Width of strikes minus debit paid", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Cash-Secured Put", description: "Sell an OTM put to collect premium; you're obligated to buy at a lower price if assigned.", maxProfit: "Premium collected", maxLoss: "Strike price minus premium", link: "/calculators/wheel-strategy" },
      ],
      medium: [
        { name: "Covered Call", description: "Own shares and sell a call above current price to generate income while capping upside.", maxProfit: "Strike - entry + premium", maxLoss: "Stock price drops to zero", link: "/calculators/wheel-strategy" },
        { name: "Bull Call Spread", description: "Defined-risk bullish spread using two call strikes.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
      long: [
        { name: "Covered Call", description: "Sell calls against long stock monthly to reduce cost basis over time.", maxProfit: "Strike - entry + premium", maxLoss: "Full stock loss minus premiums collected", link: "/calculators/wheel-strategy" },
        { name: "Cash-Secured Put", description: "Sell longer-dated OTM puts to enter a position at a discount.", maxProfit: "Premium collected", maxLoss: "Strike price minus premium", link: "/calculators/wheel-strategy" },
      ],
    },
    aggressive: {
      short: [
        { name: "Long Call", description: "Buy an ATM or OTM call to capture a sharp upward move with leverage.", maxProfit: "Unlimited", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Bull Call Spread", description: "Defined-risk way to express a bullish view with better probability than a naked long call.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
      medium: [
        { name: "Long Call", description: "Buy an in-the-money call with 30–60 DTE for a directional bet.", maxProfit: "Unlimited", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Short Strangle", description: "Sell OTM call and put to collect premium; profits if stock stays in range.", maxProfit: "Premium collected", maxLoss: "Theoretically unlimited", link: "/calculators/earnings-straddle" },
      ],
      long: [
        { name: "Long Call", description: "Deep ITM LEAPS call to simulate stock ownership with lower capital outlay.", maxProfit: "Unlimited", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Bull Call Spread", description: "Long-dated bull spread to reduce theta decay compared to a naked long call.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
    },
  },
  bearish: {
    conservative: {
      short: [
        { name: "Bear Put Spread", description: "Buy a higher-strike put and sell a lower-strike put for a defined-risk bearish bet.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Covered Call", description: "If holding shares, sell ITM calls to collect premium and partially hedge.", maxProfit: "Strike - entry + premium", maxLoss: "Full stock loss", link: "/calculators/wheel-strategy" },
      ],
      medium: [
        { name: "Bear Put Spread", description: "Defined-risk bearish spread with 30–60 DTE for time to be right.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Iron Condor", description: "Sell OTM call spread and put spread — profits from the stock staying flat or drifting lower.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
      ],
      long: [
        { name: "Bear Put Spread", description: "Long-dated put spread on a sector ETF or overvalued stock.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Iron Condor", description: "Long-dated iron condor biased lower — collect premium while the trend unfolds.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
      ],
    },
    aggressive: {
      short: [
        { name: "Long Put", description: "Buy an ATM or OTM put to profit from a sharp downward move.", maxProfit: "Strike minus zero", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Bear Put Spread", description: "Defined-risk version of the long put with better probability.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
      medium: [
        { name: "Long Put", description: "Buy puts 30–60 DTE to express a bearish conviction trade.", maxProfit: "Strike minus zero", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Short Strangle", description: "Sell OTM strangle with bearish bias on the call side.", maxProfit: "Premium collected", maxLoss: "Theoretically unlimited", link: "/calculators/earnings-straddle" },
      ],
      long: [
        { name: "Long Put", description: "Buy LEAPS puts as cheap portfolio insurance or a macro hedge.", maxProfit: "Strike minus zero", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Bear Put Spread", description: "Long-dated put spread to limit premium decay while maintaining bearish exposure.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
    },
  },
  neutral: {
    conservative: {
      short: [
        { name: "Iron Condor", description: "Sell an OTM call spread and put spread — profits from the stock staying within a range.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
        { name: "Covered Call", description: "Sell an ATM call against existing shares to monetize the flat environment.", maxProfit: "Strike - entry + premium", maxLoss: "Full stock loss", link: "/calculators/wheel-strategy" },
      ],
      medium: [
        { name: "Iron Condor", description: "Collect premium from both sides with a 30–60 DTE iron condor.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
        { name: "Wheel Strategy", description: "Sell OTM puts, collect premium; repeat or sell covered calls if assigned.", maxProfit: "Unlimited premium collection", maxLoss: "Cost basis if stock goes to zero", link: "/calculators/wheel-strategy" },
      ],
      long: [
        { name: "Iron Condor", description: "Sell a wide-strike iron condor with 60+ DTE, giving the trade time to decay.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
        { name: "Wheel Strategy", description: "Run the wheel for consistent income across multiple cycles.", maxProfit: "Compounding premium income", maxLoss: "Cost basis risk", link: "/calculators/wheel-strategy" },
      ],
    },
    aggressive: {
      short: [
        { name: "Short Strangle", description: "Sell OTM call and put — unlimited risk but higher premium than a condor.", maxProfit: "Premium collected", maxLoss: "Theoretically unlimited", link: "/calculators/earnings-straddle" },
        { name: "Iron Condor", description: "Defined-risk version of the short strangle.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
      ],
      medium: [
        { name: "Short Strangle", description: "Sell an OTM strangle 30–60 DTE to collect elevated premium.", maxProfit: "Premium collected", maxLoss: "Theoretically unlimited", link: "/calculators/earnings-straddle" },
        { name: "Iron Condor", description: "Defined-risk alternative for capital preservation.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
      ],
      long: [
        { name: "Short Strangle", description: "Sell wide OTM strangle with 60+ DTE for maximum premium capture.", maxProfit: "Premium collected", maxLoss: "Theoretically unlimited", link: "/calculators/earnings-straddle" },
        { name: "Iron Condor", description: "Wide-strike condor with long expiration for slow theta capture.", maxProfit: "Net premium collected", maxLoss: "Wider spread minus premium", link: "/calculators/black-scholes" },
      ],
    },
  },
  volatile: {
    conservative: {
      short: [
        { name: "Bull Call Spread", description: "If you have a direction bias, use a defined-risk spread to participate with capped loss.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
        { name: "Bear Put Spread", description: "Defined-risk bearish spread for a volatile downward move.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
      medium: [
        { name: "Long Straddle", description: "Buy ATM call and put — profits from a large move in either direction.", maxProfit: "Unlimited", maxLoss: "Total premium paid", link: "/calculators/earnings-straddle" },
        { name: "Bull Call Spread", description: "If you expect a volatile move upward, limit your risk with a spread.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
      long: [
        { name: "Long Straddle", description: "Buy a long-dated ATM straddle for exposure to a large eventual move.", maxProfit: "Unlimited", maxLoss: "Total premium paid", link: "/calculators/earnings-straddle" },
        { name: "Bull Call Spread", description: "LEAPS-based spread to reduce the drag of owning pure long options.", maxProfit: "Strike width minus debit", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
    },
    aggressive: {
      short: [
        { name: "Long Straddle", description: "Buy ATM call + put — maximum volatility exposure for earnings or events.", maxProfit: "Unlimited", maxLoss: "Total premium paid", link: "/calculators/earnings-straddle" },
        { name: "Short Strangle", description: "Sell OTM strangle if you believe IV is overstating the move.", maxProfit: "Premium collected", maxLoss: "Theoretically unlimited", link: "/calculators/earnings-straddle" },
      ],
      medium: [
        { name: "Long Straddle", description: "ATM straddle 30–60 DTE to capture a big pending catalyst.", maxProfit: "Unlimited", maxLoss: "Total premium paid", link: "/calculators/earnings-straddle" },
        { name: "Short Strangle", description: "Sell OTM strangle if IV is rich and you expect post-event IV crush.", maxProfit: "Premium collected", maxLoss: "Theoretically unlimited", link: "/calculators/earnings-straddle" },
      ],
      long: [
        { name: "Long Straddle", description: "Long-dated ATM straddle on a name with major uncertainty ahead.", maxProfit: "Unlimited", maxLoss: "Total premium paid", link: "/calculators/earnings-straddle" },
        { name: "Long Call", description: "Buy ITM calls if you expect volatile upward trend over time.", maxProfit: "Unlimited", maxLoss: "Premium paid", link: "/calculators/black-scholes" },
      ],
    },
  },
};

const outlooks: { value: Outlook; label: string; desc: string; emoji: string }[] = [
  { value: "bullish", label: "Bullish", desc: "I expect the stock to go up", emoji: "📈" },
  { value: "bearish", label: "Bearish", desc: "I expect the stock to go down", emoji: "📉" },
  { value: "neutral", label: "Neutral", desc: "I expect the stock to stay flat", emoji: "↔️" },
  { value: "volatile", label: "Volatile", desc: "Big move expected, direction unknown", emoji: "⚡" },
];

const risks: { value: Risk; label: string; desc: string }[] = [
  { value: "conservative", label: "Conservative", desc: "Defined risk — I know my max loss upfront" },
  { value: "aggressive", label: "Aggressive", desc: "Higher premium — I can tolerate undefined risk" },
];

const horizons: { value: Horizon; label: string; desc: string }[] = [
  { value: "short", label: "Short", desc: "< 30 DTE" },
  { value: "medium", label: "Medium", desc: "30–60 DTE" },
  { value: "long", label: "Long", desc: "60+ DTE" },
];

export default function StrategySelectorPage() {
  const [outlook, setOutlook] = useState<Outlook | null>(null);
  const [risk, setRisk] = useState<Risk | null>(null);
  const [horizon, setHorizon] = useState<Horizon | null>(null);

  const recommendations = outlook && risk && horizon ? matrix[outlook][risk][horizon] : null;
  const step = !outlook ? 1 : !risk ? 2 : !horizon ? 3 : 4;

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Strategy Selector</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Options Strategy Selector</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <p className="text-gray-600 mb-6">Answer three questions and get personalized strategy recommendations matched to your market view and risk tolerance.</p>

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
                <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>Strategy Selector</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3, fontWeight: 400 }}>3 questions → personalized strategy recommendations</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step > s ? TEAL : step === s ? "rgba(29,178,176,0.4)" : "rgba(29,178,176,0.1)", transition: "background 0.3s" }} />
            ))}
          </div>

          {/* Step 1 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e0f0f8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: TEAL, color: NAVY, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>
              What is your market outlook?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {outlooks.map((o) => {
                const isActive = outlook === o.value;
                return (
                  <button key={o.value} type="button" onClick={() => { setOutlook(o.value); setRisk(null); setHorizon(null); }} style={{ padding: "12px 8px", borderRadius: 10, border: `1px solid ${isActive ? TEAL : BORDER}`, background: isActive ? "rgba(29,178,176,0.15)" : "rgba(10,34,72,0.4)", color: isActive ? TEXT : MUTED, cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all .2s", textAlign: "left" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{o.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? TEXT : "#b4e1e8" }}>{o.label}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{o.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 */}
          {outlook && (
            <div style={{ marginBottom: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#e0f0f8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: TEAL, color: NAVY, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
                What is your risk preference?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {risks.map((r) => {
                  const isActive = risk === r.value;
                  return (
                    <button key={r.value} type="button" onClick={() => { setRisk(r.value); setHorizon(null); }} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${isActive ? TEAL : BORDER}`, background: isActive ? "rgba(29,178,176,0.15)" : "rgba(10,34,72,0.4)", color: isActive ? TEXT : MUTED, cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all .2s", textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? TEXT : "#b4e1e8" }}>{r.label}</div>
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{r.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {outlook && risk && (
            <div style={{ marginBottom: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#e0f0f8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: TEAL, color: NAVY, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
                What is your time horizon?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {horizons.map((h) => {
                  const isActive = horizon === h.value;
                  return (
                    <button key={h.value} type="button" onClick={() => setHorizon(h.value)} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${isActive ? TEAL : BORDER}`, background: isActive ? "rgba(29,178,176,0.15)" : "rgba(10,34,72,0.4)", color: isActive ? TEXT : MUTED, cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all .2s", textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? TEXT : "#b4e1e8" }}>{h.label}</div>
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{h.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results */}
          {recommendations && (
            <div style={{ paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Recommended Strategies</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {recommendations.map((strategy, i) => (
                  <div key={i} style={{ background: CARD, border: `1px solid ${i === 0 ? "rgba(29,178,176,0.4)" : BORDER}`, borderRadius: 12, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
                    {i === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: TEAL, opacity: 0.8 }} />}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: i === 0 ? "rgba(29,178,176,0.2)" : "rgba(157,189,208,0.15)", color: i === 0 ? TEAL : MUTED, letterSpacing: "0.08em", textTransform: "uppercase" }}>{i === 0 ? "Top Pick" : "Alternative"}</span>
                        <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginTop: 6 }}>{strategy.name}</div>
                      </div>
                      {strategy.link && (
                        <Link href={strategy.link} style={{ flexShrink: 0, background: TEAL, color: NAVY, fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
                          Calculate →
                        </Link>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>{strategy.description}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ background: "rgba(29,209,161,0.08)", border: "1px solid rgba(29,209,161,0.2)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 9, color: MUTED }}>Max Profit</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: PROFIT, marginTop: 2 }}>{strategy.maxProfit}</div>
                      </div>
                      <div style={{ background: "rgba(224,92,106,0.08)", border: "1px solid rgba(224,92,106,0.2)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 9, color: MUTED }}>Max Loss</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: LOSS, marginTop: 2 }}>{strategy.maxLoss}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => { setOutlook(null); setRisk(null); setHorizon(null); }} style={{ marginTop: 12, fontSize: 12, color: TEAL, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                ← Start over
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 20, padding: "14px 18px", background: "rgba(29,178,176,0.05)", border: "1px solid rgba(29,178,176,0.14)", borderRadius: 8, fontSize: 11, lineHeight: 1.65, color: MUTED }}>
            <svg viewBox="0 0 24 24" width={15} height={15} style={{ flexShrink: 0, marginTop: 2, stroke: TEAL, fill: "none", opacity: 0.8 }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong style={{ color: TEAL, fontWeight: 600 }}>For educational purposes only.</strong>{" "}
              Strategy recommendations are general guidance only. Always consider your full financial situation before trading.
            </span>
          </div>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">How the Selector Works</h2>
        <p className="text-gray-600 leading-relaxed mb-4">The strategy selector maps your three inputs — market outlook, risk tolerance, and time horizon — against a curated decision matrix of professional options strategies. The recommendations match each strategy's payoff profile to your specific scenario, giving the highest probability of capturing the intended return.</p>
        <p className="text-gray-600 leading-relaxed mb-6">Outlook defines which direction (or non-direction) you're expressing. Risk tolerance determines whether you want defined or undefined risk. Time horizon aligns theta decay and gamma exposure to your expected holding period. Together, they filter the universe of strategies down to the two best fits.</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
        <ul className="space-y-3 mb-8">
          {[
            ["Match strategy to thesis, not preference", "Using a complex strategy when a simple one fits is a common mistake. The selector surfaces the simplest structure that captures your view."],
            ["Defined risk first for new traders", "Spreads and covered calls cap your loss before you enter. This lets you learn without a single trade ending your account."],
            ["DTE and outlook must align", "A long call with 7 DTE on a slow-moving stock is a bad match. Short DTE = fast moves only. Long DTE = patience required."],
            ["Revisit as the trade evolves", "Your outlook might shift mid-trade. Run the selector again when the thesis changes rather than holding a misaligned position."],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
              <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
            </li>
          ))}
        </ul>

        <EmailCapture />
        <RelatedCalculators currentSlug="strategy-selector" />
        <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
        </div>
      </div>

      <CTABanner />
    </CalcPageLayout>
  );
}
