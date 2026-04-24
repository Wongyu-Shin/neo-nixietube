---
name: hyperagent-planner-routing
axis1: outer
axis2: pre-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6]
tc_script: harness/tests/hyperagent-planner-routing.sh
rippable_check: "Claude Code SDK grows a first-class HITL-routing primitive where subagents are forbidden from calling AskUserQuestion; probe by invoking AskUserQuestion from within a spawned Agent and checking for a structured 'HITL-not-allowed' error."
sources:
  - "https://arxiv.org/abs/2409.16299"
  - "https://github.com/FSoft-AI4Code/HyperAgent"
---

# HyperAgent Planner-only-HITL routing

Directly realises the project's axis-2 charter: **HITL belongs outside the
agent loop**. HyperAgent enforces this by construction — only the Planner
role may call a human; Navigator, Editor and Executor run to completion
without paging out. Failures return to the Planner, never the user.

Implementation is an outer orchestrator because Claude Code's current
`Agent` tool does not block `AskUserQuestion` inside subagents. The tc
currently validates the research-note contract; the live-probe version
(spawn subagent, attempt HITL, assert failure) is deferred until we wire
the outer orchestrator in `scripts/hyper/`.

Complements `swe-agent-aci` (single-agent ACI tuning) and
`voyager-skill-library` (cross-goal knowledge reuse).
