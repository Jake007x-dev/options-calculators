import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function CoveredCallPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">Covered Call</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Covered Call — Complete Strategy Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bias</p><p className="text-xl font-bold text-gray-800">Neutral / Bullish</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Profit</p><p className="text-xl font-bold text-green-600">Premium + gain to strike</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Loss</p><p className="text-xl font-bold text-red-500">Stock drops to zero</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best DTE</p><p className="text-xl font-bold text-blue-600">21–45 DTE</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is a Covered Call?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">A covered call means you own 100 shares of stock and sell one call option against them. The word "covered" means your short call is backed by shares — if the buyer exercises, you deliver the shares you already own rather than being forced to buy them at market price.</p>
      <p className="text-gray-600 leading-relaxed mb-6">You collect the option premium immediately when you sell. In exchange, you agree to sell your shares at the strike price if the stock rises above it by expiration. If the stock stays flat or falls, the call expires worthless and you keep the premium — then sell another one next month.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">AAPL Covered Call — Monthly Income Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Own <strong>100 shares of AAPL</strong> at $180/share</li>
          <li>• Sell the <strong>$185 call</strong> (30 DTE) for <strong>$2.50</strong> premium</li>
          <li>• Collect <strong>$250</strong> instantly (2.50 × 100)</li>
          <li>• Scenario A — AAPL stays below $185: call expires worthless, keep $250, sell again next month</li>
          <li>• Scenario B — AAPL rises to $190: call exercised, shares sold at $185. Total gain: $500 appreciation + $250 premium = <strong>$750</strong></li>
          <li>• Scenario C — AAPL falls to $170: call expires worthless, keep $250, but shares lose $1,000. Net loss: <strong>$750</strong> (premium partially offsets)</li>
          <li>• Annualized yield from premium alone (if repeated): ~16.7%</li>
        </ul>
      </div>

      <InlineCTA heading="Model your covered call income" body="Use the Wheel Strategy calculator to project your annualized yield across full 12-month scenarios." cta="Open Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">When to Use a Covered Call</h2>
      <div className="space-y-3 mb-8">
        {[
          ["You own the stock long-term", "Selling calls on a core holding generates income without selling shares. If called away, you can re-enter or sell puts to get back in."],
          ["The stock is range-bound", "If the stock hasn't moved much and you don't expect a big rally, selling calls harvests the IV premium efficiently."],
          ["IV is elevated", "High IV means fatter premiums. Check IV Rank — ideally above 30 before selling covered calls on a position."],
          ["You're comfortable being called away at the strike", "Only sell the strike you'd be happy selling at. Don't sell a $180 call on shares you paid $175 for unless you're fine exiting at $180."],
        ].map(([when, why]) => (
          <div key={when as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{when}:</strong> <span className="text-gray-600">{why}</span></span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Greeks Profile</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { g: "Delta", v: "Positive (long stock)", note: "~50–100 net (reduced by short call delta)" },
          { g: "Theta", v: "Positive", note: "Time works for you — the call decays toward zero" },
          { g: "Vega", v: "Negative", note: "Rising IV hurts short call; falling IV helps" },
          { g: "Gamma", v: "Negative", note: "Near expiration, stock near strike → high assignment risk" },
        ].map((row) => (
          <div key={row.g} className="bg-white border border-gray-200 rounded-xl p-3 text-sm">
            <p className="font-bold text-gray-800 mb-1">{row.g}</p>
            <p className="text-blue-700 font-semibold text-xs mb-1">{row.v}</p>
            <p className="text-gray-500 text-xs">{row.note}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["The covered call is the most beginner-friendly income strategy", "You already own the shares — you're just renting out the upside."],
          ["Strike selection is the key decision", "Selling closer to the money generates more premium but limits gains more. Further OTM means less income but more upside room."],
          ["30 DTE is the sweet spot", "You capture the steepest part of the theta curve without holding too long. Roll or re-sell each month."],
          ["Covered calls don't protect against crashes", "A big selloff still hurts you. The premium offsets only a small portion of a severe drawdown."],
          ["Pair with CSPs to run the full Wheel", "If your shares get called away, sell a cash-secured put at a lower strike to re-enter at a discount."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="wheel-strategy" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
