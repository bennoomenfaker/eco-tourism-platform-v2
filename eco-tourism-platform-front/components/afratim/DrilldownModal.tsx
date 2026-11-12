"use client";

import { motion } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";

type DrilldownData = {
  title: string;
  definition: string;
  source: string;
  rows: { label: string; value: number | string }[];
};

export function DrilldownModal({ data, onClose }: { data: DrilldownData; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">{data.title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Définition</p>
          <p className="text-sm text-slate-700">{data.definition}</p>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Source</p>
          <p className="text-sm text-slate-700">{data.source}</p>
        </div>

        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Détails</p>
          {data.rows.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Aucune ventilation disponible</p>
          ) : (
            <div className="space-y-2">
              {data.rows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <span className="text-sm font-semibold text-slate-700 truncate pr-3">{row.label}</span>
                  <span className="text-sm font-extrabold text-slate-900 shrink-0">{typeof row.value === "number" ? row.value.toLocaleString("fr-FR") : row.value}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}