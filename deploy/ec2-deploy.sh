#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

for name in EC2_IP EC2_USER EC2_SSH_KEY; do
  test -n "${!name}" || { echo "Missing secret: $name"; exit 1; }
done
[[ "$EC2_IP" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]
[[ "$EC2_USER" =~ ^[a-zA-Z_][a-zA-Z0-9_-]*$ ]]

# Keep the key temporary and remove it when the script exits.
deploy_temp=$(mktemp -d)
trap 'rm -rf "$deploy_temp"' EXIT
printf '%s\n' "$EC2_SSH_KEY" > "$deploy_temp/key"
chmod 600 "$deploy_temp/key"
ssh-keygen -y -f "$deploy_temp/key" > /dev/null
ssh_options=(-i "$deploy_temp/key" -o IdentitiesOnly=yes -o BatchMode=yes
  -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=15)
remote_host="$EC2_USER@$EC2_IP"

tar -czf "$deploy_temp/application.tgz" \
  app-tier/package.json app-tier/package-lock.json app-tier/*.js web-tier/build
ssh "${ssh_options[@]}" "$remote_host" 'mkdir -p ~/three-tier-app'
scp "${ssh_options[@]}" "$deploy_temp/application.tgz" "$remote_host:three-tier-app/application.tgz"
ssh "${ssh_options[@]}" "$remote_host" 'bash -se' <<'REMOTE_DEPLOY'
set -euo pipefail
cd ~/three-tier-app
tar -xzf application.tgz

for command in node npm pm2 curl; do
  command -v "$command" >/dev/null || { echo "Install $command on EC2 first."; exit 1; }
done
test -s app-tier/.env || { echo 'Configure ~/three-tier-app/app-tier/.env first.'; exit 1; }
npm ci --omit=dev --prefix app-tier
sudo -n mkdir -p /var/www/three-tier-app
sudo -n cp -a web-tier/build/. /var/www/three-tier-app/
sudo -n chmod -R a+rX /var/www/three-tier-app
cat > ecosystem.config.cjs <<'PM2_CONFIG'
const path = require('path');

module.exports = {
    apps: [{
        name: 'three-tier-backend',
        script: 'index.js',
        cwd: path.join(__dirname, 'app-tier'),
        env: { NODE_ENV: 'production', PORT: 4000 },
        watch: false
    }]
};
PM2_CONFIG
pm2 startOrRestart ecosystem.config.cjs --update-env
for attempt in {1..30}; do
  if curl --fail --silent http://127.0.0.1:4000/health >/dev/null; then
    # Exercise the Nginx proxy and database-backed endpoint too.
    curl --fail --silent http://127.0.0.1/api/transaction >/dev/null
    curl --fail --silent http://127.0.0.1/ >/dev/null
    pm2 save
    exit 0
  fi
  sleep 3
done
echo 'Backend failed its health check.'
pm2 logs three-tier-backend --nostream --lines 30
exit 1
REMOTE_DEPLOY
