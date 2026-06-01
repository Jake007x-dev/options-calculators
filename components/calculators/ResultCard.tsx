import { ReactNode } from "react";

interface ResultCardProps {
  label: string;
  value: string | ReactNode;
  explanation?: string;
  color?: "green" | "yellow" | "red" | "neutral" | "blue";
  className?: string;
}

const colorMap = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  red: "text-red-400",
  neutral: "text-white",
  blue: "text-blue-400",
};

const borderMap = {
  green: "border-green-500/30",
  yellow: "border-yellow-500/30",
  red: "border-red-500/30",
  neutral: "border-gray-800",
  blue: "border-blue-500/30",
};

export default function ResultCard({
  label,
  value,
  explanation,
  color = "neutral",
  className = "",
}: ResultCardProps) {
  return (
    <div
      className={`bg-gray-900 rounded-xl border ${borderMap[color]} p-4 flex flex-col gap-1 ${className}`}
    >
      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-2xl font-semibold ${colorMap[color]}`}>
        {value}
      </span>
      {explanation && (
        <span className="text-gray-500 text-xs leading-relaxed">{explanation}</span>
      )}
    </div>
  );
}
