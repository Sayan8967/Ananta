#!/bin/bash
set -euo pipefail

##############################################################################
# Ananta — Single-Server Setup Script
#
# Run on a fresh Ubuntu 22.04/24.04 EC2 instance (t3.medium recommended)
#
# Usage:
#   chmod +x deploy/setup-server.sh
#   ./deploy/setup-server.sh
#
# Estimated cost: ~$21/month (t3.medium in ap-south-1)
##############################################################################

echo "╔══════════════════════════════════════════════════╗"
echo "║  Ananta — Server Setup                          ║"
echo "║  Single-server deployment for initial testing   ║"
echo "╚══════════════════════════════════════════════════╝"

# 1. Install Docker
if ! command -v docker &> /dev/null; then
    echo "→ Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
    echo "  Docker installed. You may need to log out and back in."
fi

# 2. Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    echo "→ Installing Docker Compose plugin..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq docker-compose-plugin
fi

# 3. Create .env if not exists
if [ ! -f deploy/.env ]; then
    echo "→ Creating .env from template..."
    cp deploy/.env.example deploy/.env

    # Generate random passwords
    PG_PASS=$(openssl rand -base64 24 | tr -d '/+=')
    MONGO_PASS=$(openssl rand -base64 24 | tr -d '/+=')
    REDIS_PASS=$(openssl rand -base64 24 | tr -d '/+=')
    KC_PASS=$(openssl rand -base64 16 | tr -d '/+=')
    KC_SECRET=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)

    sed -i "s/POSTGRES_PASSWORD=CHANGE_ME_strong_password_here/POSTGRES_PASSWORD=${PG_PASS}/" deploy/.env
    sed -i "s/MONGO_PASSWORD=CHANGE_ME_strong_password_here/MONGO_PASSWORD=${MONGO_PASS}/" deploy/.env
    sed -i "s/REDIS_PASSWORD=CHANGE_ME_strong_password_here/REDIS_PASSWORD=${REDIS_PASS}/" deploy/.env
    sed -i "s/KEYCLOAK_ADMIN_PASSWORD=CHANGE_ME_strong_password_here/KEYCLOAK_ADMIN_PASSWORD=${KC_PASS}/" deploy/.env
    sed -i "s/KEYCLOAK_CLIENT_SECRET=CHANGE_ME_generate_a_uuid/KEYCLOAK_CLIENT_SECRET=${KC_SECRET}/" deploy/.env

    echo ""
    echo "  Generated random passwords in deploy/.env"
    echo "  ⚠ IMPORTANT: Save these credentials securely!"
    echo ""
    grep -E "PASSWORD|SECRET" deploy/.env | sed 's/^/    /'
    echo ""
fi

# 4. Build and start all services
echo "→ Building and starting all services (this takes 5-10 minutes on first run)..."
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build

echo ""
echo "→ Waiting for databases to initialize..."
sleep 15

# 5. Health checks
echo "→ Checking service health..."
echo ""

SERVICES=("ananta-postgres" "ananta-mongodb" "ananta-redis" "ananta-keycloak" "ananta-patient-service" "ananta-doctor-service" "ananta-emergency-service" "ananta-auth-service" "ananta-ai-service" "ananta-web" "ananta-nginx")
ALL_OK=true

for svc in "${SERVICES[@]}"; do
    STATUS=$(docker inspect --format='{{.State.Status}}' "$svc" 2>/dev/null || echo "not found")
    if [ "$STATUS" = "running" ]; then
        echo "  ✓ $svc — running"
    else
        echo "  ✗ $svc — $STATUS"
        ALL_OK=false
    fi
done

SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

echo ""
if [ "$ALL_OK" = true ]; then
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  ✅ Ananta is running!                                  ║"
    echo "╠══════════════════════════════════════════════════════════╣"
    echo "║                                                          ║"
    echo "║  Web App:        http://${SERVER_IP}                     ║"
    echo "║  Keycloak Admin: http://${SERVER_IP}/auth                ║"
    echo "║                                                          ║"
    echo "║  Demo Accounts (password: demo123 for all):              ║"
    echo "║    Patient:  patient-demo / demo123                      ║"
    echo "║    Doctor:   doctor-demo  / demo123                      ║"
    echo "║    Admin:    admin-demo   / demo123                      ║"
    echo "║                                                          ║"
    echo "║  Emergency Card Demo:                                    ║"
    echo "║    http://${SERVER_IP}/emergency/card/DEMO1234           ║"
    echo "║                                                          ║"
    echo "║  Next steps:                                             ║"
    echo "║    1. Point your domain's A record to ${SERVER_IP}       ║"
    echo "║    2. Run: ./deploy/setup-ssl.sh your-domain.com         ║"
    echo "║                                                          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
else
    echo "⚠ Some services are not running. Check logs with:"
    echo "  docker compose -f deploy/docker-compose.prod.yml logs"
fi
