"use client";

import { useState } from "react";

type AccessMethod = "makerspace" | "university" | "neon-shop" | "pottery" | "microwave" | "buy-used" | "unnecessary";

type Equipment = {
  name: string;
  neededFor: string;
  buyCost: string;
  accessMethods: {
    method: AccessMethod;
    label: string;
    cost: string;
    note: string;
    recommended?: boolean;
  }[];
};

const METHOD_COLORS: Record<AccessMethod, string> = {
  makerspace: "#7B9EB8",
  university: "#B8A9C9",
  "neon-shop": "#D4A853",
  pottery: "#C17B5E",
  microwave: "#ef8f44",
  "buy-used": "#ef4444",
  unnecessary: "#6BA368",
};

const METHOD_ICONS: Record<AccessMethod, string> = {
  makerspace: "M",
  university: "U",
  "neon-shop": "N",
  pottery: "P",
  microwave: "W",
  "buy-used": "$",
  unnecessary: "0",
};

const EQUIPMENT: Equipment[] = [
  {
    name: "로터리 진공 펌프",
    neededFor: "경로 1 (프릿): 진공 배기 10⁻³ Torr",
    buyCost: "₩200,000~400,000 (중고)",
    accessMethods: [
      { method: "neon-shop", label: "네온사인 업체", cost: "₩0 (협업)", note: "닉시관과 동일 장비. 기술 이전까지 가능", recommended: true },
      { method: "university", label: "대학 실험실", cost: "₩0 (인맥)", note: "물리/화학과에 거의 반드시 보유. 교수/대학원생 연줄 필요" },
      { method: "unnecessary", label: "경로 2 선택", cost: "₩0", note: "상온 봉착 경로는 진공 펌프 자체가 불필요" },
      { method: "buy-used", label: "중고 구매", cost: "₩200~400K", note: "중고나라/eBay. 최후 수단 — 먼저 접근 경로를 시도" },
    ],
  },
  {
    name: "전기로 (프릿 소성 450°C)",
    neededFor: "경로 1 (프릿): 프릿 소성 450°C",
    buyCost: "₩150,000~300,000 (중고)",
    accessMethods: [
      { method: "microwave", label: "전자레인지 미니가마 + Arduino PID", cost: "₩71~101K (일회)", note: "SiC 서셉터 가마(₩50K) + Arduino PID 제어(₩21K). 자택에서 450°C 소성. SWE 역량 활용", recommended: true },
      { method: "pottery", label: "도자기 공방 가마 (보조)", cost: "₩10~30K/회", note: "1000°C+ 가마를 450°C로 사용. 미니가마 대비 장점 적음" },
      { method: "university", label: "대학 재료공학과", cost: "₩0 (인맥)", note: "머플로 보유. 온도 프로파일 프로그래밍 가능" },
      { method: "unnecessary", label: "경로 2 선택", cost: "₩0", note: "상온 봉착 경로는 전기로 불필요" },
    ],
  },
  {
    name: "피라니 게이지",
    neededFor: "경로 1: 진공도 측정 + 가스 정량 충전",
    buyCost: "₩50,000~100,000 (중고)",
    accessMethods: [
      { method: "microwave", label: "Arduino DIY 피라니 (전구 센서)", cost: "₩8.5K", note: "전구 필라멘트 + ADS1115 ADC + Arduino(미니가마와 공유). 10⁻³~760 Torr 측정. SWE 역량 활용", recommended: true },
      { method: "university", label: "대학 실험실", cost: "₩0", note: "진공 시스템에 보통 부착되어 있음" },
      { method: "neon-shop", label: "네온사인 업체", cost: "₩0", note: "배기 장비에 포함" },
    ],
  },
  {
    name: "레이저 커터",
    neededFor: "전극 패터닝 (니켈 포일 커팅)",
    buyCost: "₩500,000+ (소유 비현실적)",
    accessMethods: [
      { method: "makerspace", label: "메이커스페이스", cost: "₩0~5K/시간", note: "세운메이커스큐브, 팹랩서울 등 거의 모든 곳에 보유", recommended: true },
      { method: "unnecessary", label: "FeCl₃ 화학 에칭", cost: "₩5K", note: "레이저 커터 대안. 집에서도 가능. 정밀도는 약간 낮음" },
    ],
  },
  {
    name: "DC 전원 (0-60V, 5A)",
    neededFor: "AAO 양극산화 (Phase 3)",
    buyCost: "₩80,000 (AliExpress)",
    accessMethods: [
      { method: "makerspace", label: "메이커스페이스", cost: "₩0", note: "전자 장비실에 가변 DC 전원 보유", recommended: true },
      { method: "university", label: "대학 실험실", cost: "₩0", note: "전기/전자 실험실" },
      { method: "buy-used", label: "직접 구매", cost: "₩80K", note: "AliExpress 30V 5A 모델 — Phase 3에서만 필요하므로 나중에 구매" },
    ],
  },
  {
    name: "납땜 장비",
    neededFor: "전극-핀 연결, 회로 조립",
    buyCost: "₩30,000~50,000",
    accessMethods: [
      { method: "makerspace", label: "메이커스페이스", cost: "₩0", note: "모든 메이커스페이스에 납땜 스테이션 구비", recommended: true },
      { method: "buy-used", label: "직접 구매", cost: "₩30~50K", note: "쿠팡 온도 조절식 인두. 자택 작업 시 필수" },
    ],
  },
];

