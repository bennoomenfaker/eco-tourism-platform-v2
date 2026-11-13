# 🚀 Déploiement serveur — Éco-Tourism Platform v2

> Serveur : `admin@91.134.139.163` (Ubuntu 24.04, IP `91.134.139.163`)
> Mise en service : 12 nov. 2026. Dernière vérification : 13 nov. 2026.

## URLs

| Service | URL |
|---|---|
| Web (Next.js) | http://ecovoyage.duckdns.org:3004 (aussi http://91.134.139.163:3004) |
| API (NestJS) | http://91.134.139.163:3003/api |
| Swagger | http://91.134.139.163:3003/swagger |

> Si le front est ouvert sur une autre adresse, elle doit être ajoutée à `CORS_ORIGINS` dans `~/v2/backend/.env.production` (sinon le navigateur bloque tous les appels API : listes vides et login en échec).

Le port 3003 est resté celui de l'ancienne API `tourisme` et 3004 celui de l'ancien front : les URLs publiques ne changent pas.

## Ce qui tourne

| Conteneur | Image | Port hôte |
|---|---|---|
| `v2-api` | `v2-api` (build `~/v2/backend`) | 3003 |
| `v2-web` | `v2-web` (build `~/v2/frontend`) | 3004 |
| `tourisme-db-1` | `postgres:15-alpine` — **inchangé, données conservées** | 5432 |
| `tourisme-mongo-1` | `mongo:7` — inchangé | 27017 |

- Code v2 : `/home/admin/v2/` (`backend/`, `frontend/`, `docker-compose.yml`).
  Le dossier `/srv/tourisme` appartient à l'utilisateur `maram` et `admin` n'a pas de sudo sans mot de passe : v2 a donc été déployé dans le home, sur le même réseau Docker externe `tourisme_net`.
- Base utilisée : `tourism_db` (utilisateur `marammejri`, mot de passe de `tourisme-db-1`), **la même que l'ancienne app**.
- `v2-api` joint la base par `DB_HOST=tourisme-db-1`, `DB_PORT=5432`, `DB_NAME=tourism_db` (voir `~/v2/backend/.env.production`) ; Mongo par `mongodb://tourisme-mongo-1:27017/ecovoyage`.
- Front construit avec `NEXT_PUBLIC_API_URL=http://91.134.139.163:3003/api` (argument de build, vérifié dans les chunks servis).

## Données

État de la base après migration (aucune perte) :

| Table | Lignes |
|---|---|
| `users` | 10 (les 9 comptes v2 + `voyageeco1@gmail.com`, admin d'origine) |
| `offers` / `circuits` / `publications` | 21 / 9 / 12 |
| `reservations` / `reservation_participants` | 6 / 3 |
| `guides` / `providers` / `eco_travelers` / `projects` | 2 / 2 / 3 / 2 |
| `questionnaires` / `questions` / `answers` | 3 / 31 / 124 |

- Les comptes et le contenu créés en local (`tourism_db_v2`) ont été injectés en `INSERT` idempotents (`pg_dump --data-only --column-inserts`), sans questionnaire (déjà présent à l'identique) et sans toucher aux comptes existants.
- Un seul doublon supprimé : `fakerbennoomen@gmail.com` (compte `eco_traveler` `pending` de l'ancienne base, sans aucune donnée liée), remplacé par le compte `provider` actif du même email. Sauvegarde disponible avant opération.
- Schéma : identique local/serveur (même empreinte de colonnes), géré par TypeORM `synchronize: true` (`src/database/typeorm.config.ts`).

## Sauvegardes

- `/srv/tourisme/sauvegardes/tourism_db_20261112_1318.dump` — `pg_dump -Fc` avant migration.
- `/srv/tourisme/sauvegardes/pg_dump_2026-11-12.sql`, `postgres-2026-10-31.sql` — dumps antérieurs conservés.

Sauvegarde manuelle :

```bash
U=$(docker exec tourisme-db-1 printenv POSTGRES_USER); D=$(docker exec tourisme-db-1 printenv POSTGRES_DB)
docker exec tourisme-db-1 pg_dump -U "$U" -d "$D" -Fc > /srv/tourisme/sauvegardes/tourism_db_$(date +%Y%m%d_%H%M).dump
```

Restauration :

```bash
docker exec -i tourisme-db-1 pg_restore -U "$U" -d "$D" --clean --if-exists < /srv/tourisme/sauvegardes/tourism_db_20261112_1318.dump
```

## Mettre à jour le code

Depuis le poste local (modèle utilisé pour cette mise en service) :

```bash
cd eco-tourism-platform-v2
rsync -az --exclude node_modules --exclude .next --exclude .git --exclude dist \
  eco-tourism-platform-backend/ admin@91.134.139.163:v2/backend/
rsync -az --exclude node_modules --exclude .next --exclude .git \
  eco-tourism-platform-front/ admin@91.134.139.163:v2/frontend/
ssh admin@91.134.139.163 'cd ~/v2 && docker compose build && docker compose up -d'
```

Suivi :

```bash
docker logs -f v2-api          # démarrage NestJS + synchronisation TypeORM
docker compose -f ~/v2/docker-compose.yml ps
```

## Rollback vers l'ancienne app

```bash
cd ~/v2 && docker compose stop
docker start tourisme-api-1 tourisme-web-1    # reprend 3003 / 3004
```

Les conteneurs v1 sont conservés à l'arrêt (images non supprimées). La base est commune : un rollback ne perd pas les données, mais l'ancien code ne connaît pas les tables v2 (il les ignore).

## Points de vigilance

- Disque : 90 % utilisés (≈ 7,4 Go libres) — les images v1 et v2 cohabitent. Nettoyer avec `docker image prune` / `docker builder prune` avant une nouvelle grosse construction.
- `synchronize: true` en production : TypeORM aligne le schéma au démarrage. Faire une sauvegarde avant chaque mise à jour.
- Secrets : `~/v2/backend/.env.production` (DB, JWT, SMTP, Cloudinary, Google) ; ne pas committer.
- CORS : `FRONTEND_URL` + `CORS_ORIGINS` (liste séparée par des virgules, sans slash final) définissent les origines autorisées par `src/main.ts`. Toute nouvelle adresse du front (domaine, IP, port) doit y figurer.
