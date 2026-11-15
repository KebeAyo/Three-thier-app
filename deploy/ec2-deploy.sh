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
  package.json app-tier/package.json app-tier/package-lock.json app-tier/*.js \
  web-tier/package.json web-tier/package-lock.json web-tier/public web-tier/src ecosystem.config.js
ssh "${ssh_options[@]}" "$remote_host" 'mkdir -p ~/Three-thier-app'
scp "${ssh_options[@]}" "$deploy_temp/application.tgz" "$remote_host:Three-thier-app/application.tgz"
ssh "${ssh_options[@]}" "$remote_host" "EC2_HOST=$EC2_IP bash -se" <<'REMOTE_DEPLOY'
set -euo pipefail
cd ~/Three-thier-app
tar -xzf application.tgz

for command in node npm pm2 curl; do
  command -v "$command" >/dev/null || { echo "Install $command on EC2 first."; exit 1; }
done
test -s app-tier/.env || { echo 'Configure ~/Three-thier-app/app-tier/.env first.'; exit 1; }
echo 'Installing backend dependencies in app-tier'
(cd app-tier && npm ci --omit=dev)
echo 'Installing frontend dependencies in web-tier'
(cd web-tier && npm ci --include=dev)
# Preserve a frontend environment configured on the instance.
if [[ ! -f web-tier/.env ]]; then
  printf 'PORT=3000\nREACT_APP_API_BASE_URL=http://%s:4000\n' "$EC2_HOST" > web-tier/.env
fi
pm2 startOrRestart ecosystem.config.js --update-env
for attempt in {1..60}; do
  if curl --fail --silent http://127.0.0.1:4000/health >/dev/null &&
     curl --fail --silent http://127.0.0.1:3000/ >/dev/null &&
     curl --fail --silent http://127.0.0.1:4000/transaction >/dev/null; then
    pm2 save
    exit 0
  fi
  sleep 3
done
echo 'Application failed its health checks.'
pm2 logs --nostream --lines 30
exit 1
REMOTE_DEPLOY
