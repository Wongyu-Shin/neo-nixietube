"use client";

/**
 * Static visual of Article III — the HITL boundary around in-loop.
 * Shows which segments legally accept operator input and which don't.
 */

const SEGMENTS = [
  { phase: "pre", width: 22, color: "#6BA368", label: "루프 진입 전", hitl: "active" },
  { phase: "gate", width: 4, color: "#f6c95a", label: "ExitPlanMode", hitl: "gate" },
  { phase: "in", width: 48, color: "#D4A853", label: "루프 내부 (단계 1–8 × N)", hitl: "forbidden" },
  { phase: "gate2", width: 4, color: "#c38a60", label: "정지 조건", hitl: "gate" },
  { phase: "post", width: 22, color: "#B8A9C9", label: "루프 종료 후", hitl: "active" },
];

export default function HITLBoundaryChart() {
  let cursor = 2;
  const viewW = 720;
  const viewH = 200;
  const barY = 74;
  const barH = 40;
  const total = SEGMENTS.reduce((a, s) => a + s.width, 0);
  const scale = (viewW - 4) / total;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full rounded-xl border border-white/10 bg-stone-950"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="HITL 경계 차트"
      >
        <defs>
          <pattern id="hitl-deny" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#8a3a2a" opacity="0.08" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#C1563E" strokeWidth="1.2" opacity="0.8" />
          </pattern>
          <linearGradient id="hitl-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a140c" />
            <stop offset="100%" stopColor="#0b0906" />
          </linearGradient>
        </defs>

        <rect width={viewW} height={viewH} fill="url(#hitl-bg)" rx="12" />

        {/* Title */}
        <text x={viewW / 2} y="28" fill="#D4A853" fontSize="12" fontWeight="600" textAnchor="middle" letterSpacing="0.12em">
          조항 III · HITL 경계
        </text>
        <text x={viewW / 2} y="46" fill="#8a7a58" fontSize="10" textAnchor="middle">
          능동 HITL은 두 파란 띠에서만 허용된다 — 나머지는 머신 주도
        </text>

        {/* Bar segments */}
        {SEGMENTS.map((s, i) => {
          const x = cursor;
          const w = s.width * scale;
          cursor += w;
          const labelX = x + w / 2;
          return (
            <g key={i}>
              <rect
                x={x}
                y={barY}
                width={w}
                height={barH}
                fill={s.color}
                fillOpacity={s.hitl === "forbidden" ? 0.18 : 0.38}
                stroke={s.color}
                strokeOpacity={0.7}
                strokeWidth="1"
              />
              {s.hitl === "forbidden" && (
                <rect x={x} y={barY} width={w} height={barH} fill="url(#hitl-deny)" />
              )}
              <text
                x={labelX}
                y={barY + barH + 18}
                fill={s.color}
                fontSize="10"
                textAnchor="middle"
                fontWeight={s.hitl === "gate" ? "600" : "400"}
              >
                {s.label}
              </text>
              {s.hitl === "forbidden" && (
                <g>
                  <text
                    x={labelX}
                    y={barY + barH / 2 + 4}
                    fill="#eaeaea"
                    fontSize="12"
                    textAnchor="middle"
                    fontWeight="700"
                    opacity="0.85"
                  >
                    AskUserQuestion 금지
                  </text>
                  <text
                    x={labelX}
                    y={barY + barH + 36}
                    fill="#C1563E"
                    fontSize="9"
                    textAnchor="middle"
                    opacity="0.9"
                  >
                    예외: L2 확인 · Ctrl+C
                  </text>
                </g>
              )}
              {s.hitl === "active" && (
                <text
                  x={labelX}
                  y={barY + barH / 2 + 4}
                  fill="#eaeaea"
                  fontSize="11"
                  textAnchor="middle"
                  fontWeight="600"
                  opacity="0.9"
                >
                  HITL 허용
                </text>
              )}
            </g>
          );
        })}

        {/* Brackets */}
        <path
          d={`M 4 ${barY - 8} L 4 ${barY - 14} L ${viewW - 4} ${barY - 14} L ${viewW - 4} ${barY - 8}`}
          fill="none"
          stroke="#8a7a58"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <text x={viewW / 2} y={barY - 20} fill="#8a7a58" fontSize="9" textAnchor="middle">
          루프 전체 라이프사이클
        </text>

        {/* Bottom note */}
        <text x={viewW / 2} y={viewH - 18} fill="#7a6850" fontSize="9" textAnchor="middle">
          트랜스크립트 린터가 루프 내부 AskUserQuestion을 프로토콜 위반으로 표시한다.
        </text>
      </svg>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        조항 III · 피처: <code className="text-amber-200">plan-mode-discipline</code>,{" "}
        <code className="text-amber-200">harness-graduated-confirm</code>,{" "}
        <code className="text-amber-200">harness-pause-resume</code>.
      </figcaption>
    </figure>
  );
}
