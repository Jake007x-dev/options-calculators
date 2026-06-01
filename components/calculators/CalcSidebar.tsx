"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const CALCULATORS = [
  { slug: "implied-volatility", label: "Implied Volatility" },
  { slug: "black-scholes", label: "Black-Scholes Pricing" },
  { slug: "wheel-strategy", label: "Wheel Strategy Income" },
  { slug: "expected-move", label: "Expected Move" },
  { slug: "monte-carlo", label: "Monte Carlo Simulator" },
  { slug: "position-size", label: "Position Size & Risk" },
  { slug: "strategy-selector", label: "Strategy Selector" },
  { slug: "theta-decay", label: "Theta Decay Visualizer" },
  { slug: "annualized-return", label: "Annualized Return" },
  { slug: "earnings-straddle", label: "Earnings Straddle" },
];

const GREEKS = [
  { label: "Delta", href: "/calculators/black-scholes" },
  { label: "Gamma", href: "/calculators/black-scholes" },
  { label: "Theta", href: "/calculators/theta-decay" },
  { label: "Vega", href: "/calculators/implied-volatility" },
  { label: "Rho", href: "/calculators/black-scholes" },
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
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

export default function CalcSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 self-start sticky top-0 max-h-screen overflow-y-auto">
      <div className="bg-[#0F1629] text-white text-sm font-bold px-4 py-3">
        Options Learning Hub
      </div>

      <SideSection
        title="Option Greeks"
        icon={<span className="text-base">γ</span>}
        defaultOpen={false}
      >
        {GREEKS.map((g) => (
          <Link
            key={g.label}
            href={g.href}
            className={`block pl-8 pr-4 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors ${
              pathname === g.href ? "text-blue-700 font-medium" : "text-gray-600"
            }`}
          >
            {g.label}
          </Link>
        ))}
      </SideSection>

      <SideSection
        title="Option Strategies"
        icon={<span className="text-base">⇌</span>}
        defaultOpen={false}
      >
        <Link href="/calculators/strategy-selector" className="block pl-8 pr-4 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">Strategy Selector</Link>
        <Link href="/calculators/wheel-strategy" className="block pl-8 pr-4 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">Wheel Strategy</Link>
        <Link href="/calculators/earnings-straddle" className="block pl-8 pr-4 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">Straddle / Strangle</Link>
        <Link href="/calculators/expected-move" className="block pl-8 pr-4 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">Expected Move</Link>
      </SideSection>

      <SideSection
        title="Option Calculators"
        icon={<span className="text-base">▤</span>}
        defaultOpen={true}
      >
        {CALCULATORS.map((c) => {
          const href = `/calculators/${c.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={c.slug}
              href={href}
              className={`block pl-8 pr-4 py-1.5 text-xs transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </SideSection>
    </aside>
  );
}
