#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="copy"

usage() {
  cat <<'EOF'
Usage: ./install.sh [--link]

Installs the feed script and Übersicht widget for the current user.
Default mode copies files into their live locations.
Use --link to install symlinks for local development.
EOF
}

case "${1:-}" in
  "")
    ;;
  --link)
    MODE="link"
    ;;
  -h|--help)
    usage
    exit 0
    ;;
  *)
    usage >&2
    exit 1
    ;;
esac

FEED_SOURCE="$REPO_ROOT/bin/llm-runtime-monitor-feed"
WIDGET_SOURCE="$REPO_ROOT/uebersicht/inference-scope-widget.jsx"
FEED_DEST="$HOME/.local/bin/llm-runtime-monitor-feed"
WIDGET_DIR="$HOME/Library/Application Support/Übersicht/widgets/inference-scope-widget"
WIDGET_DEST="$WIDGET_DIR/inference-scope-widget.jsx"

mkdir -p "$(dirname "$FEED_DEST")" "$WIDGET_DIR"

if [[ "$MODE" == "copy" ]]; then
  install -m 755 "$FEED_SOURCE" "$FEED_DEST"
  install -m 644 "$WIDGET_SOURCE" "$WIDGET_DEST"
else
  rm -f "$FEED_DEST" "$WIDGET_DEST"
  ln -s "$FEED_SOURCE" "$FEED_DEST"
  ln -s "$WIDGET_SOURCE" "$WIDGET_DEST"
fi

printf 'Install mode: %s\n' "$MODE"
printf 'Feed source: %s\n' "$FEED_SOURCE"
printf 'Feed destination: %s\n' "$FEED_DEST"
printf 'Widget source: %s\n' "$WIDGET_SOURCE"
printf 'Widget destination: %s\n' "$WIDGET_DEST"
