"use client";

import { useState } from "react";

/* WikiEntrySchema — annotated frontmatter block. Mirrors the schema
 * in harness/research/harness-llm-wiki.md "Each entry's frontmatter".
 * Hover a field to show its role + constraints. */

type Field = {
  key: string;
  value: string;
  role: string;
  note: string;
  color: string;
};

const FIELDS: Field[] = [
  {
    key: "name",
    value: "cad-path-2-room-temp",
    role: "slug",
    note: "Must match filename (harness/wiki/<name>.md). kebab-case, lowercase.",
    color: "#B8A9C9",
  },
  {
    key: "triggers",
    value: "[nixie, cad, path-2, seal, butyl]",
    role: "match keys",
    note: "Lowercased tokens. SessionStart hook matches any overlap with the user's latest message tokens.",
    color: "#6BA368",
  },
  {
    key: "created",
    value: "2026-01-14",
    role: "provenance",
    note: "Inserted by /harness:wiki-add. Never edited after creation.",
    color: "#7B9EB8",
  },
  {
    key: "last_verified",
    value: "2026-04-10",
    role: "freshness anchor",
    note: "Updated whenever an operator or loop re-validates the fact. Drives the half-life ring.",
    color: "#D4A853",
  },
  {
    key: "half_life_days",
    value: "30",
    role: "stale horizon",
    note: "After last_verified + half_life_days, the entry still surfaces but is flagged restale-due.",
    color: "#C17B5E",
  },
  {
    key: "sources",
    value: "[features/harness-llm-wiki, cad/path2]",
    role: "citation",
    note: "Feature-slug or external URL. Used by gcli-agent-run-telemetry for audit.",
    color: "#FF8C42",
  },
];

export default function WikiEntrySchema() {
  const [hovered, setHovered] = useState<string>("triggers");
  const active = FIELDS.find((f) => f.key === hovered) || FIELDS[1];

  return (
    <figure className="my-8 grid md:grid-cols-[1.1fr_0.9fr] gap-4 rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
      {/* YAML-ish block --------------------------------------------- */}
      <pre className="m-0 rounded-lg bg-[#0c0a09] border border-stone-800 p-4 text-[12px] leading-relaxed font-mono text-stone-300 overflow-x-auto">
        <span className="text-stone-500">---</span>
        {"\n"}
        {FIELDS.map((f) => (
          <span
            key={f.key}
            onMouseEnter={() => setHovered(f.key)}
            onFocus={() => setHovered(f.key)}
            tabIndex={0}
            className={`block -mx-2 px-2 rounded cursor-pointer focus:outline-none transition-colors ${
              hovered === f.key
                ? "bg-stone-800/70"
                : "hover:bg-stone-900/60"
            }`}
          >
            <span style={{ color: f.color }}>{f.key}</span>
            <span className="text-stone-500">: </span>
            <span className="text-stone-200">{f.value}</span>
            {hovered === f.key && (
              <span className="ml-2 text-[10px] text-stone-500">
                ← {f.role}
              </span>
            )}
          </span>
        ))}
        <span className="text-stone-500">---</span>
        {"\n\n"}
        <span className="text-stone-500"># Body: free-form markdown.</span>
        {"\n"}
        <span className="text-stone-500"># Keep to &lt; 40 lines; link out to</span>
        {"\n"}
        <span className="text-stone-500"># research notes for long-form proofs.</span>
      </pre>

      {/* Hovered field panel --------------------------------------- */}
      <aside className="rounded-lg border border-stone-800 bg-stone-900/50 p-4 flex flex-col">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="6" fill={active.color} opacity="0.3" />
            <circle cx="7" cy="7" r="3" fill={active.color} />
          </svg>
          <code
            className="font-mono text-sm font-semibold"
            style={{ color: active.color }}
          >
            {active.key}
          </code>
          <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-stone-500">
            {active.role}
          </span>
        </div>
        <p className="mt-3 text-sm text-stone-300 leading-relaxed">{active.note}</p>
        <div className="mt-auto pt-4 text-[10px] font-mono text-stone-500 border-t border-stone-800">
          defined in{" "}
          <code className="text-stone-400">
            harness/research/harness-llm-wiki.md
          </code>
          ; enforced by <code className="text-stone-400">harness/wiki/SCHEMA.md</code>.
        </div>
      </aside>
    </figure>
  );
}
