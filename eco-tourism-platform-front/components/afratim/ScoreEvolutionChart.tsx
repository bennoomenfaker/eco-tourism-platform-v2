"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type ScorePoint = { month: string; role: string; score: number };

export function ScoreEvolutionChart({ history }: { history: ScorePoint[] }) {
  if (!history?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Aucune donnée d'évolution</p>
      </div>
    );
  }

  const roles = [...new Set(history.map((h) => h.role))];
  const months = [...new Set(history.map((h) => h.month))].sort();

  const formatted = months.map((month) => {
    const entry: Record<string, any> = { month };
    roles.forEach((role) => {
      const h = history.find((x) => x.month === month && x.role === role);
      entry[role] = h?.score ?? null;
    });
    return entry;
  });

  const roleColors: Record<string, string> = {
    eco_traveler: "#10b981",
    guide: "#3b82f6",
    provider: "#f59e0b",
    project_owner: "#8b5cf6",
  };

  const roleLabels: Record<string, string> = {
    eco_traveler: "Éco-voyageurs",
    guide: "Guides",
    provider: "Prestataires",
    project_owner: "Porteurs de projet",
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.15em] mb-4">Évolution des scores de durabilité</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              labelFormatter={(month) => month}
              formatter={(value: any, name: any) => [Number(value ?? 0).toFixed(1), roleLabels[name] || name]}
            />
            {roles.map((role) => (
              <Line
                key={role}
                type="monotone"
                dataKey={role}
                stroke={roleColors[role] || "#64748b"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        {roles.map((role) => (
          <span key={role} className="flex items-center gap-1 text-[11px] font-bold" style={{ color: roleColors[role] || "#64748b" }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: roleColors[role] || "#64748b" }} />
            {roleLabels[role] || role}
          </span>
        ))}
      </div>
    </div>
  );
}