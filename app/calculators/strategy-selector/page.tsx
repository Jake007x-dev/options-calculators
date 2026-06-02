"use client";

import { useState } from "react";
import Link from "next/link";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";

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

      {/* Progress bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${step > s ? "bg-blue-600" : step === s ? "bg-blue-300" : "bg-gray-200"}`} />
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
        {/* Step 1 */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            What is your market outlook?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {outlooks.map((o) => (
              <button
                key={o.value}
                onClick={() => { setOutlook(o.value); setRisk(null); setHorizon(null); }}
                className={`p-4 rounded-xl border text-left transition-all ${outlook === o.value ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/50"}`}
              >
                <div className="text-xl mb-1">{o.emoji}</div>
                <div className="text-gray-900 font-medium text-sm">{o.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{o.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        {outlook && (
          <div className="mb-6 pt-4 border-t border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              What is your risk preference?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {risks.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setRisk(r.value); setHorizon(null); }}
                  className={`p-4 rounded-xl border text-left transition-all ${risk === r.value ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/50"}`}
                >
                  <div className="text-gray-900 font-medium text-sm">{r.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {outlook && risk && (
          <div className="pt-4 border-t border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              What is your time horizon?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {horizons.map((h) => (
                <button
                  key={h.value}
                  onClick={() => setHorizon(h.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${horizon === h.value ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/50"}`}
                >
                  <div className="text-gray-900 font-medium text-sm">{h.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{h.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {recommendations && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Strategies</h2>
          <div className="flex flex-col gap-4">
            {recommendations.map((strategy, i) => (
              <div key={i} className="bg-white rounded-xl border border-blue-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${i === 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{i === 0 ? "Top Pick" : "Alternative"}</span>
                    <h3 className="text-gray-900 font-semibold text-lg mt-1">{strategy.name}</h3>
                  </div>
                  {strategy.link && (
                    <Link href={strategy.link} className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                      Calculate this →
                    </Link>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{strategy.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">Max Profit</div>
                    <div className="text-green-700 text-sm font-medium">{strategy.maxProfit}</div>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">Max Loss</div>
                    <div className="text-red-700 text-sm font-medium">{strategy.maxLoss}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setOutlook(null); setRisk(null); setHorizon(null); }}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}

      <InlineCTA heading="Not sure which strategy fits?" body="Browse the full strategy library with payoff diagrams, Greeks profiles, and when-to-use guides for each approach." cta="Browse Strategy Library →" />

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
      <CTABanner />
    </CalcPageLayout>
  );
}
