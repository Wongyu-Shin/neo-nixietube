"use client";

import { useState } from "react";

const ITEMS = [
  { label: "보안경 착용", category: "보호구", icon: "🥽", critical: true },
  { label: "절연 장갑 (300V+ 전기 작업 시)", category: "보호구", icon: "🧤", critical: true },
  { label: "소화기 접근 가능", category: "환경", icon: "🧯", critical: true },
  { label: "환기 확보", category: "환경", icon: "💨", critical: false },
  { label: "가스 실린더 직립 고정", category: "가스", icon: "⚠️", critical: true },
  { label: "블리드 저항기 장착 (전원부)", category: "전기", icon: "⚡", critical: true },
  { label: "단독 작업 금지 (권고)", category: "환경", icon: "👥", critical: false },
];

export default function SafetyChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const allChecked = checked.size === ITEMS.length;
  const criticalChecked = ITEMS.every((item, i) => !item.critical || checked.has(i));

  return (
    <figure className="my-8">
      <div className="max-w-xl mx-auto">
        <div className="space-y-2">
          {ITEMS.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-all duration-200"
                style={{
                  borderColor: isChecked ? "#6BA36840" : item.critical ? "#ef444420" : "rgba(255,255,255,0.06)",
                  backgroundColor: isChecked ? "#6BA36808" : "rgba(255,255,255,0.02)",
                }}
              >
                <span
                  className="w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0 transition-all"
                  style={{
                    borderColor: isChecked ? "#6BA368" : item.critical ? "#ef4444" : "#555",
                    backgroundColor: isChecked ? "#6BA36820" : "transparent",
                    color: isChecked ? "#6BA368" : "transparent",
                  }}
                >
                  ✓
                </span>
                <span className="text-sm mr-1">{item.icon}</span>
                <span
                  className="text-sm flex-1"
                  style={{
                    color: isChecked ? "#6BA368" : "#ccc",
                    textDecoration: isChecked ? "line-through" : "none",
                    opacity: isChecked ? 0.7 : 1,
                  }}
                >
                  {item.label}
                </span>
                {item.critical && !isChecked && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-400/10 text-red-400 border border-red-400/20">
                    필수
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="mt-3 rounded-lg border p-3 text-center" style={{
          borderColor: allChecked ? "#6BA36840" : criticalChecked ? "#D4A85340" : "#ef444430",
          backgroundColor: allChecked ? "#6BA36808" : "rgba(255,255,255,0.02)",
        }}>
          <span className="text-sm" style={{
            color: allChecked ? "#6BA368" : criticalChecked ? "#D4A853" : "#ef4444"
          }}>
            {allChecked ? "✓ 모든 안전 항목 확인 완료 — 실험 진행 가능"
              : criticalChecked ? "⚠ 필수 항목 확인 완료. 권고 항목도 확인 권장."
              : `${checked.size}/${ITEMS.length} 확인 — 필수 항목 미완료`}
          </span>
        </div>
      </div>
      <figcaption className="text-center text-stone-500 text-xs mt-2">
        각 항목을 클릭하여 체크. 빨간 '필수' 항목은 반드시 확인 후 실험 진행.
      </figcaption>
    </figure>
  );
}
