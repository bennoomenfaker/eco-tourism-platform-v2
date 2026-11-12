"use client";

import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";

type DistributionPoint = { range: string; count: number };

const RANGE_COLORS = {
  "0-20": "#ef4444",
  "21-40": "#f97316",
  "41-60": "#eab308",
  "61-80": "#84cc16",
  "81-100": "#22c55e",
};

const RANGE_LABELS: Record<string, string> = {
  "0-20": "0–20",
  "21-40": "21–40",
  "41-60": "41–60",
  "61-80": "61–80",
  "81-100": "81–100",
};

export function ScoreDistributionDonut({ data }: { data: DistributionPoint[] }) {
  if (!data?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Aucune donnée de distribution</p>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: RANGE_LABELS[d.range] || d.range,
    color: RANGE_COLORS[d.range as keyof typeof RANGE_COLORS] || "#64748b",
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.15em] mb-4 text-center">Distribution des scores</h3>
      <div className="h-48 flex items-center justify-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={formatted}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="count"
              nameKey="label"
              label={(props: any) => `${props.label ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {formatted.map((_, i) => (
                <Cell key={`cell-${i}`} fill={formatted[i].color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              formatter={(value: any) => [Number(value ?? 0).toLocaleString("fr-FR"), "Acteurs"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {formatted.map((d) => (
          <span key={d.range} className="flex items-center gap-1 text-[10px] font-bold" style={{ color: d.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label} ({d.count})
          </span>
        ))}
      </div>
    </div>
  );
}