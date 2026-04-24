"use client";

import { useState } from "react";

/**
 * Gold-tier interactive flow diagram for the harness UX.
 *
 * Visualises the three phases (pre-loop, in-loop, post-loop) from
 * `harness/UX.md`, the 8 in-loop phases, and the HITL boundaries
 * enforced by Article III of `harness/CONSTITUTION.md`.
 *
 * Hover a node to dim the others and surface its metadata.
 * Click a node to lock the selection in the side panel.
 */

type Phase = {
  id: string;
  zone: "pre" | "in" | "post";
  label: string;
  command?: string;
  article?: string;
  feature: string;
  detail: string;
  hitl: "active" | "forbidden" | "gated";
};

const PHASES: Phase[] = [
  {
    id: "new-loop",
    zone: "pre",
    label: "new-loop",
    command: "/harness:new-loop <slug>",
    article: "VIII",
    feature: "harness-loop-scaffold",
    detail:
      "Auto-increments NNN, copies loops/TEMPLATE, opens spec.md for Goal/Scope/Metric. Binds the loop to Article III–VII invariants.",
    hitl: "active",
  },
  {
    id: "clarify",
    zone: "pre",
    label: "clarify",
    command: "/harness:clarify",
    article: "V",
    feature: "harness-clarify-gate",
    detail:
      "7-dimension ambiguity pass (D1 scope, D2 metric, D3 direction, D4 HITL, D5 stop, D6 wiki, D7 guard). Unresolved [ASSUMPTION] markers fail composite-guard.",
    hitl: "active",
  },
  {
    id: "plan",
    zone: "pre",
    label: "plan",
    command: "/autoresearch:plan",
    article: "V",
    feature: "plan-mode-discipline",
    detail:
      "Interactive wizard consumes clarifications.md, dry-runs verify, measures baseline. ExitPlanMode is the only legal HITL boundary into in-loop execution.",
    hitl: "active",
  },
  {
    id: "review",
    zone: "in",
    label: "1 · Review",
    article: "VII",
    feature: "harness-constitution",
    detail:
      "Loads CONSTITUTION.md, surfaces wiki entries by keyword, reads prior reflexion entries. First phase of every iteration.",
    hitl: "forbidden",
  },
  {
    id: "modify",
    zone: "in",
    label: "2-5 · Modify",
    article: "III",
    feature: "harness-graduated-confirm",
    detail:
      "Ideate → Modify → Commit → Verify → Guard. L0 ops silent. L1 ops notify with 30s auto-approve. L2 ops pause + blocking HITL (one of the two Article III carve-outs).",
    hitl: "gated",
  },
  {
    id: "decide",
    zone: "in",
    label: "6 · Decide",
    article: "VI",
    feature: "noise-aware-ratchet",
    detail:
      "Keep / discard / rework gated by composite-guard. Discards use git revert so the lesson stays in history (Article VIII).",
    hitl: "forbidden",
  },
  {
    id: "log",
    zone: "in",
    label: "7 · Log",
    article: "VIII",
    feature: "harness-progress-cadence",
    detail:
      "Per-iter TSV row, milestone block every 5, statusline update. Final summary on exit with report path + wiki-refs path.",
    hitl: "forbidden",
  },
  {
    id: "repeat",
    zone: "in",
    label: "8 · Repeat",
    article: "III",
    feature: "plateau-detection",
    detail:
      "Loop back to Phase 1 unless bounded N reached, Goal achieved, plateau detected, or operator abandon/pause received.",
    hitl: "gated",
  },
  {
    id: "report",
    zone: "post",
    label: "report",
    command: "/harness:report",
    article: "VIII",
    feature: "cc-post-loop-slash",
    detail:
      "Renders report.mdx with TL;DR, axis-coverage delta, kept/reworked/discarded experiments, L2 confirmations, wiki contributions, next steps.",
    hitl: "active",
  },
  {
    id: "wiki-add",
    zone: "post",
    label: "wiki-add",
    command: "/harness:wiki-add",
    article: "VII",
    feature: "harness-llm-wiki",
    detail:
      "Agent proposes 0–N keyword-triggered entries. Operator approves/edits/rejects each. Accepted entries committed to harness/wiki/<slug>.md.",
    hitl: "active",
  },
];

const ZONE_COLORS: Record<Phase["zone"], string> = {
  pre: "#6BA368",
  in: "#D4A853",
  post: "#B8A9C9",
};

const HITL_COLORS: Record<Phase["hitl"], string> = {
  active: "#6BA368",
  forbidden: "#8a3a2a",
  gated: "#D4A853",
};

