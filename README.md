# Inference Scope Widget

A macOS desktop monitor for local LLM runtimes, packaged as a shareable
[Übersicht](https://tracesof.net/uebersicht/) widget.

It watches running processes on your machine and surfaces the active local model
server, its memory footprint, and host memory pressure in a compact translucent
desktop panel.

## Supported runtimes

- `llama-server`
- `python -m llama_cpp.server`
- `ollama`
- `vllm serve`

## What it shows

- active model name and runtime
- model RSS in gigabytes
- CPU usage and listening ports
- parsed runtime flags such as context size, GPU layers, flash attention, host, and port
- host memory pressure, swap, wired memory, compressed memory, and approximate free memory
- additional runtime cards when more than one local server is active

## Repo layout

- `bin/llm-runtime-monitor-feed`: shell collector that emits widget JSON
- `widget/inference-scope-widget.jsx`: Übersicht widget UI
- `install.sh`: supported installer for copy or link mode installs

## Prerequisites

- macOS
- [Übersicht](https://tracesof.net/uebersicht/)
- shell tools used by the feed: `bash`, `ps`, `awk`, `sed`, `lsof`, `curl`, `python3`, `vm_stat`, `memory_pressure`, and `sysctl`

Install Übersicht if needed:

```bash
brew install --cask ubersicht
```

## Install

The default install mode copies files into the live locations that Übersicht and
your shell will use:

```bash
./install.sh
```

This installs:

- `~/.local/bin/llm-runtime-monitor-feed`
- `~/Library/Application Support/Übersicht/widgets/inference-scope-widget/inference-scope-widget.jsx`

Rerunning `./install.sh` is safe and refreshes those installed files in place.

## Development install

For live local development, install symlinks back to this repo instead:

```bash
./install.sh --link
```

That mode replaces only the managed feed and widget files with symlinks and
leaves any unrelated Übersicht widgets untouched.

## Reload Übersicht

After installing or updating the widget:

1. Open Übersicht.
2. Reload widgets from the Übersicht menu, or restart the app if needed.

## Verify the feed

You can inspect the collector output directly from a terminal:

```bash
~/.local/bin/llm-runtime-monitor-feed | python3 -m json.tool
```

In an idle state, the JSON should contain sane host memory metrics and an empty
`runtimes` array.

## Privacy and permissions

- The widget is process-driven, not app-driven.
- Process inspection on macOS may be limited by how a runtime was launched and by your local privacy settings.
- `ollama` visibility is best-effort because the daemon does not always expose the same level of per-model detail as direct `llama.cpp` processes.
