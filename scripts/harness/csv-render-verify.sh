#!/usr/bin/env bash
# scripts/harness/csv-render-verify.sh — Headless Chromium measurement of
# RENDERED FONT SIZE on every <svg text> element across the 3 harness
# interactive-heavy pages. Counts elements whose computed fontSize < 12px.
#
# Output (last line, machine-parseable): RENDERED_SMALL=<int>
#
# Requires:
#   - dev server running on http://localhost:3000 (cd web && npm run dev)
#   - Python playwright + chromium-headless-shell installed
#
# Direction: lower-is-better. Floor: 0. Goal: 0.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PY=/opt/homebrew/Caskroom/miniforge/base/bin/python

# Sanity: server reachable?
if ! curl -sf -o /dev/null --max-time 5 http://localhost:3000/ ; then
  echo "ERROR: dev server not reachable on :3000 — start with 'cd web && npm run dev'" >&2
  echo "RENDERED_SMALL=999"
  exit 1
fi

"$PY" - <<'PY'
import json
from playwright.sync_api import sync_playwright

PAGES = [
    "http://localhost:3000/harness",
    "http://localhost:3000/harness/constitution",
    "http://localhost:3000/harness/flow",
]
THRESHOLD = 12.0  # px — minimum legible size on a dark backdrop

# JS that runs in each page: enumerate every svg text descendant of the
# main interactive components, return their computed fontSize and rendered
# bounding rect width (so we can also surface scale info).
SCRIPT = """
(() => {
  const out = [];
  const svgs = document.querySelectorAll('svg');
  for (const svg of svgs) {
    const vb = svg.getAttribute('viewBox') || '';
    const rect = svg.getBoundingClientRect();
    if (rect.width < 100) continue;  // skip tiny icon SVGs
    const texts = svg.querySelectorAll('text');
    for (const t of texts) {
      const cs = getComputedStyle(t);
      const fs = parseFloat(cs.fontSize);
      out.push({
        viewBox: vb,
        renderedW: Math.round(rect.width),
        fontSize: fs,
        text: (t.textContent || '').trim().slice(0, 24),
      });
    }
  }
  return out;
})()
"""

THRESHOLD_INT = int(THRESHOLD)
small_total = 0
detail_lines = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1280, "height": 900})
    page = ctx.new_page()
    for url in PAGES:
        try:
            page.goto(url, wait_until="networkidle", timeout=15000)
        except Exception as e:
            print(f"WARN: {url} navigation failed: {e}")
            small_total += 999  # treat as crash
            continue
        # let any client-side hydration settle
        page.wait_for_timeout(400)
        try:
            entries = page.evaluate(SCRIPT)
        except Exception as e:
            print(f"WARN: {url} evaluate failed: {e}")
            small_total += 999
            continue
        page_small = sum(1 for e in entries if e["fontSize"] < THRESHOLD)
        small_total += page_small
        if page_small:
            samples = sorted({(round(e["fontSize"], 1), e["text"][:18]) for e in entries if e["fontSize"] < THRESHOLD})
            detail_lines.append(f"  {url.rsplit('/',1)[-1] or 'overview'}: {page_small} small (samples: {samples[:3]})")
    browser.close()

print("DETAIL:")
for line in detail_lines:
    print(line)
print(f"RENDERED_SMALL={small_total}")
PY
