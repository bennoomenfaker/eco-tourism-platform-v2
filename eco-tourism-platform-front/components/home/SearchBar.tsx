"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [recherche, setRecherche] = useState("");

  function lancerRecherche() {
    const q = recherche.trim();
    router.push(q ? `/destinations?q=${encodeURIComponent(q)}` : "/destinations");
  }

  return (
    <section className="px-6 md:px-20 lg:px-40 py-8 max-w-[1440px] mx-auto">
      <div className="relative group max-w-3xl mx-auto">
        <div className="flex h-16 w-full items-center rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-2 overflow-hidden">
          <div className="flex items-center pl-4 text-slate-400 group-focus-within:text-primary transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <input
            className="h-full w-full border-none bg-transparent px-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none text-base font-medium"
            placeholder="Quelle sera votre prochaine éco-aventure ?"
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") lancerRecherche(); }}
          />
          <button
            onClick={lancerRecherche}
            className="h-full px-6 rounded-xl bg-primary text-slate-900 font-bold hover:brightness-105 transition-all"
          >
            Rechercher
          </button>
        </div>
      </div>
    </section>
  );
}