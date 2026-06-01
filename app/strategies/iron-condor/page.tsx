import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function IronCondorPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">Iron Condor</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Iron Condor — Complete Strategy Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bias</p><p className="text-xl font-bold text-gray-800">Neutral</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Profit</p><p className="text-xl font-bold text-green-600">Net credit received</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Loss</p><p className="text-xl font-bold text-red-500">Width − credit</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best DTE</p><p className="text-xl font-bold text-blue-600">30–45 DTE</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is an Iron Condor?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">An iron condor is a four-legged options strategy where you simultaneously sell an OTM put spread and an OTM call spread. You're selling volatility on both sides — collecting premium while betting the stock stays inside a defined range through expiration.</p>
      <p className="text-gray-600 leading-relaxed mb-6">It's a defined-risk strategy — you know your exact max profit and max loss before entering. The iron condor is one of the most popular strategies for professional premium sellers because it profits from time decay on both sides and benefits from any IV contraction.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">SPY Iron Condor — 30 DTE Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• SPY at <strong>$500</strong> with 30 DTE</li>
          <li>• Sell $490 put / Buy $485 put → <strong>+$1.80 credit</strong></li>
          <li>• Sell $510 call / Buy $515 call → <strong>+$1.50 credit</strong></li>
          <li>• Total net credit: <strong>$3.30</strong> ($330 per condor)</li>
          <li>• Max profit: $330 (if SPY stays between $490–$510)</li>
          <li>• Max loss: $5.00 spread − $3.30 credit = <strong>$1.70</strong> ($170 per condor)</li>
          <li>• Breakeven range: <strong>$486.70 – $513.30</strong></li>
          <li>• Reward-to-risk: $3.30 / $1.70 = <strong>1.94:1</strong></li>
        </ul>
      </div>

      <InlineCTA heading="Find your iron condor strikes" body="Use the Expected Move calculator to identify appropriate wings for your condor based on market-implied ranges." cta="Open Expected Move →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Managing an Iron Condor</h2>
      <div className="space-y-3 mb-8">
        {[
          ["Take profit at 50%", "Close the entire condor when it reaches 50% of max profit. This is the standard rule — you've captured most of the easy theta and eliminated tail risk."],
          ["Roll tested side up/down", "If SPY threatens one of your short strikes, roll that spread further OTM for a credit. Avoid rolling for a debit."],
          ["Close at 21 DTE", "Gamma risk increases sharply in the final 3 weeks. Most professional condor traders close at 21 DTE regardless of profit."],
          ["Avoid earnings events", "A big earnings gap can immediately blow through one of your wings. Check earnings dates before entering."],
        ].map(([when, why]) => (
          <div key={when as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{when}:</strong> <span className="text-gray-600">{why}</span></span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Profit from range-bound stocks", "Iron condors win when nothing happens. They're ideal in low-volatility, directionless markets."],
          ["High POP, low reward-to-risk", "A typical condor has 70%+ probability of profit, but the max loss is often larger than max profit. Size positions accordingly."],
          ["IV is your friend on entry, enemy on exit", "Enter condors in high-IV environments when premiums are rich. Avoid entering when IV is crushed — there's no edge in selling cheap premium."],
          ["Symmetric placement vs. skewed", "You can place wings equally OTM on both sides, or skew toward puts (more premium, more downside risk) based on your market view."],
          ["Ideal on indexes, not individual stocks", "SPX, SPY, QQQ have lower gap risk and higher liquidity than single stocks. Iron condors work better on products that move smoothly."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="expected-move" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
