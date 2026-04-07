"use client";

import { useState } from "react";

type Space = {
  name: string;
  location: string;
  monthlyCost: string;
  hourCost: string;
  equipment: string[];
  pros: string[];
  cons: string[];
  relevance: "high" | "medium" | "low";
  url?: string;
};

const SPACES: Space[] = [
  {
    name: "세운메이커스큐브",
    location: "세운상가 (을지로3가)",
    monthlyCost: "무료~₩50K",
    hourCost: "무료 (사전예약)",
    equipment: ["레이저 커터", "3D 프린터", "전자 장비", "납땜 스테이션"],
    pros: [
      "을지로 네온사인 업체와 도보 5분",
      "전자/기계 장비 무료 사용",
      "서울시 운영 — 저렴",
      "금속 가공 업체 밀집 지역",
    ],
    cons: [
      "진공 펌프/전기로 없음",
      "화학 실험 제한 (환기 부족)",
      "예약 경쟁 있음",
    ],
    relevance: "high",
  },
  {
    name: "팹랩서울",
    location: "성수동",
    monthlyCost: "₩100K~200K",
    hourCost: "₩5K~20K/시간",
    equipment: ["레이저 커터", "CNC", "3D 프린터", "전자 장비", "목공 장비"],
    pros: [
      "장비 다양성 최고",
      "글로벌 팹랩 네트워크",
      "프로젝트 기반 멘토링",
    ],
    cons: [
      "월 비용 상대적 높음",
      "진공/고온 장비 없음",
      "성수 위치 (을지로와 거리)",
    ],
    relevance: "medium",
  },
  {
    name: "도자기 공방 (전기로 접근)",
    location: "서울 각지 (홍대, 이태원 등)",
    monthlyCost: "₩50K~150K",
    hourCost: "가마 사용 ₩10K~30K/회",
    equipment: ["전기로 (1000°C+)", "작업대", "환기 시설"],
    pros: [
      "전기로(가마) 사용 가능 — 프릿 소성(450°C) 충분",
      "온도 제어 PID 내장",
      "환기 시설 갖춤",
    ],
    cons: [
      "가마 스케줄 공유",
      "진공 장비 없음",
      "도자기 외 용도 협의 필요",
      "미니가마+Arduino 대안이 있으므로 필수 아님",
    ],
    relevance: "medium",
  },
  {
    name: "대학 실험실 (물리/화학과)",
    location: "서울 각 대학",
    monthlyCost: "₩0 (인맥)",
    hourCost: "₩0 (비공식)",
    equipment: ["로터리 펌프", "피라니 게이지", "전기로", "DC 전원", "화학 후드"],
    pros: [
      "로터리 펌프 + 진공 배관 완비",
      "피라니 게이지 보유",
      "화학 후드 (AAO 양극산화 가능)",
      "비용 ₩0",
    ],
    cons: [
      "접근성 — 교수/대학원생 인맥 필요",
      "사용 시간 제한",
      "비공식이므로 장기 의존 어려움",
    ],
    relevance: "high",
  },
  {
    name: "네온사인 업체 (을지로)",
    location: "을지로3가~4가",
    monthlyCost: "₩0 (협업)",
    hourCost: "₩0~시간당 (관계 의존)",
    equipment: ["진공 펌프", "토치", "배기 장비", "네온 가스", "스파크 코일"],
    pros: [
      "닉시관 공정 70-80% 동일 장비 보유",
      "기술 이전/멘토링 가능",
      "네온 가스 소량 구매 가능",
      "가장 이상적인 파트너",
    ],
    cons: [
      "기술자 수 10명 미만 (감소 추세)",
      "외부인에게 장비 개방 의지 불확실",
      "LED 전환으로 폐업 위험",
    ],
    relevance: "high",
  },
];

const RELEVANCE_COLORS = {
  high: "#6BA368",
  medium: "#D4A853",
  low: "#7B9EB8",
};

const RELEVANCE_LABELS = {
  high: "핵심",
  medium: "보조",
  low: "참고",
};

export default function WorkspaceStrategy() {
  const [selected, setSelected] = useState<number>(0);

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
        {/* Left: space list */}
        <div className="space-y-1.5">
          {SPACES.map((space, i) => {
            const isActive = selected === i;
            const color = RELEVANCE_COLORS[space.relevance];
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className="w-full text-left rounded-lg border px-3 py-2.5 transition-all duration-200"
                style={{
                  borderColor: isActive ? color + "50" : "rgba(255,255,255,0.06)",
                  backgroundColor: isActive ? color + "0a" : "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: color + "20", color }}
                  >
                    {RELEVANCE_LABELS[space.relevance]}
                  </span>
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: isActive ? color : "#ccc" }}
                  >
                    {space.name}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 ml-0.5">
                  {space.location}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: detail */}
        {(() => {
          const space = SPACES[selected];
          const color = RELEVANCE_COLORS[space.relevance];
          return (
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: color + "30",
                backgroundColor: color + "06",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold" style={{ color }}>
                  {space.name}
                </h3>
                <span className="text-xs text-stone-500">{space.location}</span>
              </div>

              {/* Cost */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5">
                  <div className="text-[10px] text-stone-500">월 비용</div>
                  <div className="text-sm font-bold" style={{ color }}>{space.monthlyCost}</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5">
                  <div className="text-[10px] text-stone-500">시간당</div>
                  <div className="text-sm font-bold" style={{ color }}>{space.hourCost}</div>
                </div>
              </div>

              {/* Equipment */}
              <div className="mb-3">
                <div className="text-xs text-stone-500 mb-1.5">사용 가능 장비</div>
                <div className="flex flex-wrap gap-1.5">
                  {space.equipment.map((eq, j) => (
                    <span
                      key={j}
                      className="text-[11px] px-2 py-0.5 rounded-full border"
                      style={{ borderColor: color + "30", color: color + "cc" }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros / Cons */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-stone-500 mb-1">장점</div>
                  {space.pros.map((p, j) => (
                    <div key={j} className="text-[11px] text-stone-300 flex items-start gap-1 mb-0.5">
                      <span className="text-green-400 mt-0.5 shrink-0">+</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs text-stone-500 mb-1">제약</div>
                  {space.cons.map((c, j) => (
                    <div key={j} className="text-[11px] text-stone-400 flex items-start gap-1 mb-0.5">
                      <span className="text-red-400 mt-0.5 shrink-0">-</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      <figcaption className="text-center text-stone-500 text-xs mt-3">
        서울 기준 작업 공간 옵션. 클릭하여 상세 비교. 핵심 = 이 프로젝트에 직접 활용 가능.
      </figcaption>
    </figure>
  );
}
