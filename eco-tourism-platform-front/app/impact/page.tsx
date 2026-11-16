"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import {
  Briefcase, Building, ShoppingBag, Cloud, TreePine, BookOpen, Handshake,
  Leaf, ArrowRight, Users, Target, Info, Sparkles,
  MapPin, CalendarCheck, TrendingUp, ShieldCheck, BarChart3,
} from "lucide-react";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

type PublicImpact = {
  note: string;
  generated_at: string;
  impact: {
    acteurs_engages: number;
    experiences_durables: number;
    lieux_valorises: number;
    reservations_durables: number;
    revenus_locaux: number;
    score_durable_moyen: number;
    ecovoyageurs_evalues: number;
    offres_total: number;
  };
};

const sdgs = [
  {
    num: 8,
    icon: <Briefcase size={28} />,
    title: "Travail décent et croissance économique",
    color: "from-pink-500 to-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    description: "Promouvoir une croissance économique soutenue, inclusive et durable. Favoriser l'emploi et les revenus décents pour tous.",
    actions: [
      "Créer des emplois locaux dans le tourisme durable",
      "Soutenir les petits entrepreneurs et artisans",
      "Promouvoir l'économie sociale et solidaire",
    ],
  },
  {
    num: 11,
    icon: <Building size={28} />,
    title: "Villes et communautés durables",
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    description: "Rendre les villes et les habitats inclusifs, sûrs, résilients et durables. Protéger le patrimoine culturel et naturel.",
    actions: [
      "Préserver les médinas et patrimoines locaux",
      "Développer un tourisme urbain responsable",
      "Améliorer l'accessibilité des sites touristiques",
    ],
  },
  {
    num: 12,
    icon: <ShoppingBag size={28} />,
    title: "Consommation responsable",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    description: "Assurer des modes de consommation et de production durables. Réduire le gaspillage alimentaire et la pollution.",
    actions: [
      "Promouvoir les produits locaux et de saison",
      "Encourager la réduction des déchets plastiques",
      "Soutenir les circuits courts et l'agriculture bio",
    ],
  },
  {
    num: 15,
    icon: <TreePine size={28} />,
    title: "Vie terrestre",
    color: "from-lime-500 to-green-500",
    bgColor: "bg-lime-50",
    textColor: "text-lime-600",
    borderColor: "border-lime-200",
    description: "Protéger, restaurer et promouvoir l'utilisation durable des écosystèmes terrestres. Lutter contre la désertification.",
    actions: [
      "Protéger les zones naturelles et parcs nationaux",
      "Promouvoir l'écotourisme responsable",
      "Sensibiliser à la biodiversité locale",
    ],
  },
  {
    num: 4,
    icon: <BookOpen size={28} />,
    title: "Éducation de qualité",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    description: "Assurer l'accès de tous à une éducation de qualité, sur un pied d'égalité, et promouvoir les possibilités d'apprentissage tout au long de la vie.",
    actions: [
      "Sensibiliser les voyageurs au patrimoine et à la culture locale",
      "Former les guides et prestataires au tourisme durable",
      "Valoriser les savoir-faire artisanaux traditionnels",
    ],
  },
  {
    num: 13,
    icon: <Cloud size={28} />,
    title: "Action climatique",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    description: "Lutter contre le changement climatique et ses impacts. Intégrer les mesures climatiques dans les politiques et stratégies.",
    actions: [
      "Compenser les émissions de carbone des voyages",
      "Promouvoir les transports à faibles émissions",
      "Sensibiliser les voyageurs aux enjeux climatiques",
    ],
  },
  {
    num: 17,
    icon: <Handshake size={28} />,
    title: "Partenariats pour la réalisation des objectifs",
    color: "from-blue-600 to-indigo-700",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    description: "Renforcer les moyens de mettre en œuvre le partenariat mondial pour le développement durable et le revitaliser.",
    actions: [
      "Collaborer avec les acteurs locaux, ONG et institutions",
      "Partager les données et les bonnes pratiques",
      "Développer des partenariats public-privé pour la durabilité",
    ],
  },
];

const STATS = [
  { key: "acteurs_engages", label: "Acteurs engagés", icon: Users, color: "from-emerald-500 to-teal-600" },
  { key: "experiences_durables", label: "Expériences durables", icon: Leaf, color: "from-green-500 to-emerald-600" },
  { key: "lieux_valorises", label: "Territoires valorisés", icon: MapPin, color: "from-amber-400 to-orange-500" },
  { key: "reservations_durables", label: "Réservations durables", icon: CalendarCheck, color: "from-blue-500 to-indigo-600" },
  { key: "revenus_locaux", label: "Revenus locaux (TND)", icon: TrendingUp, color: "from-teal-400 to-cyan-600" },
  { key: "ecovoyageurs_evalues", label: "Éco-voyageurs évalués", icon: ShieldCheck, color: "from-purple-400 to-violet-600" },
  { key: "score_durable_moyen", label: "Score durable moyen", icon: Sparkles, color: "from-pink-400 to-rose-500", suffix: "/100" },
  { key: "offres_total", label: "Offres totales", icon: Briefcase, color: "from-slate-400 to-slate-600" },
];

