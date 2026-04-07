"use client";

import { useState } from "react";

const PARTS = [
  { id: "glass-top", label: "유리 디스크 (상판)", detail: "소다라임 유리 ∅25mm, 두께 3mm. 프릿 페이스트가 접합면에 도포됨.", color: "#7B9EB8" },
  { id: "frit", label: "프릿 유리 (접합층)", detail: "Bi₂O₃:B₂O₃:ZnO = 70:20:10. 450°C에서 용융하여 유리-유리 접합. PDP 산업에서 검증된 조성.", color: "#D4A853" },
  { id: "dumet", label: "듀멧 와이어 (매립 리드)", detail: "Cu 코어 + Fe-Ni 외피. 열팽창계수가 유리와 일치. 프릿에 매립되어 기밀 관통.", color: "#C17B5E" },
  { id: "glass-tube", label: "유리관 (본체)", detail: "소다라임 유리관 OD 25mm, 벽두께 2mm. 전극 어셈블리를 수용.", color: "#7B9EB8" },
  { id: "electrode", label: "전극 어셈블리", detail: "니켈 숫자 전극 + 마이카 스페이서. 듀멧 와이어를 통해 외부 핀에 연결.", color: "#ef8f44" },
];

const RESULTS = [
  {
    id: "pass",
    label: "PASS — 유리질 광택",
    color: "#6BA368",
    checks: [
      { item: "프릿 외관", result: "유리질 광택, 균일 색상", pass: true },
      { item: "듀멧 매립", result: "와이어 당김 시 고정됨", pass: true },
      { item: "크랙", result: "봉착부+디스크 균열 없음", pass: true },
      { item: "기포", result: "육안 기포 없음", pass: true },
    ],
  },
  {
    id: "fail-porous",
    label: "FAIL — 다공성/백탁",
    color: "#ef4444",
    checks: [
      { item: "프릿 외관", result: "백탁, 분말감 잔존", pass: false },
      { item: "원인", result: "소성 온도 부족 (<430°C)", pass: false },
      { item: "대응", result: "재소성 (450°C 확인)", pass: false },
    ],
  },
  {
    id: "fail-crack",
    label: "FAIL — 균열 발생",
    color: "#ef4444",
    checks: [
      { item: "프릿 외관", result: "유리질이나 크랙 관찰", pass: false },
      { item: "원인", result: "서냉 속도 초과 (>3°C/min)", pass: false },
      { item: "대응", result: "2°C/min 이하로 재시도", pass: false },
    ],
  },
  {
    id: "fail-wire",
    label: "FAIL — 와이어 미매립",
    color: "#ef4444",
    checks: [
      { item: "듀멧 상태", result: "와이어 당기면 빠짐", pass: false },
      { item: "원인", result: "프릿 도포량 부족", pass: false },
      { item: "대응", result: "프릿 추가 도포 후 재소성", pass: false },
    ],
  },
];

