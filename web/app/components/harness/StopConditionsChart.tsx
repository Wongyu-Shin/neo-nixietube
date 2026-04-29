"use client";

import { useState } from "react";

type Trigger = {
  id: string;
  num: number;
  label: string;
  source: "auto" | "operator";
  feature: string;
  article: string;
  lossy: boolean;
  detail: string;
};

const TRIGGERS: Trigger[] = [
  {
    id: "bounded",
    num: 1,
    label: "Iterations: N 도달",
    source: "auto",
    feature: "harness-progress-cadence",
    article: "VI",
    lossy: false,
    detail:
      "Spec이 단단한 예산을 선언. 상태 줄의 카운터가 N을 향해 틱; 도달 시 루프가 깔끔히 종료되고 /harness:report이 발화한다.",
  },
  {
    id: "goal",
    num: 2,
    label: "목표 달성 (메트릭이 타깃에 도달)",
    source: "auto",
    feature: "statistical-tc-runner",
    article: "VI",
    lossy: false,
    detail:
      "Verify가 래칫이 spec의 타깃을 만족시키는 런을 반환. 통계적 러너가 N회 이상으로 확정해야 한다 — 단일 시행 승리로는 루프를 멈추지 않는다.",
  },
  {
    id: "plateau",
    num: 3,
    label: "플래토 (patience AND slope)",
    source: "auto",
    feature: "plateau-detection",
    article: "VI",
    lossy: false,
    detail:
      "두 조건 모두 발화: patience (P회 동안 신규 MAX 없음) AND slope (윈도우 위 선형 피팅 < ε). 어느 하나로는 부족 — 래칫 노이즈가 플래토를 위장할 수 있다.",
  },
  {
    id: "abandon",
    num: 4,
    label: "운영자 포기",
    source: "operator",
    feature: "harness-pause-resume",
    article: "III, VIII",
    lossy: false,
    detail:
      "/harness:abandon이 최종 체크포인트를 기록하고, 진행 중 후보를 커밋하며, /harness:report을 호출한다. 루프는 종료되지만 히스토리는 온전히 남는다.",
  },
  {
    id: "ctrlc",
    num: 5,
    label: "Ctrl+C (비상 정지)",
    source: "operator",
    feature: "harness-pause-resume",
    article: "III",
    lossy: true,
    detail:
      "조항 III의 두 번째 예외. 즉시 인터럽트 — 진행 중 수정은 커밋되지 않고, 텔레메트리는 마지막 이벤트를 놓칠 수 있으며, 리포트는 마지막 안정 커밋에서 재구성해야 한다.",
  },
];

