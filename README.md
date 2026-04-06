# neo-nixetube

50년간 발전이 멈춘 닉시관(Nixie Tube) 기술에 현대 과학/공학의 "연결되지 않은 지식"을 적용하여, 아마추어가 비용효율적으로 제조할 수 있는지 탐색하는 PoC 프로젝트.

## Background

닉시관은 1950-60년대 설계된 냉음극 가스방전 디스플레이로, 1980년대 이후 기술 발전이 사실상 멈췄다. 이 프로젝트는 그 사이 50년간 다른 분야에서 이루어진 발견 중 닉시관의 핵심 병목을 우회할 수 있는 "연결되지 않은 지식(disconnected knowledge)"을 탐색하고, 아마추어 환경에서 실증 가능한지 확인한다.

## 4대 병목과 발견된 해법

| 병목 | 전통 방식 | 발견된 현대 해법 | 출처 분야 |
|------|----------|----------------|----------|
| 유리-금속 실링 | 토치 봉착 (800-1000°C) | **프릿 실링 (450°C)** / **부틸 상온 봉착** | PDP 산업 / 건축 IGU + 자동차 |
| 전극 제조 | 수작업 커팅+조립 | **AAO 나노구조 전극** / **졸-겔 SiO₂ 코팅** | 나노기술 / 화학 |
| 진공/가스 봉입 | 고진공 펌프 + 정밀 충전 | **마이크로 격벽 고압 방전** / **MAP 가스 플러싱** | MEMS / 식품 산업 |
| 핀 관통 봉착 | 유리-금속 수작업 | **기밀 커넥터 (TO-8, MIL-spec)** | 우주/항공 |

## 실증 경로

### 경로 1: 프릿 실링 경로 (정확도 중시)
- 프릿 실링 + AAO 나노구조 전극 + 전통 진공 충전
- 비용: ~₩1,200,000 | 기간: 12주

### 경로 2: 상온 봉착 경로 (접근성 중시)
- 부틸+폴리설파이드 봉착 + 졸-겔 코팅 + 네온 플러싱
- 비용: ~₩185,000 | 기간: 4주 | 장비: 없음

## Simulation

Paschen 곡선 시뮬레이터 (LOOCV MAPE: 1.79%)와 글로우 방전 모델 (MAPE: 1.77%) 포함.

```bash
cd sim
python3 paschen.py         # Paschen curve calculator
python3 optimize.py        # 3 bridge 최적 조건 탐색
python3 glow_model.py      # Bridge 3 글로우 가시성 분석
python3 validate.py        # Paschen LOOCV validation
python3 validate_glow.py   # Glow model validation
python3 plot.py            # Paschen curve visualization
```

Requirements: Python 3.10+, numpy, scipy, matplotlib

## Project Structure

```
neo-nixetube/
├── README.md                  # This file
├── NOTES.md                   # Project notes & autoresearch guide
├── sim/                       # Simulation code
│   ├── paschen.py             # Paschen curve engine (spline + extrapolation)
│   ├── nist_data.py           # NIST reference data (Ne, Ar, He)
│   ├── glow_model.py          # Glow discharge spatial model
│   ├── glow_reference_data.py # Glow reference data (high-pressure corrected)
│   ├── validate.py            # Paschen LOOCV validation (MAPE 1.79%)
│   ├── validate_glow.py       # Glow model validation (MAPE 1.77%)
│   ├── optimize.py            # Bridge condition optimizer
│   ├── fit_constants.py       # Gas constant fitting tool
│   ├── fit_glow.py            # Glow parameter fitting tool
│   ├── plot.py                # Visualization
│   ├── paschen_curves.png     # Generated Paschen curve plot
│   └── FINDINGS.md            # Simulation findings summary
├── predict/                   # Feasibility analysis reports
│   ├── 260406-nixie-feasibility/   # Traditional manufacturing analysis
│   └── 260406-bridge-validation/   # 3 bridge technology validation
├── reason/                    # Disconnected knowledge search
│   ├── 260406-disconnected-knowledge/  # Round 1: PDP, nano, MEMS
│   └── 260406-far-field-search/        # Round 2: IGU, MAP, sol-gel
└── scenario/                  # Manufacturing scenario exploration
    └── 260406-full-manufacturing/      # 50 scenarios, 3 CRITICAL safety
```

## Analysis Method

[autoresearch](https://github.com/uditgoenka/autoresearch) 플러그인을 사용한 체계적 분석:

1. **predict** — 8 페르소나 적대적 분석 (타당성 검증)
2. **scenario** — 50개 시나리오 탐색 (실패 모드, 안전 위험)
3. **reason** — 7 판사 적대적 토론 (연결되지 않은 지식 도출)
4. **autoresearch** — 메트릭 기반 시뮬레이터 반복 개선 (MAPE 147% → 1.79%)

## Key Findings

### Paschen Simulation

![Paschen Curves](sim/paschen_curves.png)

### Glow Visibility at High Pressure (Bridge 3)

| Condition | Glow/Gap Ratio | Intensity vs Traditional | Verdict |
|-----------|---------------|------------------------|---------|
| Traditional (15 Torr, 1.5mm) | 0.33 | 1x | Baseline |
| 1mm @ 100 Torr | 0.11 | 40x | Thin but bright |
| 500μm @ 200 Torr | 0.15 | 180x | Thin but very bright |

### Cost Comparison

| Approach | Cost | Equipment | Timeline |
|----------|------|-----------|----------|
| Traditional | ₩2,500,000+ | Torch + furnace + vacuum | 6-12 months |
| Frit path | ₩1,200,000 | Furnace + vacuum | 12 weeks |
| Room-temp path | ₩185,000 | **None** | 4 weeks |

## Status

- [x] Feasibility analysis
- [x] Scenario exploration (50 scenarios)
- [x] Disconnected knowledge search (2 rounds, 8 bridges)
- [x] Paschen curve simulator (MAPE 1.79%)
- [x] Glow discharge model (MAPE 1.77%)
- [ ] Physical experiments — frit sealing validation
- [ ] Physical experiments — room-temp sealing validation
- [ ] PoC: first glow discharge in self-made tube

## Author

Seoul, South Korea — SWE with physics background exploring hardware PoC.

## License

MIT
