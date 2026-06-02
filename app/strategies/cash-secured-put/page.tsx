import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function CashSecuredPutPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">Cash-Secured Put</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Cash-Secured Put — Complete Strategy Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bias</p><p className="text-xl font-bold text-gray-800">Neutral / Bullish</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Profit</p><p className="text-xl font-bold text-green-600">Premium collected</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Loss</p><p className="text-xl font-bold text-red-500">Strike − premium</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best DTE</p><p className="text-xl font-bold text-blue-600">21–45 DTE</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is a Cash-Secured Put?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">A cash-secured put means you sell a put option while holding enough cash in your account to buy the shares if the put is exercised (assigned). The "cash-secured" part means you're not using margin — you have the buying power reserved.</p>
      <p className="text-gray-600 leading-relaxed mb-6">Think of it as getting paid to wait to buy a stock at your target price. If the stock stays above your strike, the put expires worthless and you keep the premium. If it falls below your strike, you're obligated to buy 100 shares — but at a lower effective price than today (strike minus premium received).</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">SPY Cash-Secured Put — Income + Entry Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• SPY trading at <strong>$500</strong>, want to own it at $490 or below</li>
          <li>• Sell the <strong>$490 put</strong> (30 DTE) for <strong>$3.20</strong></li>
          <li>• Collect <strong>$320</strong> immediately, reserve <strong>$49,000</strong> in cash</li>
          <li>• Break-even: <strong>$486.80</strong> ($490 − $3.20)</li>
          <li>• Scenario A — SPY stays above $490: put expires, keep $320, sell again</li>
          <li>• Scenario B — SPY falls to $485: assigned 100 shares at $490, effective cost basis = <strong>$486.80</strong></li>
          <li>• Now switch to selling covered calls on the position (Wheel Strategy)</li>
        </ul>
      </div>

      <InlineCTA heading="Calculate your CSP income" body="Model your annualized yield and effective cost basis with the Wheel Strategy calculator." cta="Open Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">CSP vs. Limit Buy Order</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-bold text-gray-800 mb-2">Limit Buy Order at $490</p>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• You get filled only if stock hits $490</li>
            <li>• You collect <strong>zero premium</strong> while waiting</li>
            <li>• Stock never hits $490: you miss the entry and earn nothing</li>
            <li>• No compensation for time spent waiting</li>
          </ul>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-bold text-green-800 mb-2">Cash-Secured Put at $490</p>
          <ul className="space-y-1 text-sm text-green-700">
            <li>• Stock stays above $490: you keep the $320 premium</li>
            <li>• Stock hits $490: you buy at $486.80 effective (better than limit)</li>
            <li>• You get paid regardless of whether the stock hits your price</li>
            <li>• Repeatable every 30–45 days</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Only sell puts on stocks you want to own", "If assigned, you'll hold 100 shares. Never sell a CSP on a stock you wouldn't want to own at the strike."],
          ["The premium reduces your cost basis", "Your effective entry price is always strike minus premium — better than a limit order at the same strike."],
          ["Strike selection defines your trade-off", "ATM CSPs collect more premium but have higher assignment probability. OTM CSPs are lower-POP but more income if stock stays flat."],
          ["Assignment isn't a loss", "Being assigned just means you bought the stock at a good price. Then you pivot to selling covered calls."],
          ["This is Phase 1 of the Wheel", "CSP → assignment → covered call is the full income cycle. The best traders view assignment as an opportunity, not a problem."],
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
