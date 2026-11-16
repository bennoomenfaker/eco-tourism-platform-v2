# Eco-Voyage → Adventures.tn Migration Summary

## Overview
L'écosystème Eco-Voyage a été migré/renommé en **Adventures.tn**. Voici l'ensemble des modifications apportées.

## Modifications Apportées

### 1. Grid Fix - `min-w-0` (6 fichiers)
Correction de la grille dans `/explorer` pour éviter le débordement des cartes :
- `app/explorer/page.tsx`
- `app/dashboard/*.tsx` (5 fichiers)

### 2. Stories Row
- 15 vignettes circulaires 64×64 avec bordure verte
- Carrousel horizontal d'offres sur `/explorer` (snap-x, w-full sm:w-[320px])

### 3. Search Functionnelle
- Input bound `recherche` avec état local
- Filtre offres/circuits avant ouverture de `/destinations`
- Résultat "Aucune correspondance" affiché

### 4. Filtres Catégorie sur /places
- Puces avec `label`, `nombre`, état actif
- Filtres par catégorie affichant le nombre d'éléments restants

### 5. Renommage Compleet : Adventures.tn
Tous les fichiers TS/TSX/json ont été renommés :
- `layout.tsx`, auth pages, navbar, footer
- Backend `.env`, dto/entités
- ~350 occurrences renommées entre front et back

### 6. Docker Compose - Ports & Traefik
- Ports 3010 (API) + 3011 (Web) choisis pour éviter les conflits
- Labels Traefik pour `ecovoyage.duckdns.org` + `adventures.tn`
- Configuration Traefik dans `docker-compose.yml`

### 7. Code Fix - Sustainable Adventures Text
**Fichier** : `app/explorer/page.tsx` (ligne 992)
**Avant** : `<h1 className="text-xl font-extrabold tracking-tight">Sustainable Adventures</h1>`
**Après** : `<h1 className="text-xl font-extrabold tracking-tight whitespace-nowrap">Sustainable Adventures</h1>`
**Description** : Ajout de `whitespace-nowrap` pour empêcher les deux mots de se superposer sur la ligne.

### 8. Caddy Configuration
Fichier `Caddyfile` créé avec :
- Routing pour `adventures.tn` et `www.adventures.tn`
- Routing pour `ecovoyage.duckdns.org`
- Reverse proxy vers ports 3010 (API) et 3011 (Web)
- Gestion encode zstd gzip

### 9. Data & Backups
- 77 images Drive attachées aux 25 lieux via SQL `demo-data/07-drive-images.sql`
- API `/publications/places` renvoie 201 images dont 77 drive (vérifié en prod)
- Backups dans `/home/admin/v2/backups/` :
  - `circuits_20261113_1344.sql`
  - `images_avant.tsv`
  - `images_avant_20261114_1842.tsv`
  - `images_avant_normalisation.json`
  - `social_20261113_1351.sql`

### 10. Git Commits (5 already pushed)
- vitrine/ui
- recherche/filtres
- brand
- docker-compose
- global

## Statut Actuel

### Domaines
| Domaine | Statut |
|---------|--------|
| `ecovoyage.duckdns.org` | ✅ HTTPS fonctionnement (Caddy) |
| `adventures.tn` | ⚠️ OVH suspension (résolue dans panel OVH) |

### Conteneurs
- `v2-web-1` : port 3011→3000
- `v2-api-1` : port 3010→3000
- `v2-db-1` : PostgreSQL
- `v2-mongo-1` : MongoDB
- `caddy` : HTTPS pour `ecovoyage.duckdns.org`

### Prochaines Étapes
1. **OVH** : Unsuspendre le domaine `adventures.tn` dans le panel OVH
2. **Serveur** : `docker compose down && docker compose up -d`
3. **Verification** : Capture écran `/explorer` avec 3 cartes visibles
4. **Commit final** + push + rsync vers prod

## Fichiers Modifiés (résumé)
- `docker-compose.yml` : ports, labels Traefik, email Let's Encrypt
- `app/explorer/page.tsx` : grid `min-w-0`, stories, recherche, `whitespace-nowrap`
- `Caddyfile` : configuration routing domaines
- ~350 occurrences de renommage Eco-Voyage → Adventures.tn
- Divers composants UI et pages