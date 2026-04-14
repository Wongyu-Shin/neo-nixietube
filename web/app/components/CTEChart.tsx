"use client";

import { useState } from "react";

const MATERIALS = [
  { name: "PDMS", cte: 310, type: "polymer", color: "#ef4444", note: "가스 투과 높음 → 부적합" },
  { name: "에폭시", cte: 60, type: "polymer", color: "#ef4444", note: "CTE 불일치 심각, PoC에만 한정 사용" },
  { name: "Torr Seal", cte: 55, type: "polymer", color: "#D4A853", note: "외층 가스 차단. 부틸이 CTE 차이 흡수하므로 Torr Seal의 CTE 영향 미미" },
  { name: "부틸(IIR)", cte: 190, type: "polymer", color: "#6BA368", note: "탄성으로 CTE 차이 흡수 — 상온 경로 핵심" },
  { name: "소다라임 유리", cte: 9.0, type: "glass", color: "#7B9EB8", note: "가장 일반적 유리, 듀멧과 매칭" },
  { name: "보로실리케이트", cte: 3.3, type: "glass", color: "#7B9EB8", note: "파이렉스, 코바르와 매칭" },
  { name: "듀멧 와이어", cte: 9.0, type: "metal", color: "#C17B5E", note: "소다라임과 CTE 매칭 → 프릿 경로 핀" },
  { name: "코바르 합금", cte: 5.0, type: "metal", color: "#C17B5E", note: "보로실리케이트와 매칭" },
  { name: "니켈", cte: 13.0, type: "metal", color: "#C17B5E", note: "전극 재료, CTE 차이 있으나 허용 범위" },
  { name: "Bi₂O₃ 프릿", cte: 10.5, type: "frit", color: "#D4A853", note: "소다라임+듀멧 사이 CTE → 기밀 접합" },
];

export default function CTEChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showLog, setShowLog] = useState(false);

  // Sort by CTE for display
  const sorted = [...MATERIALS].sort((a, b) => a.cte - b.cte);
  const maxCte = showLog ? Math.log10(310) : 310;

  const getWidth = (cte: number) => {
    if (showLog) {
      return ((Math.log10(Math.max(cte, 0.1)) / maxCte) * 100);
    }
    return (cte / 310) * 100;
  };

  // Matching pairs
  const pairs = [
    { a: "소다라임 유리", b: "듀멧 와이어", label: "CTE 매칭 (9.0)" },
    { a: "보로실리케이트", b: "코바르 합금", label: "CTE 근접 (3.3 vs 5.0)" },
  ];

  return (
    <figure className="my-8">
      <div className="flex items-center justify-between max-w-xl mx-auto mb-3">
        <span className="text-sm text-stone-400">열팽창계수(CTE) 비교</span>
        <button
          onClick={() => setShowLog(!showLog)}
          className="text-xs px-3 py-1 rounded-full border border-white/[0.06] text-stone-500 hover:text-stone-300 transition-colors"
        >
          {showLog ? "선형 스케일" : "로그 스케일"}
        </button>
      </div>

      <div className="max-w-xl mx-auto space-y-1.5">
        {sorted.map((mat, i) => {
          const isHovered = hovered === i;
          const isPaired = pairs.some((p) => p.a === mat.name || p.b === mat.name);
          const matchPair = pairs.find((p) => p.a === mat.name || p.b === mat.name);

          return (
            <div
              key={mat.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs w-28 text-right shrink-0 truncate"
                  style={{ color: isHovered ? mat.color : "#888" }}
                >
                  {mat.name}
                </span>
                <div className="flex-1 h-5 bg-white/[0.03] rounded overflow-hidden relative">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${Math.max(2, getWidth(mat.cte))}%`,
                      backgroundColor: mat.color + (isHovered ? "70" : "30"),
                    }}
                  />
                </div>
                <span
                  className="text-xs w-14 font-mono text-right"
                  style={{ color: isHovered ? mat.color : "#555" }}
                >
                  {mat.cte}
                </span>
                <span className="text-[10px] text-stone-600 w-4">×10⁻⁶/K</span>
              </div>
              {isHovered && (
                <div className="ml-32 mt-0.5 mb-1">
                  <span className="text-xs text-stone-400">{mat.note}</span>
                  {matchPair && (
                    <span
                      className="ml-2 text-xs px-2 py-0.5 rounded-full"
                      style={{ color: "#6BA368", backgroundColor: "#6BA36810", border: "1px solid #6BA36830" }}
                    >
                      ✓ {matchPair.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-xs">
        {[
          { label: "유리", color: "#7B9EB8" },
          { label: "금속", color: "#C17B5E" },
          { label: "프릿", color: "#D4A853" },
          { label: "폴리머", color: "#ef4444" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-stone-500">{l.label}</span>
          </span>
        ))}
      </div>

      <figcaption className="text-center text-stone-500 text-xs mt-3">
        재료를 호버하여 CTE 매칭 관계 확인. 유리-금속 봉착에서 CTE 일치가 핵심.
      </figcaption>
    </figure>
  );
}
