import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import TopNav from "@/components/calculators/TopNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Options Trading Calculators — Free Professional Tools",
    template: "%s | TradingBlock",
  },
  description:
    "Free professional-grade options trading calculators: Black-Scholes, Implied Volatility, Theta Decay, Monte Carlo, and more. Built for serious traders.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen font-[var(--font-inter)]">
        <ThemeProvider>
          <TopNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
