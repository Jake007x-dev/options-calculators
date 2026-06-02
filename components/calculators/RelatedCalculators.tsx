import Link from "next/link";

const ALL = [
  { slug: "implied-volatility", label: "Implied Volatility", desc: "Back-solve IV from any option price.", icon: "📊" },
  { slug: "black-scholes", label: "Black-Scholes Pricing", desc: "Theoretical price + all 5 Greeks.", icon: "⚖️" },
  { slug: "wheel-strategy", label: "Wheel Strategy", desc: "Project annual income from CSP→CC cycles.", icon: "🔄" },
  { slug: "expected-move", label: "Expected Move", desc: "IV-based and straddle-based price range.", icon: "🎯" },
  { slug: "monte-carlo", label: "Monte Carlo Sim", desc: "Simulate 500 trading paths + ruin probability.", icon: "🎲" },
  { slug: "position-size", label: "Position Size & Risk", desc: "Max contracts within your risk budget.", icon: "🛡️" },
  { slug: "strategy-selector", label: "Strategy Selector", desc: "3-question decision tree → top 2 strategies.", icon: "🧭" },
  { slug: "theta-decay", label: "Theta Decay", desc: "Daily decay curve from today to expiration.", icon: "⏳" },
  { slug: "annualized-return", label: "Annualized ROC", desc: "Standardize premium to annual return.", icon: "📈" },
  { slug: "earnings-straddle", label: "Earnings Straddle", desc: "Implied vs historical move + P&L chart.", icon: "📰" },
  { slug: "probability-of-profit", label: "Probability of Profit", desc: "PoP % for any strike using Black-Scholes.", icon: "🎯" },
  { slug: "trade-expectancy", label: "Trade Expectancy", desc: "Expected value per trade + monthly income.", icon: "💡" },
  { slug: "risk-of-ruin", label: "Risk of Ruin", desc: "Kelly Criterion + probability of blowing up.", icon: "⚠️" },
  { slug: "premium-reinvestment", label: "Premium Reinvestment", desc: "Compound options income over 20–30 years.", icon: "💰" },
  { slug: "roth-ira", label: "Roth IRA + Options", desc: "Tax-free growth with options inside a Roth.", icon: "🏦" },
  { slug: "coast-fire", label: "Coast FIRE", desc: "Retire faster by collecting options premium.", icon: "🏖️" },
];

interface RelatedCalculatorsProps {
  currentSlug: string;
}

export default function RelatedCalculators({ currentSlug }: RelatedCalculatorsProps) {
  const related = ALL.filter((c) => c.slug !== currentSlug).slice(0, 4);

  return (
    <div className="my-10">
      <h3 className="text-gray-900 font-bold text-lg mb-4">Related Calculators</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((c) => (
          <Link
            key={c.slug}
            href={`/calculators/${c.slug}`}
            className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{c.icon}</span>
            <div>
              <p className="text-gray-900 font-semibold text-sm group-hover:text-blue-700 transition-colors">{c.label} Calculator</p>
              <p className="text-gray-500 text-xs mt-0.5">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-3 text-right">
        <Link href="/calculators" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View all 16 calculators →
        </Link>
      </div>
    </div>
  );
}
