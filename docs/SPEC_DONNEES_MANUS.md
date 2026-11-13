# 📦 Structure de données à envoyer à Manus — lieux, hébergements, campings, kayak, événements du Sud

Objectif : un jeu de données **réel et vérifiable** (Tunisie), directement importable dans la base de la plateforme, couvrant 5 familles : **lieux**, **hébergements**, **campings**, **kayak**, **événements dans le Sud**.

---

## 1. Où se trouve le projet v2 sur le serveur

| Élément | Chemin sur le VPS `91.134.139.163` |
|---|---|
| Code backend (NestJS) | `/home/admin/v2/backend/` |
| Code frontend (Next.js) | `/home/admin/v2/frontend/` |
| Compose de production | `/home/admin/v2/docker-compose.yml` |
| Variables d'environnement | `/home/admin/v2/backend/.env.production` |
| Base PostgreSQL | conteneur `tourisme-db-1` → base `tourism_db` |
| Sauvegardes | `/srv/tourisme/sauvegardes/` |
| Ancienne app (arrêtée, rollback) | `/srv/tourisme/` |

Site : http://ecovoyage.duckdns.org:3004 — API : http://91.134.139.163:3003/api

---

## 2. Les 3 tables utilisées

| Famille demandée | Table | `type` / `offer_type` / `offer_subtype` |
|---|---|---|
| **Lieu** (plage, cascade, oasis, site archéologique…) | `publications` | `type = 'place'` |
| **Lieu vécu / récit** (événement non réservable) | `publications` | `type = 'experience'` |
| **Hébergement** | `offers` | `offer_type = 'hebergement'` + sous-type |
| **Camping** | `offers` | `offer_type = 'hebergement'` + `camping_sauvage` / `tente_glamping` / `gite_rural` |
| **Kayak** | `offers` | `offer_type = 'activite'` + `kayak_canoe` |
| **Événement du Sud** (réservable) | `offers` | `offer_type = 'activite'` + `soiree_culturelle` / `spectacle_traditionnel` |
| **Circuit multi-jours** | `circuits` | — |

Conventions : les identifiants sont des UUID ; les colonnes `text` listes contiennent des valeurs **séparées par des virgules** (pas des tableaux JSON) ; seul `details` / `etapes` / `tags` sont du JSON.

### Sous-types acceptés (valeurs exactes de la plateforme)

- **Hébergement** : `dortoir`, `chambre_standard`, `chambre_superieure`, `suite`, `bungalow`, `tente_glamping`, `gite_rural`, `maison_hotes`, `riad_traditionnel`, `ecolodge`, `camping_sauvage`, `ferme_agritouristique`
- **Activité** : `randonnee`, `kayak_canoe`, `velo_vtt`, `escalade`, `yoga`, `plongee`, `surf_windsurf`, `tir_arc`, `quad_4x4`, `peche_traditionnelle`, `cours_cuisine`, `plantation_jardinage`, `observation_oiseaux`, `equitation`
- **Culture / événement** : `soiree_culturelle`, `spectacle_traditionnel`, `atelier_musical`, `visite_medina`, `circuit_historique`, `visite_musee`, `hammam_traditionnel`
- **Nature / circuit** : `circuit_nature`, `safari_desert`, `observation_faune`, `observation_etoiles`, `speleologie`, `visite_oasis`, `circuit_montagne`, `tour_cotier`

---

## 3. Fichiers à livrer

| Fichier | Contenu | Volume cible |
|---|---|---|
| `lieux.json` | lieux réels de toute la Tunisie | 80 |
| `hebergements.json` | hôtels, maisons d'hôtes, écolodges, gîtes, riads | 35 |
| `campings.json` | campings sauvages, glamping, campings aménagés | 20 |
| `kayak.json` | sorties kayak / canoë réelles | 20 |
| `evenements.json` | festivals, soirées, spectacles du Sud | 20 |
| `circuits.json` | itinéraires multi-jours | 10 |

Répartition géographique imposée : Jendouba, Tabarka, Bizerte, Le Kef, Tunis, Nabeul, Sousse, Monastir, Mahdia, Sfax, **Gafsa, Tozeur, Kébili (Douz), Gabès, Médenine (Djerba, Zarzis), Tataouine**.

---

## 4. Schémas exacts (clés à respecter)

### 4.1 `lieux.json` → `publications` (`type='place'`)

