"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

type Alert = {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  acknowledged?: boolean;
};

const ALERT_ICONS: Record<string, any> = {
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  success: CheckCircle,
};

const ALERT_COLORS: Record<string, string> = {
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  error: "bg-red-50 border-red-200 text-red-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
};

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  if (!alerts?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-full min-h-[200px] flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
        <p className="text-sm font-bold text-slate-400">Aucune alerte</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 h-full min-h-[200px]">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.15em] mb-4">Alertes & Vigilance</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {alerts.slice(0, 10).map((alert) => {
          const Icon = ALERT_ICONS[alert.type];
          const colors = ALERT_COLORS[alert.type];

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 p-3 rounded-2xl border ${colors}`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colors.replace("bg-", "").replace("50", "100").replace("text-", "").replace("700", "500").replace("border-", "").replace("200", "") }}>
                <Icon className="w-4 h-4" style={{ color: colors.replace("bg-", "").replace("50", "600").replace("text-", "").replace("border-", "").replace("200", "") }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{alert.title}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{alert.message}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1">{new Date(alert.created_at).toLocaleString("fr-FR")}</p>
              </div>
              {alert.acknowledged && (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
            </motion.div>
          );
        })}
      </div>
      {alerts.length > 10 && (
        <p className="text-[11px] font-bold text-slate-400 text-center mt-3">+ {alerts.length - 10} autres alertes</p>
      )}
    </div>
  );
}