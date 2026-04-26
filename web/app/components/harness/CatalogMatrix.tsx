"use client";

import { useState, useMemo } from "react";

/*
 * CatalogMatrix — gold-tier interactive 2×3 axis classifier.
 * Article I (Axis Classification) is the rippability boundary (axis1)
 * and the HITL boundary (axis2). Every one of the 28 catalog features
 * lands in exactly one cell.
 */

type Axis1 = "inner" | "outer";
type Axis2 = "pre-loop" | "in-loop" | "post-loop";

type Feature = {
  slug: string;
  short: string;
  axis1: Axis1;
  axis2: Axis2;
  article: string;
  blurb: string;
};

const FEATURES: Feature[] = [
  // pre-loop × inner (5)
  { slug: "harness-clarify-gate", short: "clarify-gate", axis1: "inner", axis2: "pre-loop", article: "V", blurb: "7-dim ambiguity pass → clarifications.md. Blocks loop entry on unresolved [ASSUMPTION]." },
  { slug: "harness-constitution", short: "constitution", axis1: "inner", axis2: "pre-loop", article: "IX", blurb: "Load-time invariants. 9 Articles bound into every loop's spec." },
  { slug: "harness-loop-scaffold", short: "loop-scaffold", axis1: "inner", axis2: "pre-loop", article: "VIII", blurb: "/harness:new-loop scaffolds loops/NNN-<slug>/ with spec/clarif/plan/report/wiki-refs." },
  { slug: "plan-mode-discipline", short: "plan-discipline", axis1: "inner", axis2: "pre-loop", article: "III", blurb: "ExitPlanMode is the only legal HITL boundary for entering in-loop execution." },
  { slug: "swe-agent-aci", short: "swe-aci", axis1: "inner", axis2: "pre-loop", article: "I", blurb: "Agent-Computer Interface primitives — structured tool surface baked into CC." },

  // pre-loop × outer (6)
  { slug: "adas-meta-agent-search", short: "adas", axis1: "outer", axis2: "pre-loop", article: "IV", blurb: "Meta-agent searches the agent space — outer script, content-domain evaluator." },
  { slug: "alignment-free-self-improvement", short: "align-free", axis1: "outer", axis2: "pre-loop", article: "IV", blurb: "Separates eval skill from self-modification skill. DGM-style alignment fails here." },
  { slug: "fpt-hyperagent-multirole", short: "fpt-hyper", axis1: "outer", axis2: "pre-loop", article: "IV", blurb: "Multi-role hyperagent planner (Meta FPT) — pre-loop role-synthesis primitive." },
  { slug: "gcli-skill-pack-distribution", short: "skill-pack", axis1: "outer", axis2: "pre-loop", article: "VII", blurb: "Skill-pack shipping over gcli — cross-repo distribution for harness skills." },
  { slug: "harness-llm-wiki", short: "llm-wiki", axis1: "outer", axis2: "pre-loop", article: "VII", blurb: "Keyword-triggered, project-scoped, committable knowledge — the 4th persistence layer." },
  { slug: "voyager-skill-library", short: "voyager", axis1: "outer", axis2: "pre-loop", article: "VII", blurb: "Skill library substrate — Voyager-style curriculum that feeds wiki surfacing." },

  // in-loop × inner (3)
  { slug: "cc-hook-guardrail", short: "cc-hook", axis1: "inner", axis2: "in-loop", article: "III", blurb: "PreToolUse hook denies off-scope ops before the tool call fires. L2 carve-out trigger." },
  { slug: "harness-graduated-confirm", short: "graduated", axis1: "inner", axis2: "in-loop", article: "III", blurb: "L0 silent / L1 30s auto / L2 blocking. The only in-loop HITL permitted." },
  { slug: "harness-pause-resume", short: "pause-resume", axis1: "inner", axis2: "in-loop", article: "III", blurb: "/harness:pause writes checkpoint at atomic boundary. /harness:resume restores." },

  // in-loop × outer (10)
  { slug: "dgm-h-archive-parent-selection", short: "dgm-h", axis1: "outer", axis2: "in-loop", article: "VIII", blurb: "Darwin-Gödel archive parent-selection — branches from kept ancestors only." },
  { slug: "gcli-agent-run-telemetry", short: "telemetry", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "Run-level telemetry — wiki-surface hits, tool calls, guard outcomes." },
  { slug: "harness-progress-cadence", short: "cadence", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "Per-iter line + every-5 milestone block + statusline. Full summary on exit." },
  { slug: "harness-rip-test", short: "rip-test", axis1: "outer", axis2: "in-loop", article: "II", blurb: "Runs feature tc_scripts on the current CC+model combo. Pass=still-needed." },
  { slug: "meta-hyperagents-metacognitive", short: "meta-hyper", axis1: "outer", axis2: "in-loop", article: "IV", blurb: "Metacognitive supervisor — notices the harness is solving the wrong problem." },
  { slug: "noise-aware-ratchet", short: "ratchet", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "LLM-as-judge has ±10 σ noise. Use MAX ratchet; never weaken the anchor." },
  { slug: "plateau-detection", short: "plateau", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "Ratchet-patience AND trend-slope both flat → stop or trigger radical branch." },
  { slug: "reflexion", short: "reflexion", axis1: "outer", axis2: "in-loop", article: "VIII", blurb: "Verbal self-critique appended as reflexion entries, read back at Phase 1." },
  { slug: "sandboxed-open-ended-exploration", short: "sandbox", axis1: "outer", axis2: "in-loop", article: "III", blurb: "Worktree isolation + sandboxed shell — L2 ops cannot escape the bubble." },
  { slug: "statistical-tc-runner", short: "stat-tc", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "Multi-seed TC with confidence intervals. Noise-controlled pass/fail." },

  // post-loop × inner (1)
  { slug: "cc-post-loop-slash", short: "post-slash", axis1: "inner", axis2: "post-loop", article: "VIII", blurb: "/harness:report composes report.mdx from results.tsv + wiki-refs + Article bindings." },

  // post-loop × outer (3)
  { slug: "cross-domain-transfer-metric", short: "transfer", axis1: "outer", axis2: "post-loop", article: "II", blurb: "Runs loop's verify against a paired held-out domain — catches overfit-to-TC." },
  { slug: "gcli-eval-compare-primitive", short: "eval-cmp", axis1: "outer", axis2: "post-loop", article: "VI", blurb: "Paired A/B vs. baseline ref — turns verify output into a statistical comparison." },
  { slug: "llm-as-judge-audit", short: "judge-audit", axis1: "outer", axis2: "post-loop", article: "IV", blurb: "Rubric grade with self-enhancement-bias control (judge model ≠ candidate model)." },
];

