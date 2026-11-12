export const kpiRegistry: Record<string, {
  label: string;
  definition: string;
  source: string;
  unit?: string;
  icon?: React.ReactNode;
  status?: "ok" | "warning" | "error";
}> = {
  users: {
    label: "Utilisateurs totaux",
    definition: "Nombre total de comptes créés sur la plateforme (tous rôles confondus).",
    source: "Table users (PostgreSQL)",
    unit: "comptes",
  },
  guides: {
    label: "Guides inscrits",
    definition: "Nombre de comptes avec le rôle 'guide' validés par l'administration.",
    source: "Table users + role guide",
    unit: "guides",
  },
  providers: {
    label: "Prestataires inscrits",
    definition: "Nombre de comptes avec le rôle 'provider' validés par l'administration.",
    source: "Table users + role provider",
    unit: "prestataires",
  },
  offers: {
    label: "Offres publiées",
    definition: "Nombre total d'offres (tous statuts) créées par les guides et prestataires.",
    source: "Table offers",
    unit: "offres",
  },
  offers_durable: {
    label: "Offres durables",
    definition: "Offres dont le score de durabilité est ≥ 60/100 (seuil AFRATIM).",
    source: "Table offers + sustainability_score",
    unit: "offres",
  },
  reservations: {
    label: "Réservations confirmées",
    definition: "Nombre de réservations avec statut 'confirmed' ou 'completed'.",
    source: "Table reservations",
    unit: "réservations",
  },
  revenue: {
    label: "Revenus générés",
    definition: "Somme des montants des réservations confirmées (commission plateforme incluse).",
    source: "Table reservations + price",
    unit: "TND",
  },
  satisfaction: {
    label: "Satisfaction moyenne",
    definition: "Note moyenne laissée par les éco-voyageurs après expérience (sur 5).",
    source: "Table reviews",
    unit: "/5",
  },
  places: {
    label: "Lieux référencés",
    definition: "Nombre de lieux (places) publiés et validés sur la carte communautaire.",
    source: "Table places",
    unit: "lieux",
  },
  reports: {
    label: "Signalements environnement",
    definition: "Nombre de signalements d'incidents environnementaux soumis par la communauté.",
    source: "Table reports (type environnement)",
    unit: "signalements",
  },
  eco_travelers_scored: {
    label: "Éco-voyageurs évalués",
    definition: "Nombre d'éco-voyageurs ayant complété le questionnaire de durabilité.",
    source: "Table eco_traveler_scores",
    unit: "voyageurs",
  },
  establishments: {
    label: "Établissements",
    definition: "Nombre d'organisations/établissements déclarés par les prestataires.",
    source: "Table organizations",
    unit: "établissements",
  },
  guides_actifs: {
    label: "Guides actifs",
    definition: "Guides ayant au moins une offre publiée et disponible à la réservation.",
    source: "Table offers + users (role=guide)",
    unit: "guides",
  },
  prestataires_actifs: {
    label: "Prestataires actifs",
    definition: "Prestataires ayant au moins une offre publiée et disponible à la réservation.",
    source: "Table offers + users (role=provider)",
    unit: "prestataires",
  },
  experiences_publiees: {
    label: "Expériences publiées",
    definition: "Total offres + circuits publiés (statut publié).",
    source: "Tables offers + circuits",
    unit: "expériences",
  },
  reservations_confirmees: {
    label: "Réservations confirmées",
    definition: "Réservations passées au statut 'confirmed' ou 'completed'.",
    source: "Table reservations",
    unit: "réservations",
  },
  revenus_generes: {
    label: "Revenus générés",
    definition: "Chiffre d'affaires total issu des réservations confirmées (TND).",
    source: "Table reservations",
    unit: "TND",
  },
  lieux_references: {
    label: "Lieux référencés",
    definition: "Nombre total de lieux (places) validés sur la plateforme.",
    source: "Table places",
    unit: "lieux",
  },
  lieux_naturels: {
    label: "Lieux naturels",
    definition: "Lieux classés dans la catégorie 'nature' (parcs, réserves, plages, etc.).",
    source: "Table places (category=nature)",
    unit: "lieux",
  },
  lieux_culturels: {
    label: "Lieux culturels",
    definition: "Lieux classés dans la catégorie 'culture' (musées, sites historiques, etc.).",
    source: "Table places (category=culture)",
    unit: "lieux",
  },
  circuits_patrimoine: {
    label: "Circuits patrimoine",
    definition: "Circuits incluant au moins une étape de type patrimoine culturel.",
    source: "Table circuits + circuit_steps",
    unit: "circuits",
  },
  ecovoyageurs_evalues: {
    label: "Éco-voyageurs évalués",
    definition: "Voyageurs ayant complété le questionnaire de durabilité (score calculé).",
    source: "Table eco_traveler_scores",
    unit: "voyageurs",
  },
  offres_durables: {
    label: "Offres durables",
    definition: "Offres avec score de durabilité ≥ 60/100.",
    source: "Table offers (sustainability_score >= 60)",
    unit: "offres",
  },
  score_moyen_eco: {
    label: "Score moyen éco-voyageurs",
    definition: "Moyenne des scores de durabilité des éco-voyageurs évalués.",
    source: "Table eco_traveler_scores",
    unit: "/100",
  },
  score_moyen_guides: {
    label: "Score moyen guides",
    definition: "Moyenne des scores de durabilité des offres portées par des guides.",
    source: "Table offers (role=guide) + sustainability_score",
    unit: "/100",
  },
  score_moyen_prestataires: {
    label: "Score moyen prestataires",
    definition: "Moyenne des scores de durabilité des offres portées par des prestataires.",
    source: "Table offers (role=provider) + sustainability_score",
    unit: "/100",
  },
  experiences_nature: {
    label: "Expériences nature",
    definition: "Offres et circuits classés dans la macro-catégorie 'nature'.",
    source: "Tables offers + circuits (macro=nature)",
    unit: "expériences",
  },
  reservations_nature: {
    label: "Réservations nature",
    definition: "Réservations sur des offres/circuits de type 'nature'.",
    source: "Table reservations + offers/circuits (macro=nature)",
    unit: "réservations",
  },
  signalements_env: {
    label: "Signalements environnement",
    definition: "Nombre de signalements de type environnemental reçus.",
    source: "Table reports (category=environment)",
    unit: "signalements",
  },
  feedbacks_durabilite: {
    label: "Feedbacks durabilité",
    definition: "Nombre d'avis mentionnant des critères de durabilité (éco-responsable, local, etc.).",
    source: "Table reviews (mots-clés durabilité)",
    unit: "feedbacks",
  },
  taux_traitement_signalements: {
    label: "Taux de traitement signalements",
    definition: "Pourcentage de signalements traités (résolus ou fermés) sur le total reçu.",
    source: "Table reports (status=resolved|closed)",
    unit: "%",
  },
  score_evolution: {
    label: "Évolution score durable",
    definition: "Différence entre score actuel et score initial (snapshot) par rôle.",
    source: "Table score_history (snapshots)",
    unit: "pts",
  },
};