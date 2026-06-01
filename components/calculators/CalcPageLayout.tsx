import { ReactNode } from "react";

interface CalcPageLayoutProps {
  children: ReactNode;
}

export default function CalcPageLayout({ children }: CalcPageLayoutProps) {
  return (
    <main className="flex-1 min-w-0 px-6 py-8 pb-24">
      {children}
    </main>
  );
}
