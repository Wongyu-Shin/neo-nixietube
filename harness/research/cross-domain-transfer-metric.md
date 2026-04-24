# Cross-Domain Transfer Metric

**Primary citation:** Zhang, J. et al. *HyperAgents.* 2026.
arXiv:2603.19461, §5.2 "Transfer across domains".
**Primary source:** https://arxiv.org/abs/2603.19461
**Reference code:** https://github.com/facebookresearch/Hyperagents
(see `domains/` for the held-out domain harnesses)

**Related references:**
- Pan, S.J., Yang, Q., *A Survey on Transfer Learning.* IEEE TKDE 2010.
  https://doi.org/10.1109/TKDE.2009.191 — the foundational source-→target
  transfer framing.
- Hu et al., *ADAS.* arXiv:2408.08435 — §6 "Cross-Domain Transfer" uses
  the same mechanic at the agent-design level.

## Core idea — quoted from §1 of HyperAgents

> "Specifically, hyperagents optimized in one setting (i.e., paper
> review and robotics tasks) remain significantly effective at
> generating improved task agents in a different domain (i.e.,
> Olympiad-level math grading) (Section 5.2). We further show that
> self-improvements learned by the DGM-H in one setting can compound
> with continued self-improvement in another setting (Section 5.3)."

The discipline HyperAgents imposes is:

1. **Train / evolve on domain A.** Record the resulting hyperagent.
2. **Evaluate on held-out domain B.** *Without* further modification
   of the hyperagent's meta mechanism, just apply it to B.
3. **Metric = score_B(final_hyperagent) − score_B(initial_hyperagent).**
   If meta-level improvements learned on A also help on B, transfer is
   positive; if they hurt, the gains on A were overfitting.

This is the only honest way to tell whether the meta-agent learned
*how to self-improve* vs. *how to overfit A*.

## Why this matters for this project's axes

Directly operationalises the `alignment-free-self-improvement`
feature. Without a cross-domain transfer test, the harness catalog can
quietly drift into rules that help CAD loops but hurt simulation loops
— the alignment regime this project's charter explicitly rejects.

The project already has multiple domains to serve as A/B pairs:

| Domain A (train) | Domain B (held-out) | Why a natural pair |
|---|---|---|
| `cad/path-2-room-temp` loop | `sim/paschen.py` validation | both metric-driven, orthogonal skills |
| `reason/` disconnected-knowledge search | `predict/` feasibility analysis | both LLM-judged text artefacts |
| `scenario/` scenario exploration | `tests/` spec coverage | both mechanical counts |

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| post-loop (primary) | After loop end on domain A, run the final hyperagent on the paired domain B, record `transfer_delta = metric_B(final) − metric_B(baseline)`. |
| in-loop | Optionally sample B periodically and emit a warning when transfer turns negative (overfitting flag). |
| pre-loop | When proposing a new harness feature, demand a declared A/B pair in the feature frontmatter. |

## Mapping to this project's axes

- **axis1:** `outer` — runs as a shell script after the autoresearch
  loop terminates. Claude Code has no native notion of held-out domain
  evaluation.
- **axis2:** `post-loop` (primary). Complements
  `llm-as-judge-audit` (rubric scoring of the artefact) with a
  *different* post-loop measurement (transfer across domains).

## Rippable signal

Absorbed when Claude Code's `/ultrareview` (or equivalent) evaluates
the produced branch not only on the training Goal but also on a
held-out domain declared at plan time. Quantitative probe:

1. Declare an A/B pair in a project-local autoresearch Goal.
2. Run loop to termination on A.
3. Have CC-native post-loop tool compute `transfer_delta` on B.
4. Have this feature's external script compute the same.
5. If the two numbers agree within 5% on 3 consecutive Goals, rip.

## Minimal viable implementation for neo-nixetube

1. `scripts/harness/transfer.sh <domain_a> <domain_b> <baseline_commit>
   <final_commit>` — re-runs each domain's verify script on both
   commits, prints `TRANSFER_DELTA=N`.
2. `harness/pairs.tsv` — curated A/B pairs with tested verify commands.
3. Post-loop slash command (`cc-post-loop-slash` feature) reads
   `pairs.tsv` and includes the transfer_delta in the final report.

## Contrast

- `llm-as-judge-audit` — grades the final artefact in-place. This
  feature asks the different question "does what you learned
  generalise?".
- `alignment-free-self-improvement` — the *design* principle that says
  you shouldn't straddle domains. This feature is the *measurement*
  that catches you when you silently did.
- `noise-aware-ratchet` — keeps you honest within one domain. This
  feature keeps you honest across domains.
