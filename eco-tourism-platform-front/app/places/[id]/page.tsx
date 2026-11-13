"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, User } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { apiFetch } from "@/lib/api";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <div className="h-[220px] rounded-xl bg-slate-100 animate-pulse" />,
});

type Lieu = {
  id: string;
  place_name: string | null;
  description: string | null;
  region: string | null;
  image: string | null;
  latitude: number;
  longitude: number;
  author_name: string | null;
};

/**
 * Détail public d'un lieu.
 *
 * Il n'existe pas d'endpoint `GET /publications/:id` public : la liste
 * `GET /publications/places` fait autorité, on y retrouve le lieu par son id —
 * même source que la carte et la liste, donc aucun risque de divergence.
 */
export default function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lieu, setLieu] = useState<Lieu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setError("");
    apiFetch<Lieu[]>("/publications/places")
      .then((list) => {
        if (!alive) return;
        const found = (Array.isArray(list) ? list : []).find((l) => l.id === id) ?? null;
        setLieu(found);
        if (!found) setError("Ce lieu n'existe pas ou n'est plus publié.");
      })
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <Navbar variant="home" />

      <main className="flex-1 px-6 md:px-20 lg:px-40 py-10 max-w-[1100px] mx-auto w-full">
        <button
          onClick={() => router.push("/places")}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tous les lieux
        </button>

        {loading ? (
          <div className="space-y-6">
            <div className="h-80 rounded-3xl bg-slate-200 animate-pulse" />
            <div className="h-8 w-2/3 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          </div>
        ) : error || !lieu ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-bold text-red-600 mb-1">Lieu introuvable</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <article className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
            {/* Visuel */}
            <div className="relative h-80 md:h-96 overflow-hidden">
              {lieu.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${lieu.image}')` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <MapPin className="w-14 h-14 text-emerald-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {lieu.region && (
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-extrabold text-slate-700 uppercase tracking-widest shadow-sm">
                  {lieu.region}
                </span>
              )}
            </div>

            {/* En-tête */}
            <div className="px-6 md:px-8 pt-6 pb-5 border-b border-slate-100">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
                {lieu.place_name ?? "Lieu"}
              </h1>
              {lieu.author_name && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {lieu.author_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{lieu.author_name}</p>
                    <p className="text-xs text-slate-400">Éco-voyageur contributeur</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description + carte */}
            <div className="px-6 md:px-8 py-6 space-y-6">
              {lieu.description && (
                <div>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">
                    Description
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">{lieu.description}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Localisation
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {lieu.latitude.toFixed(4)}, {lieu.longitude.toFixed(4)}
                  </span>
                </div>
                <MapView lat={lieu.latitude} lng={lieu.longitude} label={lieu.place_name ?? undefined} />
              </div>

              {lieu.author_name && (
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  Ajouté par {lieu.author_name}
                </p>
              )}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