```json
{
  "title": "Cascades de Beni M'Tir",
  "place_name": "Beni M'Tir",
  "description": "Cascades naturelles dans la forêt de Kroumirie, accessibles par un sentier ombragé depuis le village.",
  "region": "Jendouba",
  "latitude": 36.7223,
  "longitude": 8.7336,
  "images": "https://…/photo1.jpg,https://…/photo2.jpg",
  "type": "place",
  "status": "approved",
  "source_url": "https://www.instagram.com/p/…",
  "image_credit": "@compte_instagram"
}
```

Champs obligatoires en base : `title`, `place_name`, `region`, `latitude`, `longitude`, `images`, `type`, `status`.

### 4.2 `hebergements.json` → `offers` (`offer_type='hebergement'`)

```json
{
  "title": "Maison d'hôtes Dar El Ain",
  "offer_type": "hebergement",
  "offer_subtype": "maison_hotes",
  "offer_mode": "single",
  "description": "Maison traditionnelle restaurée à Aïn Draham, 4 chambres, petit-déjeuner local, chauffage au bois.",
  "price": 120,
  "price_type": "per_night",
  "duration": "1 nuit",
  "capacity": 8,
  "min_group_size": 1,
  "max_group_size": 8,
  "region": "Jendouba",
  "meeting_point": "Aïn Draham, centre",
  "meeting_lat": 36.7833,
  "meeting_lng": 8.6833,
  "inclusions": "Petit-déjeuner, draps et serviettes, chauffage",
  "cancellation_policy": "Gratuit jusqu'à 48 h avant",
  "images": "https://…/a.jpg,https://…/b.jpg",
  "confirmation_mode": "automatic",
  "deposit_percentage": 30,
  "details": {
    "titre": "Chambre double vue forêt",
    "type_chambre": "Double",
    "nb_lits": 2,
    "salle_bain": "Privée",
    "petit_dejeuner": true,
    "climatisation": false
  },
  "status": "pending",
  "source_url": "https://…",
  "image_credit": "@…"
}
```

Colonnes NOT NULL à fournir systématiquement : `offer_type`, `offer_mode`, `price_type`, `confirmation_mode`, `deposit_percentage`, `status`.

Valeurs autorisées par les écrans de la plateforme :

- `price_type` : `per_person` (par personne), `per_night` (par nuit), `per_group` (par groupe), `per_item` (par pièce)
- `availability_mode` : `always` (disponible en permanence), `period` (période définie), `weekly` (récurrent hebdomadaire), `specific` (dates spécifiques — à utiliser pour les événements)
- `confirmation_mode` : `automatic` ou `manual`

### 4.3 `campings.json` → `offers` (`offer_type='hebergement'`)

Sous-types : `camping_sauvage` (bivouac, tente, van), `tente_glamping` (tente équipée), `gite_rural`.

```json
{
  "title": "Bivouac dans les dunes de Douz",
  "offer_type": "hebergement",
  "offer_subtype": "camping_sauvage",
  "offer_mode": "single",
  "description": "Emplacement en bordure d'erg, accès eau non potable à 300 m, feu de camp autorisé, couchage sous tente fournie.",
  "price": 35,
  "price_type": "per_person",
  "duration": "1 nuit",
  "capacity": 12,
  "region": "Kébili",
  "meeting_lat": 33.4667,
  "meeting_lng": 9.0167,
  "inclusions": "Emplacement, tente, dîner berbère, petit-déjeuner",
  "images": "https://…/a.jpg",
  "confirmation_mode": "automatic",
  "deposit_percentage": 20,
  "details": {
    "nom_emplacement": "Erg Nord — zone 2",
    "surface_m2": 40,
    "type_accepte_offre": "Tente",
    "vue": "Dunes",
    "sol": "Sable",
    "acces_eau_offre": false,
    "sanitaires_offre": "Aucun",
    "feu_camp_offre": true,
    "borne_electrique": false,
    "ombre": false,
    "animaux": true,
    "heure_arrivee": "16:00",
    "heure_depart": "09:00"
  },
  "status": "pending",
  "source_url": "https://…",
  "image_credit": "@…"
}
```

### 4.4 `kayak.json` → `offers` (`offer_type='activite'`, `offer_subtype='kayak_canoe'`)

