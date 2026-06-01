import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function StraddlePage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">Straddle & Strangle</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Straddle & Strangle — Complete Strategy Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bias</p><p className="text-xl font-bold text-gray-800">Volatile</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Profit</p><p className="text-xl font-bold text-green-600">Unlimited</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Loss</p><p className="text-xl font-bold text-red-500">Total premium paid</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best DTE</p><p className="text-xl font-bold text-blue-600">Pre-earnings (1–7 DTE)</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Straddle vs. Strangle</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-bold text-gray-800 mb-2">Long Straddle</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">Buy a call AND a put at the <strong>same strike</strong> (ATM) and same expiration. More expensive, but lower breakeven distance required. Best when you expect an enormous move.</p>
          <p className="text-xs text-gray-500">Breakeven: Strike ± total premium</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-bold text-gray-800 mb-2">Long Strangle</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">Buy an OTM call and an OTM put at <strong>different strikes</strong>. Cheaper upfront, but requires a larger move to profit. More common for earnings plays.</p>
          <p className="text-xs text-gray-500">Breakeven: Lower strike − premium / Upper strike + premium</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade — Earnings Straddle</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">AAPL Earnings Straddle — Night Before Earnings</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• AAPL at <strong>$200</strong>, earnings after close today</li>
          <li>• Buy the <strong>$200 call</strong> for $4.50 + <strong>$200 put</strong> for $4.20</li>
          <li>• Total cost: <strong>$8.70</strong> per straddle ($870 total)</li>
          <li>• Upper breakeven: <strong>$208.70</strong> | Lower breakeven: <strong>$191.30</strong></li>
          <li>• Stock needs to move <strong>±4.35%</strong> to profit at expiration</li>
          <li>• Scenario A — AAPL gaps up 8% to $216: call worth ~$16, put expires → profit <strong>$730</strong></li>
          <li>• Scenario B — AAPL falls 6% to $188: put worth ~$12, call expires → profit <strong>$330</strong></li>
          <li>• Scenario C — AAPL moves only 2%: straddle loses ~$450 from IV crush</li>
        </ul>
      </div>

      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 mb-6">
        <p className="font-semibold text-yellow-800 mb-2">⚠️ The IV Crush Problem</p>
        <p className="text-yellow-700 text-sm leading-relaxed">IV before earnings on individual stocks can reach 80–120%. After the report, IV often collapses to 25–35% instantly. Even if the stock moves significantly, IV crush can wipe out most of the straddle's value. This is why buying straddles into earnings is high-risk even with correct direction.</p>
      </div>

      <InlineCTA heading="Model your earnings straddle" body="Compare the implied move to historical moves and find your exact breakeven with our Earnings Straddle calculator." cta="Open Earnings Straddle →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Straddles bet on magnitude, not direction", "You don't care which way the stock moves — you need a big move in either direction."],
          ["IV crush is the primary risk", "After earnings or events, IV collapses. Even a large move can still lose you money if the move wasn't large enough to overcome IV crush."],
          ["Compare implied move to historical moves", "Use our calculator to see what move the straddle is pricing in vs. what AAPL typically moves on earnings. Edge comes from mispriced implied moves."],
          ["Short straddles are the opposite", "Selling a straddle (short straddle) profits if the stock doesn't move much. High premium, but undefined risk if the stock gaps hard."],
          ["Exit before expiration", "Don't hold to expiration. Take profits (or cut losses) when the move has played out. The straddle loses value rapidly if IV normalizes."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="earnings-straddle" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Options trading involves substantial risk.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
