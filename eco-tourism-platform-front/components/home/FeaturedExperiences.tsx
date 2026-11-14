"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ExperienceCard, { type ExperienceCardProps } from "./ExperienceCard";
import { OfferModal, CircuitModal } from "@/components/destinations/DetailModals";
import { apiFetch } from "@/lib/api";

/** La carte affichée, plus l'objet brut que la fenêtre de détail attend. */
type Carte = ExperienceCardProps & { id: string; brut: any };

/** Les listes publiques renvoient tantôt un tableau, tantôt une enveloppe. */
function liste(v: any): any[] {
  return Array.isArray(v) ? v : (v?.data ?? v?.items ?? []);
}

/** Photo réelle hébergée par nous (Cloudinary), par opposition à un visuel de secours. */
function photoReelle(url: unknown): boolean {
  return typeof url === "string" && url.includes("res.cloudinary.com");
}

/** Rang de mise en avant : 0 = fiche d'hébergement réelle, 2 = le reste. */
function rang(carte: Carte, offre: any | null): number {
  if (!photoReelle(carte.image)) return 2;
  return offre?.offer_type === "hebergement" ? 0 : 1;
}

/**
 * Fiches volontairement écartées de la vitrine : trois variantes de la même
 * nuitée de démonstration (« Écolodge Les Chênes »), qui occupaient à elles
 * seules la moitié de la grille d'accueil. Les fiches restent en catalogue.
 */
const OFFRES_MASQUEES = new Set([
  "dff8d68c-1899-4824-9be4-cc1602e632f9", // Nuitée Écolodge Les Chênes
  "ba0d1e8d-afec-444b-9494-afa560c601b3", // Nuitée — Chambre Forêt
  "0b4ad948-1a85-4cf4-b539-77a59329487e", // Choisissez votre formule
]);

export default function FeaturedExperiences() {
  const router = useRouter();
  const [cartes, setCartes] = useState<Carte[] | null>(null);
  const [ouverte, setOuverte] = useState<Carte | null>(null);

  useEffect(() => {
    (async () => {
      const [offres, circuits] = await Promise.all([
        apiFetch<any[]>("/offers").catch(() => []),
        apiFetch<any[]>("/circuits/all-public").catch(() => []),
      ]);

      const cartesOffres: Carte[] = liste(offres).map((o) => ({
        id: o.id,
        kind: "offer" as const,
        image: Array.isArray(o.images) && o.images.length ? o.images[0] : null,
        location: o.region ?? null,
        title: o.title,
        author: o.org_name ?? o.author_name ?? null,
        score: o.sustainability_score ?? null,
        description: o.description ?? null,
        price: o.price != null ? Number(o.price) : null,
        priceUnit: o.price_type ?? undefined,
        brut: o,
      }));

      const cartesCircuits: Carte[] = liste(circuits).map((c) => ({
        id: c.id,
        kind: "circuit" as const,
        image: c.cover_image ?? null,
        location: c.nb_jours ? `${c.nb_jours} jour${c.nb_jours > 1 ? "s" : ""}` : null,
        title: c.title,
        author: c.author_name ?? null,
        score: c.sustainability_score ?? null,
        description: c.description ?? null,
        price: null,
        brut: c,
      }));

      // Vitrine : les fiches d'hébergement réelles d'abord (Matmata, Dar El
      // Margoum, Toujane…), puis les offres les mieux notées. Un classement
      // au seul score mettait en tête les fiches de démonstration.
      const retenues = [...cartesOffres, ...cartesCircuits].filter(
        (c) => !(c.kind === "offer" && OFFRES_MASQUEES.has(c.id)),
      );

      setCartes(
        retenues
          .sort((a, b) => {
            const ra = rang(a, a.kind === "offer" ? a.brut : null);
            const rb = rang(b, b.kind === "offer" ? b.brut : null);
            if (ra !== rb) return ra - rb;
            const score = (b.score ?? -1) - (a.score ?? -1);
            return score !== 0 ? score : a.title.localeCompare(b.title, "fr");
          })
          // Un même partenaire n'occupe qu'une carte : sans cela, une seule
          // organisation peut remplir toute la vitrine avec ses variantes.
          .filter((c, i, toutes) => {
            const org = c.kind === "offer" ? (c.brut?.organization_id ?? null) : null;
            if (!org) return true;
            return toutes.findIndex((t) => t.kind === "offer" && t.brut?.organization_id === org) === i;
          })
          .slice(0, 6),
      );
    })();
  }, []);

  return (
    <section id="publications" className="scroll-mt-24 py-24 px-6 md:px-20 lg:px-40 max-w-[1440px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Les mieux notées
          </h2>
          <p className="text-slate-500">
            Hébergements repérés sur le terrain et offres les mieux notées de la plateforme.
          </p>
        </div>
        <button
          onClick={() => router.push("/destinations")}
          className="flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all"
        >
          Voir tout <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {cartes === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="aspect-video bg-slate-100 dark:bg-slate-700 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-2/3 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : cartes.length === 0 ? (
        <p className="text-slate-500 text-sm">
          Aucune publication pour le moment — les offres et circuits validés apparaîtront ici.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cartes.map((c) => (
            <ExperienceCard key={`${c.kind}-${c.id}`} {...c} onOpen={() => setOuverte(c)} />
          ))}
        </div>
      )}

      {/* Mêmes fenêtres que sur la page Destinations. */}
      {ouverte?.kind === "offer" && (
        <OfferModal offer={ouverte.brut} onClose={() => setOuverte(null)} />
      )}
      {ouverte?.kind === "circuit" && (
        <CircuitModal circuit={ouverte.brut} onClose={() => setOuverte(null)} />
      )}
    </section>
  );
}
