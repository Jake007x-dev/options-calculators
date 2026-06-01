import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function LEAPSPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">LEAPS Call</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">LEAPS Call — Long-Term Options Strategy Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bias</p><p className="text-xl font-bold text-gray-800">Strongly Bullish</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Profit</p><p className="text-xl font-bold text-green-600">Unlimited</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Loss</p><p className="text-xl font-bold text-red-500">Premium paid</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Expiration</p><p className="text-xl font-bold text-blue-600">12–24 months</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Are LEAPS?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">LEAPS (Long-term Equity Anticipation Securities) are options with expirations greater than one year. A LEAPS call on a stock you're bullish on gives you leveraged upside exposure at a fraction of the capital required to buy 100 shares outright.</p>
      <p className="text-gray-600 leading-relaxed mb-6">Because they have so much time remaining, LEAPS decay slowly relative to shorter-dated options. They have very high vega and very low theta as a percentage of their value. The primary risk is a drop in the underlying stock — not time decay — making them a more forgiving instrument for long-term directional bets.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">LEAPS as Stock Replacement</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">AAPL LEAPS vs. Buying Shares — Capital Comparison</p>
        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-3">
          <div></div>
          <div className="font-bold text-gray-700">Buy 100 Shares</div>
          <div className="font-bold text-blue-700">Buy 1 LEAPS Call</div>
        </div>
        {[
          ["Capital required", "$18,000 (100 × $180)", "$3,200 (deep ITM call)"],
          ["Delta exposure", "100 delta (1:1 with stock)", "~75–85 delta (leveraged)"],
          ["Max loss", "$18,000 (stock to zero)", "$3,200 (premium paid)"],
          ["Breakeven (2 yr)", "$180", "$180 + $32 = $212"],
          ["2-yr theta cost", "None (own shares)", "~$800 (slow decay)"],
          ["If AAPL → $240", "+$6,000 (33%)", "+$4,400 (137% on capital)"],
        ].map(([label, shares, leaps]) => (
          <div key={label} className="grid grid-cols-3 gap-3 py-2 border-t border-gray-100 text-xs">
            <span className="text-gray-700 font-medium">{label}</span>
            <span className="text-center text-gray-600">{shares}</span>
            <span className="text-center text-blue-700 font-medium">{leaps}</span>
          </div>
        ))}
      </div>

      <InlineCTA heading="Model your LEAPS position" body="Use the Black-Scholes calculator to see exact LEAPS pricing, delta, and vega at any strike and expiration." cta="Open Black-Scholes →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">LEAPS Greeks Profile</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { g: "Delta", v: "0.70–0.90", note: "Deep ITM LEAPS move almost dollar-for-dollar with the stock" },
          { g: "Theta", v: "Very Low", note: "Slow daily decay — months of runway before significant erosion" },
          { g: "Vega", v: "Extremely High", note: "A 1% IV move can change LEAPS price by $1–3+. Biggest Greek risk." },
          { g: "Rho", v: "High (for options)", note: "Long DTE means rate changes matter — rising rates help calls" },
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
          ["Buy deep ITM for stock replacement", "An 80+ delta LEAPS behaves almost like owning shares but at 15–25% of the capital. This is the stock replacement technique."],
          ["Vega is your biggest risk", "If IV drops significantly after you buy LEAPS, the position loses value even if the stock rises. Buy LEAPS when IV is low, not high."],
          ["Theta is low but non-zero", "LEAPS lose $0.50–$2/day in time value, vs. $10–30/day for short-dated options. This gives you time to be right."],
          ["Roll before the final year", "As your LEAPS approach 12 months, theta accelerates. Roll (sell and buy further out) before reaching the steep part of the decay curve."],
          ["Use LEAPS for high-conviction long-term calls", "LEAPS are best for stocks you believe in for 1–2 years. They're not for speculative short-term bets — that's what shorter-dated options are for."],
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
