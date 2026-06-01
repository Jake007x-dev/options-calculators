"use client";

import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function RhoPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <span className="text-gray-800">Option Greeks</span>
        <span>›</span>
        <span className="text-gray-800">Rho</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Rho (ρ) — Interest Rate Sensitivity Explained</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Calls</p>
          <p className="text-2xl font-bold text-green-600">Positive ρ</p>
          <p className="text-xs text-gray-400 mt-1">gain value as rates rise</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Puts</p>
          <p className="text-2xl font-bold text-red-500">Negative ρ</p>
          <p className="text-xs text-gray-400 mt-1">lose value as rates rise</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Matters Most For</p>
          <p className="text-2xl font-bold text-gray-800">LEAPS</p>
          <p className="text-xs text-gray-400 mt-1">long-dated options</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is Rho?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Rho measures how much an option&apos;s price changes for every <strong>1% change in the risk-free interest rate</strong>. It is typically the least significant of the five Greeks for short-term traders, but it becomes meaningful for long-dated options (LEAPS with 1–2 year expirations) and in volatile rate environments like 2022–2024.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        The intuition: when interest rates are high, the cost of carrying cash to buy stock increases. This makes call options (which give you leveraged stock exposure without tying up full capital) relatively more attractive — so calls gain value when rates rise. Puts work in reverse.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Trade — Rho in Action</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">Long Call LEAPS — Rho Example</p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Buy a <strong>2-year LEAPS call</strong> on a $150 stock</li>
          <li>• Option price: <strong>$18.00</strong>, Rho = <strong>$0.22</strong></li>
          <li>• Fed raises rates by <strong>1%</strong> (100 basis points)</li>
          <li>• Call gains approximately <strong>$0.22</strong> from rho alone</li>
          <li>• Fed cuts rates by 1% → call loses ~$0.22</li>
          <li>• Over a 2-year horizon, multiple rate changes can add up to meaningful rho impact</li>
        </ul>
      </div>

      <InlineCTA
        heading="Model rho with our Black-Scholes calculator"
        body="See how interest rate changes affect your options positions in real time."
        cta="Open the Calculator →"
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">When Does Rho Actually Matter?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        For most retail traders running 30–60 DTE positions, rho is nearly irrelevant. A 0.25% rate change on a 45-day option moves the price by pennies. However, rho deserves attention in these specific situations:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { when: "Trading LEAPS (1–2 years)", why: "Rho compounds over time. A 2% rate move on a 2-year call can change the option price by $0.40–$1.00+." },
          { when: "Fed meeting days", why: "Rate decisions can move IV dramatically, and the rho impact is realized instantly on long-dated options." },
          { when: "High interest rate environments", why: "When rates are at 5%+, the carry cost of stock ownership is significant and call options become relatively more valuable." },
          { when: "Portfolio-level hedging", why: "Institutional desks hedge rho exposure across large option books to avoid rate sensitivity at the portfolio level." },
        ].map((row) => (
          <div key={row.when} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{row.when}:</strong> <span className="text-gray-600">{row.why}</span></span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-8">
        <p className="font-semibold text-gray-800 mb-3">Rho vs. Other Greeks — Relative Importance</p>
        <div className="space-y-2">
          {[
            { greek: "Delta", importance: 95, color: "bg-blue-500" },
            { greek: "Gamma", importance: 80, color: "bg-orange-400" },
            { greek: "Theta", importance: 85, color: "bg-red-400" },
            { greek: "Vega", importance: 75, color: "bg-purple-400" },
            { greek: "Rho", importance: 20, color: "bg-gray-400" },
          ].map((g) => (
            <div key={g.greek} className="flex items-center gap-3 text-sm">
              <span className="w-12 text-gray-600 font-medium">{g.greek}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`${g.color} h-2 rounded-full`} style={{ width: `${g.importance}%` }} />
              </div>
              <span className="text-gray-400 text-xs w-10 text-right">{g.importance}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Relative importance for a typical 30–45 DTE retail options trade</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Things to Remember About Rho</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Usually the least important Greek", "For short-dated options, rho is negligible compared to delta, theta, and vega."],
          ["Calls benefit from rising rates", "Higher rates make owning calls more attractive vs. buying stock outright."],
          ["Puts are hurt by rising rates", "Higher rates reduce the present value of the downside protection a put provides."],
          ["LEAPS traders must watch it", "On 2-year options, a full 1% rate move can meaningfully change the option's price."],
          ["Fed watching becomes relevant", "If you hold long-dated options, pay attention to FOMC meetings and rate forecasts."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <p className="text-gray-500 text-sm mb-8">
        See rho alongside all other Greeks for any option setup with our{" "}
        <Link href="/calculators/black-scholes" className="text-blue-600 hover:underline font-medium">
          Black-Scholes Pricing Calculator →
        </Link>
      </p>

      <EmailCapture />
      <RelatedCalculators currentSlug="black-scholes" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> This content is for educational purposes only and does not constitute investment advice. Options trading involves substantial risk and is not appropriate for all investors.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
