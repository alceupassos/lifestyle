#!/bin/bash

# Configuration
VPS_USER="root"
VPS_IP="62.171.181.241"
VPS_PATH="/root/lifestyle"
APP_NAME="lifestyle"

echo "🚀 Starting Deployment of $APP_NAME to $VPS_IP..."

# 1. Build locally
echo "🛠️  Building the application locally..."
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin
npm run build

# 2. Prepare files for sync
# We only need .next, public, package.json, package-lock.json, ecosystem.config.js, and .env
# Actually, it's easier to sync everything except node_modules and .git
echo "📤 Transferring files to server..."
ssh $VPS_USER@$VPS_IP "mkdir -p $VPS_PATH"

# Rsync files
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next/cache' --exclude '.env*' ./ $VPS_USER@$VPS_IP:$VPS_PATH/

# 3. Server-side operations
echo "⚙️  Running server-side setup..."
ssh $VPS_USER@$VPS_IP << EOF
  cd $VPS_PATH
  
  # Install dependencies if needed
  npm install --production
  
  # Start/Restart with PM2
  if command -v pm2 &> /dev/null; then
    pm2 delete $APP_NAME || true
    pm2 start ecosystem.config.js
    pm2 save
  else
    echo "⚠️ PM2 not found on server. Installing..."
    npm install -g pm2
    pm2 start ecosystem.config.js
    pm2 save
  fi
EOF

# 4. Nginx configuration
echo "🌐 Nginx configuration is managed on the server (with Certbot SSL)."
echo "✅ Deployment Successful! Visit https://lifestyle.angra.io"
