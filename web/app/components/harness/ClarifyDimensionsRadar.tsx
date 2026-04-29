"use client";

import { useState } from "react";

/**
 * Radar chart for the 7 clarify dimensions (D1–D7) the
 * `harness-clarify-gate` feature walks before in-loop entry.
 *
 * Coverage values are illustrative ("what a well-clarified spec looks
 * like"). Hover a vertex to see the dimension's question + failure
 * mode. Unresolved D1 assumptions fail composite-guard (Article VI).
 */

type Dim = {
  id: string;
  short: string;
  question: string;
  failure: string;
  coverage: number; // 0..1 (illustrative)
  article: string;
};

const DIMS: Dim[] = [
  {
    id: "D1",
    short: "Scope 도메인",
    question: "harness/ 도메인인가 콘텐츠 도메인인가? (조항 IV)",
    failure: "D1 미해결 = 범위 가로지름 → composite-guard 실패.",
    coverage: 1.0,
    article: "IV",
  },
  {
    id: "D2",
    short: "메트릭",
    question: "단일 verify 명령으로 추출 가능한가?",
    failure: "수동 채점 메트릭 → noise-aware-ratchet이 SUM=MAX를 적용 불가.",
    coverage: 0.92,
    article: "II",
  },
  {
    id: "D3",
    short: "방향",
    question: "높은 쪽이 좋은가, 낮은 쪽이 좋은가?",
    failure: "방향 모호 → 래칫이 잘못된 방향으로 래칫.",
    coverage: 1.0,
    article: "II",
  },
  {
    id: "D4",
    short: "HITL 예외",
    question: "예상되는 비가역 작업이 있는가? 어느 L2 등급?",
    failure: "명세 부족 → L2 작업이 루프 도중 운영자를 놀라게 한다.",
    coverage: 0.78,
    article: "III",
  },
  {
    id: "D5",
    short: "정지",
    question: "유한 / 무한 / 플래토 감지?",
    failure: "플래토 설정 없는 무한 → 무기한 실행.",
    coverage: 0.88,
    article: "III",
  },
  {
    id: "D6",
    short: "위키",
    question: "이 루프가 종료 시 어떤 키워드를 발행하는가?",
    failure: "D6 공백 → wiki-refs.md 쓰기 측이 비어 있다.",
    coverage: 0.65,
    article: "VII",
  },
  {
    id: "D7",
    short: "가드",
    question: "composite-guard 외 추가 가드가 있는가?",
    failure: "도메인별 단언이 배선되지 않음 → 조용한 통과.",
    coverage: 0.84,
    article: "VI",
  },
];

const CX = 200;
const CY = 200;
const R = 140;

function vertex(i: number, t: number) {
  const a = ((360 / DIMS.length) * i - 90) * (Math.PI / 180);
  return { x: CX + R * t * Math.cos(a), y: CY + R * t * Math.sin(a) };
}

export default function ClarifyDimensionsRadar() {
  const [hover, setHover] = useState<string | null>("D6");
  const active = DIMS.find((d) => d.id === hover) ?? DIMS[5];

  const polygonPoints = DIMS.map((d, i) => {
    const v = vertex(i, d.coverage);
    return `${v.x.toFixed(2)},${v.y.toFixed(2)}`;
  }).join(" ");

  return (
    <div className="my-6 grid gap-4 rounded-lg border border-neutral-300/70 bg-white/70 p-4 md:grid-cols-[1fr_minmax(0,260px)] dark:border-neutral-700/70 dark:bg-neutral-900/60">
      <svg
        viewBox="0 0 400 400"
        className="mx-auto w-full max-w-[400px]"
        role="img"
        aria-label="명료화 커버리지 7차원 레이더"
      >
        <defs>
          <radialGradient id="clarifyFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1.0].map((t) => (
          <polygon
            key={"grid-" + t}
            points={DIMS.map((_, i) => {
              const v = vertex(i, t);
              return `${v.x.toFixed(2)},${v.y.toFixed(2)}`;
            }).join(" ")}
            fill="none"
            stroke="#a3a3a3"
            strokeOpacity={t === 1 ? 0.35 : 0.15}
            strokeDasharray={t === 1 ? "0" : "2 3"}
          />
        ))}

        {DIMS.map((_, i) => {
          const v = vertex(i, 1);
          return (
            <line
              key={"axis-" + i}
              x1={CX}
              y1={CY}
              x2={v.x}
              y2={v.y}
              stroke="#a3a3a3"
              strokeOpacity="0.25"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill="url(#clarifyFill)"
          stroke="#16a34a"
          strokeOpacity="0.7"
          strokeWidth="1.5"
        />

        {DIMS.map((d, i) => {
          const v = vertex(i, d.coverage);
          const lbl = vertex(i, 1.18);
          const isActive = d.id === hover;
          return (
            <g key={d.id}>
              <circle
                cx={v.x}
                cy={v.y}
                r={isActive ? 8 : 5}
                fill={isActive ? "#15803d" : "#22c55e"}
                stroke="#fff"
                strokeWidth="1.5"
                onMouseEnter={() => setHover(d.id)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
              <text
                x={lbl.x}
                y={lbl.y}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isActive ? 700 : 500}
                fill={isActive ? "#111827" : "#4b5563"}
              >
                {d.id}
              </text>
              <text
                x={lbl.x}
                y={lbl.y + 12}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {d.short}
              </text>
            </g>
          );
        })}

        <circle cx={CX} cy={CY} r="3" fill="#374151" />
      </svg>

      <aside className="flex flex-col gap-2 text-sm">
        <div>
          <div className="text-[12px] uppercase tracking-wider text-neutral-500">
            Dimension
          </div>
          <div className="text-lg font-bold text-stone-100">
            {active.id} · {active.short}
          </div>
        </div>
        <div>
          <div className="text-[12px] uppercase tracking-wider text-neutral-500">
            질문
          </div>
          <div className="text-[12.5px] text-stone-300">
            {active.question}
          </div>
        </div>
        <div>
          <div className="text-[12px] uppercase tracking-wider text-neutral-500">
            실패 모드
          </div>
          <div className="text-[12px] italic text-red-700 dark:text-red-400">
            {active.failure}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between text-[12px] text-neutral-500">
          <span>조항 {active.article}</span>
          <span>커버리지 {(active.coverage * 100).toFixed(0)}%</span>
        </div>
      </aside>
    </div>
  );
}
