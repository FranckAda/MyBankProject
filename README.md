# MyBankProject

Application bancaire fullstack — React 19 / Symfony 8 / MySQL 8

## Stack

- **Frontend** : React 19 + Vite + Tailwind 4 + React Router 7
- **Backend** : Symfony 8.0 + Doctrine ORM + JWT (Lexik)
- **Base** : MySQL 8.0
- **Tests** : Vitest (front) · PHPUnit 13 (back)

## Lancer le projet avec Docker

```bash
# 1. Cloner et se placer à la racine

# 2. Démarrer tous les services
docker compose up -d --build

# 3. Installer les dépendances backend et générer les clés JWT
docker compose exec backend php -d memory_limit=-1 composer install
docker compose exec backend php bin/console lexik:jwt:generate-keypair

# 4. Créer la base et exécuter les migrations
docker compose exec backend php bin/console doctrine:database:create
docker compose exec backend php bin/console doctrine:migrations:migrate

# 5. (optionnel) Charger des données de test
docker compose exec backend php bin/console doctrine:fixtures:load
```

### URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| phpMyAdmin | http://localhost:8080 |

## Développement sans Docker

### Frontend

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
npm run test       # Vitest
npm run lint       # ESLint
```

### Backend

```bash
cd backend
composer install
php bin/console lexik:jwt:generate-keypair
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
php -S localhost:8000 -t public   # ou via Nginx
php bin/phpunit
```

### Variables d'environnement

Copier `.env` ou créer `.env.local` :

```
DATABASE_URL="mysql://root:rootsecret@127.0.0.1:3306/mybank?serverVersion=8.0&charset=utf8mb4"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=bankapp_jwt_passphrase
```

Les clés JWT sont générées automatiquement dans le bootstrap des tests si absentes.

## Tests

```bash
# Frontend (53 tests)
cd frontend && npm test

# Backend (55 tests)
cd backend && php bin/phpunit
```
