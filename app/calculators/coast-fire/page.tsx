"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import InputSlider from "@/components/calculators/InputSlider";
import ClientOnly from "@/components/calculators/ClientOnly";
import CalcPageLayout from "@/components/calculators/CalcPageLayout";
import InlineCTA from "@/components/calculators/InlineCTA";
import EmailCapture from "@/components/calculators/EmailCapture";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import CTABanner from "@/components/calculators/CTABanner";
import Link from "next/link";

const PRESETS = [
  { label: "Traditional Retirement (65)", currentAge: 35, retirementAge: 65, monthlyExpenses: 5000, annualReturn: 7, swr: 4, currentSavings: 75000, monthlyOptionsPremium: 800 },
  { label: "Early Retirement (55)", currentAge: 30, retirementAge: 55, monthlyExpenses: 4000, annualReturn: 8, swr: 3.5, currentSavings: 50000, monthlyOptionsPremium: 600 },
  { label: "Aggressive FIRE (45)", currentAge: 28, retirementAge: 45, monthlyExpenses: 3500, annualReturn: 9, swr: 3, currentSavings: 30000, monthlyOptionsPremium: 500 },
];

export default function CoastFIREPage() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [swr, setSwr] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(75000);
  const [monthlyOptionsPremium, setMonthlyOptionsPremium] = useState(800);

  function applyPreset(p: typeof PRESETS[0]) {
    setCurrentAge(p.currentAge); setRetirementAge(p.retirementAge);
    setMonthlyExpenses(p.monthlyExpenses); setAnnualReturn(p.annualReturn);
    setSwr(p.swr); setCurrentSavings(p.currentSavings);
    setMonthlyOptionsPremium(p.monthlyOptionsPremium);
  }

  const calc = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 1);
    const r = annualReturn / 100;
    const annualExpenses = monthlyExpenses * 12;

    // Retirement nest egg needed
    const nestEgg = annualExpenses / (swr / 100);

    // Coast FIRE number = amount needed NOW so it grows to nestEgg without contributions
    const coastNumber = nestEgg / Math.pow(1 + r, years);

    // With options income reducing monthly savings needed
    const annualOptionsIncome = monthlyOptionsPremium * 12;
    // Adjusted nest egg (options income reduces required withdrawal from portfolio)
    const reducedAnnualExpenses = Math.max(annualExpenses - annualOptionsIncome, 0);
    const reducedNestEgg = reducedAnnualExpenses / (swr / 100);
    const coastNumberWithOptions = reducedNestEgg / Math.pow(1 + r, years);

    // How many years to reach standard coast FIRE at $1000/mo savings
    const monthlyContribution = 1000;
    let bal = currentSavings;
    let yearsToCoast = 0;
    while (bal < coastNumber && yearsToCoast < 60) {
      bal = bal * (1 + r) + monthlyContribution * 12;
      yearsToCoast++;
    }

    let balOptions = currentSavings;
    let yearsToCoastOptions = 0;
    while (balOptions < coastNumberWithOptions && yearsToCoastOptions < 60) {
      balOptions = balOptions * (1 + r) + (monthlyContribution + monthlyOptionsPremium) * 12;
      yearsToCoastOptions++;
    }

    // Chart: savings trajectory
    const chartData = Array.from({ length: years + 1 }, (_, yr) => {
      let std = currentSavings;
      let opts = currentSavings;
      for (let i = 0; i < yr; i++) {
        std = std * (1 + r) + monthlyContribution * 12;
        opts = opts * (1 + r) + (monthlyContribution + monthlyOptionsPremium) * 12;
      }
      return {
        age: currentAge + yr,
        standard: Math.round(std),
        withOptions: Math.round(opts),
      };
    });

    return { nestEgg, coastNumber, reducedNestEgg, coastNumberWithOptions, yearsToCoast, yearsToCoastOptions, chartData, annualExpenses, annualOptionsIncome };
  }, [currentAge, retirementAge, monthlyExpenses, annualReturn, swr, currentSavings, monthlyOptionsPremium]);

  const fmtK = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}k`;
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const alreadyCoasting = currentSavings >= calc.coastNumber;
  const alreadyCoastingWithOptions = currentSavings >= calc.coastNumberWithOptions;

  return (
    <CalcPageLayout>
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">🏠</a><span>›</span>
        <Link href="/calculators" className="hover:text-blue-600">Calculators</Link><span>›</span>
        <span className="text-gray-800">Coast FIRE Calculator</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Coast FIRE Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">By: <span className="font-medium text-gray-700">Options Research Desk</span> · Updated June 2026</p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-800">
        <strong>What is Coast FIRE?</strong> Coast FIRE is the point where your savings are large enough that — even without another dollar of contributions — they'll grow to fully fund your retirement by your target age. Once you hit Coast FIRE, your job income only needs to cover current living expenses. Options premium can accelerate this dramatically.
      </div>

      {/* Hero */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Coast FIRE Number</p><p className="text-3xl font-bold text-gray-900">{fmtK(calc.coastNumber)}</p><p className="text-xs text-gray-400 mt-1">standard (no options)</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">With Options Income</p><p className="text-3xl font-bold text-green-600">{fmtK(calc.coastNumberWithOptions)}</p><p className="text-xs text-gray-400 mt-1">reduced target!</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Years to Coast (Standard)</p><p className="text-2xl font-bold text-orange-500">{alreadyCoasting ? "Already there! ✓" : `${calc.yearsToCoast} yrs`}</p><p className="text-xs text-gray-400 mt-1">at $1k/mo savings</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Years to Coast (+ Options)</p><p className="text-2xl font-bold text-blue-600">{alreadyCoastingWithOptions ? "Already there! ✓" : `${calc.yearsToCoastOptions} yrs`}</p><p className="text-xs text-gray-400 mt-1">accelerated timeline</p></div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-gray-500 self-center">Quick load:</span>
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => applyPreset(p)} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors">{p.label}</button>
        ))}
      </div>

      {/* Calculator */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <InputSlider label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={65} step={1} suffix=" yrs" decimals={0} />
          <InputSlider label="Target Retirement Age" value={retirementAge} onChange={setRetirementAge} min={35} max={80} step={1} suffix=" yrs" decimals={0} />
          <InputSlider label="Monthly Expenses in Retirement ($)" value={monthlyExpenses} onChange={setMonthlyExpenses} min={500} max={20000} step={100} prefix="$" decimals={0} />
          <InputSlider label="Expected Annual Return (%)" value={annualReturn} onChange={setAnnualReturn} min={1} max={15} step={0.5} suffix="%" />
          <InputSlider label="Safe Withdrawal Rate (%)" value={swr} onChange={setSwr} min={2} max={6} step={0.5} suffix="%" />
          <InputSlider label="Current Savings ($)" value={currentSavings} onChange={setCurrentSavings} min={0} max={2000000} step={5000} prefix="$" decimals={0} />
          <InputSlider label="Monthly Options Premium ($)" value={monthlyOptionsPremium} onChange={setMonthlyOptionsPremium} min={0} max={10000} step={50} prefix="$" decimals={0} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-500 mb-1">Full Retirement Nest Egg Needed</p>
            <p className="font-bold text-gray-800 text-sm">{fmtK(calc.nestEgg)}</p>
            <p className="text-gray-400">{fmt(monthlyExpenses * 12)} / year ÷ {swr}% SWR</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-gray-500 mb-1">Nest Egg with Options Income</p>
            <p className="font-bold text-green-700 text-sm">{fmtK(calc.reducedNestEgg)}</p>
            <p className="text-gray-400">${fmt(monthlyOptionsPremium)}/mo premium offsets expenses</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Savings Trajectory</p>
          <p className="text-xs text-gray-400 mb-3"><span className="text-blue-500 font-medium">Blue</span> = With options premium reinvested · <span className="text-gray-400 font-medium">Gray</span> = Standard savings only</p>
          <ClientOnly height={240}>
            <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calc.chartData} margin={{ top: 4, right: 16, left: 4, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="age" tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => `Age ${v}`} label={{ value: "Age", position: "insideBottom", offset: -12, fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} stroke="#e5e7eb" tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`} width={60} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v, name) => [`$${Number(v).toLocaleString()}`, name === "withOptions" ? "With Options" : "Standard"]} labelFormatter={(l) => `Age ${l}`} />
                <ReferenceLine y={calc.coastNumber} stroke="#9ca3af" strokeDasharray="4 3" label={{ value: "Coast FIRE", fill: "#9ca3af", fontSize: 9, position: "right" }} />
                <ReferenceLine y={calc.coastNumberWithOptions} stroke="#22c55e" strokeDasharray="4 3" label={{ value: "Coast + Options", fill: "#22c55e", fontSize: 9, position: "right" }} />
                <Line type="monotone" dataKey="standard" stroke="#9ca3af" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="withOptions" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </ClientOnly>
        </div>
      </div>

      <InlineCTA heading="Start collecting premium to reach Coast FIRE faster" body="Every month of options premium shortens your Coast FIRE timeline. The Annualized Return calculator shows exactly how much." cta="Open Annualized Return Calculator →" />

      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">How Options Income Accelerates Coast FIRE</h2>
      <p className="text-gray-600 leading-relaxed mb-4">Coast FIRE has two levers: how much you have saved now, and how much you need in retirement. Options income works on both. First, monthly premium reinvested into your portfolio gets you to the Coast FIRE number faster. Second, premium income in retirement reduces the amount your portfolio needs to withdraw, meaning a lower Coast FIRE target to begin with.</p>
      <p className="text-gray-600 leading-relaxed mb-6">A trader collecting $800/month in premium reduces their retirement expense gap by $9,600/year. At a 4% withdrawal rate, that means $240,000 less needed in the portfolio at retirement — which means a significantly lower Coast FIRE number today.</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
      <ul className="space-y-3 mb-8">
        {[
          ["Options income shrinks the target", "Every dollar of monthly premium in retirement reduces the portfolio you need to fund that expense by 25× (at 4% SWR)."],
          ["Coast FIRE + side income is powerful", "You don't need to stop working at Coast FIRE — just stop worrying about retirement. Options premium can cover daily expenses while savings compound."],
          ["3.5% SWR for early retirees", "If you're retiring before 55, consider a more conservative 3–3.5% withdrawal rate to ensure your money lasts 40+ years."],
          ["Coast doesn't mean stop contributing", "Even after hitting Coast FIRE, adding more premium or savings speeds up your actual retirement date and builds a larger safety margin."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-blue-500 mt-0.5 font-bold flex-shrink-0">→</span>
            <span><strong className="text-gray-800">{title}:</strong> <span className="text-gray-600">{desc}</span></span>
          </li>
        ))}
      </ul>

      <EmailCapture />
      <RelatedCalculators currentSlug="coast-fire" />
      <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Disclaimer:</strong> Educational purposes only. Projections are hypothetical and do not guarantee future results. Consult a financial advisor for personalized retirement planning.
      </div>
      <CTABanner />
    </CalcPageLayout>
  );
}
