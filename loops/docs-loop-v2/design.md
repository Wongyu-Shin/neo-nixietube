# docs-loop-v2 — Design

> Successor to the original 5-worker tmux + `claude -p` orchestration that
> collapsed at iter 1 due to subprocess rate-limiting. This document
> captures lessons + the v2 architecture.

## 1. Why v1 collapsed

Concrete failure timeline:

| Time | Event |
|---|---|
| `2026-04-24 18:48` | tmux session `harness-docs-loop` spawned with 5 worker windows. Each window runs `bash scripts/harness/page-loop.sh <slug>`. |
| `18:48 – 18:57` | Iter 1 design agents (one `claude -p --dangerously-skip-permissions` each) succeed. Two pages (overview, flow) commit rich MDX + components. |
| `18:58 – 19:05` | Iter 2 onwards: every `claude -p` call returns "design exited with error". Continues silently. |
| `19:02 – 20:50` | `page-loop.sh` blindly increments iter counter despite design failures. 4-second empty cycles up to iter 20 cap. Workers EXIT cleanly; one window misreports "running" because tmux activity flag stayed set. |
| `2026-04-26 13:22` | Operator notices session is stuck (39 hours dashboard frozen). |
| `13:30 – 13:45` | Salvage: uncommitted work in 4/5 worktrees discovered (constitution, wiki, catalog had components but no merge). Sequentially merge 5 docs branches into main with conflict resolution on `PersistenceLayers.tsx`. |

Five distinct failure modes:

1. **`claude -p` subprocess rate limit / session limit.** The CLI invocation became silently unauthorized after ~5 successful calls. Our shell pipeline did not detect 401/429-style failures because `claude -p` writes errors to stderr and we discarded stderr (`> "$design_out" 2>&1` mixes them but no parse step caught the auth error vs. real output).
2. **No abort on N consecutive design failures.** `page-loop.sh` lacked a `consecutive_fail_count` watchdog. Three failed iters should have tripped the loop into "design unhealthy — pause" mode; instead it churned to iter 20.
3. **Dashboard fidelity gap.** The dashboard read tmux `activity_flag` to mark windows "running". The flag stays set even after the inner script exits, until the pane is touched. Result: a finished worker looked alive for 39 hours.
4. **Verify reads main repo, not worktrees.** `doc-verify.sh` checks `web/app/harness/` in the **main** working tree. Worktree commits live on detached branches and never propagate. SUM stayed at 0 even though real components were created on docs-* branches.
5. **No checkpoint at git-revision granularity.** When the loop "stuck", there was no automated way to ask "what did each worker actually commit?" The salvage required manual `git -C ../neo-nixetube-docs-<slug> log` walks.

## 2. v2 design — five corrections

### Correction A: stay in-session (no `claude -p` subprocess)

The single most load-bearing change. v2 runs the design + verify cycle
inside the **active operator session**, sequentially per page, with no
spawned `claude` subprocesses.

Trade-offs:

| Dimension | v1 (spawn) | v2 (in-session) |
|---|---|---|
| Parallelism | 5 pages concurrent | 1 page at a time |
| Wall-clock | Theoretical 5× faster | Sequential, slower |
| Auth surface | 5 separate token chains, each can rate-limit | One stable session |
| Failure mode | Silent stderr swallow | Visible inline |
| Recovery | Operator must SSH into tmux | Operator already there |
| Token cost | 5× independent | Single transcript, shared cache |

