#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/inference-scope-widget-test.XXXXXX")"
trap 'rm -rf "$TEST_ROOT"' EXIT

assert_file() {
  local path="$1"
  [[ -f "$path" ]] || {
    echo "expected file: $path" >&2
    exit 1
  }
}

assert_symlink() {
  local path="$1"
  [[ -L "$path" ]] || {
    echo "expected symlink: $path" >&2
    exit 1
  }
}

run_install() {
  local home_dir="$1"
  shift
  HOME="$home_dir" "$REPO_ROOT/install.sh" "$@"
}

test_copy_mode() {
  local home_dir="$TEST_ROOT/copy-home"
  local feed_path="$home_dir/.local/bin/llm-runtime-monitor-feed"
  local widget_path="$home_dir/Library/Application Support/Übersicht/widgets/inference-scope-widget/inference-scope-widget.jsx"

  mkdir -p "$home_dir"
  run_install "$home_dir"
  run_install "$home_dir"

  assert_file "$feed_path"
  assert_file "$widget_path"
  [[ ! -L "$feed_path" ]] || {
    echo "copy install should not create a feed symlink" >&2
    exit 1
  }
  [[ ! -L "$widget_path" ]] || {
    echo "copy install should not create a widget symlink" >&2
    exit 1
  }

  python3 -m json.tool < <("$feed_path") >/dev/null
}

test_link_mode() {
  local home_dir="$TEST_ROOT/link-home"
  local feed_path="$home_dir/.local/bin/llm-runtime-monitor-feed"
  local widget_path="$home_dir/Library/Application Support/Übersicht/widgets/inference-scope-widget/inference-scope-widget.jsx"

  mkdir -p "$home_dir"
  run_install "$home_dir" --link
  run_install "$home_dir" --link

  assert_symlink "$feed_path"
  assert_symlink "$widget_path"
  [[ "$(readlink "$feed_path")" == "$REPO_ROOT/bin/llm-runtime-monitor-feed" ]] || {
    echo "feed symlink target mismatch" >&2
    exit 1
  }
  [[ "$(readlink "$widget_path")" == "$REPO_ROOT/widget/inference-scope-widget.jsx" ]] || {
    echo "widget symlink target mismatch" >&2
    exit 1
  }
}

test_copy_mode
test_link_mode
