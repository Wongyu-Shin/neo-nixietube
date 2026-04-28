"use client";

import { useState } from "react";

/*
 * CrossRefGraph — the top cross-references between catalog features,
 * laid out on a fixed polar projection so the rendering is
 * deterministic (Article VI says crosschecks must be 11/11).
 */

type Node = { id: string; label: string; ring: 0 | 1 | 2; theta: number; kind: "inner" | "outer" };

// theta in degrees, 0 = top
const NODES: Node[] = [
  // inner core ring (deep primitives cited by many)
  { id: "constitution", label: "constitution", ring: 0, theta: 0, kind: "inner" },
  { id: "clarify", label: "clarify-gate", ring: 0, theta: 120, kind: "inner" },
  { id: "plan-disc", label: "plan-discipline", ring: 0, theta: 240, kind: "inner" },

  // middle ring — phase primitives
  { id: "scaffold", label: "loop-scaffold", ring: 1, theta: 20, kind: "inner" },
  { id: "progress", label: "progress-cadence", ring: 1, theta: 60, kind: "outer" },
  { id: "pause", label: "pause-resume", ring: 1, theta: 100, kind: "inner" },
  { id: "graduated", label: "graduated-confirm", ring: 1, theta: 140, kind: "inner" },
  { id: "hook", label: "cc-hook-guardrail", ring: 1, theta: 180, kind: "inner" },
  { id: "ratchet", label: "noise-ratchet", ring: 1, theta: 220, kind: "outer" },
  { id: "post", label: "post-loop-slash", ring: 1, theta: 260, kind: "inner" },
  { id: "wiki", label: "llm-wiki", ring: 1, theta: 300, kind: "outer" },
  { id: "plateau", label: "plateau-detection", ring: 1, theta: 340, kind: "outer" },

  // outer ring — specialised outer features
  { id: "align", label: "align-free", ring: 2, theta: 10, kind: "outer" },
  { id: "judge", label: "judge-audit", ring: 2, theta: 45, kind: "outer" },
  { id: "transfer", label: "transfer-metric", ring: 2, theta: 80, kind: "outer" },
  { id: "reflexion", label: "reflexion", ring: 2, theta: 115, kind: "outer" },
  { id: "rip", label: "rip-test", ring: 2, theta: 150, kind: "outer" },
  { id: "stat", label: "stat-tc", ring: 2, theta: 185, kind: "outer" },
  { id: "sandbox", label: "sandbox-explore", ring: 2, theta: 220, kind: "outer" },
  { id: "adas", label: "adas-meta", ring: 2, theta: 255, kind: "outer" },
  { id: "meta-hyper", label: "meta-hyper", ring: 2, theta: 290, kind: "outer" },
  { id: "voyager", label: "voyager-skills", ring: 2, theta: 325, kind: "outer" },
];

type Edge = [string, string];
const EDGES: Edge[] = [
  // constitution ties into every pre-loop
  ["constitution", "clarify"],
  ["constitution", "plan-disc"],
  ["constitution", "scaffold"],
  ["constitution", "post"],
  ["constitution", "wiki"],
  // clarify binds clarification + plan
  ["clarify", "plan-disc"],
  ["clarify", "scaffold"],
  // plan-discipline gates the HITL carve-outs
  ["plan-disc", "graduated"],
  ["plan-disc", "pause"],
  ["plan-disc", "hook"],
  ["plan-disc", "sandbox"],
  // in-loop cluster
  ["hook", "graduated"],
  ["graduated", "pause"],
  ["progress", "ratchet"],
  ["progress", "plateau"],
  ["ratchet", "plateau"],
  ["ratchet", "stat"],
  // post-loop pipeline
  ["post", "judge"],
  ["post", "transfer"],
  ["post", "wiki"],
  // meta
  ["align", "adas"],
  ["adas", "meta-hyper"],
  ["voyager", "wiki"],
  ["reflexion", "progress"],
  ["rip", "transfer"],
];

const CX = 260;
const CY = 260;
const R0 = 55;
const R1 = 135;
const R2 = 220;

function polar(ring: Node["ring"], theta: number) {
  const r = ring === 0 ? R0 : ring === 1 ? R1 : R2;
  const t = ((theta - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(t), y: CY + r * Math.sin(t) };
}

const POS = Object.fromEntries(NODES.map((n) => [n.id, polar(n.ring, n.theta)]));

export default function CrossRefGraph() {
  const [hover, setHover] = useState<string | null>(null);

  const connected = (id: string) =>
    new Set(
      EDGES.filter(([a, b]) => a === id || b === id).flatMap(([a, b]) => [a, b])
    );
  const active = hover ? connected(hover) : null;

  return (
    <figure className="my-6 not-prose">
      <svg viewBox="0 0 520 520" className="w-full max-w-xl mx-auto rounded-xl border border-stone-800 bg-[#0f0d0a]">
        <defs>
          <radialGradient id="xr-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#181310" />
            <stop offset="100%" stopColor="#0b0906" />
          </radialGradient>
          <radialGradient id="xr-inner" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#BFD9E8" />
            <stop offset="100%" stopColor="#2b4050" />
          </radialGradient>
          <radialGradient id="xr-outer" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#F3D991" />
            <stop offset="100%" stopColor="#4a3a18" />
          </radialGradient>
        </defs>

        <rect width="520" height="520" fill="url(#xr-bg)" />

        {/* Concentric rings */}
        {[R0, R1, R2].map((r, i) => (
          <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke="#2a2418" strokeWidth="0.8" strokeDasharray="2 4" />
        ))}
        <text x={CX} y={CY - R2 - 10} textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" fill="#6a5f48">
          외부 · 특수화
        </text>
        <text x={CX} y={CY - R1 - 6} textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" fill="#6a5f48">
          중간 · 단계 프리미티브
        </text>
        <text x={CX} y={CY - R0 - 6} textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" fill="#8a7a58">
          내부 · 앵커
        </text>

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const pa = POS[a];
          const pb = POS[b];
          const live = !active || (active.has(a) && active.has(b));
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={live ? "#D4A85355" : "#D4A85311"}
              strokeWidth={live ? 0.9 : 0.4}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const p = POS[n.id];
          const isActive = hover === n.id;
          const dim = active && !active.has(n.id);
          const r = n.ring === 0 ? 11 : 7;
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", opacity: dim ? 0.2 : 1, transition: "opacity 0.2s" }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={`url(#xr-${n.kind})`}
                stroke={isActive ? "#fff" : n.kind === "inner" ? "#9BB8CC" : "#E8C878"}
                strokeWidth={isActive ? 1.6 : 0.7}
              />
              <text
                x={p.x}
                y={p.y + r + 11}
                textAnchor="middle"
                fontSize="8.5"
                fontFamily="ui-monospace,monospace"
                fill={isActive ? "#fff" : "#c8bfa0"}
                style={{ pointerEvents: "none" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs text-stone-500 text-center">
        교차 참조 그래프 — 노드 위에 호버하면 조항 VI crosscheck 이웃을 추적한다.
      </figcaption>
    </figure>
  );
}
