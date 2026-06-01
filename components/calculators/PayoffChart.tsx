"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import { ReactNode } from "react";

interface DataSeries {
  key: string;
  color: string;
  label?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  dot?: boolean;
}

interface PayoffChartProps {
  data: Record<string, number | string>[];
  xKey: string;
  series: DataSeries[];
  xLabel?: string;
  yLabel?: string;
  yFormatter?: (v: number) => string;
  xFormatter?: (v: number) => string;
  showLegend?: boolean;
  children?: ReactNode;
  height?: number;
  referenceLines?: { y?: number; x?: number; color?: string; label?: string }[];
}

export default function PayoffChart({
  data,
  xKey,
  series,
  xLabel,
  yLabel,
  yFormatter,
  xFormatter,
  showLegend = true,
  children,
  height = 300,
  referenceLines = [],
}: PayoffChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey={xKey}
            stroke="#6b7280"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            label={
              xLabel
                ? { value: xLabel, position: "insideBottom", offset: -4, fill: "#6b7280", fontSize: 11 }
                : undefined
            }
            tickFormatter={xFormatter}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            tickFormatter={yFormatter}
            width={60}
            label={
              yLabel
                ? { value: yLabel, angle: -90, position: "insideLeft", fill: "#6b7280", fontSize: 11 }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: 8,
              fontSize: 12,
              color: "#f9fafb",
            }}
            formatter={(value, name) => {
              const v = Number(value);
              return [yFormatter ? yFormatter(v) : v.toFixed(2), String(name)];
            }}
            labelFormatter={xFormatter ? (label) => xFormatter(Number(label)) : undefined}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#9ca3af", paddingTop: 8 }}
            />
          )}
          <ReferenceLine y={0} stroke="#374151" strokeWidth={1.5} />
          {referenceLines.map((rl, i) => (
            <ReferenceLine
              key={i}
              y={rl.y}
              x={rl.x}
              stroke={rl.color ?? "#4b5563"}
              strokeDasharray="4 4"
              label={rl.label ? { value: rl.label, fill: rl.color ?? "#6b7280", fontSize: 10 } : undefined}
            />
          ))}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={s.strokeWidth ?? 2}
              dot={s.dot ?? false}
              strokeDasharray={s.strokeDasharray}
              name={s.label ?? s.key}
            />
          ))}
          {children}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