const PHASES: { key: Axis2; label: string; hint: string }[] = [
  { key: "pre-loop", label: "pre-loop", hint: "HITL allowed" },
  { key: "in-loop", label: "in-loop", hint: "HITL forbidden (Art. III)" },
  { key: "post-loop", label: "post-loop", hint: "HITL allowed" },
];

const TIERS: { key: Axis1; label: string; hint: string; color: string }[] = [
  { key: "inner", label: "inner", hint: "lives inside CC (.claude/)", color: "#7B9EB8" },
  { key: "outer", label: "outer", hint: "lives outside CC (shell / MCP)", color: "#D4A853" },
];

/* SVG layout constants */
const VB_W = 1100;
const VB_H = 620;
const PAD_L = 130;
const PAD_T = 80;
const CELL_W = (VB_W - PAD_L - 40) / 3; // 3 phases
const CELL_H = (VB_H - PAD_T - 70) / 2; // 2 tiers

function cellBox(a1: Axis1, a2: Axis2) {
  const col = PHASES.findIndex((p) => p.key === a2);
  const row = TIERS.findIndex((t) => t.key === a1);
  return {
    x: PAD_L + col * CELL_W,
    y: PAD_T + row * CELL_H,
    w: CELL_W,
    h: CELL_H,
  };
}

