#!/usr/bin/env bash
# harness/impl-verify.sh — Tier 1 production-grade implementation auditor.
#
# Reads harness/impl-manifest.yaml, walks each feature block, checks:
#   - every path under `paths:` exists (file)
#   - every regex under `contains:` and `contains_extra:` matches its file
#   - every dir under `not_empty:` has ≥ 1 entry
# A feature is "implemented" iff every check passes. IMPL_MISSING counts
# the features with at least one failing check.
#
# Output (last line, machine-parseable): IMPL_MISSING=<int>
#
# Direction: lower-is-better. Floor: 0. Goal: 0.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/harness/impl-manifest.yaml"

PY=/opt/homebrew/Caskroom/miniforge/base/bin/python
[ -x "$PY" ] || PY=$(command -v python3)

"$PY" - "$ROOT" "$MANIFEST" <<'PY'
import os, re, sys, pathlib

root = pathlib.Path(sys.argv[1])
manifest_path = pathlib.Path(sys.argv[2])

# Tiny YAML-ish parser — supports the limited shape we use:
#   <key>:
#     paths:
#       - <path>
#     contains:
#       <path>: <regex>
# Lines beginning with '#' or empty are skipped.

def parse_manifest(text):
    features = {}
    cur_feat = None
    cur_block = None  # 'paths' | 'contains' | 'contains_extra' | 'not_empty'
    for raw in text.splitlines():
        line = raw.rstrip()
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        # feature heading: zero leading spaces, ends with ':'
        if not line.startswith(' ') and line.endswith(':'):
            cur_feat = line[:-1].strip()
            features[cur_feat] = {'paths': [], 'contains': {}, 'contains_extra': {}, 'not_empty': []}
            cur_block = None
            continue
        # block heading: indented 2, ends with ':'
        m = re.match(r'^  (\w+):\s*$', line)
        if m and cur_feat:
            cur_block = m.group(1)
            continue
        # list item: indented 4-, '- value'
        m = re.match(r'^\s+- (.+)$', line)
        if m and cur_feat and cur_block in ('paths', 'not_empty'):
            features[cur_feat][cur_block].append(m.group(1).strip())
            continue
        # mapping item: indented 4, 'key: value'
        m = re.match(r"^    ([^:]+):\s*'?(.*?)'?\s*$", line)
        if m and cur_feat and cur_block in ('contains', 'contains_extra'):
            k = m.group(1).strip()
            v = m.group(2).strip()
            # strip surrounding quotes if present
            if v.startswith("'") and v.endswith("'"):
                v = v[1:-1]
            features[cur_feat][cur_block][k] = v
            continue
    return features

text = manifest_path.read_text(encoding='utf-8')
features = parse_manifest(text)

missing = []
for feat, blk in features.items():
    fails = []
    for p in blk['paths']:
        full = root / p
        if not full.is_file():
            fails.append(f'missing-file:{p}')
    for d in blk.get('not_empty', []):
        full = root / d
        if not full.is_dir() or not any(full.iterdir()):
            fails.append(f'empty-dir:{d}')
    for path, regex in {**blk['contains'], **blk['contains_extra']}.items():
        full = root / path
        if not full.is_file():
            fails.append(f'no-file-for-regex:{path}')
            continue
        try:
            content = full.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            fails.append(f'read-failed:{path}')
            continue
        if not re.search(regex, content, re.MULTILINE | re.DOTALL):
            fails.append(f'regex-miss:{path}')
    if fails:
        missing.append((feat, fails))

print('DETAIL:')
for feat, fails in missing:
    print(f'  {feat}: {", ".join(fails[:3])}{" ..." if len(fails)>3 else ""}')
print(f'IMPL_MISSING={len(missing)}')
PY
