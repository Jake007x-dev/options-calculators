"use client";
import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  height?: number;
}

/**
 * Defers rendering of children until after client hydration.
 * Use this to wrap Recharts components to avoid SSR/hydration mismatches.
 */
export default function ClientOnly({ children, height = 240 }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) {
    return <div style={{ height }} className="rounded-lg bg-gray-100 animate-pulse" />;
  }
  return <>{children}</>;
}
