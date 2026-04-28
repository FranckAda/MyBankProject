FROM php:8.4-fpm-alpine

RUN apk add --no-cache git unzip && \
    docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# ↓ Définir l'environnement avant composer install ET cache:clear
ENV APP_ENV=prod
ENV APP_DEBUG=0

RUN composer install --no-dev --optimize-autoloader
# composer install lancera cache:clear automatiquement en prod

EXPOSE 9000
CMD ["php-fpm"] 