export default function FritSealProcess() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [resultView, setResultView] = useState(0);
  const activePart = PARTS.find((p) => p.id === hovered);

  const svgW = 500;
  const svgH = 300;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={20} fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          프릿 실링 단면도 — 듀멧 와이어 매립 봉착
        </text>

        {/* ===== LEFT: Before firing ===== */}
        <text x={130} y={42} fill="#999" fontSize="9" fontWeight="bold" textAnchor="middle">소성 전</text>

        {/* Glass tube (left) */}
        <g
          onMouseEnter={() => setHovered("glass-tube")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={70} y={100} width={120} height={140} rx={4}
            fill={hovered === "glass-tube" ? "#7B9EB830" : "#7B9EB818"}
            stroke={hovered === "glass-tube" ? "#7B9EB8" : "#7B9EB865"}
            strokeWidth={hovered === "glass-tube" ? 1.5 : 0.8}
          />
          {/* Wall thickness */}
          <rect x={70} y={100} width={8} height={140} fill="#7B9EB822" />
          <rect x={182} y={100} width={8} height={140} fill="#7B9EB822" />
        </g>

        {/* Glass disc (left top) */}
        <g
          onMouseEnter={() => setHovered("glass-top")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={65} y={55} width={130} height={16} rx={3}
            fill={hovered === "glass-top" ? "#7B9EB840" : "#7B9EB825"}
            stroke={hovered === "glass-top" ? "#7B9EB8" : "#7B9EB878"}
            strokeWidth={hovered === "glass-top" ? 1.5 : 0.8}
          />
          <text x={130} y={66} fill="#7B9EB8" fontSize="7" textAnchor="middle" opacity={0.9}>유리 디스크</text>
        </g>

        {/* Frit paste (before - dashed) */}
        <g
          onMouseEnter={() => setHovered("frit")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={65} y={72} width={130} height={10} rx={2}
            fill={hovered === "frit" ? "#D4A85340" : "#D4A85325"}
            stroke={hovered === "frit" ? "#D4A853" : "#D4A85378"}
            strokeWidth={hovered === "frit" ? 1.5 : 0.8}
            strokeDasharray="3 2"
          />
          {/* Paste dots to show it's not yet fused */}
          {[80, 95, 110, 125, 140, 155, 170].map((dx, i) => (
            <circle key={i} cx={dx} cy={77} r={1.5} fill="#D4A85355" />
          ))}
          <text x={130} y={90} fill="#D4A853" fontSize="6" textAnchor="middle" opacity={0.8}>프릿 페이스트 (분말)</text>
        </g>

        {/* Dumet wires (before - separated) */}
        <g
          onMouseEnter={() => setHovered("dumet")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {[90, 115, 145, 170].map((dx, i) => (
            <g key={i}>
              <line x1={dx} y1={50} x2={dx} y2={72} stroke={hovered === "dumet" ? "#C17B5E" : "#C17B5E70"} strokeWidth={2} />
              <line x1={dx} y1={82} x2={dx} y2={120} stroke={hovered === "dumet" ? "#C17B5E" : "#C17B5E70"} strokeWidth={2} />
              {/* Gap indicator */}
              <circle cx={dx} cy={77} r={2} fill="none" stroke="#C17B5E65" strokeWidth={0.5} strokeDasharray="1 1" />
            </g>
          ))}
        </g>

        {/* Electrode inside (left) */}
        <g
          onMouseEnter={() => setHovered("electrode")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <text x={130} y={175} fill={hovered === "electrode" ? "#ef8f44" : "#ef8f4455"} fontSize="22" fontWeight="bold" textAnchor="middle">
            8
          </text>
        </g>

        {/* Arrow between */}
        <g>
          <line x1={210} y1={160} x2={270} y2={160} stroke="#D4A853" strokeWidth={1.5} />
          <polygon points="268,156 276,160 268,164" fill="#D4A853" />
          <text x={240} y={150} fill="#D4A853" fontSize="8" fontWeight="bold" textAnchor="middle">450°C</text>
          <text x={240} y={175} fill="#666" fontSize="6" textAnchor="middle">30min</text>
        </g>

        {/* ===== RIGHT: After firing ===== */}
        <text x={370} y={42} fill="#999" fontSize="9" fontWeight="bold" textAnchor="middle">소성 후 (밀봉됨)</text>

        {/* Glass tube (right) */}
        <rect x={310} y={100} width={120} height={140} rx={4}
          fill="#7B9EB818" stroke="#7B9EB865" strokeWidth={0.8} />
        <rect x={310} y={100} width={8} height={140} fill="#7B9EB822" />
        <rect x={422} y={100} width={8} height={140} fill="#7B9EB822" />

        {/* Glass disc (right) */}
        <rect x={305} y={55} width={130} height={16} rx={3}
          fill="#7B9EB825" stroke="#7B9EB878" strokeWidth={0.8} />

        {/* Frit (fused - solid) */}
        <rect x={305} y={72} width={130} height={10} rx={2}
          fill="#D4A85335" stroke="#D4A853" strokeWidth={1.2} />
        <text x={370} y={80} fill="#D4A853" fontSize="6" textAnchor="middle" fontWeight="bold">프릿 융착 (기밀)</text>

        {/* Dumet wires (after - continuous through frit) */}
        {[330, 355, 385, 410].map((dx, i) => (
          <g key={i}>
            <line x1={dx} y1={50} x2={dx} y2={120} stroke="#C17B5E" strokeWidth={2} />
            {/* Frit bond indicator */}
            <circle cx={dx} cy={77} r={3} fill="#D4A85355" stroke="#D4A85380" strokeWidth={0.5} />
          </g>
        ))}

        {/* Electrode inside (right) */}
        <text x={370} y={175} fill="#ef8f4455" fontSize="22" fontWeight="bold" textAnchor="middle">8</text>

        {/* Seal quality indicator */}
        <g>
          <rect x={305} y={250} width={130} height={24} rx={4}
            fill="#6BA36822" stroke="#6BA36855" strokeWidth={0.8} />
          <text x={370} y={260} fill="#6BA368" fontSize="7" fontWeight="bold" textAnchor="middle">기밀 달성</text>
          <text x={370} y={270} fill="#6BA368" fontSize="6" textAnchor="middle" opacity={0.8}>{"리크 < 10⁻⁸ Torr·L/s"}</text>
        </g>

        {/* Key insight */}
        <text x={svgW / 2} y={svgH - 6} fill="#666" fontSize="7" textAnchor="middle">
          핵심: 프릿이 듀멧 와이어를 감싸며 용융 → 유리-금속 기밀 봉착을 토치 없이 달성
        </text>
      </svg>

      {activePart ? (
        <div
          className="max-w-xl mx-auto mt-2 rounded-lg border p-3 transition-all duration-200"
          style={{ borderColor: activePart.color + "55", backgroundColor: activePart.color + "18" }}
        >
          <div className="text-sm font-medium" style={{ color: activePart.color }}>{activePart.label}</div>
          <p className="text-xs text-stone-400 mt-1">{activePart.detail}</p>
        </div>
      ) : (
        <figcaption className="text-center text-stone-500 text-xs mt-2">
          각 부분을 호버하여 상세 확인. 좌: 소성 전 (분말), 우: 소성 후 (융착). 전통 봉착(800°C) 대비 450°C.
        </figcaption>
      )}

      {/* 소성 결과 판정 비교 */}
      <div className="max-w-xl mx-auto mt-6">
        <div className="text-xs font-bold text-stone-400 mb-2">소성 결과 판정 — 성공 vs 실패 비교</div>
        <div className="flex gap-1 mb-3">
          {RESULTS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setResultView(i)}
              className="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all"
              style={{
                backgroundColor: resultView === i ? r.color + "22" : "transparent",
                borderColor: resultView === i ? r.color + "55" : "#ffffff15",
                border: `1px solid ${resultView === i ? r.color + "55" : "#ffffff15"}`,
                color: resultView === i ? r.color : "#888",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: RESULTS[resultView].color + "35",
            backgroundColor: RESULTS[resultView].color + "08",
          }}
        >
          {/* Visual representation */}
          <svg viewBox="0 0 300 80" className="w-full max-w-xs mx-auto mb-3">
            <rect width={300} height={80} fill="#111116" rx={6} />
            {resultView === 0 ? (
              <>
                {/* PASS: smooth glassy frit */}
                <rect x={40} y={20} width={220} height={12} rx={3} fill="#D4A85340" stroke="#D4A853" strokeWidth={1.5} />
                <text x={150} y={29} fill="#D4A853" fontSize="7" textAnchor="middle" fontWeight="bold">유리질 광택 — 균일 색상</text>
                {/* Dumet wires embedded solidly */}
                {[80, 120, 180, 220].map((dx, i) => (
                  <g key={i}>
                    <line x1={dx} y1={10} x2={dx} y2={50} stroke="#C17B5E" strokeWidth={2.5} />
                    <circle cx={dx} cy={26} r={4} fill="#D4A85355" stroke="#6BA368" strokeWidth={1} />
                  </g>
                ))}
                {/* Checkmark */}
                <circle cx={270} cy={60} r={10} fill="#6BA36830" stroke="#6BA368" strokeWidth={1} />
                <path d="M264 60 L268 64 L276 56" fill="none" stroke="#6BA368" strokeWidth={2} strokeLinecap="round" />
                <text x={40} y={68} fill="#6BA368" fontSize="7">기밀 봉착 완료</text>
              </>
            ) : resultView === 1 ? (
              <>
                {/* FAIL: porous/chalky frit */}
                <rect x={40} y={20} width={220} height={12} rx={3} fill="#ffffff12" stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" />
                {/* Dots showing unconsolidated powder */}
                {Array.from({ length: 20 }, (_, i) => (
                  <circle key={i} cx={50 + i * 11} cy={26} r={1.5} fill="#ffffff25" />
                ))}
                <text x={150} y={29} fill="#ef4444" fontSize="7" textAnchor="middle">백탁 — 분말 잔존</text>
                {/* X mark */}
                <circle cx={270} cy={60} r={10} fill="#ef444420" stroke="#ef4444" strokeWidth={1} />
                <path d="M265 55 L275 65 M275 55 L265 65" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
                <text x={40} y={68} fill="#ef4444" fontSize="7">소성 온도 부족</text>
              </>
            ) : resultView === 2 ? (
              <>
                {/* FAIL: cracked */}
                <rect x={40} y={20} width={220} height={12} rx={3} fill="#D4A85325" stroke="#D4A853" strokeWidth={1} />
                {/* Crack lines */}
                <path d="M100 20 L105 26 L98 32" fill="none" stroke="#ef4444" strokeWidth={1.5} />
                <path d="M180 20 L175 25 L182 32" fill="none" stroke="#ef4444" strokeWidth={1.5} />
                <path d="M140 20 L143 28 L138 32" fill="none" stroke="#ef4444" strokeWidth={1} />
                <text x={150} y={29} fill="#ef4444" fontSize="7" textAnchor="middle">균열 발생</text>
                <circle cx={270} cy={60} r={10} fill="#ef444420" stroke="#ef4444" strokeWidth={1} />
                <path d="M265 55 L275 65 M275 55 L265 65" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
                <text x={40} y={68} fill="#ef4444" fontSize="7">서냉 속도 초과</text>
              </>
            ) : (
              <>
                {/* FAIL: wire not embedded */}
                <rect x={40} y={20} width={220} height={12} rx={3} fill="#D4A85330" stroke="#D4A853" strokeWidth={1} />
                {/* Wires partially detached */}
                {[80, 120, 180, 220].map((dx, i) => (
                  <g key={i}>
                    <line x1={dx} y1={10} x2={dx + (i % 2 ? 3 : -3)} y2={50} stroke="#C17B5E" strokeWidth={2} strokeDasharray={i === 1 ? "3 2" : "none"} />
                    {i === 1 && <text x={dx + 8} y={42} fill="#ef4444" fontSize="5">빠짐</text>}
                    {i === 1 && (
                      <path d={`M${dx} 32 L${dx + 4} 38 L${dx} 44`} fill="none" stroke="#ef4444" strokeWidth={1} />
                    )}
                  </g>
                ))}
                <circle cx={270} cy={60} r={10} fill="#ef444420" stroke="#ef4444" strokeWidth={1} />
                <path d="M265 55 L275 65 M275 55 L265 65" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
                <text x={40} y={68} fill="#ef4444" fontSize="7">듀멧 매립 불량</text>
              </>
            )}
          </svg>

          {/* Check items */}
          <div className="space-y-1">
            {RESULTS[resultView].checks.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span className={c.pass ? "text-green-400" : "text-red-400"}>
                  {c.pass ? "✓" : "✗"}
                </span>
                <span className="text-stone-400 w-20 shrink-0 font-medium">{c.item}</span>
                <span className={c.pass ? "text-stone-300" : "text-stone-400"}>{c.result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
