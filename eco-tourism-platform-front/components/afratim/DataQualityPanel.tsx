"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, MinusCircle, XCircle } from "lucide-react";

type QualityData = {
  kpis?: Record<string, { status: string; coverage?: number; message?: string }>;
  global?: { score: number; status: string; missing_count: number };
};

const STATUS_ICONS = {
  ok: CheckCircle,
  warning: AlertTriangle,
  partial: Info,
  insufficient: MinusCircle,
  unavailable: XCircle,
};

const STATUS_LABELS = {
  ok: "OK",
  warning: "Attention",
  partial: "Partiel",
  insufficient: "Insuffisant",
  unavailable: "Indisponible",
};

const STATUS_COLORS = {
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  partial: "bg-blue-50 text-blue-700 border-blue-200",
  insufficient: "bg-orange-50 text-orange-700 border-orange-200",
  unavailable: "bg-red-50 text-red-700 border-red-200",
};

export function DataQualityPanel({ quality }: { quality: QualityData }) {
  if (!quality?.kpis) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 text-center py-12">
        <p className="text-slate-400 text-sm">Aucune donnée de qualité disponible</p>
      </div>
    );
  }

  const entries = Object.entries(quality.kpis);
  const global = quality.global;

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5">
      {global && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">Score global de qualité</p>
              <p className="text-2xl font-extrabold text-emerald-600">{global.score}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">KPIs manquants</p>
            <p className="text-xl font-extrabold text-red-600">{global.missing_count}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {entries.map(([key, q]) => {
          const Icon = STATUS_ICONS[q.status as keyof typeof STATUS_ICONS] || Info;
          const statusLabel = STATUS_LABELS[q.status as keyof typeof STATUS_LABELS] || q.status;
          const statusColor = STATUS_COLORS[q.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.ok;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: statusColor.replace("bg-", "").replace("50", "100").replace("text-", "").replace("700", "500") }}>
                <Icon className="w-5 h-5" style={{ color: statusColor.replace("bg-", "").replace("50", "600").replace("text-", "").replace("border-", "").replace("200", "") }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{key}</p>
                <p className="text-[10px] font-semibold text-slate-400">{statusLabel}{q.coverage !== undefined ? ` · Couverture : ${q.coverage}%` : ""}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-extrabold ${statusColor}`}>
                {statusLabel}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2">
        <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">Objectivité AFRATIM : 0 réel ≠ N/A. Un KPI "insuffisant" signifie que la donnée existe mais ne permet pas un calcul fiable.</p>
      </div>
    </div>
  );
}