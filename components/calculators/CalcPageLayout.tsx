import TickerTape from "./TickerTape";
import CalcSidebar from "./CalcSidebar";
import { ReactNode } from "react";

interface CalcPageLayoutProps {
  children: ReactNode;
}

export default function CalcPageLayout({ children }: CalcPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TickerTape />
      <div className="flex flex-1 max-w-[1200px] mx-auto w-full">
        <CalcSidebar />
        <main className="flex-1 min-w-0 px-6 py-8 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
