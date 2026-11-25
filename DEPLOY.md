# Déploiement de MyBankProject sur Google Cloud (VM + Docker)

Guide complet, de la création de la VM jusqu’à la mise en ligne. La stack prod est dans
`docker-compose.prod.yml` : seul Caddy est exposé (80/443), MySQL/PHP-FPM/nginx restent sur un
réseau privé.

---

## Étape 1 — Préparer Google Cloud

1. Connecte-toi sur <https://console.cloud.google.com/> avec ton compte Google.
2. Sélectionne (ou crée) un projet : menu en haut à gauche → **Nouveau projet** → nom `mybank-prod`.
3. Active la **facturation** pour ce projet (obligatoire, même avec le crédit gratuit).
4. Dans le menu **APIs et services → Bibliothèque**, cherche **Compute Engine API** et clique sur **Activer**.
5. Vérifie les quotas (VM, IP statique) dans **IAM et administration → Quotas**.

> Coût indicatif : VM `e2-medium` ≈ 25 $/mois, disque 30 Go ≈ 5 $/mois, IP statique ≈ 3 $/mois.
> Une `e2-micro` est moins chère mais trop juste pour MySQL + PHP + Node build.

---

## Étape 2 — Créer la VM

Dans **Compute Engine → Instances de machines virtuelles → Créer une instance** :

| Champ | Valeur |
|---|---|
| Nom | `mybank-prod` |
| Région | `europe-west9` (Paris) ou la plus proche de toi |
| Zone | `europe-west9-a` |
| Type de machine | `e2-medium` (2 vCPU, 4 Go) |
| Disque de démarrage | **Ubuntu 24.04 LTS**, 30 Go, SSD équilibré |
| Pare-feu | cocher **Autoriser le trafic HTTP** et **HTTPS** |
| SSH | laisser les paramètres par défaut |

Clique sur **Créer**.

Équivalent en ligne de commande (si tu as `gcloud`) :

```bash
gcloud compute instances create mybank-prod \
  --zone=europe-west9-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB \
  --tags=http-server,https-server
```

---

## Étape 3 — IP statique et DNS

1. **Compute Engine → Adresses IP → Réserver une adresse statique**
   - Nom : `mybank-ip`
   - Région : **la même que la VM** (`europe-west9`)
   - Type : IPv4
2. Attache cette IP à la VM : sélectionne l’IP → **Modifier** → Instance associée : `mybank-prod`.
   (Ou, à la création de la VM, déplie **Réseau → Interface réseau → Adresse IP externe** et choisis `mybank-ip`.)
3. Chez ton registrar de domaine (ou dans **Cloud DNS**), ajoute un enregistrement :

```
Type : A
Nom  : ton-domaine.fr (ou @)
Valeur : <IP statique>
```

4. Attends la propagation (quelques minutes). Vérifie : `nslookup ton-domaine.fr`.

> Caddy obtient le certificat HTTPS automatiquement via Let’s Encrypt : il faut que le domaine
> pointe bien vers l’IP et que les ports 80 **et** 443 soient ouverts.

---

## Étape 4 — Se connecter à la VM

```bash
gcloud compute ssh mybank-prod --zone=europe-west9-a
```

Ou depuis le Console : bouton **SSH** de la ligne de la VM.

---

## Étape 5 — Installer Docker et Compose

À exécuter **dans la VM** :

```bash
sudo apt update && sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker

docker version --format 'Client={{.Client.Version}} Server={{.Server.Version}}'
```

---

## Étape 6 — Cloner le dépôt avec une clé de déploiement

Le dépôt est privé : crée une clé dédiée à la VM.

```bash
ssh-keygen -t ed25519 -C "mybank-prod" -f ~/.ssh/mybank_deploy
cat ~/.ssh/mybank_deploy.pub
```

Copie la clé publique affichée dans **GitHub → ton dépôt → Settings → Deploy keys → Add deploy key**
(coche **Allow write access** seulement si tu veux pousser depuis la VM ; lis seule suffit).

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/mybank_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config

ssh -T git@github.com          # doit afficher "Hi FranckAda! ..."
git clone git@github.com:FranckAda/MyBankProject.git
cd MyBankProject
```

---

## Étape 7 — Créer les secrets

```bash
openssl rand -hex 32    # -> APP_SECRET
openssl rand -hex 24    # -> JWT_PASSPHRASE et MYSQL_PASSWORD
cp .env.prod.example .env.prod
nano .env.prod
```

Remplis **toutes** les valeurs. Point important : `DATABASE_URL` doit contenir **le même**
`MYSQL_PASSWORD` que `MYSQL_PASSWORD`, et `CORS_ALLOW_ORIGIN` / `DEFAULT_URI` doivent contenir
ton vrai domaine.

```dotenv
DOMAIN=ton-domaine.fr
APP_SECRET=<openssl rand -hex 32>
DATABASE_URL=mysql://mybank:<MYSQL_PASSWORD>@db:3306/mybank?serverVersion=8.0&charset=utf8mb4
MYSQL_DATABASE=mybank
MYSQL_USER=mybank
MYSQL_PASSWORD=<mot_de_passe>
MYSQL_ROOT_PASSWORD=<autre_mot_de_passe>
JWT_PASSPHRASE=<openssl rand -hex 24>
CORS_ALLOW_ORIGIN='^https://ton-domaine\.fr$'
DEFAULT_URI=https://ton-domaine.fr
```

`.env.prod` est gitignoré : il ne partira jamais sur GitHub.

---

## Étape 8 — Clés JWT

**Ne copie pas les clés de ton Mac.** Laisse l’entrypoint en générer de nouvelles au premier
démarrage, avec la `JWT_PASSPHRASE` de `.env.prod`. Elles apparaîtront dans
`backend/config/jwt/` sur la VM et seront conservées dans les sauvegardes.

```bash
ls -la backend/config/jwt    # après le premier lancement
```

⚠️ Si tu supprimes ce dossier, tous les tokens déjà émis deviennent invalides.

---

## Étape 9 — Premier lancement

Depuis `~/MyBankProject` :

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

Suis les logs le temps que Caddy obtienne son certificat :

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f caddy
```

