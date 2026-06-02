import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function ProtectivePutPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">Protective Put</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Protective Put — Portfolio Insurance Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bias</p><p className="text-xl font-bold text-gray-800">Bullish + Hedged</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Profit</p><p className="text-xl font-bold text-green-600">Unlimited (stock − premium)</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Loss</p><p className="text-xl font-bold text-red-500">Stock − strike + premium</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best DTE</p><p className="text-xl font-bold text-blue-600">60–180 DTE</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is a Protective Put?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">A protective put means you own 100 shares of stock and buy a put option against them. The put acts as insurance — if the stock falls sharply, your put gains value and limits how much money you can lose. You keep all the upside of owning the shares minus the cost of the put.</p>
      <p className="text-gray-600 leading-relaxed mb-6">The protective put is the simplest and most intuitive hedge in options. It's equivalent to buying term life insurance for your stock position. You pay a premium (the put cost) in exchange for a guaranteed floor on your losses.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">MSFT Protective Put — Hedging a Long Position</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Own <strong>100 shares of MSFT</strong> at $420/share ($42,000 total)</li>
          <li>• Buy the <strong>$400 put</strong> (90 DTE) for <strong>$8.50</strong></li>
          <li>• Put cost: <strong>$850</strong> (2% of position value)</li>
          <li>• Max loss is now capped: $420 − $400 + $8.50 = <strong>$28.50/share ($2,850)</strong></li>
          <li>• Without the put, max loss is full $42,000 (if MSFT went to zero)</li>
          <li>• Scenario — MSFT falls 20% to $336: put worth $64, shares lose $84 → net loss only <strong>$28.50</strong></li>
          <li>• Scenario — MSFT rises to $450: put expires worthless, keep full gain minus $8.50 premium</li>
        </ul>
      </div>

      <InlineCTA heading="Price your protective put" body="Use the Black-Scholes calculator to find the cost of puts at different strikes and expirations for your position." cta="Open Black-Scholes →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">When to Buy a Protective Put</h2>
      <div className="space-y-3 mb-8">
        {[
          ["Before earnings on a concentrated position", "You're long a big winner but don't want to miss potential further upside. Buy a put to sleep through the report."],
          ["When IV is low", "Protective puts are cheap when IV is low. Buying insurance when it's cheap (low IV) and selling covered calls when it's expensive (high IV) is the professional approach."],
          ["Tax reasons prevent you from selling", "You have large unrealized gains on shares you can't sell without a tax event. A protective put locks in most of the gains without triggering capital gains tax."],
          ["Portfolio protection before macro events", "Fed decisions, elections, or economic data releases can cause sharp swings. Buying index puts (SPX/SPY) protects the whole portfolio."],
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
          ["The put IS the insurance", "Think of the premium as an insurance premium. You're buying protection against a specific downside scenario."],
          ["Strike = deductible", "A lower strike = cheaper put but more potential loss before protection kicks in (higher deductible). Higher strike = more expensive but tighter protection."],
          ["Longer DTE is usually worth the extra cost", "Buying 90–120 DTE protects through more potential catalysts and has less theta decay percentage-wise than 30 DTE."],
          ["Pair with covered calls to offset cost", "Selling covered calls on your position generates premium that partially or fully pays for the protective put — this is called a collar."],
          ["Don't over-insure", "Buying very expensive puts on every position eats returns. Be selective — hedge when IV is cheap and the risk is real, not every week."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="black-scholes" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
