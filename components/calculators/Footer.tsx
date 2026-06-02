import Link from "next/link";

const CALCS = [
  ["black-scholes", "Black-Scholes Pricing"],
  ["implied-volatility", "Implied Volatility"],
  ["wheel-strategy", "Wheel Strategy Income"],
  ["expected-move", "Expected Move"],
  ["monte-carlo", "Monte Carlo Simulator"],
  ["position-size", "Position Size & Risk"],
  ["strategy-selector", "Strategy Selector"],
  ["theta-decay", "Theta Decay Visualizer"],
  ["annualized-return", "Annualized Return"],
  ["earnings-straddle", "Earnings Straddle"],
];

const GREEKS = ["delta", "gamma", "theta", "vega", "rho"];

const STRATEGIES = [
  ["covered-call", "Covered Call"],
  ["cash-secured-put", "Cash-Secured Put"],
  ["wheel", "Wheel Strategy"],
  ["iron-condor", "Iron Condor"],
  ["straddle", "Straddle & Strangle"],
  ["bull-call-spread", "Bull Call Spread"],
  ["protective-put", "Protective Put"],
  ["leaps", "LEAPS Call"],
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider mb-3">Calculators</p>
            <ul className="space-y-1.5">
              {CALCS.map(([slug, label]) => (
                <li key={slug}>
                  <Link href={`/calculators/${slug}`} className="text-gray-500 dark:text-gray-400 text-xs hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider mb-3">Option Greeks</p>
            <ul className="space-y-1.5">
              {GREEKS.map((g) => (
                <li key={g}>
                  <Link href={`/greeks/${g}`} className="text-gray-500 dark:text-gray-400 text-xs hover:text-blue-600 transition-colors capitalize">
                    {g}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/glossary" className="text-blue-600 text-xs font-medium hover:underline">
                  Full Glossary →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider mb-3">Strategies</p>
            <ul className="space-y-1.5">
              {STRATEGIES.map(([slug, label]) => (
                <li key={slug}>
                  <Link href={`/strategies/${slug}`} className="text-gray-500 dark:text-gray-400 text-xs hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#0F1629] rounded flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="white" width="10" height="10">
                  <rect x="2" y="2" width="6" height="6" rx="1" />
                  <rect x="12" y="2" width="6" height="6" rx="1" />
                  <rect x="2" y="12" width="6" height="6" rx="1" />
                  <rect x="12" y="12" width="6" height="6" rx="1" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">Jake Joseph</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-3">
              Professional-grade options tools. Free, no signup required.
            </p>
            <a
              href="https://github.com/jakejoseph"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed">
            <strong className="text-gray-600 dark:text-gray-400">Disclaimer:</strong> All calculators and content are for educational purposes only and do not constitute investment advice. Options trading involves substantial risk of loss and is not suitable for all investors. © 2026 Jake Joseph.
          </p>
        </div>
      </div>
    </footer>
  );
}
