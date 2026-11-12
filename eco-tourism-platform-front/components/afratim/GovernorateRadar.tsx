"use client";

import { useEffect, useRef, useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer,
} from "recharts";

type GovernorateRadarProps = {
  offers: { governorate: string; count: number }[];
  circuits: { governorate: string; count: number }[];
  venues: { governorate: string; count: number }[];
  reservations: { governorate: string; reservations: number }[];
  selected: string | null;
  onSelect: (gov: string | null) => void;
};

export function GovernorateRadar({ offers, circuits, venues, reservations, selected, onSelect }: GovernorateRadarProps) {
  const [data, setData] = useState<{ name: string; Offres: number; Circuits: number; Lieux: number; Réservations: number }[]>([]);

  useEffect(() => {
    const govs = new Set([
      ...offers.map((o) => o.governorate),
      ...circuits.map((c) => c.governorate),
      ...venues.map((v) => v.governorate),
      ...reservations.map((r) => r.governorate),
    ]);

    const merged = Array.from(govs)
      .filter((g) => g !== "Non renseigné")
      .map((gov) => ({
        name: gov,
        Offres: offers.find((o) => o.governorate === gov)?.count ?? 0,
        Circuits: circuits.find((c) => c.governorate === gov)?.count ?? 0,
        Lieux: venues.find((v) => v.governorate === gov)?.count ?? 0,
        Réservations: reservations.find((r) => r.governorate === gov)?.reservations ?? 0,
      }))
      .sort((a, b) => (b.Offres + b.Circuits + b.Lieux + b.Réservations) - (a.Offres + a.Circuits + a.Lieux + a.Réservations))
      .slice(0, 8);

    setData(merged);
  }, [offers, circuits, venues, reservations]);

  if (!data.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Aucune donnée radar</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.flatMap((d) => [d.Offres, d.Circuits, d.Lieux, d.Réservations]), 1);

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-64">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.15em] mb-4">Profil {selected ? `· ${selected}` : "· Top gouvernorats"}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid gridType="polygon" stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#334155" }} />
            <PolarRadiusAxis angle={30} tick={{ fontSize: 9, fill: "#94a3b8" }} domain={[0, maxVal]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              formatter={(value: any) => [Number(value ?? 0).toLocaleString("fr-FR"), ""]}
            />
            <Radar name="Offres" dataKey="Offres" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
            <Radar name="Circuits" dataKey="Circuits" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
            <Radar name="Lieux" dataKey="Lieux" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
            <Radar name="Réservations" dataKey="Réservations" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        {["Offres", "Circuits", "Lieux", "Réservations"].map((name) => (
          <span key={name} className="flex items-center gap-1 text-[10px] font-bold" style={{ color: name === "Offres" ? "#10b981" : name === "Circuits" ? "#3b82f6" : name === "Lieux" ? "#f59e0b" : "#8b5cf6" }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: name === "Offres" ? "#10b981" : name === "Circuits" ? "#3b82f6" : name === "Lieux" ? "#f59e0b" : "#8b5cf6" }} />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}