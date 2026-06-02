"use client";

import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";

export default function DeltaPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Option Greeks</span>
        <span>›</span>
        <span className="text-gray-800">Delta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Delta (Δ) — The Options Greek Explained</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      {/* Hero card */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Call Delta Range</p>
          <p className="text-2xl font-bold text-green-600">0 to +1</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Put Delta Range</p>
          <p className="text-2xl font-bold text-red-500">−1 to 0</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ATM Delta (approx)</p>
          <p className="text-2xl font-bold text-blue-600">±0.50</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is Delta?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Delta is the most widely used of the five options Greeks. It measures how much an option's price changes for every <strong>$1 move in the underlying stock</strong>. A call option with a delta of 0.50 will gain approximately $0.50 in value if the stock rises $1, and lose $0.50 if the stock falls $1.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        Delta has a dual role: it is both a sensitivity measure and a rough probability estimate. A delta of 0.30 means the option gains $0.30 per $1 stock move <em>and</em> suggests roughly a 30% chance the option expires in the money.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Delta by Moneyness</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Moneyness</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Call Delta</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Put Delta</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Behavior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ["Deep ITM", "~0.90–1.00", "~−0.90 to −1.00", "Moves almost like the stock"],
              ["At the Money (ATM)", "~0.50", "~−0.50", "50/50 — reacts to every move"],
              ["Slightly OTM", "~0.30–0.45", "~−0.30 to −0.45", "Moderate sensitivity"],
              ["Far OTM", "~0.05–0.15", "~−0.05 to −0.15", "Lottery ticket — rarely moves"],
            ].map(([m, c, p, b]) => (
              <tr key={m} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{m}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">{c}</td>
                <td className="px-4 py-3 text-red-500 font-semibold">{p}</td>
                <td className="px-4 py-3 text-gray-500">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InlineCTA heading="Trade with delta on your side" body="Access real-time Greeks on every options contract. Open a live account in minutes." />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Example Trade — Delta in Action</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">Long Call — Delta Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Stock trading at <strong>$100</strong></li>
          <li>• Buy the <strong>$105 call</strong> (slightly OTM) for <strong>$2.00</strong></li>
          <li>• Delta = <strong>0.35</strong></li>
          <li>• Stock rises $5 → option gains ~<strong>$1.75</strong> (0.35 × $5)</li>
          <li>• Stock falls $5 → option loses ~<strong>$1.75</strong></li>
          <li>• Note: Delta increases as the stock rises (Gamma effect), so actual gain may be slightly more</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Delta as a Position Hedge Ratio</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Professional traders use delta as a <strong>hedge ratio</strong>. If you are short one call contract with a delta of 0.40, you need to buy 40 shares of stock to be delta-neutral — meaning your position has no directional exposure to small stock moves. This is the foundation of delta hedging and market-making.
      </p>
      <p className="text-gray-600 leading-relaxed mb-8">
        Delta-neutral strategies (like iron condors and short straddles) aim to profit from time decay and volatility contraction rather than directional movement. As the stock drifts, the position's delta shifts and traders "re-hedge" by buying or selling shares.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Things to Remember About Delta</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Delta is dynamic", "It changes constantly as the stock price moves (that change is measured by Gamma)."],
          ["Call deltas are positive", "Long calls gain value when the stock rises. Short calls lose value."],
          ["Put deltas are negative", "Long puts gain value when the stock falls. Short puts lose value."],
          ["Delta ≈ Probability ITM", "A 0.20 delta option has roughly a 20% chance of expiring in the money."],
          ["Portfolio delta", "Sum all your positions' deltas to understand your total directional exposure."],
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
        <strong className="text-gray-700">Disclaimer:</strong> This content is for educational purposes only and does not constitute investment advice. Options trading involves substantial risk and is not appropriate for all investors.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
