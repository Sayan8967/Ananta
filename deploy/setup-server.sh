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
# Estimated cost: ~$15-25/month (t3.medium in ap-south-1)
#   - t3.medium:  ~$18/month (2 vCPU, 4GB RAM)
#   - 30GB EBS:   ~$3/month
#   - Elastic IP:  Free (when attached)
#   - Total:      ~$21/month
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
    KC_SECRET=$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)

    sed -i "s/POSTGRES_PASSWORD=CHANGE_ME_strong_password_here/POSTGRES_PASSWORD=${PG_PASS}/" deploy/.env
    sed -i "s/MONGO_PASSWORD=CHANGE_ME_strong_password_here/MONGO_PASSWORD=${MONGO_PASS}/" deploy/.env
    sed -i "s/REDIS_PASSWORD=CHANGE_ME_strong_password_here/REDIS_PASSWORD=${REDIS_PASS}/" deploy/.env
    sed -i "s/KEYCLOAK_ADMIN_PASSWORD=CHANGE_ME_strong_password_here/KEYCLOAK_ADMIN_PASSWORD=${KC_PASS}/" deploy/.env
    sed -i "s/KEYCLOAK_CLIENT_SECRET=CHANGE_ME_generate_a_uuid/KEYCLOAK_CLIENT_SECRET=${KC_SECRET}/" deploy/.env

    echo "  Generated random passwords in deploy/.env"
    echo "  ⚠ IMPORTANT: Save these credentials securely!"
    echo ""
    grep -E "PASSWORD|SECRET" deploy/.env | sed 's/^/    /'
    echo ""
fi

# 4. Build and start
echo "→ Building and starting all services..."
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build

echo ""
echo "→ Waiting for services to become healthy..."
sleep 10

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  ✅ Ananta is running!                          ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║                                                  ║"
echo "║  Web App:    http://$(hostname -I | awk '{print $1}'):80           ║"
echo "║  Keycloak:   http://$(hostname -I | awk '{print $1}'):80/auth      ║"
echo "║                                                  ║"
echo "║  Next steps:                                     ║"
echo "║  1. Point your domain to this server's IP        ║"
echo "║  2. Run: ./deploy/setup-ssl.sh your-domain.com   ║"
echo "║  3. Configure Keycloak realm + clients           ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
