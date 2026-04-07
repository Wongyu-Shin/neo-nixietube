"use client";

import { useState } from "react";

const PRIORITIES = [
  {
    priority: 0,
    label: "먼저: 장소/장비 접근 확보",
    color: "#ef8f44",
    items: [
      { name: "세운메이커스큐브 방문·등록", source: "세운상가", lead: "반나절", cost: "₩0" },
      { name: "을지로 네온사인 업체 탐방", source: "을지로3-4가", lead: "반나절", cost: "₩0" },
      { name: "대학 실험실 인맥 연락", source: "전화/메시지", lead: "1-3일", cost: "₩0" },
      { name: "미니가마(Large) + Arduino PID 키트 주문", source: "쿠팡/AliExpress", lead: "2-5일", cost: "₩71~101K" },
    ],
  },
  {
    priority: 1,
    label: "즉시 주문 (경로 무관)",
    color: "#ef4444",
    items: [
      { name: "안전 장비 (보안경+장갑+소화기)", source: "쿠팡", lead: "1-2일", cost: "₩90K" },
      { name: "TO-8 기밀 헤더", source: "DigiKey", lead: "5-7일", cost: "₩20K" },
      { name: "부틸 + 폴리설파이드", source: "쿠팡/건축자재몰", lead: "2-3일", cost: "₩25K" },
    ],
  },
  {
    priority: 2,
    label: "경로 결정 후 주문",
    color: "#D4A853",
    items: [
      { name: "시그마알드리치 시약 (프릿 경로)", source: "시그마알드리치", lead: "1-2주", cost: "₩90K" },
      { name: "듀멧 와이어 + 니켈 포일", source: "AliExpress", lead: "2-3주", cost: "₩40K" },
      { name: "네온 가스 소량", source: "네온사인 업체", lead: "업체 방문 시", cost: "₩50K" },
    ],
  },
  {
    priority: 3,
    label: "접근 실패 시에만 구매",
    color: "#6BA368",
    items: [
      { name: "중고 로터리 펌프 (접근 불가 시)", source: "중고나라", lead: "1-4주", cost: "₩200-400K" },
    ],
  },
];

export default function PurchasePriority() {
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <figure className="my-8">
      <div className="max-w-xl mx-auto">
        {PRIORITIES.map((p, i) => {
          const isExpanded = expanded === i;
          return (
            <div key={i} className="mb-2">
              <button
                onClick={() => setExpanded(i)}
                className="w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-200"
                style={{
                  borderColor: isExpanded ? p.color + "40" : "rgba(255,255,255,0.06)",
                  backgroundColor: isExpanded ? p.color + "08" : "rgba(255,255,255,0.02)",
                }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: p.color + "20", color: p.color, border: `2px solid ${p.color}40` }}
                >
                  {p.priority}
                </span>
                <span className="text-sm font-medium flex-1" style={{ color: isExpanded ? p.color : "#ccc" }}>
                  {p.label}
                </span>
                <span className="text-xs text-stone-500">{p.items.length}개 품목</span>
              </button>
              {isExpanded && (
                <div className="ml-10 mt-1 space-y-1">
                  {p.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 rounded-md px-3 py-2 border"
                      style={{ borderColor: p.color + "15", backgroundColor: p.color + "04" }}
                    >
                      <span className="text-sm text-stone-200 flex-1">{item.name}</span>
                      <span className="text-[10px] text-stone-500">{item.source}</span>
                      <span className="text-[10px] font-mono" style={{ color: p.color }}>{item.lead}</span>
                      <span className="text-[10px] font-mono text-stone-400">{item.cost}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <figcaption className="text-center text-stone-500 text-xs mt-3">
        배송 리드타임 순으로 정렬. 클릭하여 각 우선순위의 구매 품목 확인.
      </figcaption>
    </figure>
  );
}
