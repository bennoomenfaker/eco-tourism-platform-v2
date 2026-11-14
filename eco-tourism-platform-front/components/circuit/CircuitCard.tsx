"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { OFFER_PLACEHOLDERS, seedFromId } from "@/components/destinations/DetailModals";

/**
 * Forme renvoyée par `GET /circuits/all-public` (voir `CircuitService.findAllPublic`).
 * La carte et la page dédiée `/circuits` partagent ce type et ce rendu : dupliquer
 * la carte aurait garanti la dérive, comme pour la page Destinations.
 */
export type Circuit = {
  id: string;
  provider_id: string;
  title: string;
  description: string | null;
  nb_jours: number;
  cover_image: string | null;
  images?: string[] | null;
  etapes: any[];
  hebergement: any | null;
  tags: string[] | null;
  owner_type: string;
  author_name: string | null;
  author_photo: string | null;
  price?: number | null;
  price_display_from?: number | null;
  bookable_options?: Array<{ key: string; label: string; price_per_person: number }> | null;
  created_at: string;
};

export default function CircuitCard({
  circuit,
  onClick,
}: {
  circuit: Circuit;
  onClick: () => void;
}) {
  const image = circuit.cover_image ?? OFFER_PLACEHOLDERS[seedFromId(circuit.id, OFFER_PLACEHOLDERS.length)];
  const nbEtapes = circuit.etapes?.length ?? 0;

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-60 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-extrabold text-slate-700 uppercase tracking-widest shadow-sm">
            Circuit
          </span>
          <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">
            {circuit.owner_type === "guide" ? "Guide" : "Prestataire"}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="flex items-center gap-1 text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 shrink-0" /> {circuit.nb_jours} jour{circuit.nb_jours > 1 ? "s" : ""}
          </span>
          {nbEtapes > 0 && (
            <span className="flex items-center gap-1 text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3 shrink-0" /> {nbEtapes} étape{nbEtapes > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {circuit.title}
        </h3>
        {circuit.description && (
          <p className="text-slate-500 text-sm line-clamp-2 flex-1 leading-relaxed mb-3">{circuit.description}</p>
        )}
        {circuit.author_name && (
          <div className="flex items-center gap-2 mt-2 mb-1">
            {circuit.author_photo ? (
              <img src={circuit.author_photo} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-100 shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[9px] shrink-0">
                {circuit.author_name[0]}
              </div>
            )}
            <span className="text-xs font-bold text-slate-500 truncate">{circuit.author_name}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400">{circuit.nb_jours}J / {nbEtapes} étape{nbEtapes > 1 ? "s" : ""}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="h-8 px-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold hover:bg-primary hover:text-slate-900 hover:border-primary transition-all text-xs">
            Voir le circuit
          </button>
        </div>
      </div>
    </div>
  );
}
