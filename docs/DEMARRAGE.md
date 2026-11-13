# 🚀 Démarrage local — Éco-Tourism Platform v2

Guide pour lancer l'application en **développement local**.
Aucun secret n'est versionné : identifiants, clés et mots de passe vivent dans des
fichiers `.env` **ignorés par Git** (voir `.gitignore`).

## Prérequis

- Docker + Docker Compose
- Node.js 18+ et Yarn

## 1. Variables d'environnement (non versionnées)

À la racine du projet, créer un fichier `.env` :

```dotenv
DB_USERNAME=<utilisateur PostgreSQL>
DB_PASSWORD=<mot de passe PostgreSQL>
DB_NAME=<nom de la base>
```

Côté backend, copier le modèle fourni et l'adapter :

```bash
cp eco-tourism-platform-backend/.env.dev eco-tourism-platform-backend/.env
# puis renseigner DB_*, JWT_SECRET, MONGODB_URI, SMTP_*, etc.
```

## 2. Infrastructure — PostgreSQL + MongoDB

```bash
docker compose -f docker-compose.dev.yml up -d
```

| Service | Port hôte (local) |
|---|---|
| PostgreSQL | `5433` |
| MongoDB | `27018` |

> ⚠️ **Ne pas lancer `docker compose up` seul** : le `docker-compose.yml` du dépôt est le
> compose de **déploiement serveur** (aucun port exposé à l'hôte). En local, utiliser
> `docker-compose.dev.yml`.

Si ce fichier n'existe pas, l'équivalent minimal est :

```yaml
services:
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "127.0.0.1:5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  mongo:
    image: mongo:7
    restart: unless-stopped
    ports:
      - "127.0.0.1:27018:27017"
    volumes:
      - mongodata:/data/db

volumes:
  pgdata:
  mongodata:
```

## 3. Backend (NestJS)

```bash
cd eco-tourism-platform-backend
yarn install
yarn start:dev
```

- API : http://localhost:3002/api
- Swagger : http://localhost:3002/swagger

## 4. Frontend (Next.js)

```bash
cd eco-tourism-platform-front
yarn install
yarn dev
```

- Web : http://localhost:3003
- Connexion : http://localhost:3003/auth/login

Le front lit `NEXT_PUBLIC_API_URL` (fichier `eco-tourism-platform-front/.env.local`) :

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## 5. Vérifier que tout répond

```bash
curl -s -o /dev/null -w 'API %{http_code}\n' http://localhost:3002/api/offers
curl -s -o /dev/null -w 'WEB %{http_code}\n' http://localhost:3003/
```

## Arrêter

```bash
docker compose -f docker-compose.dev.yml stop
pkill -f "nest start" ; pkill -f "next dev"
```

## Seeder des données de démonstration

Les seeds officiels sont dans `eco-tourism-platform-backend/src/database/seeds/`
(`seed:demo`, `seed:offers`, `seed:circuits`, questionnaires). Des scripts de complément
(relations sociales, activités prestataires) sont fournis dans `demo-data/`.

## En cas de souci

- **Écran vide / login impossible** → vérifier `NEXT_PUBLIC_API_URL` (front) et les origines
  CORS autorisées (`eco-tourism-platform-backend/src/main.ts`).
- **Base vide après un `docker compose up`** → vous avez probablement lancé le compose de
  serveur ; revenir à `docker-compose.dev.yml` (volumes locaux).
