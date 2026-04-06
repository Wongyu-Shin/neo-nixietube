# Findings — Nixie Tube Amateur Manufacturing Feasibility

Ranked by priority_score descending.

---

## Finding 1: 고전압(170-200V DC) 감전 위험

**Severity:** CRITICAL
**Confidence:** HIGH
**Consensus:** 6/8 personas (VE, EE, DM, SR, DA confirm)
**Priority Score:** 3.80

**Evidence:**
동작 전압 170-200V DC는 치명적 감전 가능. DC는 AC보다 근육 경직을 유발하여 자력 이탈이 어려움. 부스트 컨버터 출력부, 노출된 전극, 미봉착 관에서 접촉 시 위험.

**Recommendation:**
- 절연 장갑 착용 필수 (전기 작업용, 500V 이상 정격)
- 전원부에 퓨즈(5mA) + 블리드 저항기 장착
- 테스트 시 한 손만 사용(one-hand rule) — 심장 경로 회피
- 전류 제한을 5mA 이하로 하드웨어 수준에서 강제
- 비상 차단 스위치 설치

**비협상 안전 장비:**
| 항목 | 예상 비용 |
|------|----------|
| 보안경 | ₩10,000 |
| 절연 장갑 (Class 0, 500V) | ₩30,000 |
| 소화기 (ABC형) | ₩30,000 |
| 내화 매트 | ₩20,000 |
| **소계** | **₩90,000** |

---

## Finding 2: 네온사인 기술자 협업이 프로젝트 성패를 좌우

**Severity:** KEY ENABLER
**Confidence:** HIGH
**Consensus:** 7/8 personas confirm (DA: 조건부 동의)

**Evidence:**
서울 을지로/세운상가 일대에 전통 네온사인 기술자 존재(추정 10명 미만, 감소 추세). 이들이 보유한 스킬셋:
- 보로실리케이트/소다라임 유리 토치 가공 및 벤딩
- 유리-금속 봉착 (Housekeeper seal)
- 진공 배기 및 가스 봉입 장비
- 배기관 팁오프

이것은 닉시관 제조 공정의 70-80%와 겹침.

**Recommendation:**
- **즉시 행동**: 을지로 네온사인 업체 방문 (추천: 을지로3가~4가 일대)
- **목표**: 외주가 아닌 기술 이전/멘토링 관계 구축
- **대안**: 네온사인 기술자가 아닌 경우, 국내 유리 공예 학원/대학 유리공학 실험실
- **긴급성**: 네온사인 산업이 LED로 대체되며 기술자가 빠르게 사라지고 있음

---

## Finding 3: 유리-금속 봉착(Glass-to-Metal Seal)이 최대 기술적 난관

**Severity:** HIGH (네온사인 기술자 협업 시) / CRITICAL (독자 수행 시)
**Confidence:** HIGH
**Consensus:** 6/8 personas

**Evidence:**
10개 이상의 핀(0-9 숫자 음극 + 양극 + 도트)을 유리를 관통시켜 기밀 봉착해야 함.

핵심 문제:
- 열팽창계수 불일치 → 냉각 시 크랙
- Dalibor Farny도 이 공정 마스터에 2년+ 소요
- 네온사인 기술자도 초기 실패율 30-50%

**Recommendation:**
- 소다라임 유리 + 듀멧 와이어 조합 (가장 관용적)
- 초기 프로토타입: 핀 수 3-4개로 축소 (단일 숫자)
- 어닐링(응력 제거): 도자기용 전기로 활용 가능 (₩200,000-500,000)

---

## Finding 4: 진공 도달 한계

**Severity:** HIGH (PoC 기준: 10⁻⁴ Torr) / CRITICAL (상업 품질: 10⁻⁵ Torr)
**Confidence:** HIGH
**Consensus:** 5/8 personas

**Evidence:**
DIY 로터리 펌프 + 냉매 트랩 = 10⁻³~10⁻⁴ Torr 한계.
10⁻⁵ Torr 도달에는 확산펌프/터보펌프 필요 (추가 ₩500,000-1,500,000).

**Debate 결과:**
- DIY 진공관 커뮤니티에서 10⁻⁴ Torr로도 동작하는 관 제작 선례 존재
- 수명은 수백 시간으로 짧지만 PoC에 충분
- Round 3에서 CRITICAL → HIGH로 하향 합의