```json
{
  "title": "Kayak côtier aux aiguilles de Tabarka",
  "offer_type": "activite",
  "offer_subtype": "kayak_canoe",
  "offer_mode": "single",
  "description": "Sortie de 3 h le long des formations rocheuses, encadrée par un moniteur, accessible aux débutants.",
  "price": 70,
  "price_type": "per_person",
  "duration": "3 h",
  "region": "Tabarka",
  "meeting_point": "Port de plaisance de Tabarka",
  "meeting_lat": 36.9547,
  "meeting_lng": 8.7583,
  "min_group_size": 2,
  "max_group_size": 10,
  "min_age": 12,
  "inclusions": "Moniteur, kayak biplace, gilet, pagaie, photos",
  "images": "https://…/a.jpg,https://…/b.jpg",
  "confirmation_mode": "automatic",
  "deposit_percentage": 30,
  "details": {
    "titre": "Aiguilles de Tabarka en kayak",
    "parcours": "Port → aiguilles → grottes marines → retour",
    "distance_km": 7,
    "duree": "3 h",
    "niveau_offre": "Débutant",
    "type_embarcation_offre": "Kayak duo",
    "nb_embarcations_offre": 5,
    "equipement_fourni": ["Kayak / Canoë", "Pagaie", "Gilet de sauvetage", "Sac étanche"],
    "inclus": ["Encadrement", "Briefing sécurité", "Photos"],
    "nb_participants_min": 2,
    "nb_participants_max": 10,
    "age_minimum": 12,
    "savoir_nager": true
  },
  "status": "pending",
  "source_url": "https://…",
  "image_credit": "@…"
}
```

### 4.5 `evenements.json` → `offers` (`offer_type='activite'`)

Événement **réservable** : `soiree_culturelle` (soirée, dîner-concert) ou `spectacle_traditionnel`.
Événement **non réservable** (festival, fête locale) : `publications` avec `"type": "experience"` (mêmes clés que 4.1).

```json
{
  "title": "Soirée musicale dans une oasis de Tozeur",
  "offer_type": "activite",
  "offer_subtype": "soiree_culturelle",
  "offer_mode": "single",
  "description": "Soirée de musique traditionnelle dans une palmeraie, dîner local inclus, 60 places.",
  "price": 60,
  "price_type": "per_person",
  "duration": "3 h",
  "region": "Tozeur",
  "meeting_point": "Oasis de Chebika, entrée principale",
  "meeting_lat": 34.0167,
  "meeting_lng": 8.1500,
  "capacity": 60,
  "images": "https://…/a.jpg",
  "availability_mode": "specific",
  "availability_start": "2027-03-20",
  "availability_end": "2027-03-22",
  "confirmation_mode": "automatic",
  "deposit_percentage": 50,
  "details": {
    "titre": "Nuits de l'oasis",
    "programme_offre": ["Musique live", "Dîner traditionnel"],
    "duree": "3 h",
    "description_programme": "Concert de malouf puis dîner sous les palmiers.",
    "restauration_offre": true,
    "menu_soiree": "Couscous aux légumes du jardin, thé à la menthe",
    "nb_participants_min": 10,
    "nb_participants_max": 60
  },
  "status": "pending",
  "source_url": "https://…",
  "image_credit": "@…"
}
```

Événements du Sud à couvrir en priorité : Festival des Oasis (Tozeur), Festival international du Sahara (Douz), Festival des Ksour (Tataouine), Festival de Djerba, fêtes des dattes (Kébili), marchés hebdomadaires, soirées musicales dans les oasis, mariages/cérémonies ouvertes au public **uniquement si réellement ouvertes**.

### 4.6 `circuits.json` → `circuits`

```json
{
  "title": "Sud tunisien : oasis, ksour et désert en 4 jours",
  "description": "Tozeur, Chebika, Douz, Matmata, Tataouine : palmeraies, ksour et nuit sous tente.",
  "nb_jours": 4,
  "cover_image": "https://…/cover.jpg",
  "price": 780,
  "circuit_mode": "package",
  "owner_type": "provider",
  "etapes": [
    { "jour": 1, "titre": "Oasis de montagne", "description": "Chebika, Tamerza, Midès", "categorie": "activite", "heure_debut": "09:00", "heure_fin": "17:00", "prix": 0 }
  ],
  "tags": ["desert", "oasis", "patrimoine"],
  "confirmation_mode": "automatic",
  "deposit_percentage": 30,
  "status": "pending",
  "source_url": "https://…",
  "image_credit": "@…"
}
```

