# Harness UX — Entry → Completion Flow

Complete user-facing walkthrough of how to design, run, interrupt,
resume, and report on a harness loop. Consolidates the 28 catalog
features into a single flow.

**Prerequisite reading:** `harness/CONSTITUTION.md` (9 Articles —
durable invariants).

---

## Flow at a glance

```
    ┌──────────────────────────────────────────────────────────────┐
    │                         PRE-LOOP                              │
    │  operator ──┬─▶ /harness:new-loop <slug>         [scaffold]   │
    │             │                                                 │
    │             │    creates loops/NNN-<slug>/{spec,clarif,plan}  │
    │             ▼                                                 │
    │       /harness:clarify                           [7 dims]     │
    │             │   writes clarifications.md                      │
    │             │   flags [ASSUMPTION] for gaps                   │
    │             ▼                                                 │
    │       /autoresearch:plan                         [wizard]     │
    │             │   uses clarifications as input                  │
    │             │   dry-runs verify, measures baseline            │
    │             ▼                                                 │
    │       ExitPlanMode  ←─  operator approves plan                │
    └──────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                         IN-LOOP                               │
    │        ┌────────────────────────────────────────┐             │
    │        │  PHASE 1  Review (git log, TSV, wiki)  │◀─────┐      │
    │        │          - CONSTITUTION loaded         │      │      │
    │        │          - wiki keyword-surfaced       │      │      │
    │        │          - reflexion entries read      │      │      │
    │        └──────────────────┬─────────────────────┘      │      │
    │                           ▼                            │      │
    │        ┌────────────────────────────────────────┐      │      │
    │        │  PHASE 2-5  Ideate → Modify → Commit   │      │      │
    │        │            → Verify → (Guard)          │      │      │
    │        │  - L0 ops silent                       │      │      │
    │        │  - L1 ops notify (auto-approve 30s)    │      │      │
    │        │  - L2 ops pause + blocking HITL        │      │      │
    │        └──────────────────┬─────────────────────┘      │      │
    │                           ▼                            │      │
    │        ┌────────────────────────────────────────┐      │      │
    │        │  PHASE 6  Decide keep / discard / rework│     │      │
    │        │          (composite-guard gates)        │     │      │
    │        └──────────────────┬─────────────────────┘      │      │
    │                           ▼                            │      │
    │        ┌────────────────────────────────────────┐      │      │
    │        │  PHASE 7  Log + progress cadence       │──────┘      │
    │        │          per-iter line, milestone blk  │             │
    │        │          statusline update             │             │
    │        └──────────────────┬─────────────────────┘             │
    │                           │                                   │
    │             OPERATOR ──── ┤ /harness:pause                    │
    │                           │ /harness:send "<hint>"            │
    │                           │ ^C  (emergency stop)              │
    │                           ▼                                   │
    │        ┌────────────────────────────────────────┐             │
    │        │  PHASE 8  Repeat | plateau | bounded N │             │
    │        │          | operator abandon            │             │
    │        └──────────────────┬─────────────────────┘             │
    └───────────────────────────┼─────────────────────────────────────┘
                                ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                         POST-LOOP                             │
    │       /harness:report                                         │
    │          - cc-post-loop-slash → report.mdx                   │
    │          - llm-as-judge-audit (optional)                     │
    │          - cross-domain-transfer-metric (optional)           │
    │          - eval-compare vs baseline (optional)               │
    │                                                               │
    │       /harness:wiki-add                                       │
    │          - agent proposes entries                             │
    │          - operator approves → harness/wiki/*.md             │
    │                                                               │
    │       loops/NNN-<slug>/report.mdx    ← handback artifact     │
    └──────────────────────────────────────────────────────────────┘
```

---

## 1. Entry — how the user kicks off a loop

### Path A: fresh intent (most common)

```
/harness:new-loop <slug>
```

The slash command:

1. Auto-increments NNN (e.g. `loops/003-cad-path2-upgrade/`).
2. Copies `loops/TEMPLATE/` — creates `spec.md`, `clarifications.md`,
   `plan.md`, `report.mdx`, `wiki-refs.md` skeletons.
3. Opens `spec.md` for the operator to fill in Goal + Scope + Metric.
4. Binds the loop to Article III–VII invariants automatically (see
   `spec.md` "Article references" block).

### Path B: resume existing loop

```
/harness:status <run_id>   ← inspect checkpoint
/harness:resume <run_id>   ← continue from last checkpoint
/harness:resume <run_id> --hint "focus on <area>"
```

### Path C: one-shot inline config (power users)

Existing `/autoresearch` inline-config pathway is preserved. Those
users bypass `/harness:new-loop` but lose the numbered-directory
audit trail. Documented as supported but not recommended for
non-trivial Goals.

---

## 2. Ambiguity resolution — `/harness:clarify`

