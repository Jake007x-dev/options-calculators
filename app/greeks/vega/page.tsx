"use client";

import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function VegaPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Option Greeks</span>
        <span>›</span>
        <span className="text-gray-800">Vega</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Vega (ν) — Volatility Sensitivity Explained</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Always Positive</p>
          <p className="text-2xl font-bold text-blue-600">Long Options</p>
          <p className="text-xs text-gray-400 mt-1">benefit from rising IV</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Always Negative</p>
          <p className="text-2xl font-bold text-red-500">Short Options</p>
          <p className="text-xs text-gray-400 mt-1">hurt by rising IV</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Measures</p>
          <p className="text-2xl font-bold text-gray-800">$ per 1% IV</p>
          <p className="text-xs text-gray-400 mt-1">change in implied volatility</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is Vega?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Vega measures how much an option's price changes for every <strong>1% change in implied volatility (IV)</strong>. Unlike the other Greeks, vega is not a letter of the Greek alphabet — it is a term invented by options traders. But its importance is real: vega is often the dominant driver of option price changes around earnings announcements and market events.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        When implied volatility rises (fear increases), all options become more expensive — both calls and puts. When IV falls (fear subsides, often after an earnings report), options lose value rapidly. This IV collapse is called a "volatility crush," and it is one of the most common ways options buyers lose money even when they correctly predict the direction of the stock.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade — Vega in Action</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">Long Straddle into Earnings — Vega Risk</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Stock at <strong>$150</strong>, earnings tomorrow</li>
          <li>• Buy ATM straddle for <strong>$8.00</strong> (IV = 60%)</li>
          <li>• Vega = <strong>$0.18</strong> per 1% IV change</li>
          <li>• Stock moves up $10 ✓ — but IV drops from 60% → 25% after earnings</li>
          <li>• IV crush = −35% × $0.18 = <strong>−$6.30</strong> in vega loss</li>
          <li>• Net result: stock moved your way but you still lost money due to IV collapse</li>
          <li>• This is why buying options into earnings is high-risk even with correct direction</li>
        </ul>
      </div>

      <InlineCTA
        heading="Trade volatility intelligently"
        body="Use our Implied Volatility calculator to find rich vs. cheap options before you trade."
        cta="Try the IV Calculator →"
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">IV Rank and Vega Strategy</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Sophisticated traders don&apos;t just look at IV in isolation — they use <strong>IV Rank (IVR)</strong>, which compares current IV to the past 52-week range. An IVR above 50 means IV is elevated relative to recent history, suggesting options are expensive. An IVR below 30 means options are cheap.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-bold text-green-800 mb-2">High IV Rank (&gt;50) — Sell Vega</p>
          <p className="text-green-700 text-sm leading-relaxed">Options are expensive. Consider selling premium strategies: iron condors, short strangles, covered calls. You collect inflated vega and profit if IV reverts lower.</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="font-bold text-blue-800 mb-2">Low IV Rank (&lt;30) — Buy Vega</p>
          <p className="text-blue-700 text-sm leading-relaxed">Options are cheap. Consider buying strategies: long calls, long puts, debit spreads, straddles. If IV expands, your options gain value even without a large stock move.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Vega vs. Time to Expiration</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Vega is highest for <strong>longer-dated options</strong> (LEAPS and 60+ DTE) because there is more time for volatility to manifest as actual stock movement. Short-dated options have low vega — a 1% IV change doesn&apos;t matter much when there are only 5 days left.
      </p>
      <p className="text-gray-600 leading-relaxed mb-8">
        This creates an interesting tradeoff: 0DTE traders face enormous gamma risk but almost no vega risk. LEAPS traders face enormous vega risk but very low gamma risk. Choosing the right expiration is fundamentally about choosing which Greek risk you want to manage.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Things to Remember About Vega</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Vega is not a Greek letter", "It's a trader-coined term for volatility sensitivity — but it's treated like a Greek in practice."],
          ["Both calls and puts have positive vega", "Rising IV benefits all long options, regardless of direction."],
          ["IV crush destroys option buyers", "After earnings, IV often collapses 30–60%. This is the biggest trap for new options traders."],
          ["Longer DTE = higher vega", "LEAPS are the most sensitive to IV changes. Short-dated options have minimal vega."],
          ["Check IV Rank before trading", "Never buy or sell options without knowing whether IV is historically high or low."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <p className="text-gray-500 text-sm mb-8">
        Want to back-solve for implied volatility from a real option price?{" "}
        <Link href="/calculators/implied-volatility" className="text-blue-600 hover:underline font-medium">
          Use our Implied Volatility Calculator →
        </Link>
      </p>

      <EmailCapture />
      <RelatedCalculators currentSlug="implied-volatility" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> This content is for educational purposes only and does not constitute investment advice. Options trading involves substantial risk and is not appropriate for all investors.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
