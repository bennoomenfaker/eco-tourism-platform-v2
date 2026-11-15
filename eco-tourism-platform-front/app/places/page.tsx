"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Search } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { apiFetch } from "@/lib/api";

/**
 * Lieu tel que renvoyé par `GET /publications/places`
 * (voir `PublicationService.findAllPublicPlaces`) : uniquement les lieux
 * approuvés et géolocalisés, avec le nom de l'auteur.
 */
type Lieu = {
  id: string;
  place_name: string | null;
  description: string | null;
  region: string | null;
  /** Nature du lieu, renseignée en base ; null pour les lieux non classés. */
  category?: string | null;
  image: string | null;
  /** Galerie complète : plusieurs photos par lieu. */
  images?: string[] | null;
  latitude: number;
  longitude: number;
  author_name: string | null;
  /** Nombre de « j'aime » ; le serveur trie déjà par ce champ décroissant. */
  likes_count: number;
};

/** Libellé affiché pour un lieu sans catégorie renseignée. */
const AUTRE = "Autres lieux";

/**
 * Page publique dédiée aux lieux de la communauté.
 *
 * Même source que la carte de l'accueil (`PlacesMap`), présentée ici sous forme
 * de liste filtrable. Le bouton « Voir sur la carte » renvoie vers la carte
 * partagée de l'accueil, plutôt que d'en embarquer une seconde copie.
 */
export default function PlacesPage() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Lieu[]>("/publications/places")
      .then((r) => setLieux(Array.isArray(r) ? r : []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const regions = useMemo(
    () =>
      [...new Set(lieux.map((l) => l.region).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [lieux],
  );

  // Filtres par nature de lieu : les catégories réellement présentes, avec
  // leur nombre, comme les puces de la carte de l'accueil.
  const categories = useMemo(() => {
    const compte = new Map<string, number>();
    for (const lieu of lieux) {
      const c = lieu.category?.trim() || AUTRE;
      compte.set(c, (compte.get(c) ?? 0) + 1);
    }
    return [...compte.entries()]
      .sort((a, b) => (a[0] === AUTRE ? 1 : b[0] === AUTRE ? -1 : b[1] - a[1]))
      .map(([label, nombre]) => ({ label, nombre }));
  }, [lieux]);

  const filtered = useMemo(
    () =>
      lieux
        .filter((l) => {
          if (category && (l.category?.trim() || AUTRE) !== category) return false;
          const q = search.trim().toLowerCase();
          if (
            q &&
            !(l.place_name ?? "").toLowerCase().includes(q) &&
            !(l.description ?? "").toLowerCase().includes(q) &&
            !(l.region ?? "").toLowerCase().includes(q)
          )
            return false;
          if (region && l.region !== region) return false;
          return true;
        })
        // Les lieux les plus aimés d'abord (le serveur renvoie déjà cet ordre,
        // on le réapplique pour rester correct après filtrage/recherche).
        .sort(
          (a, b) =>
            (b.likes_count ?? 0) - (a.likes_count ?? 0) ||
            (a.place_name ?? "").localeCompare(b.place_name ?? "", "fr"),
        ),
    [lieux, search, region, category],
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white">
      <Navbar variant="home" />

      <main className="flex-1">
        {/* En-tête */}
        <section className="px-6 md:px-20 lg:px-40 pt-16 pb-10 max-w-[1440px] mx-auto w-full">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-primary" />
                <span className="text-primary font-extrabold text-sm uppercase tracking-widest">
                  Lieux de la communauté
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                Les lieux de la communauté
              </h1>
              <p className="text-slate-500 max-w-2xl leading-relaxed">
                Des sites repérés et partagés par les éco-voyageurs, validés avant
                publication. Explorez-les en liste, ou retrouvez-les sur la carte.
              </p>
            </div>
            <Link
              href="/#univers"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-all text-sm"
            >
              <MapPin className="w-4 h-4" />
              Voir sur la carte
            </Link>
          </div>
        </section>

        {/* Recherche + filtre région */}
        <section className="px-6 md:px-20 lg:px-40 pb-6 max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un lieu, une région…"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
            <div className="relative sm:w-64">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:border-primary focus:bg-white transition-all"
              >
                <option value="">Toutes les régions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Puces de catégorie : même logique que la carte de l'accueil. */}
          {categories.length > 1 && (
            <div
              className="mt-4 flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filtrer les lieux par catégorie"
            >
              {[
                { label: null as string | null, texte: "Tous les lieux", nombre: lieux.length },
                ...categories.map((c) => ({ label: c.label, texte: c.label, nombre: c.nombre })),
              ].map((c) => {
                const actif = category === c.label;
                return (
                  <button
                    key={c.texte}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => setCategory(c.label)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${
                      actif
                        ? "border-primary bg-primary text-slate-900"
                        : "border-slate-300 bg-white text-slate-700 hover:border-primary hover:text-slate-900"
                    }`}
                  >
                    {c.texte}
                    <span
                      className={`text-[11px] font-black ${
                        actif ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {c.nombre}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Grille */}
        <section className="px-6 md:px-20 lg:px-40 pb-24 max-w-[1440px] mx-auto w-full">
          <div className="mb-6">
            <span className="text-sm font-semibold text-slate-400">
              {loading
                ? "Chargement…"
                : `${filtered.length} lieu${filtered.length > 1 ? "x" : ""}${
                    filtered.length !== lieux.length ? ` / ${lieux.length}` : ""
                  }`}
            </span>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MapPin className="w-10 h-10 text-slate-200 mb-3" />
              <p className="text-slate-400 font-semibold">
                Aucun lieu ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((l) => (
                <PlaceCard key={l.id} lieu={l} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PlaceCard({ lieu }: { lieu: Lieu }) {
  return (
    <Link
      href={`/places/${lieu.id}`}
      className="flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="relative h-52 overflow-hidden">
        {lieu.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url('${lieu.image}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-emerald-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {lieu.region && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-extrabold text-slate-700 uppercase tracking-widest shadow-sm">
            {lieu.region}
          </span>
        )}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-extrabold text-slate-700 shadow-sm">
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          {lieu.likes_count ?? 0}
        </span>
        {(lieu.images?.length ?? 0) > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            {lieu.images!.length} photos
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {lieu.place_name ?? "Lieu"}
        </h3>
        {lieu.description && (
          <p className="text-slate-500 text-sm line-clamp-3 flex-1 leading-relaxed mb-3">
            {lieu.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          {lieu.author_name ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[9px] shrink-0">
                {lieu.author_name[0]}
              </div>
              <span className="text-xs font-bold text-slate-500 truncate">
                {lieu.author_name}
              </span>
            </div>
          ) : (
            <span />
          )}
          <span className="text-xs font-bold text-primary group-hover:underline shrink-0">
            Voir le lieu →
          </span>
        </div>
      </div>
    </Link>
  );
}
