"use client";

import { useState } from "react";

type Satellite = { label: string; id: string };
type Core = {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  satellites: Satellite[];
};

const CORES: Core[] = [
  {
    id: "discharge",
    label: "가스 방전",
    icon: "⚡",
    color: "#D4A853",
    description: "닉시관의 원리 — 저압 가스에 전압을 인가하면 빛이 발생하는 현상",
    satellites: [
      { label: "글로우 방전", id: "glow" },
      { label: "파셴 법칙", id: "paschen" },
      { label: "타운센드 메커니즘", id: "townsend" },
      { label: "스퍼터링", id: "sputtering" },
      { label: "항복 전압", id: "vb" },
      { label: "Penning 혼합", id: "penning" },
    ],
  },
  {
    id: "sealing",
    label: "봉착 기술",
    icon: "🔒",
    color: "#6BA368",
    description: "관을 밀봉하는 방법 — 유리, 금속, 고무를 접합하여 기밀 유지",
    satellites: [
      { label: "유리-금속 봉착", id: "gtm" },
      { label: "프릿 실링", id: "frit" },
      { label: "부틸 고무", id: "butyl" },
      { label: "졸-겔", id: "solgel" },
      { label: "듀멧 와이어", id: "dumet" },
      { label: "폴리설파이드", id: "polysulfide" },
      { label: "PIB", id: "pib" },
      { label: "유리 프리폼", id: "preform" },
    ],
  },
  {
    id: "electrode",
    label: "전극",
    icon: "8",
    color: "#ef8f44",
    description: "숫자가 빛나는 부품 — 니켈로 만든 숫자 형상 음극",
    satellites: [
      { label: "전해 니켈", id: "nickel" },
      { label: "AAO 나노구조", id: "aao" },
      { label: "전해도금", id: "plating" },
      { label: "마이카", id: "mica" },
      { label: "FeCl₃ 에칭", id: "etch" },
    ],
  },
  {
    id: "vacuum",
    label: "진공/가스",
    icon: "◎",
    color: "#7B9EB8",
    description: "관 내부 환경 — 공기를 빼고 네온을 채우는 과정",
    satellites: [
      { label: "진공 펌프", id: "pump" },
      { label: "피라니 게이지", id: "pirani" },
      { label: "MAP 플러싱", id: "map" },
      { label: "게터", id: "getter" },
      { label: "팁오프", id: "tipoff" },
      { label: "리크 테스트", id: "leak" },
    ],
  },
  {
    id: "drive",
    label: "구동/안전",
    icon: "⊕",
    color: "#B8A9C9",
    description: "전기 회로 — 고전압 생성, 전류 제한, 안전 장치",
    satellites: [
      { label: "부스트 컨버터", id: "boost" },
      { label: "블리드 저항", id: "bleed" },
      { label: "TO-8 헤더", id: "to8" },
    ],
  },
  {
    id: "equipment",
    label: "자택 장비",
    icon: "🔧",
    color: "#C17B5E",
    description: "Arduino 에코시스템 — 미니가마, PID 제어, 진공 측정을 하나의 MCU로",
    satellites: [
      { label: "SiC 서셉터", id: "sic" },
      { label: "PID 제어", id: "pid" },
      { label: "SSR", id: "ssr" },
      { label: "어닐링", id: "anneal" },
    ],
  },
];

export default function GlossaryMap() {
  const [activeCore, setActiveCore] = useState<string>("discharge");

  const core = CORES.find((c) => c.id === activeCore)!;

  return (
    <figure className="my-8">
      {/* Core selector - horizontal tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4">
        {CORES.map((c) => {
          const isActive = activeCore === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCore(c.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border whitespace-nowrap transition-all text-sm"
              style={{
                borderColor: isActive ? c.color + "60" : c.color + "20",
                backgroundColor: isActive ? c.color + "15" : "transparent",
                color: isActive ? c.color : "#888",
              }}
            >
              <span className="text-base">{c.icon}</span>
              <span className="font-medium">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active core detail */}
      <div
        className="rounded-xl border p-5 transition-all"
        style={{ borderColor: core.color + "30", backgroundColor: core.color + "08" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{core.icon}</span>
          <div>
            <div className="text-lg font-bold" style={{ color: core.color }}>{core.label}</div>
            <div className="text-xs text-stone-400">{core.description}</div>
          </div>
        </div>

        {/* Satellite grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
          {core.satellites.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-lg border px-3 py-2 text-sm transition-all hover:scale-[1.02]"
              style={{
                borderColor: core.color + "25",
                color: core.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = core.color + "60";
                e.currentTarget.style.backgroundColor = core.color + "12";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = core.color + "25";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <figcaption className="text-center text-stone-500 text-xs mt-2">
        6개 코어 개념 → {CORES.reduce((sum, c) => sum + c.satellites.length, 0)}개 위성 용어. 탭 클릭으로 카테고리 전환, 용어 클릭으로 상세 이동.
      </figcaption>
    </figure>
  );
}
