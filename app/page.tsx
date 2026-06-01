import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F1629] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-300 text-xs font-medium mb-6">
          Free · Real-Time · Professional Grade
        </div>
        <h1 className="text-5xl font-semibold text-white mb-4 leading-tight">
          Options Calculators
          <br />
          <span className="text-blue-400">Built for Traders</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Ten professional-grade tools — Black-Scholes pricing, IV solver, Theta decay, Monte Carlo simulation, and more. All free, all updating in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/calculators"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Browse All Calculators →
          </Link>
          <Link
            href="/open-account"
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-8 py-3.5 rounded-xl transition-colors border border-gray-700"
          >
            Open a Live Account
          </Link>
        </div>
      </div>
    </div>
  );
}
