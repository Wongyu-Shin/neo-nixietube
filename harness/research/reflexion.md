# Reflexion — Verbal Reinforcement Learning for Language Agents

**Citation:** Shinn, N., Cassano, F., Gopinath, A., Narasimhan, K., Yao, S.
*Reflexion: Language Agents with Verbal Reinforcement Learning.*
NeurIPS 2023. arXiv:2303.11366.

**Primary source:** https://arxiv.org/abs/2303.11366
**Reference code:** https://github.com/noahshinn/reflexion

## Core idea

After each failed trial, the agent writes a natural-language "self-reflection"
on *why* the trial failed, stores it in an episodic memory, and conditions the
next trial on that memory. No gradient updates — the LLM is effectively fine-
tuned by text feedback.

Reported wins: HumanEval 91% pass@1 (GPT-4 + Reflexion, 2023), AlfWorld success
rate up from ~45% → 97% after a handful of reflections.

## Harness-relevant decomposition

| Phase | Role of reflexion |
|---|---|
| pre-loop | Seed the reflection store with prior-run reflections (bootstraps Voyager-style lifelong learning). |
| in-loop | After each failed Verify, append a reflection note keyed by the failure signature; the next iteration's prompt pulls matching notes. |
| post-loop | Summarise the full reflection log into a distilled "lessons learned" report. |

## Mapping to this project's axes

- **axis1:** `outer` — implemented as a hook/script that writes `harness/build/reflexion/*.md` and injects them via `<system-reminder>` style context at iteration start. Claude Code's built-in "git as memory" covers *commit-level* reflection but not free-text introspection.
- **axis2:** `in-loop` (primary) with optional `pre-loop` bootstrap.

## Rippable signal

The feature is absorbed upstream when the base model, given a failed Verify
output and the last 3 commit diffs, produces an actionable next-iteration
plan *without* an explicit reflection prompt. Empirically: run two parallel
arms (`with-reflexion`, `no-reflexion`) on a failing fixture; if mean
iterations-to-fix is statistically indistinguishable (Welch t-test p>0.1,
n≥10 per arm), the feature is redundant.

## Minimal viable implementation for neo-nixetube

1. `scripts/hooks/reflexion-on-discard.sh` — PostToolUse hook on the autoresearch commit/revert pipeline; appends `harness/build/reflexion/<ts>-<short-hash>.md` summarising the discarded diff and verify output.
2. `harness/build/reflexion/INDEX.md` — running index consumed at Phase 1 of each iteration.
3. Prompt injection: the /autoresearch skill reads the last 5 entries at Phase 1.

## Open questions

- How to bound reflection store size before context pressure? (LRU? clustering?)
- Do reflections transfer across Goals, or pollute new loops?
