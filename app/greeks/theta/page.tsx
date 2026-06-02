"use client";

import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function ThetaPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Option Greeks</span>
        <span>›</span>
        <span className="text-gray-800">Theta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Theta (Θ) — Time Decay Explained</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">For Buyers</p>
          <p className="text-2xl font-bold text-red-500">Negative</p>
          <p className="text-xs text-gray-400 mt-1">value erodes daily</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">For Sellers</p>
          <p className="text-2xl font-bold text-green-600">Positive</p>
          <p className="text-xs text-gray-400 mt-1">time works in your favor</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Accelerates After</p>
          <p className="text-2xl font-bold text-orange-500">30 DTE</p>
          <p className="text-xs text-gray-400 mt-1">decay curve steepens</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is Theta?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Theta measures the daily dollar amount an option loses due to the passage of time, all else equal. It is the cost of holding a long option — and the income earned by holding a short option. Every morning you wake up, your long options are worth slightly less than the night before. That erosion is theta.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        Theta is expressed as a negative number for long options (e.g., −$0.08 means the option loses $0.08 per day) and a positive number for short options. The decay is not linear — it accelerates significantly in the final 30 days before expiration, following a curve that drops steeply as the option approaches its expiration date.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade — Theta in Action</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">Short Put — Positive Theta Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Sell the <strong>$95 put</strong> on a $100 stock for <strong>$2.00</strong> (30 DTE)</li>
          <li>• Theta = <strong>+$0.07/day</strong></li>
          <li>• After 10 days (stock unchanged): option worth ~<strong>$1.30</strong></li>
          <li>• After 20 days (stock unchanged): option worth ~<strong>$0.60</strong></li>
          <li>• At expiration: if stock above $95, option expires worthless → <strong>$200 profit</strong></li>
          <li>• Theta accelerates in the last 10 days — decay is fastest near expiry</li>
        </ul>
      </div>

      <InlineCTA
        heading="Put theta to work for you"
        body="Sell premium and collect time decay. Open a live account and trade defined-risk income strategies."
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Why Theta Accelerates Near Expiration</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        An option's value is made up of intrinsic value (how far in the money it is) and extrinsic value (time premium). Theta erodes the extrinsic value. With 60 days remaining, there is a lot of time for the stock to move in your favor — so the extrinsic premium is high. With 5 days remaining, there is very little time left, so the extrinsic value collapses rapidly.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        This is why income traders — who run strategies like covered calls, cash-secured puts, and iron condors — prefer to sell options in the 30–45 DTE range. They are in the "sweet spot" where theta decay is meaningful but the gamma risk of being very close to expiration has not yet peaked.
      </p>

      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 mb-8">
        <p className="font-semibold text-yellow-800 mb-2">⚡ Theta-Vega Tradeoff</p>
        <p className="text-yellow-700 text-sm leading-relaxed">
          Theta and Vega move in opposite directions. High-IV environments produce high theta (more premium to collect) but also high vega risk (IV can crush against you if it falls). Low-IV environments have low theta but relatively cheap options to buy. Understanding this tradeoff is essential for choosing the right strategy.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Strategies That Profit From Theta</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {[
          { name: "Covered Call", desc: "Sell a call against stock you own. Collect premium that decays toward zero.", link: "/calculators/wheel-strategy" },
          { name: "Cash-Secured Put", desc: "Sell an OTM put. If the stock stays flat or rises, you keep the full premium.", link: "/calculators/wheel-strategy" },
          { name: "Iron Condor", desc: "Sell OTM call spread + put spread. Profit from the stock staying in a range.", link: "/calculators/black-scholes" },
          { name: "Short Strangle", desc: "Sell OTM call and put. Maximum theta capture, but undefined risk.", link: "/calculators/earnings-straddle" },
        ].map((s) => (
          <Link key={s.name} href={s.link} className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
            <p className="font-semibold text-gray-900 group-hover:text-blue-700 text-sm mb-1">{s.name}</p>
            <p className="text-gray-500 text-xs">{s.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Things to Remember About Theta</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Theta is the rent you pay", "Every day you hold a long option, time decay costs you money — even if the stock doesn't move."],
          ["Sellers collect theta", "Short options positions earn theta daily. It's why many professionals prefer selling premium."],
          ["Decay is non-linear", "Theta is slow early and fast late. The last 2 weeks before expiry see the steepest decay."],
          ["ATM options decay fastest", "In dollar terms, ATM options have the highest theta because they have the most extrinsic value."],
          ["Weekends count", "Options lose ~3 days of theta over the weekend (Friday close to Monday open)."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <p className="text-gray-500 text-sm mb-8">
        Want to visualize exactly how theta decays for a specific option?{" "}
        <Link href="/calculators/theta-decay" className="text-blue-600 hover:underline font-medium">
          Use our interactive Theta Decay Visualizer →
        </Link>
      </p>

      <EmailCapture />
      <RelatedCalculators currentSlug="theta-decay" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> This content is for educational purposes only and does not constitute investment advice. Options trading involves substantial risk and is not appropriate for all investors.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
