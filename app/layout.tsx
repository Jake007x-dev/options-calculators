import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Options Trading Calculators — Free Professional Tools",
    template: "%s | Options Calculators",
  },
  description:
    "Free professional-grade options trading calculators: Black-Scholes, Implied Volatility, Theta Decay, Monte Carlo, and more. Built for serious traders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#0F1629] text-white min-h-screen font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
