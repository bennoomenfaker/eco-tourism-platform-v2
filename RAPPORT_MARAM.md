# Rapport pour Maram — état de la v2 déployée

Dernière mise à jour : 14 novembre 2026 (soir).

## 1. Où voir le site

| Élément | URL |
|---|---|
| Site | http://ecovoyage.duckdns.org:3004 |
| API | http://ecovoyage.duckdns.org:3003/api |
| Swagger | http://ecovoyage.duckdns.org:3003/swagger |
| Serveur | `admin@91.134.139.163`, sources dans `~/v2` |

Le port 3004 est utilisé volontairement : **Traefik n'est pas réparé** (erreur
`client version 1.24 is too old`) et n'est pas rattaché au réseau
`tourisme_net`. Tant que ce n'est pas fait, `https://ecovoyage.duckdns.org`
sans port ne sert pas la v2. Depuis certains réseaux (wifi de la fac par
exemple) seuls les ports 80/443/8080 sortent : dans ce cas le site est
injoignable depuis ce réseau, ce n'est pas un bug de l'application.

Conteneurs : `v2-api` (3003 → 3000) et `v2-web` (3004 → 3000).
Base : conteneur `tourisme-db-1`, utilisateur `marammejri`, base `tourism_db`.
Les autres applications du serveur (veille, volontariat, toolbox, Traefik,
Ollama) n'ont jamais été modifiées.

## 2. État des données

Vérifié en base le 14/11 au soir :

| Contenu | Nombre | Images Cloudinary |
|---|---|---|
| Lieux (`publications.type='place'`) | 42 | 42 / 42 |
| Offres approuvées (`offers`) | 51 | 51 / 51 |
| Circuits | 14 | 14 / 14, toutes avec galerie de 3 images |

- **Zéro hotlink** : aucune URL `wikimedia`, `unsplash`, `picsum`,
  `placeholder` ou `staticflickr` ne reste dans `publications`, `offers` ou
  `circuits`. Tout est servi par `res.cloudinary.com/depzhocsd`.
- Les doublons de lieux ont été supprimés (`demo-data/05-dedup-places.sql`),
  y compris un dernier « Erriadh » en double retiré manuellement.
- Chaque lieu porte une **catégorie** (`place_category`) :

| Catégorie | Lieux |
|---|---|
| Village & patrimoine | 18 |
| Oasis & désert | 7 |
| Plage & littoral | 6 |
| Site archéologique | 5 |
| Forêt & montagne | 4 |
| Parc & réserve | 3 |

## 3. Ce qui a été fait

### Accueil `/`

- La vitrine affiche en priorité les **hébergements réels avec photo
  Cloudinary** (Au Trait d'union Tijma, Auberge Ben Ahmed, Azul Chenini,
  Dar Annaïm, Dar Ayed, Dar El Margoum), puis les offres les mieux notées.
  Avant, le tri au seul score de durabilité faisait remonter des fiches de
  démonstration.
- Les trois fiches « Écolodge Les Chênes » (nuitée, chambre Forêt, formule)
  sont **exclues de la vitrine** : elles n'occupaient pas moins de trois
  cartes sur six. Elles restent visibles dans `/destinations`.
- Règle ajoutée : **une seule carte par organisation** sur l'accueil, pour
  qu'un partenaire ne puisse pas remplir toute la grille avec ses variantes.

### Carte de l'accueil

- Nouveau **filtre par nature de lieu** au-dessus de la carte : Tous les
  lieux, Village & patrimoine, Oasis & désert, Plage & littoral, Site
  archéologique, Forêt & montagne, Parc & réserve — chaque puce affiche son
  nombre, le bouton actif est en vert, et un compteur annonce « N lieux
  affichés ». Le filtrage ajoute/retire les épingles sans reconstruire la
  carte, donc le zoom choisi est conservé et la vue se recadre sur la
  sélection.
- La puce « X lieux sur la carte » est lisible au repos (bordure grise, texte
  foncé) au lieu de n'apparaître qu'au survol.
- Le lien **Lieux** a été retiré de la navbar, et **AFRATIM ODD** est repassé
  en couleur normale (il était en couleur d'accent).

### Performance

Le problème n'était pas la base (une requête prend ~50 ms) mais le transport :
les réponses n'étaient pas compressées.

- **gzip** activé côté Nest (`compression`, seuil 1 Ko).
- Suppression du N+1 dans `findAllPublic` (offres et circuits) via `In(...)`
  et une `Map`.
- Cache mémoire de 60 s côté front sur les GET publics, avec dédoublonnage
  des requêtes simultanées (`PUBLIC_GET_TTL_MS`).

Mesures après déploiement (taille transférée) :

| Endpoint | Avant | Après |
|---|---|---|
| `/offers` | 94 776 o (1,55 s) | 10 778 o |
| `/circuits/all-public` | 26 428 o | 5 656 o |
| `/publications/places` | 19 275 o | 6 751 o |
| `/publications/experiences` | 2 251 o | 2 466 o |

### Fiches détail

Galeries multi-images Cloudinary sur les lieux, les circuits et les offres
(colonne `images` en plus de l'image de couverture).

## 4. Comment déployer

Depuis le dépôt local :

```bash
rsync -az --exclude node_modules --exclude .next --exclude .git --exclude dist \
  --exclude '.env*' eco-tourism-platform-backend/ admin@91.134.139.163:~/v2/backend/
rsync -az --exclude node_modules --exclude .next --exclude .git --exclude dist \
  --exclude '.env*' eco-tourism-platform-front/ admin@91.134.139.163:~/v2/frontend/
ssh admin@91.134.139.163 'cd ~/v2 && docker compose up -d --build --force-recreate'
```

`--force-recreate` est important : sans lui, Compose répond parfois
« Running » et les conteneurs continuent de servir l'ancienne image.

Le backend a **deux** lockfiles (`package-lock.json` et `yarn.lock`) et le
Dockerfile installe avec `yarn --frozen-lockfile` : toute dépendance ajoutée
doit figurer dans les deux, sinon le build échoue.

Attention au disque : 72 Go dont ~9,5 Go libres. Un `ENOSPC` pendant le build
ressemble à une erreur de lockfile mais n'en est pas une. Nettoyages sans
risque pour les autres apps : `docker builder prune -f` et
`docker image prune -f` (jamais `-a`, jamais `docker volume prune`).

## 5. Limites connues

- Traefik non réparé : pas de HTTPS ni de port 443 pour la v2.
- La catégorie d'un lieu n'est pas encore saisissable depuis le formulaire
  d'ajout : un lieu créé depuis l'interface tombera dans « Autres lieux »
  jusqu'au backfill.
- Le filtre de catégorie n'existe que sur la carte de l'accueil, pas sur
  `/places`.
- L'exclusion des trois fiches Les Chênes se fait par identifiant
  (`OFFRES_MASQUEES` dans `FeaturedExperiences.tsx`). Si la base est
  réinitialisée par un seed, les identifiants changent. La solution durable
  est un champ `featured` sur les offres, pilotable depuis le back-office.
- `/destinations` met ~2,8 s en premier rendu serveur ; les appels suivants
  sont plus rapides grâce au cache de 60 s.