const ODD_LIST = [
  { id: 8, name: "Travail décent et croissance économique", color: "#A21942" },
  { id: 11, name: "Villes et communautés durables", color: "#FD9D24" },
  { id: 12, name: "Consommation et production responsables", color: "#BF8B2E" },
  { id: 15, name: "Vie terrestre", color: "#56C02B" },
  { id: 4, name: "Éducation de qualité", color: "#C5192D" },
  { id: 13, name: "Lutte contre les changements climatiques", color: "#3F7E44" },
  { id: 17, name: "Partenariats pour la réalisation des objectifs", color: "#19486A" },
];

export default function ImpactPage() {
  const router = useRouter();
  const [data, setData] = useState<PublicImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<PublicImpact>("/dashboard/public-overview")
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="home" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-24 text-center relative">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-bold mb-6">
              <Target size={14} /> Impact & Développement Durable
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
              Notre impact
            </h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Sustainable Adventures s&apos;inscrit dans les Objectifs de Développement Durable des Nations Unies pour un tourisme responsable et durable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard impact réel AFRATIM */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-3xl border-4 border-emerald-500 border-t-transparent animate-spin" />
            <p className="text-sm font-bold text-slate-400">Chargement de l&apos;impact AFRATIM…</p>
          </div>
        ) : error || !data ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Info className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-bold text-slate-400">Données temporairement indisponibles.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* En-tête section */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 md:p-6 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-extrabold mb-3">
                <BarChart3 size={13} /> Impact AFRATIM · Données réelles
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Des chiffres réels, <span className="text-emerald-600">pas des promesses</span>
              </h2>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed mt-2">
                Chaque chiffre ci-dessous est agrégé depuis la plateforme AFRATIM : acteurs engagés,
                expériences durables, territoires valorisés et réservations responsables.
              </p>
            </motion.div>

            {/* KPI agrégés */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {STATS.map((s, i) => {
                const raw = data.impact[s.key as keyof typeof data.impact];
                const value = raw.toLocaleString("fr-FR");
                return (
                  <motion.div
                    key={s.key}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md shadow-black/5 mb-3`}>
                      <s.icon size={16} className="text-white" />
                    </div>
                    <p className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {value}
                      {s.suffix && <span className="text-xs font-extrabold text-slate-400 ml-1">{s.suffix}</span>}
                    </p>
                    <p className="text-[10px] md:text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mt-1">{s.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* ODD */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.15em] mb-4">Nos Objectifs de Développement Durable</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ODD_LIST.map((odd) => (
                  <div key={odd.id} className="flex items-center gap-3 rounded-2xl border border-slate-100/80 p-3.5 hover:border-slate-200 transition-colors">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-extrabold shrink-0" style={{ background: odd.color }}>
                      {odd.id}
                    </span>
                    <p className="text-xs font-bold text-slate-700 leading-snug">{odd.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Note de transparence */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
              <Info size={16} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-emerald-800">Transparence du reporting</p>
                <p className="text-[11px] font-semibold text-emerald-700/70 mt-1 leading-relaxed">
                  {data.note} · Mise à jour : {new Date(data.generated_at).toLocaleString("fr-FR")} ·
                  Données de démonstration exclues des agrégats publics.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SDGs */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-4">Objectifs de Développement Durable</h2>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
            Nos actions contribuent directement à ces objectifs mondiaux.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sdgs.map((sdg, i) => (
            <motion.div
              key={sdg.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl border ${sdg.borderColor} overflow-hidden`}
            >
              <div className={`bg-gradient-to-r ${sdg.color} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    {sdg.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold opacity-80">ODD {sdg.num}</div>
                    <h3 className="text-xl font-extrabold">{sdg.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{sdg.description}</p>
                <div className="space-y-2">
                  {sdg.actions.map((action) => (
                    <div key={action} className="flex items-start gap-2">
                      <Leaf size={14} className={`${sdg.textColor} mt-0.5 shrink-0`} />
                      <span className="text-sm text-slate-600">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Notre engagement</h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
              Chaque réservation, chaque circuit, chaque projet sur Sustainable Adventures contribue à un avenir plus durable.
              Ensemble, nous construisons un tourisme responsable qui respecte les personnes et la planète.
            </p>
            <button
              onClick={() => router.push("/auth/register")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Rejoindre le mouvement <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}