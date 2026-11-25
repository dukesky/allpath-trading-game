#!/usr/bin/env bash
# Build the game and copy it into the AllPath website repo, where it is served at
# https://trading.all-path.com/game  (files under public/trading/game/).
# Usage: scripts/sync-to-site.sh [path-to-allpath-site-repo]   (default: ../allpath)
set -euo pipefail
cd "$(dirname "$0")/.."
SITE="${1:-../allpath}"
[ -f "$SITE/next.config.ts" ] || { echo "Not the AllPath site repo: $SITE" >&2; exit 1; }
npm run build
rm -rf "$SITE/public/trading/game"
mkdir -p "$SITE/public/trading/game"
cp -R dist/. "$SITE/public/trading/game/"
echo "Copied $(find dist -type f | wc -l | tr -d ' ') files to $SITE/public/trading/game/"
