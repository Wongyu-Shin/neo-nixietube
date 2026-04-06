"use client";

import { useState } from "react";

/**
 * Interactive timeline for the action plan.
 * Hover over weeks to see details.
 */

const WEEKS = [
  { week: "W1", label: "재료 주문", tasks: ["을지로 방문", "TO-8 헤더 주문", "안전장비 구매", "부틸+폴리설파이드"], status: "ready", color: "#6BA368" },
  { week: "W2", label: "소싱 대기 + 준비", tasks: ["시그마알드리치 시약 도착 대기", "메이커스페이스 답사", "전극 설계 CAD"], status: "ready", color: "#7B9EB8" },
  { week: "W3", label: "핵심 실험", tasks: ["실험 A: 부틸 기밀 테스트", "실험 B: 프릿 기밀 테스트", "실험 C: 네온 플러싱 순도"], status: "todo", color: "#D4A853" },
  { week: "W4-5", label: "첫 점등 시도", tasks: ["상온 경로: TO-8 + 부틸 + 플러싱", "프릿 경로: 프릿 봉착 + 진공"], status: "todo", color: "#C17B5E" },
  { week: "W6-8", label: "반복 개선", tasks: ["실패 원인 분석", "공정 파라미터 조정", "2차 시도"], status: "todo", color: "#B8A9C9" },
  { week: "W9-12", label: "AAO/졸겔 적용", tasks: ["AAO 나노구조 전극 제작", "졸-겔 SiO₂ 코팅 시도", "정량 비교 실험"], status: "future", color: "#B8A9C9" },
];

export default function Timeline() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <figure className="my-8">
      {/* Horizontal timeline */}
      <div className="flex items-start gap-1 overflow-x-auto pb-4">
        {WEEKS.map((w, i) => {
          const isHover = hover === i;
          return (
            <div
              key={i}
              className="flex-shrink-0 cursor-pointer transition-all duration-200"
              style={{ width: isHover ? "200px" : "100px" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* Week marker */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: w.color,
                    backgroundColor: w.status === "ready" ? w.color : "transparent",
                  }}
                />
                <span className="text-xs font-bold" style={{ color: w.color }}>{w.week}</span>
              </div>

              {/* Bar */}
              <div
                className="h-2 rounded-full mb-2 transition-all"
                style={{
                  backgroundColor: `${w.color}${isHover ? "40" : "20"}`,
                  border: `1px solid ${w.color}${isHover ? "60" : "30"}`,
                }}
              />

              {/* Label */}
              <div className="text-xs text-stone-400 leading-tight">{w.label}</div>

              {/* Expanded tasks */}
              {isHover && (
                <div className="mt-2 space-y-1">
                  {w.tasks.map((task, ti) => (
                    <div key={ti} className="text-[10px] text-stone-500 flex items-start gap-1">
                      <span style={{ color: w.color }}>-</span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <figcaption className="text-center text-stone-500 text-xs mt-1">
        주간 타임라인 — 마우스를 올리면 세부 작업 표시
      </figcaption>
    </figure>
  );
}
