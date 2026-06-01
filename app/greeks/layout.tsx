import TickerTape from "@/components/calculators/TickerTape";
import CalcSidebar from "@/components/calculators/CalcSidebar";
import Footer from "@/components/calculators/Footer";

export default function GreeksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <TickerTape />
      <div className="flex flex-1 max-w-[1200px] mx-auto w-full">
        <CalcSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