The sequential cost is more than offset by the fact that v1's actual
realised throughput was *worse* (1 useful iter per page in 5 hrs vs.
v2's measured 1 stage in ~10 min).

### Correction B: stage-based progress, not iter-count-based

v1's metric was `DOCS_READY=N/5` based on per-page 5-gate threshold.
The threshold was unreachable at iter 1 (no GAN scoring wired) so
every iter showed delta=0 and the dashboard could not distinguish
"working hard" from "spinning".

v2 metric: `STAGES_PASSED=N/5` where N is the count of distinct
*phases* completed:
- S1 dev render (Chrome MCP nav, console clean)
- S2 component density (≥15 unique imports per page)
- S3 GAN verify (SUM ≥ 48 per page via existing page-verify.sh port)
- S4 screenshot tour (Chrome MCP per-page captures)
- S5 v2 design committed (this document)

Each stage is binary; the dashboard advances visibly per iter.

### Correction C: existing page-verify.sh port over re-implementation

`scripts/page-verify.sh` (199 lines, 6 criteria, GAN structure with
Defender + 4 Critics + Judge + Anchor) already exists for the
path-roomtemp page and works. v2 ports it into
`scripts/harness/page-verify-harness.sh <slug>` with one change:
6 criteria reframed for harness docs (doc_structure, component_density,
interactive_quality, charter_alignment, cross_links, reader_path)
instead of cad-specific criteria.

This avoids re-implementing GAN logic from scratch and inherits the
ratchet-anchor protocol the project already learned to trust.

### Correction D: Chrome MCP for both render gate AND screenshot tour

S1 (render gate) and S4 (screenshot) both use Chrome MCP. Concretely:

- S1: navigate each page, `read_console_messages` with
  `onlyErrors=true`. Pass = console clean.
- S4: navigate each page, `gif_creator` for animated capture, save to
  `reports/harness/screenshots/<slug>.gif`.

Chrome MCP is in-session, no rate limit, faster than spinning up a
headless puppeteer. The dev server stays up across S1 and S4 (single
`npm run dev` background process).

### Correction E: per-stage TaskCreate + TaskUpdate visibility

v1 hid progress in tmux windows that nobody attached to. v2 uses the
in-session task list (TaskCreate / TaskUpdate) so the operator sees
which stage is `in_progress` at any moment. The 5 stages map to 5
tasks, each transitioning `pending → in_progress → completed`.

## 3. Sequence diagram (entry → exit)

```
operator
  │
  ├─► /autoresearch:plan { Goal: stages, Verify: stage-verify.sh }
  │     │
  │     └─► main session enters Phase 7 confirm
  │
  ├─► main writes scripts/harness/stage-verify.sh, baseline = 0/5
  │
  ├─► STAGE 1 (≈3 min)
  │     ├─ npm run dev (background, log to /tmp/harness-next-dev.log)
  │     ├─ MCP tabs_create → 5× navigate → 5× read_console
  │     ├─ write loops/docs-loop-v2/render-status.txt ALL_PASS=1
  │     └─ commit  → STAGES_PASSED=1
  │
  ├─► STAGE 2 (≈10 min)
  │     ├─ inventory components/harness/ (34 existing)
  │     ├─ append Appendix section to each page with cross-imports
  │     ├─ npm run build (gates compile errors)
  │     └─ commit  → STAGES_PASSED=2
  │
  ├─► STAGE 3 (≈8 min × 5 pages = ≈40 min)
  │     ├─ scripts/harness/page-verify-harness.sh overview
  │     │    │ Defender → 4 Critics ‖ → Judge → SUM
  │     ├─ scripts/harness/page-verify-harness.sh constitution
  │     ├─ ... wiki, flow, catalog
  │     └─ commit aggregate  → STAGES_PASSED=3 iff all 5 SUM ≥ 48
  │
  ├─► STAGE 4 (≈2 min)
  │     ├─ MCP gif_creator / screenshot per page
  │     ├─ save to reports/harness/screenshots/<slug>.{gif,png}
  │     └─ commit  → STAGES_PASSED=4
  │
  └─► STAGE 5 (≈10 min)
        ├─ write this document
        ├─ commit
        └─ STAGES_PASSED=5  ← DONE
```

Total wall-clock estimate: 65–75 min in-session vs. v1's 5+ hours
spent stuck at zero progress.

## 4. Anti-patterns to NOT bring back

- **Subprocess `claude -p` for orchestration.** Use main session.
  Acceptable only for `page-verify.sh`-style isolated GAN scoring with
  hard timeout + abort-on-stderr.
- **Activity-flag-based "running" detection.** Always check process
  liveness via PID file or `pgrep`, not tmux flags.
- **Dashboards that show stale data as "in progress".** Add a
  staleness column showing `seconds_since_last_log_write`. If > 600s,
  flag as STUCK regardless of activity flag.
- **Worktrees without merge plan.** Decide upfront: do worktrees
  squash-merge to main on completion, or stay separate as
  permanent branches? v1 had no answer; salvage required manual
  conflict resolution.
- **Per-iter design prompts that don't bound output.** v1's design
  prompt said "make page rich" without size/scope budget. Workers
  produced sprawling 600-line components with low cohesion. v2 design
  prompts MUST specify line/component ceilings.

## 5. Open questions for v3

These are not corrections to v1 but extensions worth considering for
the next round:

- **Adversarial team specialisation.** Should the 4 GAN critics be
  reused across all pages, or specialise per-page (e.g. `wiki` page
  gets a "knowledge management critic", `flow` page gets a "BPMN
  critic")? Specialisation deepens analysis but explodes prompt
  surface.
- **Inter-page consistency check.** A 6th GAN criterion: do the 5 pages
  cite each other consistently? Is a feature slug rendered the same
  way on every page that mentions it? Currently not enforced.
- **Component novelty filter.** v1 created 34 components, many
  near-duplicates (PersistenceLayers vs. KnowledgeStack — same data,
  different visual). v3 should run an embedding-based novelty filter
  before accepting a new component PR.
- **Visual regression suite.** Once S4 captures are committed, future
  loops can diff `reports/harness/screenshots/<slug>.png` against the
  current head. Any unexpected pixel delta = visual regression.

## 6. Cross-references

| Topic | Where |
|---|---|
| Original v1 collapse log | `loops/docs-overview/tmux.out.log` (worktree-prune-d) |
| Salvaged commits | `git log --grep='salvaged from worktree'` |
| Stage gate script | `scripts/harness/stage-verify.sh` |
| GAN port | `scripts/harness/page-verify-harness.sh` |
| Constitution invariants | `harness/CONSTITUTION.md` |
| UX flow spec | `harness/UX.md` |