export default function EquipmentAccess() {
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <figure className="my-8">
      <div className="space-y-2">
        {EQUIPMENT.map((eq, i) => {
          const isExpanded = expanded === i;
          const recommended = eq.accessMethods.find((m) => m.recommended);
          const recColor = recommended ? METHOD_COLORS[recommended.method] : "#D4A853";

          return (
            <div key={i}>
              <button
                onClick={() => setExpanded(isExpanded ? -1 : i)}
                className="w-full text-left rounded-lg border px-4 py-3 transition-all duration-200"
                style={{
                  borderColor: isExpanded ? recColor + "40" : "rgba(255,255,255,0.06)",
                  backgroundColor: isExpanded ? recColor + "06" : "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-200 flex-1">
                    {eq.name}
                  </span>
                  <span className="text-[10px] text-stone-500 hidden sm:block">
                    {eq.neededFor}
                  </span>
                  <span className="text-[10px] line-through text-stone-600">
                    {eq.buyCost}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1.5 space-y-1.5">
                  {eq.accessMethods.map((am, j) => {
                    const color = METHOD_COLORS[am.method];
                    return (
                      <div
                        key={j}
                        className="flex items-start gap-3 rounded-md px-3 py-2.5 border transition-all"
                        style={{
                          borderColor: am.recommended ? color + "40" : color + "15",
                          backgroundColor: am.recommended ? color + "0a" : color + "04",
                        }}
                      >
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                          style={{ backgroundColor: color + "20", color, border: `1.5px solid ${color}40` }}
                        >
                          {METHOD_ICONS[am.method]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-stone-200">{am.label}</span>
                            {am.recommended && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + "20", color }}>
                                추천
                              </span>
                            )}
                            <span className="text-xs font-mono ml-auto" style={{ color }}>{am.cost}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{am.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px]">
        {(Object.entries(METHOD_COLORS) as [AccessMethod, string][])
          .filter(([method]) => method !== "unnecessary")
          .map(([method, color]) => {
            const labels: Record<string, string> = {
              makerspace: "메이커스페이스",
              university: "대학 실험실",
              "neon-shop": "네온사인 업체",
              pottery: "도자기 공방",
              microwave: "미니가마+Arduino",
              "buy-used": "중고 구매",
            };
            return (
              <span key={method} className="flex items-center gap-1">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                  style={{ backgroundColor: color + "20", color, border: `1px solid ${color}40` }}
                >
                  {METHOD_ICONS[method]}
                </span>
                <span className="text-stone-500">{labels[method]}</span>
              </span>
            );
          })}
      </div>

      <figcaption className="text-center text-stone-500 text-xs mt-2">
        장비별 접근 전략. 구매가 아닌 "접근"으로 비용 최소화. 클릭하여 대안 비교.
      </figcaption>
    </figure>
  );
}
