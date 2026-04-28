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
    title: "사용자 메모리",
    path: "~/.claude/.../memory/*.md",
    scope: "레포 횡단",
    trigger: "항상 로드",
    color: "#B8A9C9",
    note: "모든 프로젝트를 가로질러 영속한다. 사용자 정체성 사실에는 좋지만, 프로젝트별 미묘함에는 부적합.",
  },
  {
    id: "claude-md",
    title: "CLAUDE.md",
    path: "repo-root/CLAUDE.md",
    scope: "프로젝트",
    trigger: "항상 로드",
    color: "#7B9EB8",
    note: "이 레포의 모든 세션에서 로드된다. 특정 맥락에서만 의미 있는 사실은 피하라.",
  },
  {
    id: "wiki",
    title: "하네스 위키",
    path: "harness/wiki/<slug>.md",
    scope: "프로젝트",
    trigger: "키워드 트리거",
    color: "#6BA368",
    note: "조항 VII. 커밋 가능, 범위 제한, 메시지 토큰이 항목 트리거에 매칭될 때만 표면화된다.",
  },
  {
    id: "research",
    title: "리서치 노트",
    path: "harness/research/*.md",
    scope: "프로젝트",
    trigger: "명시적 읽기",
    color: "#D4A853",
    note: "장문 인용 + 설계 근거. 자동 표면화되지 않는다; 에이전트가 요청 시 읽는다.",
  },
];

export default function KnowledgeStack() {
  const [active, setActive] = useState<string | null>("wiki");

  return (
    <figure className="my-8 rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
          4계층 영속 스택
        </div>
        <div className="text-[10px] font-mono text-stone-500">
          헌법 · 조항 VII
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
        계층 위에 호버하거나 탭한다. 키워드 트리거 표면화는 오직 <em>하네스 위키</em>(L2) 만이
        사용한다 &mdash; 바로 이 공백이 <code>harness-llm-wiki</code>(조항 VII)의 동기다.
      </figcaption>
    </figure>
  );
}