After `/harness:new-loop` fills in the initial spec, the operator runs:

```
/harness:clarify
```

The agent walks 7 coverage dimensions (see `harness-clarify-gate`):

| Dim | Question |
|---|---|
| D1 | Scope-domain: harness/ or content? |
| D2 | Metric mechanicality: extractable by single command? |
| D3 | Direction: higher or lower is better? |
| D4 | HITL-exceptions: any irreversible ops likely? |
| D5 | Stop conditions: bounded / unbounded / plateau? |
| D6 | Wiki contributions: which keywords will this loop emit? |
| D7 | Guard composition: beyond composite-guard, Goal-specific? |

Every Q+A+assumption is written to `clarifications.md`. Unresolved
`[ASSUMPTION]` markers for D1 (scope straddle) fail composite-guard;
the loop cannot proceed.

After clarify, `/autoresearch:plan` (existing) runs with the
clarifications as input, produces the full config, dry-runs verify,
records the baseline.

---

## 3. Start — ExitPlanMode

The operator reviews the plan document, then explicitly exits Plan
mode (CC-native gesture). This is the **only** legal HITL boundary
for entering in-loop execution (Article III).

Per `plan-mode-discipline`: from this point on, the agent forbids
any in-loop `AskUserQuestion` except the two carve-outs:

- Operator-initiated pause (`/harness:pause`, Ctrl-Z) —
  `harness-pause-resume`.
- Irreversible-op confirmation — `harness-graduated-confirm` L2.

---

## 4. In-run UX — progress, interrupts, safety

### Progress visibility (`harness-progress-cadence`)

| Cadence | What you see |
|---|---|
| Per-iteration | One line: `[iter 3/20] SCORE=87 (+2) keep: add response caching` |
| Milestone (every 5) | Block: ratchet curve, keep/discard count, last 3 descs, plateau flag |
| Statusline | Bottom-of-terminal persistent: `harness:cad-path2 iter=12/30 score=92 guard=pass` |
| Final (on exit) | Full summary + report path + wiki-refs path |

### Operator controls (`harness-pause-resume`)

```
/harness:pause              # finish current atomic step, write checkpoint, stop
/harness:send "<text>"      # inject hint mid-flight without pausing
/harness:status             # show active loops + their latest iter
/harness:resume <run_id>    # continue from checkpoint
/harness:abandon <run_id>   # graceful terminate + post-loop report
Ctrl+C                      # emergency stop (lossy, avoid if possible)
```

### Safety tiers (`harness-graduated-confirm`)

| Tier | Behavior |
|---|---|
| L0 (read, scoped-edit) | Silent |
| L1 (rm in scope, package install) | Notify with 30s auto-approve |
| L2 (`git push --force`, `rm` outside scope, `sudo`, release publish, …) | Pause loop + require explicit operator keystroke |

L2 events are logged to `report.mdx` and visible in the statusline.

---

## 5. Stop — when and how

### Automatic stop conditions

1. **Bounded** — `Iterations: N` in spec; stop at iteration N even
   if still improving. `harness-progress-cadence` prints final summary.
2. **Goal-achieved** (`/autoresearch:fix` mode) — metric hits target;
   stop automatically.
3. **Plateau** (`plateau-detection` feature) — ratchet-patience AND
   trend-slope both signal no progress under current σ; stop or
   trigger radical-experiment branch.

### Manual stop conditions

4. **Operator abandon** — `/harness:abandon <run_id>` produces the
   post-loop report and terminates.
5. **Operator emergency** — `Ctrl+C`; the runner tries to write a
   crash-checkpoint at `loops/NNN/checkpoints/` before dying.

---

## 6. Results reporting

### Artifact tree per completed loop

```
loops/NNN-<slug>/
├── spec.md              ← Goal / Scope / Metric / direction / baseline
├── clarifications.md    ← operator Q/A record (Article V)
├── plan.md              ← approved plan (via ExitPlanMode)
├── results.tsv          ← per-iteration log
├── checkpoints/         ← pause-resume JSON snapshots
│   └── <ts>.json
├── report.mdx           ← narrative handback (template-bound)
└── wiki-refs.md         ← wiki entries touched / created
```

### `report.mdx` structure (written by `cc-post-loop-slash`)

```markdown
---
goal: ...
scope: ...
metric: ...
baseline: N → final: M (+Δ)
iterations: K
keeps: A | reworks: B | discards: C | crashes: D
article_references: [III, IV, V, VI]
---

## TL;DR
## Axis coverage delta
## Kept experiments (with commit hashes)
## Reworked experiments
## Discarded experiments (lessons)
## L2 confirmations
## Wiki contributions
## Next steps
```

### Optional add-ons

- `llm-as-judge-audit` — rubric grade with self-enhancement-bias
  control (different judge model).
