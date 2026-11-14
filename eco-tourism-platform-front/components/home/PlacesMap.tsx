"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Lieu = {
  id: string;
  place_name: string | null;
  description: string | null;
  region: string | null;
  /** Nature du lieu, renseignée en base ; null pour les lieux non classés. */
  category: string | null;
  image: string | null;
  latitude: number;
  longitude: number;
  author_name: string | null;
  /** Nombre de « j'aime » ; le serveur trie déjà par ce champ décroissant. */
  likes_count: number;
};

/** Même épingle que les autres cartes du site, pour rester cohérent. */
const PIN_HTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
  <ellipse cx="16" cy="40" rx="6" ry="2" fill="rgba(0,0,0,.2)"/>
  <path d="M16 0C9.37 0 4 5.37 4 12c0 9 12 28 12 28S28 21 28 12C28 5.37 22.63 0 16 0z" fill="#10b981" stroke="white" stroke-width="2"/>
  <circle cx="16" cy="12" r="5" fill="white"/>
</svg>`;

/** Résumé lisible : on coupe sur un mot pour ne pas laisser une phrase en suspens. */
function resume(texte: string | null, max = 240) {
  if (!texte) return "";
  const propre = texte.replace(/\s+/g, " ").trim();
  if (propre.length <= max) return propre;
  const coupe = propre.slice(0, max);
  return `${coupe.slice(0, coupe.lastIndexOf(" "))}…`;
}

/** Libellé affiché pour un lieu sans catégorie renseignée. */
const AUTRE = "Autres lieux";

function categorieDe(lieu: Lieu): string {
  return lieu.category?.trim() || AUTRE;
}

export default function PlacesMap() {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const carteRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  /** Une entrée par épingle, pour filtrer sans reconstruire la carte. */
  const marqueursRef = useRef<{ lieu: Lieu; marker: any }[]>([]);
  const [cssPrete, setCssPrete] = useState(false);
  const [lieux, setLieux] = useState<Lieu[] | null>(null);
  const [selection, setSelection] = useState<Lieu | null>(null);
  const [filtre, setFiltre] = useState<string | null>(null);

  // Filtres proposés : les catégories réellement présentes, avec leur nombre.
  const categories = useMemo(() => {
    const compte = new Map<string, number>();
    for (const lieu of lieux ?? []) {
      const c = categorieDe(lieu);
      compte.set(c, (compte.get(c) ?? 0) + 1);
    }
    return [...compte.entries()]
      .sort((a, b) => (a[0] === AUTRE ? 1 : b[0] === AUTRE ? -1 : b[1] - a[1]))
      .map(([label, nombre]) => ({ label, nombre }));
  }, [lieux]);

  const visibles = useMemo(
    () => (lieux ?? []).filter((l) => !filtre || categorieDe(l) === filtre),
    [lieux, filtre],
  );

  // Modale : fermeture au clavier et blocage du défilement derrière.
  useEffect(() => {
    if (!selection) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelection(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selection]);

  // La feuille de style Leaflet est chargée à la demande, comme dans MapView.
  useEffect(() => {
    if (document.querySelector('link[href*="leaflet.css"]')) { setCssPrete(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.onload = () => setCssPrete(true);
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    apiFetch<Lieu[]>("/publications/places")
      .then((r) => setLieux(Array.isArray(r) ? r : []))
      .catch(() => setLieux([]));
  }, []);

  useEffect(() => {
    if (!cssPrete || !conteneurRef.current || !lieux || lieux.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");
    if (carteRef.current) { carteRef.current.remove(); carteRef.current = null; }

    leafletRef.current = L;
    const carte = L.map(conteneurRef.current, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(carte);

    const icone = L.divIcon({ className: "", iconSize: [32, 42], iconAnchor: [16, 42], html: PIN_HTML });

    marqueursRef.current = lieux.map((l) => {
      const marqueur = L.marker([l.latitude, l.longitude], {
        icon: icone,
        title: l.place_name ?? "Lieu",
        alt: l.place_name ?? "Lieu",
      }).addTo(carte);
      // Un clic ouvre la fiche dans une modale (comme sur Google Maps), pas une bulle.
      marqueur.on("click", () => setSelection(l));
      return { lieu: l, marker: marqueur };
    });

    // Le cadrage suit les lieux : aucune vue codée en dur à retoucher plus tard.
    const groupe = L.featureGroup(
      lieux.map((l) => L.marker([l.latitude, l.longitude])),
    );
    carte.fitBounds(groupe.getBounds(), { padding: [50, 50], maxZoom: 9 });

    carteRef.current = carte;
    return () => {
      try { carte.stop(); } catch {}
      try { carte.remove(); } catch {}
      marqueursRef.current = [];
      carteRef.current = null;
    };
  }, [cssPrete, lieux]);

  // Filtre : on ajoute ou retire les épingles existantes plutôt que de
  // reconstruire la carte, ce qui conserverait mal le zoom choisi par l'utilisateur.
  useEffect(() => {
    const carte = carteRef.current;
    const L = leafletRef.current;
    if (!carte || !L) return;

    const affiches: [number, number][] = [];
    for (const { lieu, marker } of marqueursRef.current) {
      const visible = !filtre || categorieDe(lieu) === filtre;
      if (visible) {
        if (!carte.hasLayer(marker)) marker.addTo(carte);
        affiches.push([lieu.latitude, lieu.longitude]);
      } else if (carte.hasLayer(marker)) {
        carte.removeLayer(marker);
      }
    }

    if (affiches.length > 0) {
      carte.fitBounds(L.latLngBounds(affiches), { padding: [50, 50], maxZoom: 9 });
    }
  }, [filtre, lieux]);

  return (
    <section id="univers" className="scroll-mt-24 px-6 md:px-20 lg:px-40 max-w-[1440px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Les lieux de la communauté
          </h2>
          <p className="text-slate-500">
            Des sites repérés et partagés par les éco-voyageurs, validés avant
            publication. Les plus aimés apparaissent en premier.
          </p>
        </div>
        {lieux && lieux.length > 0 && (
          // Sur bureau le lien reste à droite, comme un « tout voir » classique ;
          // sur mobile il passe sous le texte, en pleine largeur pour rester cliquable.
          <Link
            href="/places"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 sm:py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <MapPin className="w-4 h-4 text-primary" />
            {lieux.length} lieu{lieux.length > 1 ? "x" : ""} sur la carte
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        )}
      </div>

      {/* Filtres par nature de lieu : ils agissent sur les épingles, pas sur la liste. */}
      {lieux && lieux.length > 0 && categories.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer les lieux par catégorie">
          {[{ label: null as string | null, texte: "Tous les lieux", nombre: lieux.length }, ...categories.map((c) => ({ label: c.label, texte: c.label, nombre: c.nombre }))].map((c) => {
            const actif = filtre === c.label;
            return (
              <button
                key={c.texte}
                type="button"
                aria-pressed={actif}
                onClick={() => setFiltre(c.label)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${
                  actif
                    ? "border-primary bg-primary text-slate-900"
                    : "border-slate-300 bg-white text-slate-700 hover:border-primary hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {c.texte}
                <span className={`text-[11px] font-black ${actif ? "text-slate-800" : "text-slate-400"}`}>
                  {c.nombre}
                </span>
              </button>
            );
          })}
          <span className="ml-auto text-xs font-semibold text-slate-500" aria-live="polite">
            {visibles.length} lieu{visibles.length > 1 ? "x" : ""} affiché{visibles.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-lg">
        {lieux === null ? (
          <div className="h-[480px] bg-slate-100 dark:bg-slate-700 animate-pulse" />
        ) : lieux.length === 0 ? (
          <div className="h-[480px] flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 text-slate-400">
            <MapPin className="w-10 h-10" />
            <p className="text-sm font-semibold">
              Aucun lieu partagé pour l'instant.
            </p>
          </div>
        ) : (
          <div ref={conteneurRef} style={{ height: "480px", width: "100%" }} />
        )}
      </div>

      {selection && (
        <div
          className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titre-lieu-modal"
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setSelection(null)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          <div className="relative w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelection(null)}
              aria-label="Fermer la fiche"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>

            {selection.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selection.image}
                alt={selection.place_name ?? "Lieu"}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-32 w-full items-center justify-center bg-primary/10">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
            )}

            <div className="space-y-3 p-5 sm:p-6">
              <div className="space-y-1">
                <h3
                  id="titre-lieu-modal"
                  className="text-xl font-extrabold text-slate-900 dark:text-slate-50"
                >
                  {selection.place_name ?? "Lieu"}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                  {selection.region && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {selection.region}
                    </span>
                  )}
                  <span className="text-rose-500">
                    ♥ {selection.likes_count} j&apos;aime
                  </span>
                </div>
              </div>

              {selection.description && (
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {resume(selection.description)}
                </p>
              )}

              <Link
                href={`/places/${selection.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                Voir la fiche du lieu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
