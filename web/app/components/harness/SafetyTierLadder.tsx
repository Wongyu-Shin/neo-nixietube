"use client";

import { useState } from "react";

/**
 * L0/L1/L2 graduated-confirm ladder, per `harness-graduated-confirm`
 * and the Article III carve-out for irreversible operations.
 */

type Tier = {
  id: "L0" | "L1" | "L2";
  label: string;
  color: string;
  behavior: string;
  examples: string[];
  hitl: string;
};

const TIERS: Tier[] = [
  {
    id: "L0",
    label: "침묵",
    color: "#6BA368",
    behavior: "인터럽트 없음, 로그 없음. 설계상 가역성을 가정한다.",
    examples: ["파일 읽기", "Scope 내부 편집", "git log / git diff", "Verify 실행"],
    hitl: "없음",
  },
  {
    id: "L1",
    label: "알림 + 30초",
    color: "#D4A853",
    behavior:
      "상태 줄 핑; 운영자의 거부를 위해 루프가 30초 블록 후 자동 승인 및 계속.",
    examples: [
      "Scope 소유 파일 rm",
      "패키지 설치",
      "Scope 내 디렉터리 이름 변경",
      "새 브랜치 생성",
    ],
    hitl: "권고",
  },
  {
    id: "L2",
    label: "일시 정지 + 키 입력",
    color: "#C1563E",
    behavior:
      "루프 일시 정지. 운영자의 명시적 키 입력 필요. report.mdx에 로깅. 조항 III 루프 내부 예외 둘 중 하나.",
    examples: [
      "git push --force",
      "Scope 밖 rm",
      "sudo / 릴리스 publish",
      "서명된 커밋 amend / 삭제",
    ],
    hitl: "차단",
  },
];

export default function SafetyTierLadder() {
  const [selected, setSelected] = useState<Tier["id"]>("L2");
  const active = TIERS.find((t) => t.id === selected)!;

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
        <svg
          viewBox="0 0 320 260"
          className="w-full rounded-xl border border-white/10 bg-stone-950"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="L0/L1/L2 안전 등급 사다리"
        >
          <defs>
            <linearGradient id="tl-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a140c" />
              <stop offset="100%" stopColor="#0b0906" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#tl-bg)" rx="12" />

          {/* Vertical rail */}
          <line x1="58" y1="36" x2="58" y2="226" stroke="#3a2e1e" strokeWidth="2" />
          <circle cx="58" cy="36" r="4" fill="#8a7a58" />
          <circle cx="58" cy="226" r="4" fill="#8a7a58" />
          <text x="58" y="22" fill="#8a7a58" fontSize="10" textAnchor="middle">
            안전
          </text>
          <text x="58" y="246" fill="#8a7a58" fontSize="10" textAnchor="middle">
            비가역
          </text>

          {TIERS.map((t, i) => {
            const y = 56 + i * 68;
            const isActive = selected === t.id;
            return (
              <g
                key={t.id}
                style={{ cursor: "pointer", transition: "opacity 0.25s" }}
                onClick={() => setSelected(t.id)}
                opacity={isActive ? 1 : 0.55}
              >
                <circle
                  cx="58"
                  cy={y}
                  r={isActive ? 18 : 14}
                  fill={t.color}
                  fillOpacity={isActive ? 0.42 : 0.2}
                  stroke={t.color}
                  strokeWidth={isActive ? 2.4 : 1.4}
                />
                <text
                  x="58"
                  y={y + 4}
                  fill="#eaeaea"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {t.id}
                </text>
                <rect
                  x="92"
                  y={y - 16}
                  width="210"
                  height="32"
                  rx="6"
                  fill="#120d08"
                  stroke={t.color}
                  strokeOpacity={isActive ? 0.7 : 0.3}
                />
                <text
                  x="104"
                  y={y - 2}
                  fill={t.color}
                  fontSize="11"
                  fontWeight="600"
                >
                  {t.label}
                </text>
                <text x="104" y={y + 11} fill="#9a8660" fontSize="9">
                  HITL: {t.hitl}
                </text>
              </g>
            );
          })}
        </svg>

        <aside className="rounded-xl border border-white/10 bg-stone-900/60 p-5 text-sm">
          <div
            className="uppercase tracking-widest text-[10px] mb-1"
            style={{ color: active.color }}
          >
            등급 {active.id}
          </div>
          <div className="text-lg font-semibold text-amber-200 mb-2">
            {active.label}
          </div>
          <p className="text-xs text-stone-400 leading-relaxed mb-3">
            {active.behavior}
          </p>
          <div className="text-xs text-stone-500 mb-1">예시</div>
          <ul className="text-xs text-stone-300 space-y-1">
            {active.examples.map((ex) => (
              <li key={ex} className="flex gap-2">
                <span className="text-stone-600">·</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        피처: <code className="text-amber-200">harness-graduated-confirm</code>
        {" · "}
        조항 III 루프 내부 HITL 예외.
      </figcaption>
    </figure>
  );
}
