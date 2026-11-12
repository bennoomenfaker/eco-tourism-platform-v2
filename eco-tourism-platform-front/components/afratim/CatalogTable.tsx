"use client";

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, MapPin } from "lucide-react";

export type CatalogRow = {
  id: string;
  title: string;
  type: "offer" | "circuit";
  region: string | null;
  governorate: string | null;
  author_name: string | null;
  price: number | null;
  sustainability_score: number | null;
  created_at: string;
};

type CatalogTableProps = {
  offers: CatalogRow[];
  circuits: CatalogRow[];
  governorate: string | null;
  onGovernorate: (gov: string | null) => void;
};

export function CatalogTable({ offers, circuits, governorate, onGovernorate }: CatalogTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof CatalogRow>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const all = useMemo(() => [...offers, ...circuits], [offers, circuits]);

  const filtered = useMemo(() => {
    let rows = all;
    if (governorate) rows = rows.filter((r) => r.governorate === governorate);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.region?.toLowerCase().includes(q) ||
        r.governorate?.toLowerCase().includes(q) ||
        r.author_name?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [all, governorate, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      const cmp = av > bv ? 1 : av < bv ? -1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const handleSort = (key: keyof CatalogRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const GovList = useMemo(() => {
    const set = new Set(all.map((r) => r.governorate).filter((g): g is string => !!g));
    return Array.from(set).sort();
  }, [all]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher titre, région, auteur…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {governorate && (
          <button
            onClick={() => onGovernorate(null)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-sm font-bold hover:bg-amber-100 transition-colors"
          >
            <MapPin className="w-4 h-4" /> {governorate}
          </button>
        )}

        <select
          value={governorate || ""}
          onChange={(e) => onGovernorate(e.target.value || null)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tous les gouvernorats</option>
          {GovList.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                { key: "title", label: "Titre" },
                { key: "type", label: "Type" },
                { key: "region", label: "Région" },
                { key: "governorate", label: "Gouvernorat" },
                { key: "author_name", label: "Auteur" },
                { key: "price", label: "Prix (TND)" },
                { key: "sustainability_score", label: "Score" },
                { key: "created_at", label: "Création" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key as keyof CatalogRow)}
                  className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-[0.1em] cursor-pointer hover:text-slate-700 select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (sortDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-400">Aucune offre ni circuit</td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 max-w-xs truncate">{row.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      row.type === "offer" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {row.type === "offer" ? "Offre" : "Circuit"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.region || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.governorate || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.author_name || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.price ? row.price.toLocaleString("fr-FR") : "—"}</td>
                  <td className="px-4 py-3">
                    {row.sustainability_score !== null ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold ${
                        row.sustainability_score >= 80 ? "bg-emerald-100 text-emerald-700" :
                        row.sustainability_score >= 60 ? "bg-amber-100 text-amber-700" :
                        row.sustainability_score >= 40 ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {row.sustainability_score}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(row.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} / {totalPages} · {sorted.length} résultat{sorted.length > 1 ? "s" : ""}</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl text-sm font-bold border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl text-sm font-bold border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}