- `cross-domain-transfer-metric` — run the loop's verify on a paired
  held-out domain.
- `gcli-eval-compare-primitive` — paired A/B vs. baseline ref.

---

## 7. Persistence layers (the LLM-wiki question)

Four durable knowledge layers, loaded in different contexts:

| Layer | Location | Scope | Trigger |
|---|---|---|---|
| User memory | `~/.claude/.../memory/*.md` | cross-repo | Always loaded |
| CLAUDE.md | repo root | project | Always loaded |
| Harness wiki | `harness/wiki/*.md` | project | **Keyword-triggered** |
| Research notes | `harness/research/*.md` | project | Explicit read |

The **harness wiki** (`harness-llm-wiki`, implementing Article VII)
is the layer directly answering "how does LLM-wiki persistence
work?" — it is:

- Committable (versioned with the repo)
- Project-scoped (unlike user memory which is cross-repo)
- Keyword-triggered (unlike CLAUDE.md which floods every session)
- Half-life tracked (`last_verified + half_life_days`; stale entries
  surface with a warning)

### Writing to the wiki — post-loop workflow

```
/harness:wiki-add
```

- `cc-post-loop-slash` prompts the agent: "What should the wiki
  remember from this loop?"
- Agent emits 0–N candidate entries with frontmatter + triggers.
- Operator approves / edits / rejects each interactively.
- Accepted entries committed to `harness/wiki/<slug>.md`.
- `wiki-refs.md` in the loop directory records which wiki entries
  this loop read AND wrote, so future readers can trace the
  knowledge lineage.

### Reading from the wiki — SessionStart workflow

- `.claude/skills/wiki-surface/SKILL.md` (an inner feature) runs at
  SessionStart.
- It reads the operator's initial message + last N lines of
  transcript.
- Tokenizes, matches tokens against every `harness/wiki/*.md`
  entry's `triggers` field.
- Surfaces top-3 matches as `<system-reminder>` blocks with
  citations.
- Each surfaced entry is logged to
  `gcli-agent-run-telemetry` for audit.

---

## 8. Keyboard / command cheat sheet

### Pre-loop

| Command | Purpose |
|---|---|
| `/harness:new-loop <slug>` | Scaffold `loops/NNN-<slug>/` |
| `/harness:clarify` | 7-dim ambiguity pass → clarifications.md |
| `/autoresearch:plan` | Interactive wizard, baseline dry-run |
| `ExitPlanMode` | Start the loop (operator approval gate) |

### In-loop

| Input | Effect |
|---|---|
| `/harness:pause` | Checkpoint + stop at next iter boundary |
| `/harness:send "<msg>"` | Inject mid-flight hint |
| `/harness:status` | Show active loops + progress |
| `Ctrl+C` | Emergency stop (lossy) |
| L2 op | Blocks, operator keystroke required |

### Post-loop

| Command | Purpose |
|---|---|
| `/harness:report` | Generate `report.mdx` |
| `/harness:wiki-add` | Interactive wiki entry proposal |
| `/harness:abandon <run_id>` | Graceful terminate + report |
| `/harness:resume <run_id>` | Continue a paused loop |

---

## 9. Feature-to-UX-phase index

Every UX primitive described above maps to at least one catalog
feature. This is the index:

| Phase | Feature |
|---|---|
| Entry (scaffold) | `harness-loop-scaffold` |
| Entry (constitution-load) | `harness-constitution` |
| Clarify | `harness-clarify-gate` |
| Plan | `plan-mode-discipline` |
| Progress (per-iter) | `harness-progress-cadence`, `gcli-agent-run-telemetry` |
| Interrupt (operator) | `harness-pause-resume` |
| Interrupt (irreversible op) | `harness-graduated-confirm` |
| In-loop safety | `cc-hook-guardrail`, `sandboxed-open-ended-exploration` |
| Noise + stop | `plateau-detection`, `noise-aware-ratchet` |
| Test infrastructure | `statistical-tc-runner`, `harness-rip-test` |
| Report | `cc-post-loop-slash` |
| Audit (optional) | `llm-as-judge-audit`, `cross-domain-transfer-metric`, `gcli-eval-compare-primitive` |
| Wiki | `harness-llm-wiki` |
| Distribution | `gcli-skill-pack-distribution` |
| Meta | `adas-meta-agent-search`, `meta-hyperagents-metacognitive`, `dgm-h-archive-parent-selection` |
| Planning-substrate | `voyager-skill-library`, `reflexion` |
| Alignment-discipline | `alignment-free-self-improvement` |
| Classical multi-agent | `fpt-hyperagent-multirole`, `swe-agent-aci` |

All 28 catalog features are load-bearing in the flow above. None is
purely theoretical; each backs a concrete UX primitive the operator
experiences.
