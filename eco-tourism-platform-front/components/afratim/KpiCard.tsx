import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: number | string;
  status?: "ok" | "warning" | "error";
  evolution?: number;
  previous?: number | string;
  definition?: string;
  source?: string;
  unit?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const STATUS_COLORS = {
  ok: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  error: "bg-red-100 text-red-700 border-red-200",
};

export function KpiCard({
  label,
  value,
  status = "ok",
  evolution,
  previous,
  definition,
  source,
  unit,
  icon,
  onClick,
}: KpiCardProps) {
  const hasEvo = typeof evolution === "number" && !Number.isNaN(evolution);
  const up = hasEvo && evolution > 0;
  const down = hasEvo && evolution < 0;

  const displayValue = typeof value === "number" ? value.toLocaleString("fr-FR") : value;
  const displayPrevious = typeof previous === "number" ? previous.toLocaleString("fr-FR") : previous;

  return (
    <motion.button
      onClick={onClick}
      disabled={!onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative bg-white rounded-3xl border border-slate-100/80 shadow-sm p-4 md:p-5 space-y-3 transition-all duration-300 hover:shadow-lg hover:border-emerald-200 ${onClick ? "cursor-pointer" : "cursor-default"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] truncate">{label}</p>
          <p className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
            {displayValue}
            {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
          </p>
        </div>
        {icon && <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">{icon}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${STATUS_COLORS[status]}`}>
          {status === "ok" && <span>✓</span>}
          {status === "warning" && <span>⚠</span>}
          {status === "error" && <span>✕</span>}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>

        {hasEvo && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${up ? "bg-emerald-50 text-emerald-600" : down ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500"}`}>
            {up ? <TrendingUp size={10} /> : down ? <TrendingDown size={10} /> : <Minus size={10} />}
            {up ? "+" : ""}{evolution.toFixed(1)}%
          </span>
        )}

        {previous !== undefined && !hasEvo && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500">
            Précédent : {displayPrevious}
          </span>
        )}
      </div>

      {(definition || source) && (
        <div className="pt-2 border-t border-slate-100">
          {/* Pas de <button> imbriqué : la carte est déjà un bouton (erreur d'hydratation). */}
          <span
            title={definition ?? source}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600"
          >
            <Info size={10} /> {definition ? "Définition" : "Source"}
          </span>
        </div>
      )}
    </motion.button>
  );
}