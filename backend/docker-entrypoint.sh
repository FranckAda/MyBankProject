#!/bin/sh
set -e

# Composer est execute en root dans le conteneur
export COMPOSER_ALLOW_SUPERUSER=1

# Le dossier backend est monte depuis l'hote (Windows, macOS ou Linux).
# On cree une configuration locale si elle n'existe pas encore.
if [ ! -f .env ] && [ -f .env.example ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# La phrase secrète peut avoir ete personnalisee dans .env (lisible ici avant Symfony)
if [ -z "${JWT_PASSPHRASE:-}" ] && [ -f .env ]; then
    JWT_PASSPHRASE=$(sed -n 's/^JWT_PASSPHRASE=//p' .env | head -n 1 | tr -d '"'\''\r')
    export JWT_PASSPHRASE
fi

mkdir -p var/cache var/log config/jwt
chmod -R 777 var/cache var/log

# Le montage de l'hote masque le vendor installe pendant le build de l'image.
# On (re)installe les dependances cote conteneur si elles sont absentes.
if [ ! -f vendor/autoload.php ]; then
    echo "Installing Composer dependencies..."
    if [ "${APP_ENV:-dev}" = "dev" ]; then
        composer install --no-interaction --prefer-dist
    else
        composer install --no-interaction --prefer-dist --no-dev --optimize-autoloader
    fi
fi

if [ ! -f config/jwt/private.pem ]; then
    echo "Generating JWT keys..."
    openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa \
        -pkeyopt rsa_keygen_bits:4096 \
        -pass pass:"${JWT_PASSPHRASE:-bankapp_jwt_passphrase}"
    openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem \
        -pubout -passin pass:"${JWT_PASSPHRASE:-bankapp_jwt_passphrase}"
    chmod 644 config/jwt/private.pem config/jwt/public.pem
    echo "JWT keys generated."
fi

exec "$@"
