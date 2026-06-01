import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/calculators/CTABanner";

export const metadata: Metadata = {
  title: "Free Options Trading Calculators — All 10 Tools",
  description:
    "Professional options trading calculators: Black-Scholes pricing, Implied Volatility, Theta Decay, Monte Carlo simulation, Wheel Strategy income, and more. Free, real-time, no signup required.",
};

const calculators = [
  {
    slug: "implied-volatility",
    title: "Implied Volatility Calculator",
    description: "Back-solve for IV from any option's market price using Newton-Raphson iteration against Black-Scholes.",
    tag: "IV / Volatility",
    icon: "📊",
  },
  {
    slug: "black-scholes",
    title: "Black-Scholes Pricing Calculator",
    description: "Calculate theoretical call/put prices and all five Greeks: Delta, Gamma, Theta, Vega, and Rho.",
    tag: "Pricing / Greeks",
    icon: "⚖️",
  },
  {
    slug: "wheel-strategy",
    title: "Wheel Strategy Income Calculator",
    description: "Project your annualized yield and monthly income from running the Wheel (CSP → Covered Call) strategy.",
    tag: "Income / Strategy",
    icon: "🔄",
  },
  {
    slug: "expected-move",
    title: "Expected Move Calculator",
    description: "Calculate the options market's 1σ price range using IV or the ATM straddle price.",
    tag: "IV / Range",
    icon: "🎯",
  },
  {
    slug: "monte-carlo",
    title: "Monte Carlo Portfolio Simulator",
    description: "Run 500 simulated trading paths to estimate your probability of ruin and range of outcomes.",
    tag: "Risk / Simulation",
    icon: "🎲",
  },
  {
    slug: "position-size",
    title: "Position Size & Risk Calculator",
    description: "Calculate the exact number of contracts you can trade while staying within your risk per trade limit.",
    tag: "Risk / Sizing",
    icon: "🛡️",
  },
  {
    slug: "strategy-selector",
    title: "Options Strategy Selector",
    description: "Answer three questions about your market outlook, risk tolerance, and time horizon for personalized strategy recommendations.",
    tag: "Education / Strategy",
    icon: "🧭",
  },
  {
    slug: "theta-decay",
    title: "Theta Decay Visualizer",
    description: "Visualize how an option's value decays daily from now to expiration — from a buyer's or seller's perspective.",
    tag: "Theta / Visualization",
    icon: "⏳",
  },
  {
    slug: "annualized-return",
    title: "Annualized Return on Capital",
    description: "Standardize any options premium into an annualized ROC and compare it against the S&P 500 and savings rates.",
    tag: "Income / ROC",
    icon: "📈",
  },
  {
    slug: "earnings-straddle",
    title: "Earnings Straddle Calculator",
    description: "Compare implied vs. historical earnings moves to find edge and model long/short straddle P&L.",
    tag: "Earnings / Straddle",
    icon: "📰",
  },
];

export default function CalculatorsIndexPage() {
  return (
    <div className="min-h-screen bg-[#0F1629] pb-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-300 text-xs font-medium mb-4">
            Professional-Grade Tools · Free · Real-Time
          </div>
          <h1 className="text-4xl font-semibold text-white mb-4">
            Options Trading Calculators
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ten professional-grade tools to price options, manage risk, and build income strategies — all updating in real time as you type.
          </p>
        </div>

        {/* Calculator grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculators.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="group bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 flex flex-col gap-3 transition-all hover:bg-gray-800/50"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{calc.icon}</span>
                <span className="text-xs bg-gray-800 group-hover:bg-gray-700 text-gray-400 px-2 py-1 rounded-full transition-colors">
                  {calc.tag}
                </span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors leading-tight mb-1.5">
                  {calc.title}
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {calc.description}
                </p>
              </div>
              <div className="text-blue-400 text-xs font-medium mt-auto group-hover:text-blue-300 transition-colors">
                Open calculator →
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-16 bg-gray-900 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-white text-2xl font-semibold mb-3">
            Put These Tools to Work
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Open a live trading account and execute the strategies you've modeled here — with professional-grade order routing and competitive pricing.
          </p>
          <Link
            href="/open-account"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
          >
            Open a Live Account →
          </Link>
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
