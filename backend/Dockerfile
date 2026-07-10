FROM php:8.4-fpm-alpine

RUN apk add --no-cache git unzip && \
    docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# ↓ Définir l'environnement avant composer install ET cache:clear
ENV APP_ENV=prod
ENV APP_DEBUG=0

# Créer un .env vide juste pour satisfaire Symfony au build
RUN touch .env

RUN composer install --no-dev --optimize-autoloader --no-scripts

# Nettoyer le .env factice
RUN rm .env

# composer install lancera cache:clear automatiquement en prod

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 9000
CMD ["php-fpm"]
