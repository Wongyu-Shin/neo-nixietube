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
    role: "슬러그",
    note: "파일명과 일치해야 한다 (harness/wiki/<name>.md). kebab-case, 소문자.",
    color: "#B8A9C9",
  },
  {
    key: "triggers",
    value: "[nixie, cad, path-2, seal, butyl]",
    role: "매치 키",
    note: "소문자 토큰. SessionStart 훅이 사용자의 최근 메시지 토큰과 겹치는 것을 매칭한다.",
    color: "#6BA368",
  },
  {
    key: "created",
    value: "2026-01-14",
    role: "출처",
    note: "/harness:wiki-add 가 삽입한다. 생성 후에는 수정하지 않는다.",
    color: "#7B9EB8",
  },
  {
    key: "last_verified",
    value: "2026-04-10",
    role: "신선도 앵커",
    note: "운영자 또는 루프가 사실을 재검증할 때마다 갱신된다. 반감기 고리를 구동.",
    color: "#D4A853",
  },
  {
    key: "half_life_days",
    value: "30",
    role: "노후 지평",
    note: "last_verified + half_life_days 이후에도 항목은 표면화되지만 restale-due 로 표시된다.",
    color: "#C17B5E",
  },
  {
    key: "sources",
    value: "[features/harness-llm-wiki, cad/path2]",
    role: "인용",
    note: "피처 슬러그 또는 외부 URL. gcli-agent-run-telemetry 가 감사용으로 사용.",
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
        <span className="text-stone-500"># 본문: 자유 형식 마크다운.</span>
        {"\n"}
        <span className="text-stone-500"># 40줄 미만으로 유지; 장문 증명은</span>
        {"\n"}
        <span className="text-stone-500"># 리서치 노트로 링크아웃.</span>
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
          정의:{" "}
          <code className="text-stone-400">
            harness/research/harness-llm-wiki.md
          </code>
          ; 강제: <code className="text-stone-400">harness/wiki/SCHEMA.md</code>.
        </div>
      </aside>
    </figure>
  );
}
