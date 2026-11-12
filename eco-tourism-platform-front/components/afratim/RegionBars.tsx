"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type RegionBarsProps = {
  title: string;
  data: { name: string; value: number }[];
  color: string;
};

export function RegionBars({ title, data, color }: RegionBarsProps) {
  if (!data?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64 flex items-center justify-center">
        <p className="text-slate-400 text-sm">{title} : aucune donnée</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.15em] mb-4">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#334155" }} axisLine={false} tickLine={false} width={120} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              formatter={(value: any) => [Number(value ?? 0).toLocaleString("fr-FR"), ""]}
            />
            <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} maxBarSize={32}>
              {sorted.map((_, i) => <Cell key={`cell-${i}`} fill={i === 0 ? color : color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}