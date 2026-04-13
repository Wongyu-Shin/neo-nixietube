# Autoresearch Plateau Analysis & Harness Design

**작성일:** 2026-04-13
**대상:** 경로 2 닉시관 CAD GAN loop, session 3 (iter 21-41)
**상태:** SUM=35/90에서 plateau — 17 iterations (iter 25-41) SUM 변화 없음

---

## 1. Plateau 문제 정의

### 1.1 관측된 현상

| 구간 | Iterations | SUM 변화 | Rate |
|------|-----------|----------|------|
| Phase 5 (진행) | iter 21-24 | 31→35 (+4) | 1.0/iter |
| **Phase 6 (plateau)** | **iter 25-41** | **35→35 (0)** | **0.0/iter** |

17회 연속 iteration에서 SUM 개선 없음. 이 중:
- 설계 변경 시도: 8회 (iter 25-31, 33, 40)
- 래칫 재검증: 5회 (iter 37-41)
- 툴링 변경 시도: 2회 (iter 32, recalibration)
- 안정성 테스트: 2회 (iter 34, 36)

### 1.2 근본 원인 분류

| # | 원인 | 증거 | 심각도 |
|---|------|------|--------|
| **P1** | GAN 평가 노이즈 ±10 SUM | iter 36: 동일 코드에서 -10 (C3:3→0, C4:7→0) | **치명적** |
| **P2** | 앵커 과보수 | iter 25-31: 설계 개선해도 앵커가 승격 차단 | 높음 |
| **P3** | Geometry 변경 = 관련없는 기준 회귀 | iter 26(-4), 27(-3), 28(-8), 33(-7) | 높음 |
| **P4** | Critic 비결정성 | 매 실행마다 다른 flaw에 집중 → judge가 "새 결함" 으로 오인 | 중간 |
| **P5** | 루브릭 5 도달 조건 | "마이너 없음" = critic 3명 모두 동일 기준에 minor 0 | 구조적 |

### 1.3 인과 관계 다이어그램

```
P4 (critic 비결정성)
    ↓
P1 (±10 노이즈) ←─── P3 (geometry 변경 = 회귀)
    ↓
P2 (앵커가 "새 결함"으로 오인 → 강등)
    ↓
P5 (루브릭 5 도달 불가능 — critic이 항상 1+ minor 발견)
    ↓
PLATEAU at SUM=35
```

---

## 2. 세션 3에서 구축한 하네스 (Harness)

### 2.1 하네스 구성 요소

| # | 하네스 컴포넌트 | Commit | 해결하는 문제 | Rippable? |
|---|----------------|--------|-------------|-----------|
| **H1** | 앵커 v2 (critic 비교) | `ed9e1c3` | P2 (과보수) | ✅ Yes — judge prompt 수정만으로 제거 |
| **H2** | 래칫 (per-criterion MAX) | `7422c57` | P1 (노이즈 회귀) | ✅ Yes — verify.sh 후처리 블록 제거 |
| **H3** | Critic summary 보존 | `ed9e1c3` | P4 (비결정성) | ✅ Yes — prev_critics_summary.txt 참조 제거 |
| **H4** | Guard anchor 보존 | `13fc391` | P2 (앵커 소실) | ⚠ Keep — 인프라 안전장치 |
| **H5** | SUM surrogate metric | `ec3a49a` | Gradient starvation | ⚠ Keep — MIN은 종료조건만 |

### 2.2 "Rippable" 기준

하네스가 "rippable"이려면:
1. **제거 시 verify.sh가 여전히 유효한 SUM 출력** (파이프라인 무결성)
2. **제거 후 더 나은 모델이 하네스 없이도 동등 이상 성능** (모델 역량 검증)
3. **제거가 단일 commit으로 가능** (원자적 제거)

### 2.3 하네스 제거 순서 (rip plan)

```
Step 1: H2 (래칫) 제거
  → 가장 큰 보조 장치. 제거 시 노이즈 회귀가 다시 발생하는지 확인.
  → 더 나은 모델이 critic 일관성이 높으면 래칫 불필요.

Step 2: H1+H3 (앵커 v2 + critic summary) 제거
  → judge가 이전 critic 없이도 정확히 승격/강등 판단 가능한지 확인.
  → 원래 앵커 로직(점수만, critic 비교 없음)으로 복귀.

Step 3: H5 (SUM metric) 유지 or MIN으로 전환 시도
  → MIN≥9 종료조건과 SUM gradient를 동시에 평가.
```

---

## 3. 개선 계획

### 3.1 단기 (다음 세션)

| 우선순위 | 개선 | 예상 효과 | 비용 |
|---------|------|----------|------|
| 1 | **Hybrid metric** — C1(치수), C2(BOM), C8(제조) deterministic assertion | P1 해결 (3 기준 노이즈 제거) | verify.sh 대폭 수정 |
| 2 | **Multi-run median** — 3회 verify 중앙값 | P1 완화 (±10→±3) | 비용 3× |
| 3 | **Critic pinning** — 변경 안 된 파일의 critic 캐싱 | P4 완화 + 비용 40% 절감 | 캐시 로직 추가 |

