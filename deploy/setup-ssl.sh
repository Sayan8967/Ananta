#!/bin/bash
set -euo pipefail

##############################################################################
# Ananta — SSL Setup with Let's Encrypt
#
# Usage:
#   ./deploy/setup-ssl.sh your-domain.com
##############################################################################

DOMAIN=${1:?Usage: ./deploy/setup-ssl.sh your-domain.com}

echo "→ Obtaining SSL certificate for ${DOMAIN}..."

# Create certs directory
mkdir -p deploy/nginx/certs

# Get certificate
docker compose -f deploy/docker-compose.prod.yml run --rm certbot \
    certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@${DOMAIN} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN}

# Update nginx config to enable SSL
sed -i "s/# listen 443 ssl;/listen 443 ssl;/" deploy/nginx/nginx.conf
sed -i "s/# ssl_certificate/ssl_certificate/" deploy/nginx/nginx.conf
sed -i "s/YOUR_DOMAIN/${DOMAIN}/g" deploy/nginx/nginx.conf
sed -i "s/# server {/server {/" deploy/nginx/nginx.conf

# Update domain in .env
sed -i "s/DOMAIN=.*/DOMAIN=${DOMAIN}/" deploy/.env

# Restart nginx
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env restart nginx

echo "✅ SSL enabled for https://${DOMAIN}"
