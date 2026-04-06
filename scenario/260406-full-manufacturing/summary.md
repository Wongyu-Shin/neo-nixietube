# Scenario Exploration Summary — Nixie Tube Full Manufacturing Process

**Date:** 2026-04-06
**Seed:** 서울에서 아마추어가 닉시관을 Phase 0(글로우 램프) → Phase 2(다중 숫자)까지 전체 제조
**Depth:** Deep (50 iterations)
**Goals:** 실패 모드, 엣지케이스, 전체 경로, 비용/시간 스트레스, 안전 위험
**Format:** Mixed

## Coverage Matrix

| Dimension | Scenarios | Critical | High | Medium | Low |
|-----------|-----------|----------|------|--------|-----|
| Happy path | 5 | - | - | - | - |
| Material failure | 4 | - | 1 | 2 | - |
| Process failure | 4 | - | 2 | 1 | - |
| Equipment failure | 3 | - | 2 | 1 | - |
| Skill gap | 2 | - | 1 | 1 | - |
| Safety incident | 5 | **3** | 2 | - | - |
| Supply chain | 3 | - | 2 | 1 | - |
| Budget/Time | 3 | - | 1 | 2 | - |
| Integration | 5 | - | 3 | 1 | - |
| Physics limit | 3 | - | 2 | 1 | - |
| Environmental | 2 | - | - | 2 | - |
| Recovery | 2 | - | - | 1 | 1 |
| Cross-dimension | 5 | - | 1 | 3 | 1 |
| Meta/Project | 4 | - | 1 | 1 | 2 |
| **Total** | **50** | **3** | **17** | **18** | **7** (+5 baseline) |

## CRITICAL Findings (비협상)

| # | Scenario | Phase | 요약 |
|---|----------|-------|------|
| 1 | **캐패시터 잔류 전하 감전** | 테스트 | 200V DC 잔류 → 블리드 저항 필수 |
| 2 | **유리 내파 파편 비산** | 진공 작업 | 보안경/면갑 필수 |
| 3 | **토치 역화(Flashback)** | 유리 가공 | 역화 방지기 필수 (₩20,000-40,000) |

## Top 10 High-Severity Scenarios (우선 대비 필요)

| # | Scenario | Dimension | Recovery |
|---|----------|-----------|----------|
| 1 | 니켈 순도 부족 → 스퍼터링 가속 | Material | 전해 니켈 사전 확보 |
| 2 | 유리 봉착 온도 과다 → 인접 봉착 훼손 | Process | 히트싱크, 핀 간격 확보 |
| 3 | 펌프 오일 오염 → backstreaming | Equipment | 오일 교환 + 포어라인 트랩 |
| 4 | 토치 산소 과다 → 금속 산화 | Equipment | 화염 타입 구분법 학습 |
| 5 | 팁오프 타이밍 실패 → 핀홀 리크 | Skill gap | hold test 의무화 |
| 6 | 네온 가스 소량 구매 불가 | Supply chain | 네온사인 업체 충전 서비스 |
| 7 | 인접 음극 크로스토크 방전 | Physics | 간격 확대 + 마이카 스페이서 |
| 8 | 소다라임-코바르 불일치 | Material+Process | 매칭 규칙 숙지 |
| 9 | 배기 중 전극 조립체 이탈 | Edge case | 마이카 고정 + 견고한 접합 |
| 10 | 네온사인 기술자 은퇴 | Meta | 비디오 기록 + 복수 관계 |

## Phase별 실패 확률 추정

| Phase | 주요 리스크 | 1회 성공 확률 | 3회 내 성공 확률 |
|-------|------------|-------------|----------------|
| 0. 시뮬레이션 | 낮음 | 95% | 99% |
| 1. 전극 제작 | 재료 순도, 정밀도 | 70% | 97% |
| 2. 유리 봉착 | 기밀성, 크랙 | 20-30% | 50-65% |
| 3. 진공/가스 | 도달 한계, 정량 | 40-50% | 78-88% |
| 4. 봉입/팁오프 | 리크, 오염 | 30-40% | 66-78% |
| 5. 점등/에이징 | 전압 불일치 | 50-60% | 88-94% |
| **전 과정 종합** | | **~3-5%** | **~15-30%** |

## 핵심 시사점

1. **전 과정 1회 통과 성공 확률은 3-5%** — 10-20회 시도 각오 필요
2. **유리 봉착(Phase 2)이 최대 병목** — 이 단계의 성공률이 전체를 좌우
3. **안전 장비 3종(보안경, 절연장갑, 역화방지기)은 Day 1 필수**
4. **네온사인 기술자 협업이 유리 봉착 성공률을 20→50%로 끌어올림**
5. **시뮬레이션(Phase 0)이 Physics limit 시나리오를 사전 차단**
6. **Phase별 독립 검증 후 통합** — 실패 원인 특정을 위한 필수 전략
7. **재료 소싱은 프로젝트 첫 주에 시작** — 리드타임이 가장 긴 병목
8. **번아웃 방지: 마일스톤 축하, 커뮤니티 참여, 휴식 허용**

## 추가 탐색 추천

- `/autoresearch:reason` — "소다라임 vs 보로실리케이트: 아마추어에게 어떤 유리가 더 나은가?"
- `/autoresearch:predict` — Phase 2(유리 봉착) 심층 분석
- `/autoresearch:scenario --focus safety` — 안전 시나리오만 추가 탐색

## Files

- [scenarios.md](./scenarios.md) — 50개 시나리오 전문
- [edge-cases.md](./edge-cases.md) — 엣지케이스 모음
- [scenario-results.tsv](./scenario-results.tsv) — iteration log