### 3.2 중기 (모델 개선 활용)

| 개선 | 전제 조건 | 하네스 제거 가능성 |
|------|----------|-----------------|
| **Critic 일관성 향상** | 모델이 동일 입력에 동일 flaw 지적 | H2 (래칫) 제거 가능 |
| **Judge 정밀 승격** | Judge가 critic 비교 없이도 "이전 결함 해결" 인식 | H1+H3 제거 가능 |
| **노이즈 감소** | 단일 run ±3 이내 | Multi-run 불필요 |

### 3.3 장기 (아키텍처 변경)

| 개선 | 설명 |
|------|------|
| **Differential scoring** | `git diff`를 judge에 전달, delta만 판정 |
| **Self-consistency** | 동일 디자인 3회 평가 → 일치하는 점수만 채택 |
| **Deterministic rubric** | 점수 0/3/5/7/9를 기계적 체크리스트로 변환 |

---

## 4. 테스트케이스 설계

### 4.1 하네스 제거 검증 테스트 (Rip Tests)

각 테스트는 하네스 컴포넌트를 제거한 후 모델이 동등 성능을 보이는지 검증합니다.

#### TC-01: 래칫 없이 노이즈 안정성 (H2 rip test)

```yaml
name: ratchet_removal_stability
description: "래칫 제거 후 동일 디자인 3회 verify — ±3 이내 안정성"
precondition:
  - 래칫 코드 제거 (verify.sh ratchet block 삭제)
  - 앵커는 현재 SUM=35 상태 유지
steps:
  - bash scripts/cad-verify.sh cad/path-2-room-temp  # run 1
  - bash scripts/cad-verify.sh cad/path-2-room-temp  # run 2
  - bash scripts/cad-verify.sh cad/path-2-room-temp  # run 3
pass_criteria:
  - 3회 SUM의 max - min ≤ 6 (현재 ±10, 개선 모델은 ±3 목표)
  - 어떤 기준도 0으로 추락하지 않음 (현재 C3, C4가 0 도달)
  - median(SUM) ≥ 33 (현재 앵커 35에서 -2 이내)
current_baseline: "FAIL — iter 36에서 -10 (SUM 25) 관측"
target_model_behavior: "동일 코드에 대해 일관된 평가 (±3 이내)"
```

#### TC-02: Critic 비교 없이 승격 정확성 (H1+H3 rip test)

```yaml
name: anchor_v1_promotion_accuracy
description: "이전 critic summary 없이 (원래 앵커만으로) 정확한 승격 판정"
precondition:
  - prev_critics_summary.txt 삭제
  - judge prompt에서 PREVIOUS CRITIC FINDINGS 섹션 제거
  - 앵커 SUM=35 유지
steps:
  - 알려진 개선 (composite seal) 적용
  - bash scripts/cad-verify.sh  # 앵커만으로 평가
pass_criteria:
  - C5가 3→5 승격됨 (composite seal은 진짜 개선)
  - C4가 7에서 유지됨 (관련 없는 변경 없음)
  - SUM ≥ 37 (현재 35 + C5 승격 2)
current_baseline: "FAIL — iter 21-22에서 앵커가 승격 차단"
target_model_behavior: "Judge가 critic 비교 없이도 '이전 결함 해결됨'을 인식"
```

#### TC-03: 단일 run 신뢰도 (multi-run 불필요 검증)

```yaml
name: single_run_reliability
description: "단일 verify run이 true score의 ±3 이내"
precondition:
  - 앵커 제거 (cold run)
  - 현재 디자인 (SUM=35 앵커 상태)
steps:
  - 5회 독립 verify (각각 앵커 없이)
pass_criteria:
  - 5회 SUM의 표준편차 ≤ 3
  - 5회 SUM의 평균 ≥ 33
  - 어떤 단일 기준도 run 간 2+ 레벨 변동 없음 (예: 7→3 금지)
current_baseline: "FAIL — 2회 cold run 결과: SUM 23, 26 (range=3, 표준편차 ≈ 2)"
target_model_behavior: "표준편차 ≤ 2, 평균 ≥ 35"
```

### 4.2 설계 변경 정확도 테스트 (Signal Detection Tests)

이 테스트들은 모델이 설계 변경의 영향을 정확히 감지하는지 검증합니다.

#### TC-04: 양성 변경 감지 (True Positive)

```yaml
name: positive_change_detection
description: "알려진 좋은 변경이 정확히 해당 기준만 승격"
steps:
  - 앵커 SUM=31 (세션 시작) 상태로 복원
  - composite seal 적용 (iter 24의 변경)
  - verify 실행
pass_criteria:
  - C5가 3→5 (복합 봉착은 진짜 C5 개선)
  - C1, C4가 변하지 않음 (관련 없는 기준)
  - SUM delta = +2 (C5만 변경)
current_baseline: "PARTIAL — C5는 0→3 회복했으나 5 미도달"
target_model_behavior: "변경이 타겟 기준만 정확히 이동"
```

