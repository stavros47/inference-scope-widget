#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FEED_PATH="$REPO_ROOT/bin/llm-runtime-monitor-feed"

assert_eq() {
  local actual="$1"
  local expected="$2"
  if [[ "$actual" != "$expected" ]]; then
    echo "expected '$expected' but got '$actual'" >&2
    exit 1
  fi
}

output="$(
  LLM_RUNTIME_MONITOR_LIB=1 source "$FEED_PATH"
  parse_memory_free_percentage $'System-wide memory free percentage: 61%\nPages free: 1.'
)"
assert_eq "$output" "61"

output="$(
  LLM_RUNTIME_MONITOR_LIB=1 source "$FEED_PATH"
  classify_memory_free_state "61"
)"
assert_eq "$output" "roomy"

json="$("$FEED_PATH")"
python3 - <<'PY' "$json"
import json
import sys

data = json.loads(sys.argv[1])
host = data["host"]
assert "memoryFreePercent" in host, "missing memoryFreePercent"
assert "memoryFreeState" in host, "missing memoryFreeState"
assert "memoryPressure" not in host, "unexpected legacy memoryPressure field"
assert "memoryPressureShort" not in host, "unexpected legacy memoryPressureShort field"
PY
