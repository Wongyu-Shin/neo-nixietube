"use client";

import { useState } from "react";

/* KnowledgeStack — 4-layer persistence stack diagram.
 * Mirrors harness/UX.md §7 "Persistence layers" and research
 * note harness/research/harness-llm-wiki.md §"Core idea" table.
 */

type Layer = {
  id: string;
  title: string;
  path: string;
  scope: string;
  trigger: string;
  color: string;
  note: string;
};

const LAYERS: Layer[] = [
  {
    id: "user",
    title: "User memory",
    path: "~/.claude/.../memory/*.md",
    scope: "cross-repo",
    trigger: "always loaded",
    color: "#B8A9C9",
    note: "Persists across every project. Great for who-you-are facts; bad for project-specific nuance.",
  },
  {
    id: "claude-md",
    title: "CLAUDE.md",
    path: "repo-root/CLAUDE.md",
    scope: "project",
    trigger: "always loaded",
    color: "#7B9EB8",
    note: "Loaded in every session for this repo. Avoid for facts that matter only in specific contexts.",
  },
  {
    id: "wiki",
    title: "Harness wiki",
    path: "harness/wiki/<slug>.md",
    scope: "project",
    trigger: "keyword-triggered",
    color: "#6BA368",
    note: "Article VII. Committable, scoped, surfaced only when message tokens match entry triggers.",
  },
  {
    id: "research",
    title: "Research notes",
    path: "harness/research/*.md",
    scope: "project",
    trigger: "explicit read",
    color: "#D4A853",
    note: "Long-form citations + design rationale. Never auto-surfaced; agent reads on demand.",
  },
];

export default function KnowledgeStack() {
  const [active, setActive] = useState<string | null>("wiki");

  return (
    <figure className="my-8 rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
          4-layer persistence stack
        </div>
        <div className="text-[10px] font-mono text-stone-500">
          constitution · Article VII
        </div>
      </div>

      <div className="grid gap-2">
        {LAYERS.map((l, i) => {
          const isActive = active === l.id;
          const isWiki = l.id === "wiki";
          return (
            <button
              key={l.id}
              onClick={() => setActive(isActive ? null : l.id)}
              onMouseEnter={() => setActive(l.id)}
              className={`group relative grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                isActive
                  ? "bg-stone-900/90 shadow-lg"
                  : "bg-stone-900/40 hover:bg-stone-900/70"
              }`}
              style={{
                borderColor: isActive ? l.color + "aa" : l.color + "33",
              }}
              aria-expanded={isActive}
            >
              {/* Index + color chip ------------------------------ */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-stone-500 w-4">
                  L{i}
                </span>
                <svg width="20" height="28" viewBox="0 0 20 28" aria-hidden="true">
                  <defs>
                    <linearGradient id={`ks-${l.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={l.color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={l.color} stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="2"
                    y="2"
                    width="16"
                    height="24"
                    rx="3"
                    fill={`url(#ks-${l.id})`}
                    stroke={l.color}
                    strokeWidth="0.7"
                  />
                  {isWiki && (
                    <circle
                      cx="10"
                      cy="14"
                      r="3"
                      fill="none"
                      stroke="#fafaf9"
                      strokeWidth="0.8"
                      strokeDasharray="1 1.5"
                    />
                  )}
                </svg>
              </div>

              {/* Body --------------------------------------------- */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-stone-100">
                    {l.title}
                  </span>
                  <code className="text-[11px] font-mono text-stone-400 truncate">
                    {l.path}
                  </code>
                </div>
                {isActive && (
                  <p className="mt-1 text-[12px] text-stone-400 leading-snug">
                    {l.note}
                  </p>
                )}
              </div>

              {/* Trigger pill ------------------------------------- */}
              <div className="flex flex-col items-end gap-1 text-[10px] font-mono">
                <span
                  className="rounded px-1.5 py-0.5 uppercase tracking-wider"
                  style={{
                    color: l.color,
                    background: l.color + "1a",
                    border: `1px solid ${l.color}55`,
                  }}
                >
                  {l.trigger}
                </span>
                <span className="text-stone-500">{l.scope}</span>
              </div>
            </button>
          );
        })}
      </div>

      <figcaption className="mt-3 text-[11px] text-stone-500 leading-relaxed">
        Hover or tap a layer. Only <em>harness wiki</em> (L2) uses keyword-triggered
        surfacing &mdash; this gap is the motivation for <code>harness-llm-wiki</code>
        (Article VII).
      </figcaption>
    </figure>
  );
}