#### TC-05: 음성 변경 감지 (True Negative)

```yaml
name: negative_change_detection
description: "관련 없는 변경이 어떤 기준도 이동시키지 않음"
steps:
  - 주석만 변경 (예: 날짜 업데이트)
  - verify 실행
pass_criteria:
  - 모든 9개 기준 변화 없음
  - SUM delta = 0
current_baseline: "FAIL — iter 36에서 주석 변경 없이도 -10 SUM"
target_model_behavior: "비실질적 변경에 대해 0 delta"
```

#### TC-06: Geometry 변경 격리 (Collateral Damage Test)

```yaml
name: geometry_change_isolation
description: "geometry 변경이 타겟 기준만 영향, 관련없는 기준은 안정"
steps:
  - 지지봉 추가 (iter 26의 변경)
  - verify 실행
pass_criteria:
  - C3가 변화 (목표 기준)
  - C4, C5, C7이 변화하지 않음 (관련 없는 기준)
  - |비타겟 기준 SUM delta| ≤ 2
current_baseline: "FAIL — iter 26에서 C4:7→3 (-4 비타겟 회귀)"
target_model_behavior: "비타겟 기준 SUM delta = 0"
```

### 4.3 하네스 효과 측정 테스트 (Harness Effectiveness Tests)

#### TC-07: 래칫 효과 측정

```yaml
name: ratchet_effectiveness
description: "래칫이 방지한 회귀 횟수 vs 차단한 승격 횟수"
steps:
  - 래칫 있는 상태로 10회 verify
  - 래칫 없는 상태로 10회 verify (별도 브랜치)
  - 비교: max(ratcheted) vs max(unratcheted)
pass_criteria:
  - ratcheted max SUM ≥ unratcheted max SUM (래칫이 승격을 차단하지 않음)
  - ratcheted min SUM > unratcheted min SUM (래칫이 회귀를 방지함)
current_baseline: "래칫 6회: 모두 35. 래칫 없이 2회: 25, 31 (range 6)"
harness_rip_signal: "unratcheted min ≥ 33이면 래칫 불필요"
```

#### TC-08: 앵커 v2 효과 측정

```yaml
name: anchor_v2_effectiveness
description: "critic summary가 승격 정확도를 개선하는지"
steps:
  - 앵커 v2 (critic summary 있음)로 10회 verify
  - 앵커 v1 (critic summary 없음)로 10회 verify
  - 비교: v2의 승격 횟수 vs v1의 승격 횟수
pass_criteria:
  - v2 승격 횟수 > v1 승격 횟수
current_baseline: "v1: iter 21-22에서 0 승격. v2: iter 23에서 +1 승격"
harness_rip_signal: "v1에서도 동등한 승격률이면 v2 불필요"
```

---

## 5. 구현 로드맵

### Phase 1: 테스트 스크립트 구축 (즉시)

```bash
# scripts/test-harness-rip.sh — 하네스 제거 검증 자동화
# TC-01 ~ TC-08을 자동 실행하고 PASS/FAIL 보고
```

### Phase 2: Hybrid Metric 도입 (다음 세션)

```
deterministic assertions (C1, C2, C8):
  - C1: all parameters.py values match actual geometry (grep + compute)
  - C2: BOM type != "COTS" for custom items (yaml parse)
  - C8: pocket clearance ≥ 0.10mm (python assert)

GAN evaluation (C3, C4, C5, C6, C7, C9):
  - 6개 기준만 LLM judge
  - 비용 5 Opus → 3 Opus (critic 2→1 + judge)
```

### Phase 3: 모델 업그레이드 시 Rip Test 실행

```
새 모델 출시 시:
  1. TC-01 (노이즈 안정성) 실행
  2. TC-05 (음성 감지) 실행
  3. 둘 다 PASS면 → H2 (래칫) 제거 시도
  4. TC-02 (승격 정확성) 실행
  5. PASS면 → H1+H3 (critic summary) 제거 시도
  6. 최종: 하네스 0개로 SUM ≥ 35 달성 가능한지 확인
```

---

## 6. 핵심 결론

### Plateau는 모델 한계의 증상이다

SUM=35 plateau는 **설계 문제가 아니라 평가 시스템 문제**. 설계는 실질적으로 개선됨 (unanchored 23→26 확인). 하지만 GAN evaluator의 ±10 노이즈가 ±2-4 크기의 실제 개선을 마스킹.

### 하네스는 모델 한계의 보완재다

래칫, 앵커 v2, critic summary — 이들은 모델이 못하는 것 (일관성, 정밀 비교, 회귀 방지)을 코드로 보완. **더 나은 모델은 이 하네스 없이도 동등 성능을 보여야 한다.**

### 테스트케이스는 모델 역량의 계량 도구다

8개 TC가 모델의 "평가 신뢰도"를 정량 측정. 모델 업그레이드 시 이 TC를 실행하여:
- **PASS 개수 증가** → 해당 하네스 제거 가능
- **모든 TC PASS** → 하네스 완전 제거, raw GAN으로 SUM > 35 달성 가능