export default function HarnessFlowDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>("modify");
  const active = hovered ?? locked;
  const activePhase = PHASES.find((p) => p.id === active) ?? PHASES[0];

  const dim = (id: string) => (active && active !== id ? 0.28 : 1);

  const prePhases = PHASES.filter((p) => p.zone === "pre");
  const inPhases = PHASES.filter((p) => p.zone === "in");
  const postPhases = PHASES.filter((p) => p.zone === "post");

  const centerX = 480;
  const centerY = 340;
  const ringR = 180;

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <svg
          viewBox="0 0 960 680"
          className="w-full rounded-xl border border-white/10 bg-stone-950"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Harness loop flow diagram"
        >
          <defs>
            <radialGradient id="hf-bg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#1a140c" />
              <stop offset="100%" stopColor="#0b0906" />
            </radialGradient>
            <radialGradient id="hf-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFDCB8" stopOpacity="0.75" />
              <stop offset="45%" stopColor="#FF8C42" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hf-pre" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6BA368" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6BA368" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="hf-post" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8A9C9" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#B8A9C9" stopOpacity="0.02" />
            </linearGradient>
            <filter id="hf-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b1" />
              <feGaussianBlur stdDeviation="8" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="hf-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#D4A853" />
            </marker>
            <marker
              id="hf-arrow-pre"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6BA368" />
            </marker>
            <marker
              id="hf-arrow-post"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#B8A9C9" />
            </marker>
          </defs>

          {/* Background */}
          <rect width="960" height="680" fill="url(#hf-bg)" />

          {/* Pre-loop zone */}
          <g opacity={active?.startsWith("pre") ? 1 : 0.95}>
            <rect
              x="24"
              y="60"
              width="180"
              height="560"
              rx="14"
              fill="url(#hf-pre)"
              stroke="#6BA368"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <text
              x="114"
              y="88"
              fill="#6BA368"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              PRE-LOOP
            </text>
            <text
              x="114"
              y="106"
              fill="#6BA368"
              fontSize="10"
              opacity="0.7"
              textAnchor="middle"
            >
              Article III · HITL OK
            </text>
          </g>

          {/* Post-loop zone */}
          <g opacity={active?.startsWith("post") ? 1 : 0.95}>
            <rect
              x="756"
              y="60"
              width="180"
              height="560"
              rx="14"
              fill="url(#hf-post)"
              stroke="#B8A9C9"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <text
              x="846"
              y="88"
              fill="#B8A9C9"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              POST-LOOP
            </text>
            <text
              x="846"
              y="106"
              fill="#B8A9C9"
              fontSize="10"
              opacity="0.7"
              textAnchor="middle"
            >
              Article III · HITL OK
            </text>
          </g>

          {/* In-loop ring background */}
          <circle
            cx={centerX}
            cy={centerY}
            r={ringR + 42}
            fill="none"
            stroke="#D4A853"
            strokeOpacity="0.08"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={ringR - 40}
            fill="url(#hf-core)"
            opacity="0.75"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={ringR + 42}
            fill="none"
            stroke="#D4A853"
            strokeOpacity="0.22"
            strokeWidth="0.7"
          />
          <text
            x={centerX}
            y={centerY - ringR - 58}
            fill="#D4A853"
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            IN-LOOP
          </text>
          <text
            x={centerX}
            y={centerY - ringR - 42}
            fill="#D4A853"
            fontSize="10"
            opacity="0.7"
            textAnchor="middle"
          >
            Article III · HITL forbidden (two carve-outs)
          </text>

          {/* Ring connector arrows between in-phases */}
          {inPhases.map((_, i) => {
            const a0 = (-Math.PI / 2) + (i / inPhases.length) * Math.PI * 2;
            const a1 = (-Math.PI / 2) + ((i + 1) / inPhases.length) * Math.PI * 2;
            const r = ringR;
            const x0 = centerX + Math.cos(a0 + 0.22) * r;
            const y0 = centerY + Math.sin(a0 + 0.22) * r;
            const x1 = centerX + Math.cos(a1 - 0.22) * r;
            const y1 = centerY + Math.sin(a1 - 0.22) * r;
            const mx = centerX + Math.cos((a0 + a1) / 2) * (r + 18);
            const my = centerY + Math.sin((a0 + a1) / 2) * (r + 18);
            return (
              <path
                key={`arc-${i}`}
                d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`}
                fill="none"
                stroke="#D4A853"
                strokeOpacity="0.45"
                strokeWidth="1.2"
                markerEnd="url(#hf-arrow)"
              />
            );
          })}

          {/* Pre-loop nodes (vertical stack) */}
          {prePhases.map((p, i) => {
            const y = 180 + i * 120;
            const isActive = active === p.id;
            return (
              <g
                key={p.id}
                style={{ cursor: "pointer", transition: "opacity 0.25s" }}
                opacity={dim(p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setLocked(p.id)}
              >
                <circle
                  cx={114}
                  cy={y}
                  r={isActive ? 36 : 30}
                  fill={ZONE_COLORS.pre}
                  fillOpacity={isActive ? 0.4 : 0.22}
                  stroke={ZONE_COLORS.pre}
                  strokeWidth={isActive ? 2.4 : 1.5}
                  filter={isActive ? "url(#hf-glow)" : undefined}
                />
                <text
                  x={114}
                  y={y - 2}
                  fill="#eaeaea"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
                <text
                  x={114}
                  y={y + 13}
                  fill="#9ec8a0"
                  fontSize="9"
                  textAnchor="middle"
                >
                  Art. {p.article}
                </text>
                {i < prePhases.length - 1 && (
                  <line
                    x1={114}
                    y1={y + (isActive ? 38 : 32)}
                    x2={114}
                    y2={y + 82}
                    stroke="#6BA368"
                    strokeOpacity="0.5"
                    strokeWidth="1.4"
                    markerEnd="url(#hf-arrow-pre)"
                  />
                )}
              </g>
            );
          })}

          {/* Pre-loop → in-loop bridge arrow */}
          <line
            x1={204}
            y1={centerY}
            x2={centerX - ringR - 48}
            y2={centerY}
            stroke="#6BA368"
            strokeOpacity="0.55"
            strokeWidth="1.8"
            markerEnd="url(#hf-arrow-pre)"
          />
          <text
            x={(204 + centerX - ringR - 48) / 2}
            y={centerY - 12}
            fill="#6BA368"
            fontSize="10"
            textAnchor="middle"
            opacity="0.8"
          >
            ExitPlanMode
          </text>

          {/* In-loop ring nodes */}
          {inPhases.map((p, i) => {
            const angle = (-Math.PI / 2) + (i / inPhases.length) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * ringR;
            const y = centerY + Math.sin(angle) * ringR;
            const isActive = active === p.id;
            return (
              <g
                key={p.id}
                style={{ cursor: "pointer", transition: "opacity 0.25s" }}
                opacity={dim(p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setLocked(p.id)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 38 : 32}
                  fill={ZONE_COLORS.in}
                  fillOpacity={isActive ? 0.38 : 0.2}
                  stroke={HITL_COLORS[p.hitl]}
                  strokeWidth={isActive ? 2.6 : 1.6}
                  filter={isActive ? "url(#hf-glow)" : undefined}
                />
                <text
                  x={x}
                  y={y - 2}
                  fill="#eaeaea"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {p.label.split(" · ")[0]}
                </text>
                <text
                  x={x}
                  y={y + 12}
                  fill="#e6c97a"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {p.label.split(" · ")[1] ?? ""}
                </text>
              </g>
            );
          })}

          {/* HITL badge in the ring core */}
          <g>
            <circle
              cx={centerX}
              cy={centerY}
              r="58"
              fill="#120d08"
              stroke="#D4A853"
              strokeOpacity="0.6"
              strokeWidth="1"
            />
            <text
              x={centerX}
              y={centerY - 14}
              fill="#D4A853"
              fontSize="10"
              textAnchor="middle"
              fontWeight="600"
              letterSpacing="0.08em"
            >
              HITL
            </text>
            <text
              x={centerX}
              y={centerY + 2}
              fill="#eaeaea"
              fontSize="11"
              textAnchor="middle"
              fontWeight="600"
            >
              L2 + Ctrl-C
            </text>
            <text
              x={centerX}
              y={centerY + 18}
              fill="#9a8660"
              fontSize="9"
              textAnchor="middle"
            >
              Article III
            </text>
            <text
              x={centerX}
              y={centerY + 32}
              fill="#7a6850"
              fontSize="9"
              textAnchor="middle"
            >
              (only two carve-outs)
            </text>
          </g>

          {/* In-loop → post-loop bridge */}
          <line
            x1={centerX + ringR + 48}
            y1={centerY}
            x2={756}
            y2={centerY}
            stroke="#B8A9C9"
            strokeOpacity="0.55"
            strokeWidth="1.8"
            markerEnd="url(#hf-arrow-post)"
          />
          <text
            x={(centerX + ringR + 48 + 756) / 2}
            y={centerY - 12}
            fill="#B8A9C9"
            fontSize="10"
            textAnchor="middle"
            opacity="0.8"
          >
            stop cond.
          </text>

          {/* Post-loop nodes */}
          {postPhases.map((p, i) => {
            const y = 240 + i * 140;
            const isActive = active === p.id;
            return (
              <g
                key={p.id}
                style={{ cursor: "pointer", transition: "opacity 0.25s" }}
                opacity={dim(p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setLocked(p.id)}
              >
                <circle
                  cx={846}
                  cy={y}
                  r={isActive ? 36 : 30}
                  fill={ZONE_COLORS.post}
                  fillOpacity={isActive ? 0.4 : 0.22}
                  stroke={ZONE_COLORS.post}
                  strokeWidth={isActive ? 2.4 : 1.5}
                  filter={isActive ? "url(#hf-glow)" : undefined}
                />
                <text
                  x={846}
                  y={y - 2}
                  fill="#eaeaea"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
                <text
                  x={846}
                  y={y + 13}
                  fill="#c4b5d2"
                  fontSize="9"
                  textAnchor="middle"
                >
                  Art. {p.article}
                </text>
                {i < postPhases.length - 1 && (
                  <line
                    x1={846}
                    y1={y + (isActive ? 38 : 32)}
                    x2={846}
                    y2={y + 104}
                    stroke="#B8A9C9"
                    strokeOpacity="0.5"
                    strokeWidth="1.4"
                    markerEnd="url(#hf-arrow-post)"
                  />
                )}
              </g>
            );
          })}

          {/* Legend (bottom) */}
          <g transform="translate(24, 634)">
            <rect width="912" height="32" rx="8" fill="#120d08" stroke="#3a2e1e" />
            <g transform="translate(16, 16)">
              <circle cx="6" cy="0" r="6" fill={HITL_COLORS.active} opacity="0.6" />
              <text x="18" y="3" fill="#c7c7c7" fontSize="10">HITL active (pre/post)</text>
            </g>
            <g transform="translate(210, 16)">
              <circle cx="6" cy="0" r="6" fill={HITL_COLORS.forbidden} opacity="0.7" />
              <text x="18" y="3" fill="#c7c7c7" fontSize="10">HITL forbidden (in-loop)</text>
            </g>
            <g transform="translate(420, 16)">
              <circle cx="6" cy="0" r="6" fill={HITL_COLORS.gated} opacity="0.7" />
              <text x="18" y="3" fill="#c7c7c7" fontSize="10">HITL gated (L2 carve-out)</text>
            </g>
            <g transform="translate(620, 16)">
              <rect x="-2" y="-6" width="12" height="12" rx="2" fill="#D4A853" opacity="0.35" />
              <text x="18" y="3" fill="#c7c7c7" fontSize="10">click a node to lock the panel</text>
            </g>
          </g>
        </svg>

        {/* Side panel — details about the active phase */}
        <aside
          className="rounded-xl border border-white/10 bg-stone-900/60 p-5 text-sm text-stone-300"
          aria-live="polite"
        >
          <div
            className="uppercase tracking-widest text-[10px] mb-1"
            style={{ color: ZONE_COLORS[activePhase.zone] }}
          >
            {activePhase.zone === "pre"
              ? "pre-loop"
              : activePhase.zone === "in"
              ? "in-loop"
              : "post-loop"}
          </div>
          <div className="text-lg font-semibold text-amber-200 mb-3">
            {activePhase.label}
          </div>
          {activePhase.command && (
            <div className="mb-3">
              <div className="text-xs text-stone-500 mb-1">command</div>
              <code className="block bg-stone-950 border border-white/5 px-2 py-1.5 rounded text-amber-300 text-xs">
                {activePhase.command}
              </code>
            </div>
          )}
          <div className="mb-3">
            <div className="text-xs text-stone-500 mb-1">feature</div>
            <code className="text-xs text-amber-200">{activePhase.feature}</code>
          </div>
          <div className="mb-3">
            <div className="text-xs text-stone-500 mb-1">article</div>
            <div className="text-xs text-amber-100">Article {activePhase.article}</div>
          </div>
          <div className="mb-3">
            <div className="text-xs text-stone-500 mb-1">HITL</div>
            <span
              className="inline-block text-xs px-2 py-0.5 rounded"
              style={{
                background: HITL_COLORS[activePhase.hitl] + "33",
                color: HITL_COLORS[activePhase.hitl],
                border: `1px solid ${HITL_COLORS[activePhase.hitl]}66`,
              }}
            >
              {activePhase.hitl}
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">{activePhase.detail}</p>
        </aside>
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        Interactive loop diagram — hover to preview, click to lock. 10 phases ·
        3 zones · Article III HITL boundary highlighted.
      </figcaption>
    </figure>
  );
}
