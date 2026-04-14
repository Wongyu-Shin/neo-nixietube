"use client";

import { useState } from "react";

const CATEGORIES = [
  {
    name: "실링/봉착",
    color: "#D4A853",
    path1: 90000,
    path2: 25000,
    items: ["Bi₂O₃ 프릿", "부틸 테이프", "Torr Seal", "에폭시"],
  },
  {
    name: "전극",
    color: "#C17B5E",
    path1: 145000,
    path2: 20000,
    items: ["니켈 포일", "Al판", "도금액", "DC전원"],
  },
  {
    name: "유리",
    color: "#7B9EB8",
    path1: 25000,
    path2: 10000,
    items: ["소다라임 유리관", "유리 디스크", "유리 돔"],
  },
  {
    name: "가스/센서",
    color: "#6BA368",
    path1: 100000,
    path2: 80000,
    items: ["네온 가스", "O₂ 센서", "피라니 게이지"],
  },
  {
    name: "피드스루",
    color: "#B8A9C9",
    path1: 20000,
    path2: 25000,
    items: ["듀멧 와이어", "TO-8 기밀 헤더"],
  },
  {
    name: "장비",
    color: "#ef4444",
    path1: 500000,
    path2: 0,
    items: ["전기로(중고)", "로터리 펌프(중고)", "진공 배관"],
  },
  {
    name: "안전/회로",
    color: "#999",
    path1: 106000,
    path2: 56000,
    items: ["보안경", "절연장갑", "부스트 컨버터", "저항"],
  },
];

export default function BOMBreakdown() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [path, setPath] = useState<1 | 2>(2);

  const total = CATEGORIES.reduce(
    (s, c) => s + (path === 1 ? c.path1 : c.path2),
    0
  );
  const maxCost = Math.max(
    ...CATEGORIES.map((c) => (path === 1 ? c.path1 : c.path2))
  );

  return (
    <figure className="my-8">
      {/* Path toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setPath(1)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
            path === 1
              ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
              : "bg-white/[0.02] text-stone-500 border-white/[0.06] hover:text-stone-300"
          }`}
        >
          경로 1: 프릿 실링
        </button>
        <button
          onClick={() => setPath(2)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
            path === 2
              ? "bg-green-400/10 text-green-400 border-green-400/30"
              : "bg-white/[0.02] text-stone-500 border-white/[0.06] hover:text-stone-300"
          }`}
        >
          경로 2: 상온 봉착
        </button>
      </div>

      {/* Total */}
      <div className="text-center mb-4">
        <span className="text-2xl font-bold text-amber-400">
          ₩{total.toLocaleString()}
        </span>
        <span className="text-sm text-stone-500 ml-2">총 예상 비용</span>
      </div>

      {/* Bar chart */}
      <div className="max-w-xl mx-auto space-y-2">
        {CATEGORIES.map((cat, i) => {
          const cost = path === 1 ? cat.path1 : cat.path2;
          const pct = maxCost > 0 ? (cost / maxCost) * 100 : 0;
          const isActive = activeCategory === i;

          return (
            <div
              key={cat.name}
              onMouseEnter={() => setActiveCategory(i)}
              onMouseLeave={() => setActiveCategory(null)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs w-20 text-right shrink-0"
                  style={{ color: isActive ? cat.color : "#999" }}
                >
                  {cat.name}
                </span>
                <div className="flex-1 h-6 bg-white/[0.03] rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color + (isActive ? "80" : "40"),
                    }}
                  />
                </div>
                <span
                  className="text-xs w-20 font-mono"
                  style={{ color: isActive ? cat.color : "#666" }}
                >
                  {cost > 0 ? `₩${(cost / 1000).toFixed(0)}K` : "—"}
                </span>
              </div>
              {isActive && cost > 0 && (
                <div className="ml-24 mt-1 mb-1 flex flex-wrap gap-1">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: cat.color + "30",
                        color: cat.color,
                        backgroundColor: cat.color + "08",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <figcaption className="text-center text-stone-500 text-xs mt-4">
        경로를 전환하고 카테고리를 호버하여 세부 품목 확인. 경로 2는 장비 비용 ₩0.
      </figcaption>
    </figure>
  );
}
