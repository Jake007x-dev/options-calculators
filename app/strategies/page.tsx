import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Options Strategy Library — 8 Strategies Explained",
  description: "Complete options strategy guide: Covered Call, Cash-Secured Put, Wheel Strategy, Iron Condor, Straddle, Bull Call Spread, Protective Put, and LEAPS. Setup, max profit/loss, and when to use each.",
};

const strategies = [
  {
    slug: "covered-call",
    name: "Covered Call",
    bias: "Neutral / Slightly Bullish",
    risk: "Low",
    riskColor: "green",
    maxProfit: "Premium + stock gains to strike",
    maxLoss: "Stock price − premium (owns shares)",
    dte: "21–45 DTE",
    desc: "Sell a call against 100 shares you own. Generate monthly income from stocks in your portfolio. Caps upside but lowers your effective cost basis.",
    icon: "📈",
  },
  {
    slug: "cash-secured-put",
    name: "Cash-Secured Put",
    bias: "Neutral / Slightly Bullish",
    risk: "Low–Medium",
    riskColor: "yellow",
    maxProfit: "Premium collected",
    maxLoss: "Strike − premium (if stock goes to zero)",
    dte: "21–45 DTE",
    desc: "Sell a put while holding enough cash to buy shares if assigned. Enter a stock at a discount and collect premium while waiting.",
    icon: "💵",
  },
  {
    slug: "wheel",
    name: "Wheel Strategy",
    bias: "Neutral / Bullish",
    risk: "Low–Medium",
    riskColor: "yellow",
    maxProfit: "Ongoing premium income across cycles",
    maxLoss: "Cost basis if stock collapses",
    dte: "21–45 DTE per cycle",
    desc: "The full income cycle: sell cash-secured puts → get assigned → sell covered calls → get called away → repeat. A systematic premium harvesting machine.",
    icon: "🔄",
  },
  {
    slug: "iron-condor",
    name: "Iron Condor",
    bias: "Neutral",
    risk: "Defined",
    riskColor: "green",
    maxProfit: "Net credit received",
    maxLoss: "Spread width − net credit",
    dte: "30–45 DTE",
    desc: "Sell an OTM put spread + OTM call spread simultaneously. Profit if the stock stays inside a wide range through expiration. High POP, limited reward.",
    icon: "🦅",
  },
  {
    slug: "straddle",
    name: "Straddle & Strangle",
    bias: "Volatile (no direction)",
    risk: "Medium",
    riskColor: "yellow",
    maxProfit: "Unlimited (if stock moves far enough)",
    maxLoss: "Total premium paid (straddle) / total premium (strangle)",
    dte: "Pre-earnings (1–7 DTE) or longer",
    desc: "Buy both a call and a put. Profits from a large move in either direction. The go-to strategy for earnings plays when you expect a big move but don't know which way.",
    icon: "↕️",
  },
  {
    slug: "bull-call-spread",
    name: "Bull Call Spread",
    bias: "Bullish",
    risk: "Defined",
    riskColor: "green",
    maxProfit: "Spread width − debit paid",
    maxLoss: "Debit paid",
    dte: "30–60 DTE",
    desc: "Buy a lower-strike call, sell a higher-strike call. A cheaper way to express a bullish view with defined risk. Lower cost than a straight long call.",
    icon: "🐂",
  },
  {
    slug: "protective-put",
    name: "Protective Put",
    bias: "Bullish (hedged)",
    risk: "Low",
    riskColor: "green",
    maxProfit: "Unlimited (stock gains) − put premium",
    maxLoss: "Stock price − strike + premium paid",
    dte: "60–180 DTE",
    desc: "Buy a put against shares you own. Portfolio insurance — limits downside while keeping full upside. The most straightforward hedge for long stock positions.",
    icon: "🛡️",
  },
  {
    slug: "leaps",
    name: "LEAPS Call",
    bias: "Strongly Bullish",
    risk: "Medium",
    riskColor: "yellow",
    maxProfit: "Unlimited",
    maxLoss: "Premium paid",
    dte: "12–24 months",
    desc: "Buy a deep ITM call with 1–2 year expiration. Leveraged stock replacement — captures most of the stock's upside at a fraction of the capital. High vega, low theta.",
    icon: "🚀",
  },
];

const riskBadge: Record<string, string> = {
  green: "bg-green-50 text-green-700 border-green-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  red: "bg-red-50 text-red-700 border-red-200",
};

export default function StrategiesPage() {
  return (
    <main className="flex-1 min-w-0 px-6 py-10 pb-24">
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Option Strategies</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Options Strategy Library</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-2xl">
        Eight core options strategies — setup, max profit/loss, directional bias, and when to use each. Click any strategy to see a full breakdown with worked trade examples.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {strategies.map((s) => (
          <Link
            key={s.slug}
            href={`/strategies/${s.slug}`}
            className="group block bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl p-5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.bias}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${riskBadge[s.riskColor]}`}>
                {s.risk} Risk
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.desc}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                <p className="text-green-600 font-semibold mb-0.5">Max Profit</p>
                <p className="text-gray-700">{s.maxProfit}</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <p className="text-red-600 font-semibold mb-0.5">Max Loss</p>
                <p className="text-gray-700">{s.maxLoss}</p>
              </div>
            </div>
            <p className="text-blue-600 text-xs font-medium group-hover:text-blue-700">Read full guide →</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-gray-900 mb-1">Model any strategy in real time</p>
          <p className="text-gray-600 text-sm">Our calculators let you see exact P&L, Greeks, and income projections before you trade.</p>
        </div>
        <Link href="/calculators" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
          Open a Calculator →
        </Link>
      </div>
    </main>
  );
}