/* Deterministic, collision-avoidant node placement within a cell. */
function layoutCell(a1: Axis1, a2: Axis2, n: number) {
  const { x, y, w, h } = cellBox(a1, a2);
  const pad = 26;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(n))));
  const rows = Math.ceil(n / cols);
  const pts: { cx: number; cy: number }[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const dx = cols === 1 ? innerW / 2 : (innerW / (cols - 1)) * c;
    const dy = rows === 1 ? innerH / 2 : (innerH / (rows - 1)) * r;
    pts.push({ cx: x + pad + dx, cy: y + pad + dy });
  }
  return pts;
}

export default function CatalogMatrix() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<Axis1 | "all">("all");

  const active = pinned ?? hovered;
  const activeF = FEATURES.find((f) => f.slug === active) ?? null;

  const nodes = useMemo(() => {
    const out: (Feature & { cx: number; cy: number })[] = [];
    for (const a1 of ["inner", "outer"] as Axis1[]) {
      for (const a2 of ["pre-loop", "in-loop", "post-loop"] as Axis2[]) {
        const bucket = FEATURES.filter((f) => f.axis1 === a1 && f.axis2 === a2);
        const pts = layoutCell(a1, a2, bucket.length);
        bucket.forEach((f, i) => out.push({ ...f, cx: pts[i].cx, cy: pts[i].cy }));
      }
    }
    return out;
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FEATURES) {
      const k = `${f.axis1}|${f.axis2}`;
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, []);

  const dimmed = (f: Feature) => {
    if (tierFilter !== "all" && f.axis1 !== tierFilter) return true;
    if (!active) return false;
    return f.slug !== active;
  };

  return (
    <figure className="my-8 not-prose">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-stone-400">
        <span className="mr-1">tier filter:</span>
        {(["all", "inner", "outer"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTierFilter(k)}
            className={`px-2 py-0.5 rounded-full border transition ${
              tierFilter === k
                ? "border-[#D4A853] text-[#D4A853] bg-[#D4A853]/10"
                : "border-stone-700 text-stone-400 hover:border-stone-500"
            }`}
          >
            {k}
          </button>
        ))}
        <span className="ml-3 text-stone-500 normal-case tracking-normal">
          Article I — every feature declares axis1 × axis2. Hover a node; click to pin.
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full rounded-xl border border-stone-800 bg-[#0f0d0a]"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="28 harness features arranged by axis1 (inner/outer) × axis2 (pre/in/post-loop)"
      >
        <defs>
          <radialGradient id="cm-bg" cx="50%" cy="0%" r="95%">
            <stop offset="0%" stopColor="#1a1510" />
            <stop offset="100%" stopColor="#0b0906" />
          </radialGradient>
          <linearGradient id="cm-inner-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7B9EB8" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#7B9EB8" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="cm-outer-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A853" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#D4A853" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="cm-preloop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6BA368" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#6BA368" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="cm-inloop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef8f44" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#ef8f44" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ef8f44" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="cm-postloop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B8A9C9" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#B8A9C9" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="cm-node-inner" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#BFD9E8" />
            <stop offset="70%" stopColor="#7B9EB8" />
            <stop offset="100%" stopColor="#2b4050" />
          </radialGradient>
          <radialGradient id="cm-node-outer" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#F3D991" />
            <stop offset="70%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#4a3a18" />
          </radialGradient>
          <filter id="cm-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cm-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <pattern id="cm-grid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#2a2418" strokeWidth="0.4" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width={VB_W} height={VB_H} fill="url(#cm-bg)" />
        <rect width={VB_W} height={VB_H} fill="url(#cm-grid)" opacity="0.4" />

        {/* Row bands (tier colouring) */}
        <rect
          x={PAD_L}
          y={PAD_T}
          width={CELL_W * 3}
          height={CELL_H}
          fill="url(#cm-inner-band)"
        />
        <rect
          x={PAD_L}
          y={PAD_T + CELL_H}
          width={CELL_W * 3}
          height={CELL_H}
          fill="url(#cm-outer-band)"
        />

        {/* Column bands (phase colouring) */}
        <rect x={PAD_L} y={PAD_T} width={CELL_W} height={CELL_H * 2} fill="url(#cm-preloop)" />
        <rect x={PAD_L + CELL_W} y={PAD_T} width={CELL_W} height={CELL_H * 2} fill="url(#cm-inloop)" />
        <rect x={PAD_L + CELL_W * 2} y={PAD_T} width={CELL_W} height={CELL_H * 2} fill="url(#cm-postloop)" />

        {/* HITL-forbidden band marker (Article III) */}
        <rect
          x={PAD_L + CELL_W}
          y={PAD_T - 14}
          width={CELL_W}
          height={6}
          fill="#ef8f44"
          opacity="0.55"
        />
        <text
          x={PAD_L + CELL_W + CELL_W / 2}
          y={PAD_T - 20}
          textAnchor="middle"
          fontSize="10"
          fill="#ef8f44"
          fontFamily="ui-monospace, monospace"
          opacity="0.85"
        >
          Article III — HITL forbidden inside this column
        </text>

        {/* Axis frame */}
        <rect
          x={PAD_L}
          y={PAD_T}
          width={CELL_W * 3}
          height={CELL_H * 2}
          fill="none"
          stroke="#3a3020"
          strokeWidth="1.2"
        />

        {/* Cell dividers */}
        <line x1={PAD_L + CELL_W} y1={PAD_T} x2={PAD_L + CELL_W} y2={PAD_T + CELL_H * 2} stroke="#3a3020" strokeWidth="0.8" strokeDasharray="3 4" />
        <line x1={PAD_L + CELL_W * 2} y1={PAD_T} x2={PAD_L + CELL_W * 2} y2={PAD_T + CELL_H * 2} stroke="#3a3020" strokeWidth="0.8" strokeDasharray="3 4" />
        <line x1={PAD_L} y1={PAD_T + CELL_H} x2={PAD_L + CELL_W * 3} y2={PAD_T + CELL_H} stroke="#3a3020" strokeWidth="0.8" strokeDasharray="3 4" />

        {/* Column headers */}
        {PHASES.map((p, i) => (
          <g key={p.key}>
            <text
              x={PAD_L + i * CELL_W + CELL_W / 2}
              y={PAD_T - 40}
              textAnchor="middle"
              fontSize="18"
              fontFamily="ui-monospace, monospace"
              fill="#e8dfc8"
              fontWeight="600"
            >
              {p.label}
            </text>
            <text
              x={PAD_L + i * CELL_W + CELL_W / 2}
              y={PAD_T - 24}
              textAnchor="middle"
              fontSize="10"
              fill="#8a7a58"
              fontFamily="ui-monospace, monospace"
            >
              {p.hint}
            </text>
          </g>
        ))}

        {/* Row headers */}
        {TIERS.map((t, i) => (
          <g key={t.key}>
            <text
              x={PAD_L - 22}
              y={PAD_T + i * CELL_H + CELL_H / 2 - 6}
              textAnchor="end"
              fontSize="16"
              fontFamily="ui-monospace, monospace"
              fill={t.color}
              fontWeight="600"
            >
              {t.label}
            </text>
            <text
              x={PAD_L - 22}
              y={PAD_T + i * CELL_H + CELL_H / 2 + 10}
              textAnchor="end"
              fontSize="9"
              fill="#8a7a58"
              fontFamily="ui-monospace, monospace"
            >
              {t.hint}
            </text>
            <rect
              x={PAD_L - 14}
              y={PAD_T + i * CELL_H + 8}
              width={5}
              height={CELL_H - 16}
              fill={t.color}
              opacity="0.5"
              rx="2"
            />
          </g>
        ))}

        {/* Cell count badges */}
        {TIERS.map((t, ri) =>
          PHASES.map((p, ci) => {
            const n = counts[`${t.key}|${p.key}`] ?? 0;
            return (
              <g key={`${t.key}-${p.key}`}>
                <rect
                  x={PAD_L + ci * CELL_W + 10}
                  y={PAD_T + ri * CELL_H + 10}
                  width={44}
                  height={18}
                  rx="9"
                  fill="#000"
                  opacity="0.55"
                />
                <text
                  x={PAD_L + ci * CELL_W + 32}
                  y={PAD_T + ri * CELL_H + 22}
                  textAnchor="middle"
                  fontSize="10"
                  fill={t.color}
                  fontFamily="ui-monospace, monospace"
                >
                  n={n}
                </text>
              </g>
            );
          })
        )}

        {/* Feature nodes */}
        {nodes.map((f) => {
          const isActive = f.slug === active;
          const isDim = dimmed(f);
          const r = isActive ? 14 : 9;
          return (
            <g
              key={f.slug}
              style={{ cursor: "pointer", transition: "opacity 0.25s" }}
              opacity={isDim ? 0.18 : 1}
              onMouseEnter={() => setHovered(f.slug)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned(pinned === f.slug ? null : f.slug)}
            >
              {isActive && (
                <circle
                  cx={f.cx}
                  cy={f.cy}
                  r={22}
                  fill={f.axis1 === "inner" ? "#7B9EB8" : "#D4A853"}
                  opacity="0.25"
                  filter="url(#cm-glow)"
                />
              )}
              <circle
                cx={f.cx}
                cy={f.cy}
                r={r}
                fill={`url(#cm-node-${f.axis1})`}
                stroke={isActive ? "#ffffff" : f.axis1 === "inner" ? "#9BB8CC" : "#E8C878"}
                strokeWidth={isActive ? 1.8 : 0.8}
              />
              <circle
                cx={f.cx - r * 0.3}
                cy={f.cy - r * 0.35}
                r={r * 0.32}
                fill="#ffffff"
                opacity="0.35"
                filter="url(#cm-soft)"
              />
              <text
                x={f.cx}
                y={f.cy + r + 14}
                textAnchor="middle"
                fontSize="9.5"
                fill={isActive ? "#ffffff" : "#c8bfa0"}
                fontFamily="ui-monospace, monospace"
                style={{ pointerEvents: "none" }}
              >
                {f.short}
              </text>
              <text
                x={f.cx}
                y={f.cy + 3}
                textAnchor="middle"
                fontSize="8"
                fill="#000"
                opacity="0.7"
                fontFamily="ui-monospace, monospace"
                style={{ pointerEvents: "none" }}
              >
                {f.article}
              </text>
            </g>
          );
        })}

        {/* Detail pane (bottom) */}
        <g transform={`translate(${PAD_L}, ${VB_H - 60})`}>
          <rect
            x={0}
            y={0}
            width={CELL_W * 3}
            height={52}
            rx="8"
            fill="#120f0a"
            stroke="#2a2418"
            strokeWidth="1"
          />
          {activeF ? (
            <>
              <circle
                cx={22}
                cy={26}
                r={8}
                fill={`url(#cm-node-${activeF.axis1})`}
                stroke={activeF.axis1 === "inner" ? "#9BB8CC" : "#E8C878"}
              />
              <text x={42} y={22} fontSize="12" fontFamily="ui-monospace, monospace" fill="#e8dfc8" fontWeight="600">
                {activeF.slug}
              </text>
              <text x={42} y={22} fontSize="10" fontFamily="ui-monospace, monospace" fill="#8a7a58" textAnchor="start" dx={activeF.slug.length * 7.3 + 10}>
                Article {activeF.article} · {activeF.axis1} · {activeF.axis2}
              </text>
              <text x={42} y={40} fontSize="10.5" fontFamily="ui-monospace, monospace" fill="#c8bfa0">
                {activeF.blurb.length > 110 ? activeF.blurb.slice(0, 108) + "…" : activeF.blurb}
              </text>
            </>
          ) : (
            <text x={22} y={30} fontSize="11" fontFamily="ui-monospace, monospace" fill="#6a5f48">
              hover a node — 28 features · axis1 ∈ {"{inner, outer}"} · axis2 ∈ {"{pre-loop, in-loop, post-loop}"} · Article I
            </text>
          )}
        </g>
      </svg>

      <figcaption className="mt-2 text-xs text-stone-500 text-center">
        Catalog matrix — 28 features, Article I axis classification. Inner cells are CC-native
        (<span className="text-[#7B9EB8]">blue</span>); outer cells are shell/MCP
        (<span className="text-[#D4A853]">gold</span>). The middle column (in-loop) is HITL-forbidden
        under Article III except graduated-confirm + Ctrl+C.
      </figcaption>
    </figure>
  );
}
