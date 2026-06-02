import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import EmailCapture from "@/components/calculators/EmailCapture";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

export default function WheelPage() {
  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/strategies" className="hover:text-blue-600">Strategies</Link><span>›</span>
        <span className="text-gray-800">Wheel Strategy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">The Wheel Strategy — Complete Income Guide</h1>
      <p className="text-gray-500 text-sm mb-8">By: <span className="font-medium text-gray-700">Jake Joseph</span> · Updated June 2026</p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Strategy Type</p><p className="text-xl font-bold text-gray-800">Income Cycle</p><p className="text-xs text-gray-400 mt-1">Repeating premium harvest</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Typical Annual Yield</p><p className="text-xl font-bold text-green-600">12–25% ROC</p><p className="text-xs text-gray-400 mt-1">depends on IV and strike selection</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best On</p><p className="text-xl font-bold text-blue-600">High-IV Stocks</p><p className="text-xs text-gray-400 mt-1">SPY, QQQ, AAPL, MSFT</p></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">How the Wheel Works</h2>
      <p className="text-gray-600 leading-relaxed mb-4">The Wheel is a systematic options income strategy that cycles between two positions: selling cash-secured puts (Phase 1) and selling covered calls (Phase 2). The "wheel" turns because assignment connects the two phases — being put the stock transitions you from CSP to covered call, and being called away restarts the cycle.</p>

      <div className="space-y-3 mb-8">
        {[
          { phase: "Phase 1", name: "Sell Cash-Secured Put", desc: "Sell an OTM put at your target entry price. Collect premium. If stock stays above strike → keep premium, sell again. If assigned → move to Phase 2.", color: "bg-blue-50 border-blue-200" },
          { phase: "Phase 2", name: "Sell Covered Call", desc: "Now you own 100 shares. Sell a call at or above your cost basis. If stock stays below strike → keep premium, sell again. If called away → back to Phase 1.", color: "bg-green-50 border-green-200" },
          { phase: "Repeat", name: "Restart the Cycle", desc: "Shares called away → sell another CSP. Keep collecting premium each month. The cycle turns indefinitely as long as you stick to quality stocks.", color: "bg-purple-50 border-purple-200" },
        ].map((p) => (
          <div key={p.phase} className={`rounded-xl border ${p.color} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-white border border-gray-200 px-2 py-0.5 rounded-full">{p.phase}</span>
              <span className="font-bold text-gray-900 text-sm">{p.name}</span>
            </div>
            <p className="text-gray-600 text-sm">{p.desc}</p>
          </div>
        ))}
      </div>

      <InlineCTA heading="Project your Wheel income" body="Enter your stock, premium, and DTE to see annualized yield and monthly income across 12 months." cta="Open Wheel Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Full Year Example — AAPL Wheel</h2>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-8">
        <p className="font-bold text-gray-800 mb-3">AAPL at $180 — Wheel Strategy Annual Projection</p>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase pb-2 border-b border-gray-200">
            <span>Month</span><span>Action</span><span>Premium</span>
          </div>
          {[
            ["Jan–Feb", "Sell $175 CSP (30 DTE) × 2 cycles", "$180 × 2 = $360"],
            ["Mar", "Assigned at $175 — now own 100 shares", "Effective cost: $171.20"],
            ["Apr–Jun", "Sell $178 CC × 3 cycles", "$220 × 3 = $660"],
            ["Jul", "Shares called away at $178", "Gain $280 + premium"],
            ["Aug–Dec", "Sell $170 CSP × 5 cycles", "$150 × 5 = $750"],
          ].map(([m, a, p]) => (
            <div key={m as string} className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 text-xs">
              <span className="font-medium text-gray-800">{m}</span>
              <span className="text-gray-600">{a}</span>
              <span className="text-green-600 font-semibold">{p}</span>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 py-2 text-xs font-bold">
            <span className="text-gray-900">Total Year</span>
            <span></span>
            <span className="text-green-700">~$1,770 income</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">~11.4% ROC on $15,500 capital (100 shares × $175 cost). Illustrative only — actual results vary.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Only wheel high-quality stocks", "The Wheel fails on garbage stocks that go to zero. SPY, QQQ, AAPL, MSFT — stocks you'd be fine holding long-term if assigned."],
          ["Strike selection determines everything", "Selling too close ATM maximizes premium but increases assignment frequency. Too far OTM means low income. Aim for 20–30 delta puts."],
          ["Assignment is part of the plan", "The Wheel is designed around the expectation of occasional assignment. It's not a loss — it's a transition to Phase 2."],
          ["High IV environments are ideal", "The Wheel generates the most income when IV is elevated. Check IV Rank before each trade — sell when IVR > 30."],
          ["Avoid the Wheel into earnings", "A big gap down can put you deeply underwater on shares. Skip the cycle if earnings fall within the DTE window."],
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
