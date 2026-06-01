import TickerTape from "@/components/calculators/TickerTape";
import CalcSidebar from "@/components/calculators/CalcSidebar";

export default function GreeksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TickerTape />
      <div className="flex flex-1 max-w-[1200px] mx-auto w-full">
        <CalcSidebar />
        {children}
      </div>
    </div>
  );
}
