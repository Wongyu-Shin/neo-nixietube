#!/usr/bin/env bash
# TC for feature: hyperagent-planner-routing
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/hyperagent.md"

[ -f "$NOTE" ] || { echo "TC_FAIL hyperagent: missing research note"; exit 1; }
grep -q "arxiv.org/abs/2409.16299" "$NOTE" || { echo "TC_FAIL hyperagent: missing primary citation"; exit 1; }

# The feature's whole point: Planner is the only agent allowed to talk to
# the human. The note MUST spell that out.
grep -qi "planner.*only.*human\|HITL.*planner\|only agent.*human" "$NOTE" \
    || { echo "TC_FAIL hyperagent: missing HITL-routing invariant"; exit 1; }

grep -qi "Navigator" "$NOTE" && grep -qi "Editor" "$NOTE" && grep -qi "Executor" "$NOTE" \
    || { echo "TC_FAIL hyperagent: missing role triad"; exit 1; }

grep -qi "AskUserQuestion\|HITL-not-allowed\|changelog" "$NOTE" \
    || { echo "TC_FAIL hyperagent: rippable signal lacks a concrete probe"; exit 1; }

echo "TC_PASS hyperagent-planner-routing"
exit 0
