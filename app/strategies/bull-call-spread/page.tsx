import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function BullCallSpreadPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">Bull Call Spread</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Bull Call Spread — Complete Strategy Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bias</p><p className="text-xl font-bold text-gray-800">Bullish</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Profit</p><p className="text-xl font-bold text-green-600">Width − debit paid</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Loss</p><p className="text-xl font-bold text-red-500">Debit paid</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best DTE</p><p className="text-xl font-bold text-blue-600">30–60 DTE</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is a Bull Call Spread?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">A bull call spread (also called a debit call spread or vertical call spread) involves buying a call at one strike and simultaneously selling a call at a higher strike, same expiration. You pay a net debit upfront. The sold call reduces your cost and your maximum upside.</p>
      <p className="text-gray-600 leading-relaxed mb-6">It's a defined-risk alternative to buying a straight call — you give up potential gains above your short strike in exchange for a lower breakeven and lower capital at risk. Ideal when you're bullish but want to avoid paying full price for a call.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">NVDA Bull Call Spread — 45 DTE Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• NVDA at <strong>$130</strong>, expecting a move to $145 by next month</li>
          <li>• Buy the <strong>$130 call</strong> for $6.50</li>
          <li>• Sell the <strong>$140 call</strong> for $3.20</li>
          <li>• Net debit: <strong>$3.30</strong> ($330 per spread)</li>
          <li>• Max profit: $10 − $3.30 = <strong>$6.70</strong> ($670) if NVDA ≥ $140 at expiration</li>
          <li>• Max loss: <strong>$3.30</strong> ($330) if NVDA ≤ $130 at expiration</li>
          <li>• Breakeven: <strong>$133.30</strong></li>
          <li>• Reward-to-risk: <strong>2.03:1</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Bull Call Spread vs. Long Call</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-bold text-gray-800 mb-2">Long Call at $130</p>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Cost: <strong>$6.50</strong> ($650)</li>
            <li>• Breakeven: <strong>$136.50</strong></li>
            <li>• Unlimited upside above breakeven</li>
            <li>• Higher capital required, higher theta exposure</li>
          </ul>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-bold text-green-800 mb-2">Bull Call Spread $130/$140</p>
          <ul className="space-y-1 text-sm text-green-700">
            <li>• Cost: <strong>$3.30</strong> ($330) — 49% cheaper</li>
            <li>• Breakeven: <strong>$133.30</strong> — 3.2 pts lower</li>
            <li>• Capped at $140 — fine if that's your target</li>
            <li>• Lower theta decay due to sold call hedge</li>
          </ul>
        </div>
      </div>

      <InlineCTA heading="Price your bull call spread" body="Use the Black-Scholes calculator to get exact call prices at any strike and model your spread's P&L." cta="Open Black-Scholes →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Know your target price before entering", "The spread caps your gains at the short strike. If you think the stock will run to $160, a $130/$140 spread leaves too much profit on the table."],
          ["Wider spreads = more reward, more risk", "A $130/$150 spread costs more but has higher max profit. A $130/$135 spread is cheap but limited. Width defines the trade-off."],
          ["Best in low-to-moderate IV environments", "Debit spreads benefit from lower IV (cheaper to enter). High IV makes the long call expensive even after the hedge."],
          ["Theta works against you (but less than a straight long)", "You're long theta-negative calls, but the short call partially offsets decay. Still, time hurts you if the stock doesn't move."],
          ["Ideal reward-to-risk is 1.5:1 or better", "Don't pay $4 to make $1. Structure spreads where your max profit is meaningfully larger than your max loss."],
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
