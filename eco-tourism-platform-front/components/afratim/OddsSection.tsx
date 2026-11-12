"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle } from "lucide-react";

type Odd = {
  id: number;
  title: string;
  targets?: { id: string; title: string; progress: number; kpi_key?: string }[];
};

type OddsSectionProps = {
  odds: Odd[];
  kpiData: Record<string, { value: number; status: string }>;
};

const ODD_COLORS: Record<number, { bg: string; text: string; border: string; icon: string }> = {
  8: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: "🎯" },
  11: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "🏙️" },
  12: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", icon: "♻️" },
  15: { bg: "bg-lime-50", text: "text-lime-600", border: "border-lime-200", icon: "🌳" },
  4: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: "📚" },
  13: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: "☁️" },
  17: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "🤝" },
};

export function OddsSection({ odds, kpiData }: OddsSectionProps) {
  if (!odds?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 text-center py-12">
        <p className="text-slate-400 text-sm">Aucune donnée ODD disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {odds.map((odd) => {
        const colors = ODD_COLORS[odd.id] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: "🎯" };
        const targets = odd.targets || [];
        const avgProgress = targets.length
          ? Math.round(targets.reduce((a, t) => a + (t.progress || 0), 0) / targets.length)
          : 0;

        return (
          <motion.div
            key={odd.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-white rounded-3xl border ${colors.border} shadow-sm overflow-hidden`}
          >
            <div className={`p-5 ${colors.bg} border-b ${colors.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{colors.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-extrabold ${colors.text.replace("600", "500")} bg-[${colors.text.replace("600", "500")}]`}>
                        {odd.id}
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900">{odd.title}</h4>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">Progression globale : <span className="font-extrabold">{avgProgress}%</span></p>
                  </div>
                </div>
                <div className={`w-16 h-16 rounded-2xl ${colors.bg.replace("50", "100")} flex items-center justify-center`}>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill="none"
                        stroke={colors.text.replace("600", "500")}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 12 * (avgProgress / 100)} ${2 * Math.PI * 12}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold" style={{ color: colors.text }}>
                      {avgProgress}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {targets.length > 0 && (
              <div className="p-5 space-y-3">
                {targets.map((target) => {
                  const kpi = target.kpi_key ? kpiData[target.kpi_key] : null;
                  const progress = target.progress || 0;
                  return (
                    <motion.div
                      key={target.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">{target.title}</span>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${progress >= 75 ? "bg-emerald-50 text-emerald-600" : progress >= 50 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: colors.text.replace("600", "500") }}
                        />
                      </div>
                      {kpi && (
                        <p className="text-[10px] font-semibold text-slate-400">
                          KPI lié : {kpi.value.toLocaleString("fr-FR")} ({kpi.status})
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}