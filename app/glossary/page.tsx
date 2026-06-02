import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Options Trading Glossary — 45+ Terms Explained",
  description: "Complete options trading glossary: implied volatility, Greeks, strategies, and more. Plain-English definitions for every major options concept.",
};

const TERMS: { term: string; def: string; link?: string }[] = [
  { term: "At-the-Money (ATM)", def: "An option whose strike price equals (or is very close to) the current stock price. ATM options have the highest extrinsic value and the highest gamma." },
  { term: "Assignment", def: "When an option seller is obligated to fulfill the contract — deliver shares (calls) or buy shares (puts) — because the buyer exercised." },
  { term: "Bid-Ask Spread", def: "The difference between the highest price a buyer will pay (bid) and the lowest price a seller will accept (ask). Wide spreads mean higher trading costs." },
  { term: "Black-Scholes Model", def: "The mathematical model used to price European options. Takes stock price, strike, time, volatility, and interest rate as inputs. The foundation of modern options pricing.", link: "/calculators/black-scholes" },
  { term: "Break-Even Price", def: "The stock price at expiration where an options position neither profits nor loses. For a long call: strike + premium paid. For a long put: strike − premium paid." },
  { term: "Bull Call Spread", def: "A debit spread: buy a lower-strike call, sell a higher-strike call. Defined max profit and loss. Profits from a moderate upward move.", link: "/strategies/bull-call-spread" },
  { term: "Call Option", def: "A contract giving the buyer the right (not obligation) to buy 100 shares at the strike price on or before expiration. Buyers pay a premium; sellers collect it." },
  { term: "Cash-Secured Put (CSP)", def: "Selling a put option while holding enough cash to buy the shares if assigned. An income strategy that also lets you acquire stock at a discount.", link: "/strategies/cash-secured-put" },
  { term: "Collar", def: "Owning stock + buying a protective put + selling a covered call. Limits both upside and downside. Common in portfolios needing downside protection." },
  { term: "Covered Call", def: "Selling a call option against 100 shares you own. Generates income but caps your upside. The most widely used options income strategy.", link: "/strategies/covered-call" },
  { term: "Credit Spread", def: "Selling one option and buying another at a different strike, collecting a net premium. Max profit is the premium collected. Max loss is the spread width minus premium." },
  { term: "Days to Expiration (DTE)", def: "The number of calendar days until an option expires. Shorter DTE means faster theta decay. Income traders often target 30–45 DTE for optimal time premium." },
  { term: "Debit Spread", def: "Buying one option and selling another at a different strike, paying a net premium. Defined-risk, defined-reward structure with lower cost than a straight long option." },
  { term: "Delta (Δ)", def: "How much the option's price moves per $1 move in the stock. Calls: 0 to +1. Puts: 0 to −1. ATM options have a delta near ±0.50.", link: "/greeks/delta" },
  { term: "Early Exercise", def: "Exercising an American-style option before its expiration date. Rarely optimal for calls (forfeits time value). More common for puts to capture intrinsic value." },
  { term: "Earnings Play", def: "An options strategy entered before an earnings announcement to profit from (or against) the expected post-earnings move.", link: "/calculators/earnings-straddle" },
  { term: "Expected Move", def: "The options market's implied 1-standard-deviation range for a stock over a given period. Roughly equals the ATM straddle price. 68% probability of ending inside the range.", link: "/calculators/expected-move" },
  { term: "Extrinsic Value", def: "The portion of an option's price above its intrinsic value. Also called time value or volatility premium. It decays to zero at expiration." },
  { term: "Gamma (Γ)", def: "The rate of change of delta per $1 move in the stock. Always positive for long options. Highest for ATM options near expiration — the source of explosive 0DTE moves.", link: "/greeks/gamma" },
  { term: "Gamma Squeeze", def: "A feedback loop where rising stock prices force dealers who sold calls to buy more shares to hedge their delta, pushing the price higher and forcing more buying." },
  { term: "Hedge Ratio", def: "The number of shares needed to offset the delta of an options position. A delta-neutral position has a hedge ratio of 1. Used by market makers to manage directional risk." },
  { term: "Historical Volatility (HV)", def: "The actual realized price movement of a stock over a past period (typically 20 or 30 days), annualized. Compare to IV to determine if options are cheap or expensive." },
  { term: "Implied Volatility (IV)", def: "The market's forward-looking expectation of how much a stock will move, derived by back-solving Black-Scholes from current option prices. Rises with fear, falls after events.", link: "/calculators/implied-volatility" },
  { term: "In-the-Money (ITM)", def: "An option with intrinsic value. A call is ITM when the stock is above the strike. A put is ITM when the stock is below the strike. ITM options have higher deltas." },
  { term: "Intrinsic Value", def: "The real, exercisable value of an option. For a call: max(0, stock − strike). For a put: max(0, strike − stock). Deep ITM options are mostly intrinsic value." },
  { term: "Iron Condor", def: "Selling an OTM put spread and an OTM call spread simultaneously. Profits from the stock staying in a range. Defined risk on both sides.", link: "/strategies/iron-condor" },
  { term: "IV Crush", def: "A sharp drop in implied volatility after a binary event (earnings, FDA decision). Options buyers can lose money even with a correct directional bet if IV collapses." },
  { term: "IV Rank (IVR)", def: "Current IV relative to its 52-week high/low, expressed as a percentage (0–100). IVR above 50 = options expensive (sell premium). Below 30 = options cheap (buy premium)." },
  { term: "LEAPS", def: "Long-term Equity Anticipation Securities — options with expirations greater than 1 year. High vega, low theta relative to shorter-dated options. Popular for long directional bets.", link: "/strategies/leaps" },
  { term: "Long Call", def: "Buying a call option. Unlimited upside, limited loss to premium paid. Requires the stock to move significantly higher to profit after accounting for time decay." },
  { term: "Long Put", def: "Buying a put option. Profits if the stock falls below the strike by more than the premium paid. A bearish position with defined risk." },
  { term: "Max Loss", def: "The most money you can lose on a trade. For long options: the premium paid. For short options without hedges: theoretically unlimited. For spreads: the spread width minus credit." },
  { term: "Max Profit", def: "The most money a trade can return. For long calls: unlimited. For credit spreads: the premium collected. For iron condors: the total net credit received." },
  { term: "Moneyness", def: "The relationship between a stock's price and an option's strike. Deep ITM, slightly ITM, ATM, slightly OTM, and deep OTM describe how far an option is from the current price." },
  { term: "Open Interest", def: "The total number of outstanding option contracts that have not been settled or closed. High OI indicates liquidity. A spike in OI can signal institutional positioning." },
  { term: "Out-of-the-Money (OTM)", def: "An option with no intrinsic value. A call is OTM when stock < strike. A put is OTM when stock > strike. OTM options are cheaper and require larger moves to profit." },
  { term: "Pin Risk", def: "The risk that a stock closes exactly at the strike on expiration. The option seller doesn't know if they'll be assigned, creating uncertainty over the weekend." },
  { term: "Premium", def: "The price paid by the option buyer and received by the option seller. It's the sum of intrinsic value and extrinsic value. Sellers want it to go to zero; buyers want it to rise." },
  { term: "Probability of Profit (POP)", def: "The estimated probability that a trade will close for a profit. For credit strategies, POP approximately equals 1 minus the option's delta. Higher POP usually means lower reward-to-risk." },
  { term: "Protective Put", def: "Buying a put against shares you own. Acts as portfolio insurance — limits downside in exchange for the premium paid.", link: "/strategies/protective-put" },
  { term: "Put Option", def: "A contract giving the buyer the right to sell 100 shares at the strike price on or before expiration. Buyers profit if the stock falls; sellers collect premium expecting stability." },
  { term: "Rho (ρ)", def: "How much an option's price changes per 1% change in the risk-free interest rate. Matters most for LEAPS. Usually the least important Greek for short-term traders.", link: "/greeks/rho" },
  { term: "Strike Price", def: "The fixed price at which an option can be exercised. Calls profit above the strike; puts profit below. Strike selection is one of the most important decisions in options trading." },
  { term: "Synthetic Position", def: "Replicating the payoff of a stock or option position using other instruments. A synthetic long stock = buy call + sell put at same strike and expiration." },
  { term: "Theta (Θ)", def: "The daily dollar amount an option loses due to time passing. Always negative for buyers (cost), positive for sellers (income). Accelerates sharply in the final 30 DTE.", link: "/greeks/theta" },
  { term: "Time Value", def: "Same as extrinsic value. The portion of an option's price that reflects time remaining and volatility premium. Falls to zero at expiration regardless of stock price." },
  { term: "Undefined Risk", def: "A position where max loss is theoretically unlimited. Naked calls and short strangles without hedges are undefined risk. High premium, but requires significant margin." },
  { term: "Vega (ν)", def: "How much an option's price changes per 1% move in implied volatility. Long options have positive vega (benefit from rising IV). Short options have negative vega.", link: "/greeks/vega" },
  { term: "Vertical Spread", def: "Buying and selling options of the same type (both calls or both puts) at different strikes, same expiration. Reduces cost and caps both profit and loss." },
  { term: "Volatility Crush", def: "See IV Crush — the rapid drop in implied volatility after an anticipated event resolves. The single most common reason options buyers lose money into earnings." },
  { term: "Wheel Strategy", def: "Systematically selling cash-secured puts until assigned, then selling covered calls on the shares until called away, then repeating. An income-generation cycle.", link: "/strategies/wheel" },
  { term: "0DTE", def: "Zero days to expiration — options expiring the same day. Extreme gamma, very low vega. Popular for intraday speculation on SPX and SPY. High risk, binary-like payoffs." },
];