**Recommendation:**
- Phase 1: 중고 로터리 펌프 (₩200,000-400,000) + 피라니 게이지
- Phase 2: 중고 소형 확산펌프 추가 (성능 개선 시)
- 가스 정량 충전: 피라니 게이지 필수 (±1 Torr 정밀도면 충분)

---

## Finding 5: SWE 배경 활용 — 시뮬레이션이 경쟁력

**Severity:** HIGH (미활용 리스크)
**Confidence:** HIGH
**Consensus:** 4/8 personas (EE, DM, DA confirm)

**Evidence:**
작업자의 SWE 배경으로 활용 가능한 것들:
- 파이썬 파셴 곡선 시뮬레이터 → 최적 가스 압력/전극 간격 사전 결정
- SPICE 시뮬레이션 → 구동 회로 설계
- Arduino/RasPi → 진공 시스템 자동화 (압력 모니터링, 밸브 제어)
- 데이터 로깅 → 각 시도의 정량적 기록
- GitHub 문서화 → 커뮤니티 기여

**Recommendation:**
- Phase 0 (제작 전): 파셴 곡선 시뮬레이터 제작
- 물리적 실험 횟수를 절반으로 줄이는 효과
- 이것이 "50년간 발전된 기술"을 아마추어가 활용하는 구체적 사례

---

## Finding 6: MVP 범위를 "단일 숫자 점등"으로 축소

**Severity:** HIGH
**Confidence:** HIGH
**Consensus:** 5/8 personas

**Evidence:**
PoC 목표는 "가능한가?"이지 "상업 품질인가?"가 아님. 모든 숫자(0-9), 장수명, 균일 발광을 동시에 추구하면 영원히 완성 불가.

**Recommendation:**
MVP 정의: 단일 숫자(8 또는 0 — 가장 복잡한 형상)가 100시간 이상 안정적으로 글로우 점등되면 PoC 성공.

---

## Finding 7: 리크 디텍션 수단 부재

**Severity:** HIGH
**Confidence:** HIGH
**Consensus:** 3/8 personas (전문가 그룹)

**Evidence:**
유리-금속 봉착부 리크 레이트 허용치 <10⁻⁸ Torr·L/s. 헬륨 리크 디텍터 (₩5,000,000+)는 접근 불가.

**Recommendation (대안 3가지):**
1. 압력 유지(hold) 테스트: 10⁻⁴ Torr에서 1시간 유지 후 압력 변화 측정
2. 스파크 코일 리크 테스트: 네온사인 업계 표준 기법 (테슬라 코일로 외부에서 방전 유도, 리크 지점에서 방전 집중)
3. 방전 색상 관찰: 공기 유입 시 네온 오렌지 → 보라/분홍으로 변색

---

## Finding 8: 음극 재료 순도

**Severity:** HIGH
**Confidence:** HIGH
**Consensus:** 3/8 personas

**Evidence:**
시판 니켈의 불순물(황, 탄소)이 스퍼터링을 가속. 수명에 직접 영향.

**Recommendation:**
전해 니켈 포일(99.5%+)을 시그마알드리치 코리아 또는 알파에이사에서 구매. 소량(10×10cm) ₩20,000-50,000.

---

## Finding 9: 유리 파손/내파 위험

**Severity:** HIGH
**Confidence:** HIGH
**Consensus:** 4/8 personas

**Evidence:**
진공 유리관은 대기압(101 kPa) 압축력. 결함 시 갑작스런 내파로 파편 비산.

**Recommendation:**
진공 작업 시 항상 보안경. 메쉬 슬리브 또는 카프톤 테이프로 유리관 감싸기.

---

## Finding 10: 가스 정량 충전의 어려움

**Severity:** HIGH
**Confidence:** HIGH
**Consensus:** 4/8 personas

**Evidence:**
네온 10-30 Torr 정밀 충전 필요. 파셴 법칙에 의해 압력 범위 이탈 시 동작 불가.

**Recommendation:**
피라니 게이지(중고 ₩50,000-100,000) 필수. 또는 알려진 체적의 레저버에서 팽창법으로 정량.
