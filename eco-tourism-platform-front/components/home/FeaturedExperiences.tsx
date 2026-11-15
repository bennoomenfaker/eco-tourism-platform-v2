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

/**
 * Qualité de l'image de couverture, de 0 (à écarter) à 5.
 * La vitrine est le premier écran vu par un visiteur : on n'y met que des
 * photos réellement servies par nous, assez larges pour une carte de 400 px.
 */
function qualiteImage(url: unknown): number {
  if (typeof url !== "string" || !url) return 0;
  // Visuels de secours, images par défaut des démos : jamais en vitrine.
  if (/placeholder|no-?image|default\.(jpe?g|png)|via\.placeholder/i.test(url)) return 0;
  let q = 1;
  if (url.includes("res.cloudinary.com")) q += 2; // hébergée par nous, servie en cache CDN
  if (/\/t_eco_1600\//.test(url)) q += 1; // transformation large : nette sur grand écran
  if (/\.(jpe?g|webp|avif)(\?|$)/i.test(url)) q += 1; // format photographique
  if (/[\/_-]w_(\d{1,3})(?![0-9])/.test(url)) q -= 1; // vignette trop petite
  return q;
}

/** Deux cartes ne doivent jamais montrer la même photo. */
function clePhoto(url: string | null): string | null {
  return url ? url.split("?")[0].split("/").pop() ?? url : null;
}

/** Fiche complète : prix affichable et score de durabilité renseignés. */
function completude(carte: Carte): number {
  return (carte.price != null ? 1 : 0) + (carte.score != null ? 1 : 0);
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

      // Vitrine : uniquement des fiches dont la photo est exploitable, les
      // mieux documentées d'abord (prix + score), puis les mieux notées.
      const retenues = [...cartesOffres, ...cartesCircuits]
        .filter((c) => !(c.kind === "offer" && OFFRES_MASQUEES.has(c.id)))
        .filter((c) => qualiteImage(c.image) > 0)
        .sort((a, b) => {
          const qa = qualiteImage(a.image);
          const qb = qualiteImage(b.image);
          if (qa !== qb) return qb - qa;
          const ca = completude(a);
          const cb = completude(b);
          if (ca !== cb) return cb - ca;
          const score = (b.score ?? -1) - (a.score ?? -1);
          return score !== 0 ? score : a.title.localeCompare(b.title, "fr");
        });

      // Une seule carte par photo, par partenaire et par région : sans cela la
      // grille répétait la même image (9 offres partagent une couverture) et
      // trois fiches voisines remplissaient la moitié de l'écran.
      // Rotation quotidienne : le classement reste le même, mais la vitrine ne
      // montre plus éternellement les six mêmes fiches. On fait tourner le
      // début des meilleures candidates chaque jour, sans descendre dans les
      // fiches mal documentées.
      const pool = retenues.slice(0, 15);
      const jour = Math.floor(Date.now() / 86_400_000);
      const decalage = pool.length ? (jour * 6) % pool.length : 0;
      const ordonnees = [
        ...pool.slice(decalage),
        ...pool.slice(0, decalage),
        ...retenues.slice(15),
      ];

      const photos = new Set<string>();
      const orgs = new Set<string>();
      const regions = new Map<string, number>();
      const vitrine: Carte[] = [];
      for (const c of ordonnees) {
        const photo = clePhoto(c.image);
        if (photo && photos.has(photo)) continue;

        const org = c.kind === "offer" ? (c.brut?.organization_id ?? null) : null;
        if (org && orgs.has(org)) continue;

        const region = (c.location ?? "").trim();
        if (region && (regions.get(region) ?? 0) >= 2) continue;

        if (photo) photos.add(photo);
        if (org) orgs.add(org);
        if (region) regions.set(region, (regions.get(region) ?? 0) + 1);
        vitrine.push(c);
        if (vitrine.length === 6) break;
      }

      setCartes(vitrine);
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
