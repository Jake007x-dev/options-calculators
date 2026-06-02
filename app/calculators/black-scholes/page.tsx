"use client";

import { useMemo, useState } from "react";
import { blackScholes } from "@/lib/blackScholes";
import InputSlider from "@/components/calculators/InputSlider";
import InfoTooltip from "@/components/calculators/InfoTooltip";
import CTABanner from "@/components/calculators/CTABanner";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";

export default function BlackScholesPage() {
  const [stockPrice, setStockPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [dte, setDte] = useState(30);
  const [iv, setIv] = useState(25);
  const [riskFreeRate, setRiskFreeRate] = useState(5.25);
  const [divYield, setDivYield] = useState(0);

  const result = useMemo(() => {
    return blackScholes({
      S: stockPrice,
      K: strikePrice,
      T: dte / 365,
      sigma: iv / 100,
      r: riskFreeRate / 100,
      q: divYield / 100,
    });
  }, [stockPrice, strikePrice, dte, iv, riskFreeRate, divYield]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <CalcPageLayout>
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a>
        <span>›</span>
        <a href="/calculators" className="hover:text-blue-600">Calculators</a>
        <span>›</span>
        <span className="text-gray-800">Black-Scholes Pricing</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        Free Black-Scholes Option Pricing Calculator
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        By: <span className="font-medium text-gray-700">Jake Joseph</span>
        &nbsp;·&nbsp; Updated June 2026
      </p>

      {/* ── CALCULATOR WIDGET ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm mb-2 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="font-semibold text-gray-800 text-sm">Black-Scholes Options Pricing Calculator</span>
          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full">ALL GREEKS</span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">INPUTS</h2>
            <InputSlider label="Stock Price ($)" value={stockPrice} onChange={setStockPrice} min={1} max={1000} step={0.5} prefix="$" />
            <InputSlider label="Strike Price ($)" value={strikePrice} onChange={setStrikePrice} min={1} max={1000} step={0.5} prefix="$" />
            <InputSlider label="Days to Expiration" value={dte} onChange={setDte} min={1} max={730} step={1} suffix=" days" decimals={0} />
            <InputSlider label="Implied Volatility (%)" value={iv} onChange={setIv} min={1} max={200} step={0.5} suffix="%" />
            <InputSlider label="Risk-Free Rate (%)" value={riskFreeRate} onChange={setRiskFreeRate} min={0} max={15} step={0.25} suffix="%" />
            <InputSlider label="Dividend Yield (%)" value={divYield} onChange={setDivYield} min={0} max={15} step={0.1} suffix="%" />
          </div>

          {/* Outputs */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">P/L AT EXPIRATION</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-xs text-gray-500 mb-0.5">Call Price</p>
                <p className="text-2xl font-bold text-green-600">${fmt(result.callPrice)}</p>
              </div>
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-xs text-gray-500 mb-0.5">Put Price</p>
                <p className="text-2xl font-bold text-red-500">${fmt(result.putPrice)}</p>
              </div>
            </div>

            {/* Greeks grid */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                { label: "Delta (Call)", value: fmt(result.delta.call, 4), tip: "Option price move per $1 in stock" },
                { label: "Delta (Put)", value: fmt(result.delta.put, 4), tip: "Negative — put loses value as stock rises" },
                { label: "Gamma", value: fmt(result.gamma, 4), tip: "Rate of delta change per $1 stock move" },
                { label: "Theta / day", value: `$${fmt(result.theta.call, 4)}`, tip: "Daily time decay cost to the call buyer" },
                { label: "Vega / 1% IV", value: `$${fmt(result.vega, 4)}`, tip: "Value change per 1% implied volatility move" },
                { label: "Rho (Call)", value: `$${fmt(result.rho.call, 4)}`, tip: "Value change per 1% interest rate move" },
              ].map((g) => (
                <div key={g.label} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center gap-0.5">
                    {g.label}
                    <InfoTooltip content={g.tip} />
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{g.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 border-t border-gray-100">
          {[
            { label: "MAX PROFIT (CALL)", value: "Unlimited" },
            { label: "MAX LOSS (CALL)", value: `$${fmt(result.callPrice * 100)}` },
            { label: "BREAKEVEN", value: `$${fmt(strikePrice + result.callPrice)}` },
          ].map((s) => (
            <div key={s.label} className="p-3 text-center border-r border-gray-100 last:border-r-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className={`font-bold text-sm ${s.label.includes("PROFIT") ? "text-green-600" : s.label.includes("LOSS") ? "text-red-500" : "text-blue-600"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-500">
          <span className="text-gray-400 flex-shrink-0 mt-0.5">ℹ</span>
          <span>
            <strong className="text-gray-600">For educational purposes only.</strong> Results are theoretical estimates based on the Black-Scholes-Merton model and do not account for commissions, early assignment, liquidity, or real-world factors. Options involve substantial risk and are not suitable for all investors.
          </span>
        </div>
      </div>

      {/* ── EDUCATIONAL CONTENT ── */}
      <div className="mt-10 prose prose-gray max-w-none">

        <h2 className="text-2xl font-bold text-gray-900 mb-3">About the Black-Scholes Calculator</h2>
        <p className="text-gray-600 leading-relaxed">
          The Black-Scholes-Merton (BSM) model is the foundational formula for pricing European-style options. Developed in 1973 by Fischer Black, Myron Scholes, and Robert Merton — earning a Nobel Prize in Economics — it derives a closed-form price for an option using five observable inputs: the current stock price, the strike price, time to expiration, the risk-free interest rate, and implied volatility. Our calculator outputs both the theoretical call and put price, plus all five Greeks that describe how the option price changes as market conditions shift.
        </p>

        <InlineCTA
          heading="Use Black-Scholes on real trades"
          body="Model your options positions before you enter. Open a live account and trade with professional-grade order routing."
        />

        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">Black-Scholes Option Pricing — Example Trade</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Let&apos;s walk through a real example using the calculator above.
        </p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
          <p className="font-bold text-gray-800 mb-3">LONG CALL — Example Setup</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Stock trading at <strong>$150.00</strong></li>
            <li>• Buy the <strong>$155 call</strong> expiring in <strong>30 days</strong></li>
            <li>• Implied volatility: <strong>25%</strong>, Risk-free rate: <strong>5.25%</strong></li>
            <li>• BSM theoretical call price: <strong>~$2.40</strong></li>
            <li>• Breakeven at expiration: <strong>$157.40</strong></li>
            <li>• Max loss: <strong>$240 per contract</strong> (premium paid)</li>
            <li>• Max profit: <strong>Unlimited</strong></li>
            <li>• If stock closes at $162, profit = <strong>$460 per contract</strong></li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">The Five Greeks — Explained Simply</h2>
        <p className="text-gray-600 mb-5 leading-relaxed">
          The Greeks quantify your option&apos;s sensitivity to every major market variable. Professional traders use them to manage risk precisely — not just know whether a trade is profitable, but exactly <em>why</em> it&apos;s moving.
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              greek: "Delta (Δ)",
              range: "0 to 1 for calls · −1 to 0 for puts",
              explain: "The most important Greek. Delta tells you how much the option price moves for every $1 change in the stock. A call with a delta of 0.50 gains approximately $0.50 when the stock rises $1. Delta also approximates the probability the option expires in the money.",
              example: "Stock up $5 · Delta 0.50 call → option up ~$2.50",
            },
            {
              greek: "Gamma (Γ)",
              range: "Always positive",
              explain: "Gamma measures how fast delta changes as the stock moves. High gamma means delta can swing rapidly — great for long options buyers, dangerous for sellers near expiration. ATM options have the highest gamma.",
              example: "Delta 0.50, Gamma 0.04 · Stock up $1 → new delta ≈ 0.54",
            },
            {
              greek: "Theta (Θ)",
              range: "Negative for buyers · Positive for sellers",
              explain: "The daily cost of time decay. Every day that passes, an option loses the theta amount in value (all else equal). Theta decay accelerates dramatically in the last 30 days — one reason option sellers prefer short-dated positions.",
              example: "Option worth $3.00 · Theta −$0.08 → worth ~$2.92 tomorrow",
            },
            {
              greek: "Vega (ν)",
              range: "Always positive",
              explain: "How much the option price changes for every 1% move in implied volatility. Long options benefit from rising IV; short options are hurt. Vega is highest for longer-dated options and ATM strikes.",
              example: "Vega $0.12 · IV rises from 25% to 26% → option gains $0.12",
            },
            {
              greek: "Rho (ρ)",
              range: "Positive for calls · Negative for puts",
              explain: "Sensitivity to changes in the risk-free interest rate. Rho matters most for long-dated options (LEAPS) and in volatile rate environments. For short-term options it is typically the least significant Greek.",
              example: "Rho $0.05 · Rates rise 1% → call gains $0.05",
            },
          ].map((g) => (
            <div key={g.greek} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-gray-900">{g.greek}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{g.range}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{g.explain}</p>
              <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 font-medium">
                Example: {g.example}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">History of the Black-Scholes Model</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Before Black-Scholes, options were priced through negotiation and intuition. In 1973, Fischer Black and Myron Scholes published &ldquo;The Pricing of Options and Corporate Liabilities&rdquo; in the <em>Journal of Political Economy</em>, and Robert Merton published a companion paper extending the model to continuous-time stochastic calculus. The Chicago Board Options Exchange (CBOE) opened the same year — coincidence or not, the two developments transformed derivatives markets forever.
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          In 1997, Scholes and Merton were awarded the Nobel Memorial Prize in Economic Sciences. Black had passed away in 1995 and was ineligible, but the Prize committee acknowledged his foundational contribution. Today, Black-Scholes remains the industry standard for pricing European options, benchmarking implied volatility, and computing Greeks — even though practitioners routinely adjust it for real-world factors like volatility skew, early assignment, and discrete dividends.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Black-Scholes Assumptions & Limitations</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          The model makes several simplifying assumptions. In practice, traders know these limitations and adjust accordingly:
        </p>
        <ul className="space-y-2 text-sm text-gray-700 mb-6 list-none">
          {[
            ["Constant volatility", "Real markets exhibit volatility smile and skew — IV varies by strike and expiration."],
            ["Log-normal returns", "Actual returns have fat tails — extreme moves happen more often than the model predicts."],
            ["European-style only", "BSM does not account for early assignment risk on American-style options."],
            ["No dividends (base model)", "The Merton extension handles continuous dividends; discrete cash dividends require adjustment."],
            ["Continuous trading", "The model assumes you can delta-hedge continuously — real trading has frictions and gaps."],
          ].map(([name, desc]) => (
            <li key={name} className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-2.5">
              <span className="text-yellow-500 mt-0.5 flex-shrink-0">⚠</span>
              <span><strong className="text-gray-800">{name}:</strong> {desc}</span>
            </li>
          ))}
        </ul>

        <InlineCTA
          heading="Ready to apply these concepts?"
          body="Open a live account and access real-time options chains, Greeks, and professional order types."
          cta="Open an Account →"
        />

        <EmailCapture />

        <RelatedCalculators currentSlug="black-scholes" />

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Disclaimer:</strong> This calculator is provided for educational and informational purposes only. Results are hypothetical and based on the Black-Scholes-Merton theoretical model. They do not represent actual trading outcomes and should not be relied upon as investment advice. Options trading involves substantial risk and is not appropriate for all investors. Past performance is not indicative of future results.
        </div>
      </div>

      <CTABanner />
    </CalcPageLayout>
  );
}
