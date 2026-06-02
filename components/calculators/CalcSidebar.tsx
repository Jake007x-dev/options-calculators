"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const GREEKS = [
  { label: "Delta", href: "/greeks/delta" },
  { label: "Gamma", href: "/greeks/gamma" },
  { label: "Theta", href: "/greeks/theta" },
  { label: "Vega", href: "/greeks/vega" },
  { label: "Rho", href: "/greeks/rho" },
];

const STRATEGIES = [
  { slug: "covered-call", label: "Covered Call" },
  { slug: "cash-secured-put", label: "Cash-Secured Put" },
  { slug: "wheel", label: "Wheel Strategy" },
  { slug: "iron-condor", label: "Iron Condor" },
  { slug: "straddle", label: "Straddle & Strangle" },
  { slug: "bull-call-spread", label: "Bull Call Spread" },
  { slug: "protective-put", label: "Protective Put" },
  { slug: "leaps", label: "LEAPS Call" },
];

const CALC_GROUPS = [
  {
    group: "Pricing & Volatility",
    items: [
      { slug: "black-scholes", label: "Black-Scholes" },
      { slug: "implied-volatility", label: "Implied Volatility" },
      { slug: "expected-move", label: "Expected Move" },
      { slug: "probability-of-profit", label: "Prob. of Profit" },
      { slug: "earnings-straddle", label: "Earnings Straddle" },
      { slug: "theta-decay", label: "Theta Decay" },
    ],
  },
  {
    group: "Risk & Sizing",
    items: [
      { slug: "position-size", label: "Position Size & Risk" },
      { slug: "monte-carlo", label: "Monte Carlo Sim" },
      { slug: "risk-of-ruin", label: "Risk of Ruin" },
      { slug: "trade-expectancy", label: "Trade Expectancy" },
    ],
  },
  {
    group: "Income & Strategy",
    items: [
      { slug: "wheel-strategy", label: "Wheel Strategy" },
      { slug: "annualized-return", label: "Annualized Return" },
      { slug: "premium-reinvestment", label: "Premium Reinvestment" },
      { slug: "strategy-selector", label: "Strategy Selector" },
    ],
  },
  {
    group: "Personal Finance",
    items: [
      { slug: "roth-ira", label: "Roth IRA + Options" },
      { slug: "coast-fire", label: "Coast FIRE" },
    ],
  },
];

function SideSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors uppercase tracking-wider"
      >
        <span className="flex items-center gap-2">{icon}{title}</span>
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

function CalcSubGroup({
  group,
  items,
  navLink,
}: {
  group: string;
  items: { slug: string; label: string }[];
  navLink: (href: string, label: string) => React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between pl-6 pr-4 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {group}
        {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
      </button>
      {open && <div>{items.map((c) => navLink(`/calculators/${c.slug}`, c.label))}</div>}
    </div>
  );
}

export default function CalcSidebar() {
  const pathname = usePathname();

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={`block pl-8 pr-4 py-1.5 text-xs transition-colors ${
          active
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border-l-2 border-blue-600"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-700 dark:hover:text-blue-300"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-scroll">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Options Learning Hub</p>
      </div>

      <SideSection title="Option Greeks" icon={<span className="text-base">γ</span>} defaultOpen={false}>
        {GREEKS.map((g) => navLink(g.href, g.label))}
        <Link href="/glossary" className="block pl-8 pr-4 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors">
          Glossary →
        </Link>
      </SideSection>

      <SideSection title="Option Strategies" icon={<span className="text-base">⇌</span>} defaultOpen={false}>
        {STRATEGIES.map((s) => navLink(`/strategies/${s.slug}`, s.label))}
      </SideSection>

      <SideSection title="Calculators" icon={<span className="text-base">▤</span>} defaultOpen={true}>
        {CALC_GROUPS.map((g) => (
          <CalcSubGroup key={g.group} group={g.group} items={g.items} navLink={navLink} />
        ))}
      </SideSection>
    </aside>
  );
}
