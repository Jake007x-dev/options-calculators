import type { Metadata } from "next";
import Link from "next/link";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";

export const metadata: Metadata = {
  title: "Free Options Trading Calculators — All 16 Tools",
  description:
    "Professional options trading calculators: Black-Scholes pricing, Implied Volatility, Theta Decay, Monte Carlo simulation, Wheel Strategy income, Coast FIRE, Roth IRA, and more. Free, real-time, no signup required.",
};

const calculators = [
  {
    slug: "implied-volatility",
    title: "Implied Volatility Calculator",
    description: "Back-solve for IV from any option's market price using Newton-Raphson iteration.",
    tag: "IV / Volatility",
    icon: "📊",
  },
  {
    slug: "black-scholes",
    title: "Black-Scholes Pricing Calculator",
    description: "Calculate theoretical call/put prices and all five Greeks in real time.",
    tag: "Pricing / Greeks",
    icon: "⚖️",
  },
  {
    slug: "wheel-strategy",
    title: "Wheel Strategy Income Calculator",
    description: "Project annualized yield and monthly income from running the Wheel strategy.",
    tag: "Income / Strategy",
    icon: "🔄",
  },
  {
    slug: "expected-move",
    title: "Expected Move Calculator",
    description: "Calculate the options market's 1σ price range using IV or ATM straddle price.",
    tag: "IV / Range",
    icon: "🎯",
  },
  {
    slug: "monte-carlo",
    title: "Monte Carlo Portfolio Simulator",
    description: "Run 500 simulated paths to estimate your probability of ruin and range of outcomes.",
    tag: "Risk / Simulation",
    icon: "🎲",
  },
  {
    slug: "position-size",
    title: "Position Size & Risk Calculator",
    description: "Calculate the exact number of contracts to stay within your per-trade risk limit.",
    tag: "Risk / Sizing",
    icon: "🛡️",
  },
  {
    slug: "strategy-selector",
    title: "Options Strategy Selector",
    description: "Answer three questions and get personalized strategy recommendations.",
    tag: "Education / Strategy",
    icon: "🧭",
  },
  {
    slug: "theta-decay",
    title: "Theta Decay Visualizer",
    description: "Visualize how an option's value erodes daily from now to expiration.",
    tag: "Theta / Visualization",
    icon: "⏳",
  },
  {
    slug: "annualized-return",
    title: "Annualized Return on Capital",
    description: "Standardize any premium into annualized ROC and benchmark against the S&P 500.",
    tag: "Income / ROC",
    icon: "📈",
  },
  {
    slug: "earnings-straddle",
    title: "Earnings Straddle Calculator",
    description: "Compare implied vs. historical earnings moves and model long/short straddle P&L.",
    tag: "Earnings / Straddle",
    icon: "📰",
  },
  {
    slug: "probability-of-profit",
    title: "Probability of Profit Calculator",
    description: "Calculate the exact PoP% for any option strike using Black-Scholes and N(d₂).",
    tag: "Risk / Probability",
    icon: "🎯",
  },
  {
    slug: "trade-expectancy",
    title: "Trade Expectancy Calculator",
    description: "Find your per-trade edge, monthly income, and whether your system is mathematically profitable.",
    tag: "Edge / Expectancy",
    icon: "💡",
  },
  {
    slug: "risk-of-ruin",
    title: "Risk of Ruin Calculator",
    description: "Kelly Criterion, optimal position sizing, and probability of blowing up your account.",
    tag: "Risk / Kelly",
    icon: "⚠️",
  },
  {
    slug: "premium-reinvestment",
    title: '"What If I Reinvested My Premium?" Calculator',
    description: "See how compounding monthly options income over 20–30 years stacks up vs. passive investing.",
    tag: "Income / Compounding",
    icon: "💰",
  },
  {
    slug: "roth-ira",
    title: "Roth IRA + Options Calculator",
    description: "Project tax-free retirement wealth using options-enhanced returns inside a Roth IRA.",
    tag: "Retirement / Tax-Free",
    icon: "🏦",
  },
  {
    slug: "coast-fire",
    title: "Coast FIRE Calculator",
    description: "Find your Coast FIRE number and see how options income accelerates your timeline to financial independence.",
    tag: "FIRE / Retirement",
    icon: "🏖️",
  },
];

const benefits = [
  {
    icon: "⚡",
    title: "Real-Time Outputs",
    desc: "Every slider and input updates results instantly — no submit button, no lag.",
  },
  {
    icon: "🎓",
    title: "Built-In Education",
    desc: "Each tool includes worked example trades, explanations, and strategy context.",
  },
  {
    icon: "🔒",
    title: "Free, No Signup Required",
    desc: "All 10 calculators are completely free. No account needed to get started.",
  },
];

export default function CalculatorsLandingPage() {
  return (
    <main className="flex-1 min-w-0 px-6 py-10 pb-24">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Option Calculators</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-blue-600 text-xs font-medium mb-4">
          16 Tools · Free · Real-Time · No Signup
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
          Free Options Trading Calculators
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
          Professional-grade tools for pricing options, managing risk, and building income strategies — all updating in real time as you type.
        </p>
      </div>

      {/* Benefits strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {benefits.map((b) => (
          <div key={b.title} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <span className="text-xl flex-shrink-0">{b.icon}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm mb-0.5">{b.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calculator grid */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">All 16 Calculators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        {calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calculators/${calc.slug}`}
            className="group flex items-start gap-4 bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl p-4 transition-all"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{calc.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors leading-tight">
                  {calc.title}
                </p>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                  {calc.tag}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{calc.description}</p>
              <p className="text-blue-600 text-xs font-medium mt-2 group-hover:text-blue-700 transition-colors">
                Open calculator →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA section */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-gray-900 text-lg mb-1">Put These Tools to Work</p>
          <p className="text-gray-600 text-sm">Open a live account and execute the strategies you've modeled here.</p>
        </div>
        <Link
          href="/open-account"
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          Open a Live Account →
        </Link>
      </div>

      <EmailCapture />
      <CTABanner />
    </main>
  );
}
