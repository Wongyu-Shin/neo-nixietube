"use client";

import { useState } from "react";

/**
 * Four-layer persistence picker — the "LLM-wiki question" from UX §7.
 * Shows scope, load trigger, lifetime, and which Article governs.
 */

type Layer = {
  id: string;
  name: string;
  location: string;
  scope: "cross-repo" | "project" | "project (on-demand)";
  trigger: string;
  lifetime: string;
  article: string;
  color: string;
};

const LAYERS: Layer[] = [
  {
    id: "user",
    name: "User memory",
    location: "~/.claude/.../memory/*.md",
    scope: "cross-repo",
    trigger: "Always loaded",
    lifetime: "Indefinite",
    article: "—",
    color: "#B8A9C9",
  },
  {
    id: "claudemd",
    name: "CLAUDE.md",
    location: "repo root",
    scope: "project",
    trigger: "Always loaded",
    lifetime: "Indefinite; floods every session",
    article: "—",
    color: "#D4A853",
  },
  {
    id: "wiki",
    name: "Harness wiki",
    location: "harness/wiki/*.md",
    scope: "project",
    trigger: "Keyword-triggered (SessionStart)",
    lifetime: "last_verified + half_life_days; stales flagged",
    article: "VII",
    color: "#6BA368",
  },
  {
    id: "research",
    name: "Research notes",
    location: "harness/research/*.md",
    scope: "project (on-demand)",
    trigger: "Explicit read only",
    lifetime: "Versioned with the repo",
    article: "—",
    color: "#7B9EB8",
  },
];

export default function PersistenceLayers() {
  const [active, setActive] = useState<string>("wiki");
  const layer = LAYERS.find((l) => l.id === active)!;

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        {LAYERS.map((l) => {
          const isActive = active === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setActive(l.id)}
              className="text-left rounded-xl border p-4 transition-colors"
              style={{
                background: isActive ? l.color + "18" : "#120d08",
                borderColor: isActive ? l.color : "#2a2218",
              }}
            >
              <div
                className="text-[10px] uppercase tracking-widest mb-1"
                style={{ color: l.color }}
              >
                layer · {l.scope}
              </div>
              <div className="text-sm font-semibold text-amber-200">{l.name}</div>
              <code className="block text-[10px] text-stone-500 mt-1 truncate">
                {l.location}
              </code>
            </button>
          );
        })}
      </div>
      <div
        className="rounded-xl border p-5 text-sm"
        style={{
          borderColor: layer.color + "55",
          background: layer.color + "0d",
        }}
      >
        <div
          className="uppercase tracking-widest text-[10px] mb-1"
          style={{ color: layer.color }}
        >
          {layer.name}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
          <div>
            <div className="text-stone-500 mb-1">Load trigger</div>
            <div className="text-stone-200">{layer.trigger}</div>
          </div>
          <div>
            <div className="text-stone-500 mb-1">Lifetime</div>
            <div className="text-stone-200">{layer.lifetime}</div>
          </div>
          <div>
            <div className="text-stone-500 mb-1">Scope</div>
            <div className="text-stone-200">{layer.scope}</div>
          </div>
          <div>
            <div className="text-stone-500 mb-1">Article</div>
            <div className="text-stone-200">{layer.article}</div>
          </div>
        </div>
        {layer.id === "wiki" && (
          <p className="text-xs text-stone-400 mt-4 leading-relaxed">
            The wiki is the only project-scoped, cross-loop, committable
            knowledge store. Entries are surfaced on SessionStart by matching
            the operator's opening message + last N transcript lines against
            each entry's <code className="text-amber-200">triggers</code> field
            (top-3 surfaced as <code className="text-amber-200">&lt;system-reminder&gt;</code>).
          </p>
        )}
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        Source: <code className="text-amber-200">harness/UX.md</code> §7 ·
        Feature: <code className="text-amber-200">harness-llm-wiki</code>.
      </figcaption>
    </figure>
  );
}