const allLetters = TERMS.map((t) => t.term[0]);
const letters = allLetters.filter((l, i) => allLetters.indexOf(l) === i).sort();

export default function GlossaryPage() {
  return (
    <main className="flex-1 min-w-0 px-6 py-10 pb-24">
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Options Glossary</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Options Trading Glossary</h1>
      <p className="text-gray-500 text-lg mb-2">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>
      <p className="text-gray-500 mb-8 max-w-2xl">
        Plain-English definitions for every major options concept — from the basics to advanced Greek mechanics. Click any term to jump to related calculators or strategy guides.
      </p>

      {/* Alphabet jump nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {letters.map((l) => (
          <a key={l} href={`#${l}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
            {l}
          </a>
        ))}
      </div>

      {/* Terms */}
      <div className="space-y-1">
        {letters.map((letter) => {
          const group = TERMS.filter((t) => t.term[0] === letter);
          return (
            <div key={letter} id={letter} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{letter}</h2>
              <div className="space-y-4">
                {group.map((t) => (
                  <div key={t.term} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm mb-1">{t.term}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{t.def}</p>
                    </div>
                    {t.link && (
                      <a href={t.link} className="flex-shrink-0 text-xs text-blue-600 font-medium hover:underline whitespace-nowrap mt-0.5">
                        See calculator →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-gray-900 mb-1">Ready to put these concepts to work?</p>
          <p className="text-gray-600 text-sm">Use our free calculators to model any strategy in real time.</p>
        </div>
        <Link href="/calculators" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
          Browse All Calculators →
        </Link>
      </div>
    </main>
  );
}
