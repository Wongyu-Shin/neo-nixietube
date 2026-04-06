# Predict Analysis — Nixie Tube Amateur Manufacturing Feasibility

**Date:** 2026-04-06
**Scope:** NOTES.md + domain research context (6 core areas)
**Personas:** 8 (VacuumEng, GlassWorker, MaterialsSci, ElecEng, DIYMaker, SafetyRedTeam, SupplyChain, DevilsAdvocate)
**Debate Rounds:** 3 completed
**Commit Hash:** 510a951
**Anti-Herd Status:** PASSED (flip_rate=0.35, entropy=0.72)
**Mode:** Adversarial + Deep

## Summary

- **Total Findings:** 39 (initial) → 10 (post-consensus, deduplicated)
  - Confirmed: 10 | Probable: 0 | Minority: 0
- **Severity Breakdown:** Critical: 1 | High: 7 | Medium: 1 | Low: 1
- **Key Enablers:** 2 identified
- **Overall Feasibility:** 조건부 타당 (60-70% PoC 성공 확률)

## Core Verdict

**아마추어 닉시관 제조는 조건부로 타당하다.**

필수 조건:
1. 네온사인 기술자 협업 및 기술 이전 확보
2. 진공 도달 목표를 10⁻⁴ Torr로 현실화 (수명 타협)
3. MVP를 "단일 숫자 글로우 점등"으로 축소
4. 6-12개월 타임라인 + ₩1,000,000-2,000,000 예산 수용

## 6개 영역별 난이도

| 영역 | 난이도 | 핵심 장벽 | 해결 전략 |
|------|--------|----------|----------|
| 전극 제조 | **낮음** | 니켈 순도 | 전해 니켈 포일 + 레이저커터/화학에칭 |
| 유리 가공/봉착 | **높음→중간*** | 유리-금속 기밀 봉착 | *네온사인 기술자 협업 시 중간으로 하향 |
| 진공/가스 봉입 | **높음→중간*** | 10⁻⁴~⁻⁵ Torr 도달, 정밀 가스 충전 | 중고 펌프 + 피라니 게이지 + *협업 |
| 형광체/발광 소재 | **불필요** | 닉시관은 가스 방전 발광. 형광체 불필요 | 가스 조성으로 발색 변경 |
| 구동 회로 | **매우 낮음** | 없음 (기존 오픈소스 회로 활용) | 부스트 컨버터 + Arduino |
| 재료 조달 (서울) | **중간** | 네온 가스 소량 구매, 특수 금속 리드타임 | 네온사인 업체 + 해외 직구 |

## Top 5 Findings

1. **[감전 위험 (SR-1)](./findings.md#finding-1)** — CRITICAL | 6/8 consensus — 유일한 생명 위협
2. **[네온사인 기술자 협업 (DM-3)](./findings.md#finding-2)** — KEY ENABLER | 7/8 consensus — 프로젝트 최대 변수
3. **[유리-금속 봉착 (GW-1)](./findings.md#finding-3)** — HIGH | 6/8 consensus — 최대 기술적 난관
4. **[진공 도달 한계 (VE-1)](./findings.md#finding-4)** — HIGH | 5/8 consensus — 두 번째 기술적 난관
5. **[SWE 강점 활용 (DA-5)](./findings.md#finding-5)** — HIGH | 4/8 consensus — 미활용 경쟁력

## 제안 로드맵

```
Month 0-1:  시뮬레이션 (파셴 곡선, SPICE) + 재료 소싱 시작 + 네온사인 기술자 접촉
Month 1-2:  전극 설계/제작 + 상업 닉시관으로 구동 회로 검증
Month 2-4:  유리 봉착 연습 (기술자 멘토링) + 진공 시스템 구축
Month 4-6:  첫 봉입 시도 + 반복 개선
Month 6-8:  PoC 완성 (단일 숫자 안정 점등)
Month 8-12: 다중 숫자 확장 + 수명 개선
```

## Files in This Report

- [Findings](./findings.md) — ranked by priority score
- [Hypothesis Queue](./hypothesis-queue.md) — actionable next steps
- [Domain Knowledge](./domain-knowledge.md) — research context
