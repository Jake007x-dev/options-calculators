"use client";

import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";

export default function GammaPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Option Greeks</span>
        <span>›</span>
        <span className="text-gray-800">Gamma</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Gamma (Γ) — The Options Greek Explained</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Always</p>
          <p className="text-2xl font-bold text-blue-600">Positive</p>
          <p className="text-xs text-gray-400 mt-1">for long options</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Highest When</p>
          <p className="text-2xl font-bold text-orange-500">ATM</p>
          <p className="text-xs text-gray-400 mt-1">at-the-money near expiry</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Measures</p>
          <p className="text-2xl font-bold text-gray-800">Δ Change</p>
          <p className="text-xs text-gray-400 mt-1">per $1 in underlying</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is Gamma?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Gamma is the rate of change of delta. While delta tells you how much an option's price moves per $1 move in the stock, gamma tells you <strong>how much delta itself changes</strong> when the stock moves $1. It is the second-order sensitivity — the acceleration, not just the speed.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        Gamma is always positive for long options (calls and puts) and always negative for short options. A high gamma means delta can shift rapidly with stock movement — which benefits option buyers but creates risk for sellers, especially near expiration.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade — Gamma in Action</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">Long ATM Call — Gamma Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Stock at <strong>$100</strong>, buy the <strong>$100 call</strong></li>
          <li>• Delta = <strong>0.50</strong>, Gamma = <strong>0.04</strong></li>
          <li>• Stock rises $1 to $101 → new Delta = <strong>0.54</strong> (0.50 + 0.04)</li>
          <li>• Stock rises another $1 to $102 → Delta ≈ <strong>0.58</strong></li>
          <li>• The option accelerates in your favor as the stock moves up</li>
          <li>• This convexity is why buyers pay a premium — they benefit from large moves</li>
        </ul>
      </div>

      <InlineCTA heading="Trade gamma-rich strategies" body="Access real-time Greeks and live options chains. Open an account and start trading today." />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Gamma Risk for Sellers</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Short options have <strong>negative gamma</strong> — the worst-case scenario for a seller. When you sell an ATM option near expiration and the stock starts moving, your delta shifts rapidly against you. A small move in the wrong direction can turn a winning short position into a large loser very quickly.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        This is why experienced traders who sell premium (iron condors, short straddles) avoid holding positions through earnings or other binary events — the gamma risk is simply too high relative to the premium collected.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Gamma vs. Time to Expiration</h2>
      <div className="space-y-3 mb-8">
        {[
          { dte: "60+ DTE", gamma: "Low", desc: "Plenty of time — delta changes slowly. Less dramatic swings." },
          { dte: "30 DTE", gamma: "Moderate", desc: "Gamma starts picking up. Sellers collect solid premium but risk is rising." },
          { dte: "7 DTE", gamma: "High", desc: "Gamma is elevated. ATM options can flip from worthless to valuable quickly." },
          { dte: "0–1 DTE (0DTE)", gamma: "Extreme", desc: "ATM options behave almost like binary events. Delta can go 0→1 in minutes." },
        ].map((row) => (
          <div key={row.dte} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="font-bold text-gray-800 w-20 flex-shrink-0">{row.dte}</span>
            <span className={`font-semibold w-20 flex-shrink-0 ${row.gamma === "Extreme" ? "text-red-500" : row.gamma === "High" ? "text-orange-500" : row.gamma === "Moderate" ? "text-yellow-600" : "text-green-600"}`}>{row.gamma}</span>
            <span className="text-gray-600">{row.desc}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Things to Remember About Gamma</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Gamma accelerates delta", "As a stock moves toward your strike, delta increases faster and faster."],
          ["Long gamma = convexity", "Buyers benefit from large moves in either direction — it's a non-linear payoff."],
          ["Short gamma = risk near expiry", "Sellers face the most gamma risk when ATM and close to expiration."],
          ["ATM = maximum gamma", "Gamma peaks at the ATM strike and falls off on both sides."],
          ["0DTE gamma is extreme", "Same-day expiration options have enormous gamma — tiny moves cause huge delta shifts."],
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