export default function StopConditionsChart() {
  const [active, setActive] = useState<string | null>(null);
  const W = 780;
  const H = 300;
  const PAD_L = 110;
  const PAD_R = 30;
  const PAD_T = 50;
  const PAD_B = 70;
  const STEP = (W - PAD_L - PAD_R) / TRIGGERS.length;

  const rowY = (source: "auto" | "operator") =>
    source === "auto" ? PAD_T + 40 : PAD_T + 140;

  const activeTrigger = active ? TRIGGERS.find((t) => t.id === active) ?? null : null;

  return (
    <figure className="my-8">
      <div className="max-w-5xl mx-auto rounded-xl border border-stone-800 bg-stone-950/50 p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="자동 vs 운영자로 그룹화된 5개 정지 조건"
        >
          <rect x="0" y="0" width={W} height={H} fill="#0b0b0b" />

          {/* row labels */}
          <g>
            <rect
              x={20}
              y={PAD_T + 14}
              width={PAD_L - 40}
              height={52}
              fill="#7B9EB8"
              fillOpacity="0.08"
              stroke="#7B9EB8"
              strokeOpacity="0.4"
              rx="4"
            />
            <text
              x={PAD_L / 2}
              y={PAD_T + 42}
              textAnchor="middle"
              fill="#7B9EB8"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
              fontWeight="600"
            >
              자동
            </text>
            <text
              x={PAD_L / 2}
              y={PAD_T + 56}
              textAnchor="middle"
              fill="#7B9EB8"
              fillOpacity="0.6"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
            >
              5 중 3
            </text>

            <rect
              x={20}
              y={PAD_T + 114}
              width={PAD_L - 40}
              height={52}
              fill="#C17B5E"
              fillOpacity="0.08"
              stroke="#C17B5E"
              strokeOpacity="0.4"
              rx="4"
            />
            <text
              x={PAD_L / 2}
              y={PAD_T + 142}
              textAnchor="middle"
              fill="#C17B5E"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
              fontWeight="600"
            >
              운영자
            </text>
            <text
              x={PAD_L / 2}
              y={PAD_T + 156}
              textAnchor="middle"
              fill="#C17B5E"
              fillOpacity="0.6"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
            >
              5 중 2
            </text>
          </g>

          {/* header */}
          <text
            x={PAD_L}
            y={30}
            fill="#888"
            fontSize="12"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1"
          >
            5개 정지 트리거 · 루프는 정확히 하나에서 종료한다
          </text>

          {/* triggers */}
          {TRIGGERS.map((t, i) => {
            const cx = PAD_L + STEP * (i + 0.5);
            const cy = rowY(t.source);
            const isActive = active === t.id;
            const color = t.source === "auto" ? "#7B9EB8" : "#C17B5E";
            return (
              <g
                key={t.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActive(t.id)}
                onMouseLeave={() => setActive(null)}
              >
                <rect
                  x={cx - 52}
                  y={cy - 26}
                  width={104}
                  height={52}
                  rx={6}
                  fill={color}
                  fillOpacity={isActive ? 0.22 : 0.08}
                  stroke={color}
                  strokeOpacity={isActive ? 0.95 : 0.55}
                  strokeWidth={isActive ? 1.8 : 1}
                />
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  fill={color}
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="600"
                >
                  #{t.num}
                </text>
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fill="#d4d4d4"
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                >
                  {t.label.split(" ").slice(0, 2).join(" ")}
                </text>
                <text
                  x={cx}
                  y={cy + 16}
                  textAnchor="middle"
                  fill="#999"
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                >
                  {t.label.split(" ").slice(2).join(" ") || " "}
                </text>
                {t.lossy && (
                  <g>
                    <circle cx={cx + 44} cy={cy - 18} r={6} fill="#C17B5E" />
                    <text
                      x={cx + 44}
                      y={cy - 15}
                      textAnchor="middle"
                      fill="#0b0b0b"
                      fontSize="12"
                      fontFamily="ui-monospace, monospace"
                      fontWeight="700"
                    >
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* footer annotation */}
          <g transform={`translate(${PAD_L}, ${H - 16})`}>
            <circle cx="4" cy="-4" r="5" fill="#C17B5E" />
            <text
              x="4"
              y="-1"
              textAnchor="middle"
              fill="#0b0b0b"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
            >
              !
            </text>
            <text x="16" y="0" fill="#888" fontSize="12" fontFamily="ui-monospace, monospace">
              손실: 진행 중 작업이 완전히 커밋/리포트되지 않을 수 있다
            </text>
          </g>
        </svg>

        <div className="mt-3 rounded-lg border border-stone-800 bg-stone-950/70 p-3 text-sm min-h-[88px]">
          {activeTrigger ? (
            <>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-xs font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    color: activeTrigger.source === "auto" ? "#7B9EB8" : "#C17B5E",
                    borderColor: activeTrigger.source === "auto" ? "#7B9EB8" : "#C17B5E",
                  }}
                >
                  {activeTrigger.source === "auto" ? "자동" : "운영자"}
                </span>
                <span className="font-semibold text-stone-100">
                  #{activeTrigger.num} · {activeTrigger.label}
                </span>
                <code className="text-[12px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800 ml-auto">
                  {activeTrigger.feature}
                </code>
                <span className="text-[12px] px-1.5 py-0.5 rounded bg-[#D4A853]/10 border border-[#D4A853]/30 text-[#D4A853] font-mono">
                  조항 {activeTrigger.article}
                </span>
              </div>
              <div className="mt-2 text-stone-300 text-[13px] leading-relaxed">
                {activeTrigger.detail}
              </div>
            </>
          ) : (
            <div className="text-stone-500 italic text-[13px]">
              트리거 위에 호버. 루프당 정확히 하나가 발화한다 — 셋은 자동
              (유한, 목표, 플래토), 둘은 운영자가 시작 (포기, Ctrl+C). Ctrl+C만
              손실이다.
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