Tu dois voir quelque chose comme `certificate obtained successfully`.

---

## Étape 10 — Base de données et cache

```bash
C="docker compose --env-file .env.prod -f docker-compose.prod.yml"

$C exec backend php bin/console doctrine:database:create --if-not-exists --env=prod
$C exec backend php bin/console doctrine:migrations:migrate --no-interaction --env=prod
$C exec backend php bin/console cache:clear --env=prod
$C exec backend php bin/console cache:warmup --env=prod
```

**Ne lance jamais `doctrine:fixtures:load` en prod** : la fixture contient un compte admin avec
un mot de passe connu (`Admin1234`) et la commande purge la base. Les 12 catégories par défaut sont
désormais créées par la migration `Version20261125000000`, donc `doctrine:migrations:migrate`
suffit — aucune commande de fixtures en production.

---

## Étape 11 — Créer le premier admin

La commande demande le mot de passe de façon masquée (il n’apparaît pas dans l’historique) :

```bash
$C exec backend php bin/console app:create-admin admin@ton-domaine.fr --env=prod
```

Respecte la règle : 8 caractères minimum, au moins une lettre et un chiffre.

Les comptes admin suivants se créent depuis le dashboard (`/api/users/new`), désormais réservé
aux admins. L’inscription publique ne peut plus créer d’admin.

---

## Étape 12 — Vérifications

```bash
curl -I https://ton-domaine.fr                 # 200
curl https://ton-domaine.fr/api/health         # 200

# Connexion
curl -X POST https://ton-domaine.fr/api/login_check \
  -H 'Content-Type: application/json' \
  -d '{"mail":"admin@ton-domaine.fr","password":"ton_mot_de_passe"}'
```

Vérifie aussi que les ports sensibles ne répondent pas depuis l’extérieur :

```bash
sudo ss -tulpen | grep -E ':(3306|8000|8080)\b'
```

Rien ne doit être écouté sur `0.0.0.0` pour ces ports.

---

## Étape 13 — Sauvegardes

Crée `~/backup-mybank.sh` :

```bash
#!/bin/sh
set -a
. /home/$USER/MyBankProject/.env.prod
set +a
mkdir -p /home/$USER/backups
cd /home/$USER/MyBankProject || exit 1
docker compose --env-file .env.prod -f docker-compose.prod.yml \
  exec -T db mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" mybank \
  | gzip > /home/$USER/backups/mybank-$(date +%F).sql.gz
# Conserver 14 jours
find /home/$USER/backups -name 'mybank-*.sql.gz' -mtime +14 -delete
```

```bash
chmod +x ~/backup-mybank.sh
crontab -e
# Tous les jours à 03:00
0 3 * * * /home/$USER/backup-mybank.sh >> /home/$USER/backup.log 2>&1
```

À compléter idéalement par une copie des backups hors de la VM (Cloud Storage, autre machine).

---

## Étape 14 — Mises à jour

```bash
cd ~/MyBankProject
git pull
C="docker compose --env-file .env.prod -f docker-compose.prod.yml"
$C up -d --build
$C exec backend php bin/console doctrine:migrations:migrate --no-interaction --env=prod
$C exec backend php bin/console cache:clear --env=prod
```

Ne supprime **jamais** `backend/config/jwt/` ni le volume `db-data` lors d’une mise à jour.

---

## Dépannage rapide

| Symptôme | Cause probable | Action |
|---|---|---|
| Caddy reste en « obtaining certificate » | DNS pas propagé ou port 80 fermé | `nslookup ton-domaine.fr`, règle pare-feu GCP |
| `502 Bad Gateway` | frontend/nginx pas prêt | `docker compose ... logs frontend nginx` |
| `500` côté API | migrations pas jouées ou `.env.prod` incomplet | relire les logs backend, vérifier `APP_ENV=prod` |
| `401` sur toutes les routes | clés JWT régénérées | reconnecte-toi ; les anciens tokens sont invalides |
| `Access denied ... mybank` | mot de passe différent entre `DATABASE_URL` et `MYSQL_PASSWORD` | aligner les deux dans `.env.prod`, puis `up -d --force-recreate db` |
| VM inaccessible en SSH | pare-feu / OS Login | vérifier les règles de pare-feu et l’accès IAM |
