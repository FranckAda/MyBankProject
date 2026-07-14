#!/bin/sh
set -e

mkdir -p var/cache var/log config/jwt
chmod -R 777 var/cache var/log

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
