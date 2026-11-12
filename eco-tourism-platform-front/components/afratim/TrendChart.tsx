"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

type TrendPoint = {
  month: string;
  reservations: number;
  revenue: number;
  new_users: number;
  new_offers: number;
};

export function TrendChart({ data }: { data: TrendPoint[] }) {
  if (!data?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-80 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Aucune donnée de tendance</p>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    monthLabel: d.month.length === 7 ? d.month.slice(5) + "/" + d.month.slice(2, 4) : d.month,
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-80">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.15em] mb-4">Tendances mensuelles</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              labelStyle={{ color: "#0f172a", fontWeight: 700, fontSize: 12 }}
              formatter={(value: any, name: any) => {
                const v = Number(value ?? 0);
                const n = name ?? "";
                return [(n === "reservations" ? v.toLocaleString("fr-FR") : n === "revenue" ? v.toLocaleString("fr-FR") + " TND" : v.toLocaleString("fr-FR")), (n === "reservations" ? "Réservations" : n === "revenue" ? "Revenus" : n === "new_users" ? "Nouveaux utilisateurs" : "Nouvelles offres")];
              }}
            />
            <Area type="monotone" dataKey="reservations" stroke="#10b981" fillOpacity={1} fill="url(#colorReservations)" />
            <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-4 text-[11px] font-bold">
        <span className="flex items-center gap-1 text-emerald-600"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Réservations</span>
        <span className="flex items-center gap-1 text-amber-600"><span className="w-3 h-3 rounded-full bg-amber-500" /> Revenus (TND)</span>
      </div>
    </div>
  );
}