Colonnes NOT NULL : `nb_jours`, `etapes`, `circuit_mode`, `owner_type`, `confirmation_mode`, `deposit_percentage`, `status`.

---

## 5. Consignes à joindre au prompt Manus

```
Constitue un jeu de données VÉRIFIÉ sur le tourisme réel en Tunisie, en 6 fichiers JSON.

Volumes : lieux.json (80) · hebergements.json (35) · campings.json (20) ·
kayak.json (20) · evenements.json (20) · circuits.json (10).

Couverture : Jendouba, Tabarka, Bizerte, Le Kef, Tunis, Nabeul, Sousse,
Monastir, Mahdia, Sfax, Gafsa, Tozeur, Kébili/Douz, Gabès, Médenine/Djerba/Zarzis,
Tataouine.

Règles strictes :
1. Uniquement des lieux, hébergements, campings, clubs de kayak et événements
   qui existent réellement — vérifier nom, adresse et activité.
2. Coordonnées GPS exactes (6 décimales) + région administrative.
3. Photos : URL publiques stables, avec l'URL du post d'origine et le compte
   Instagram/Facebook crédité. Interdit : images générées par IA, captures de
   story éphémère, banques d'images génériques.
4. Prix en dinars tunisiens, cohérents avec le marché local ; ne rien inventer
   (laisser null si inconnu).
5. Pour les événements : dates réelles de l'édition en cours ou à venir,
   sinon type "experience" dans lieux.json sans date inventée.
6. Descriptions factuelles de 2 à 4 phrases, en français.
7. Sortie : les 6 fichiers JSON, clés strictement identiques aux modèles fournis,
   aucune clé obligatoire manquante, aucune clé inventée.
8. Ajouter pour chaque entrée "source_url" et "image_credit".
```

---

## 6. Où mettre les images récoltées

La plateforme **n'héberge pas de fichiers sur le VPS** (disque à 92 %) : les images sont stockées chez **Cloudinary** (dossier `eco-tourism/`) via `POST /api/upload` (JWT admin requis, image ≤ 10 Mo), et la base ne contient que l'URL.

### Règle à imposer à Manus

Manus **ne peut pas téléverser** dans notre Cloudinary (pas d'accès à l'API authentifiée). Il doit donc livrer **les fichiers + un manifeste**, et l'import les envoie lui-même :

1. Un dossier `images/` avec les fichiers nommés par slug : `beni-mtir-1.jpg`, `beni-mtir-2.jpg`, `douz-bivouac-1.jpg`…
2. Un fichier `images.json` :

```json
[
  {
    "slug": "beni-mtir",
    "files": ["beni-mtir-1.jpg", "beni-mtir-2.jpg"],
    "source_url": "https://www.instagram.com/p/…",
    "image_credit": "@compte_instagram",
    "place": "Cascades de Beni M'Tir"
  }
]
```
3. Dans les 6 fichiers de données, le champ `images` reste **vide** (`""`) : il sera rempli automatiquement avec les URLs Cloudinary après téléversement.

### Contraintes techniques à préciser

- Formats : JPG ou WebP, largeur ≥ 1200 px, poids ≤ 2 Mo par image (limite API : 10 Mo).
- Pas de capture d'écran avec interface Instagram/Facebook, pas de filigrane, pas d'image générée par IA.
- Une URL de post d'origine + le compte crédité par image (obligatoire, usage éditorial).
- Si une photo ne peut pas être récupérée proprement, laisser la liste vide plutôt que d'inventer un visuel.

### Traitement côté plateforme

Pour chaque image : `POST http://91.134.139.163:3003/api/upload` (multipart `file`) → réponse `{"url": "https://res.cloudinary.com/…"}` ; l'URL est concaténée (séparée par des virgules) dans `offers.images`, `publications.images` ou `circuits.cover_image` au moment de l'import.

> Alternative acceptable : Manus fournit uniquement des **URLs directes stables** (CDN, site officiel du prestataire). Les URLs de type `scontent-*.cdninstagram.com` **expirent** : elles ne doivent pas être stockées telles quelles.

---

## 7. Import dans la base

Les JSON reçoivent un `author_id` (compte admin/guide existant), `status = 'pending'` par défaut, puis sont chargés dans `tourisme-db-1`. Les `lieux.json` avec `type = 'place'` et `status = 'approved'` apparaissent immédiatement sur la carte de la page d'accueil ; les offres et événements passent par la validation admin avant publication.
