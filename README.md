# MyBankProject

Application bancaire fullstack — React 19 / Symfony 8 / MySQL 8

**Documentation :** [Déploiement en production sur Google Cloud](DEPLOY.md)

## Stack

- **Frontend** : React 19 + Vite + Tailwind 4 + React Router 7
- **Backend** : Symfony 8.0 + Doctrine ORM + JWT (Lexik)
- **Base** : MySQL 8.0
- **Tests** : Vitest (front) · PHPUnit 13 (back)

## Lancer le projet sur macOS (Docker)

Le projet utilise des images Linux : il tourne de la même façon sur Windows, macOS (Intel et Apple Silicon) et Linux. Aucun réglage spécifique à Windows n’est nécessaire.

### 1. Installer Docker Desktop

Télécharger [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/), l’ouvrir et attendre que la baleine soit verte dans la barre de menu. Vérifier dans un terminal :

```bash
docker --version
docker info >/dev/null && echo "Docker est pret"
```

### 2. Démarrer le projet

Depuis la racine du dépôt :

```bash
# Configuration locale (cree backend/.env, non versionne)
cp backend/.env.example backend/.env

# Build et demarrage de tous les services
docker compose up -d --build
```

Au premier démarrage, le conteneur backend installe automatiquement les dépendances Composer et génère les clés JWT (le dossier `backend` est monté depuis l’hôte, donc le `vendor/` construit dans l’image est masqué). La toute première initialisation de MySQL peut prendre 3 à 5 minutes : le backend, nginx et le frontend démarrent dès que la base est `healthy`. Si un service reste `Created`, relancer simplement `docker compose up -d`.

### 3. Initialiser la base de données (une seule fois)

```bash
docker compose exec backend php bin/console doctrine:database:create --if-not-exists
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

# Optionnel : données de demonstration
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

Les fixtures créent un compte admin de développement : **`admin@mybank.local` / `Admin1234`**.
L’inscription publique ne permet plus de créer un admin ; les autres comptes admin se créent
depuis le dashboard avec ce compte, via `POST /api/users/new`.

En production, ne pas lancer les fixtures : les catégories sont créées par la migration
`Version20261125000000` et le premier admin par `app:create-admin`. Voir [DEPLOY.md](DEPLOY.md).

### URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| phpMyAdmin | http://localhost:8080 |
| MySQL | `localhost:3306` (root / `rootsecret`) |

### Commandes utiles

```bash
docker compose logs -f backend      # suivre les logs du backend
docker compose ps                   # etat des services
docker compose restart backend      # apres modification de .env
docker compose down                 # arreter (garde les donnees)
docker compose down -v              # arreter et supprimer la base
```

Si les clés JWT doivent être régénérées :

```bash
docker compose exec backend php bin/console lexik:jwt:generate-keypair --overwrite
docker compose restart backend
```

### Dépannage macOS

- **`Cannot connect to the Docker daemon`** : Docker Desktop n’est pas démarré (icône baleine).
- **`port 3306 is already allocated`** : un MySQL local occupe le port — `lsof -i :3306`, puis arrête-le ou change le mapping dans `docker-compose.yml`.
- **Erreur `vendor/autoload.php` introuvable** : `docker compose logs backend`, puis `docker compose restart backend` (l’installation Composer se refait si `vendor/` est absent).
- **Le frontend affiche une page blanche** : attendre la fin du build (`docker compose logs -f frontend`) et vérifier http://localhost:3000.
- **Puce Apple Silicon (M1/M2/M3)** : aucune option `--platform` n’est nécessaire, les images utilisées sont multi-architecture.

## Développement sans Docker

Prérequis à installer séparément : **Node.js 20+**, **PHP 8.4+** avec les extensions `pdo_mysql`, `sodium`, `intl`, et **MySQL 8**. Sur un Mac nu, Docker reste la méthode la plus simple.

```bash
cp backend/.env.example backend/.env
# La DATABASE_URL du modele pointe deja vers 127.0.0.1:3306

# Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run test -- --run
npm run lint

# Backend (dans un autre terminal)
cd backend
composer install
php bin/console lexik:jwt:generate-keypair
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
php -S localhost:8000 -t public
php bin/phpunit
```

### Variables d’environnement

Le modèle `backend/.env.example` contient toutes les variables nécessaires (`APP_SECRET`, `DATABASE_URL`, `CORS_ALLOW_ORIGIN`, clés JWT…). Le fichier `backend/.env` est ignoré par Git : chaque machine garde sa propre configuration.

Les clés JWT sont générées automatiquement au démarrage du conteneur (et par le bootstrap des tests si absentes).

## Tests

```bash
# Backend (via Docker) — APP_ENV=test est indispensable : le conteneur tourne en dev
docker compose exec -e APP_ENV=test backend php bin/phpunit

# Frontend (Node 20+ requis en local)
cd frontend && npm ci && npm run test -- --run
```
