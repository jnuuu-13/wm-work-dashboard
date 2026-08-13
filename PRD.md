# WM 신입사원 개인 업무 대시보드 PRD

## 목표

WM 신입사원이 하루의 고객 관련 일정과 업무를 확인하고, 상담·미팅·교육 과정에서 얻은 정보를 기록하며, 금융상품과 시장 관련 업무 지식을 지속적으로 축적할 수 있는 개인용 업무 대시보드를 만든다.

단순 업무관리 도구가 아니라,

일정 확인 → 업무 수행 → 상담·미팅 기록 → 후속 업무 관리 → 업무 지식 축적 → 주간 회고

로 이어지는 WM 업무 흐름을 하나의 서비스에서 관리하는 것이 목표다.

## 사용자

WM 직무 신입사원

- 출근 직후 약 5분 동안 오늘의 일정과 주요 업무 확인
- 업무 중 고객 문의, 금융상품, 시장 관련 내용을 빠르게 기록
- 고객 상담·내부 미팅·상품교육 후 핵심 내용과 Follow-up 기록
- 업무 중 궁금한 내용을 기존 기록에서 검색
- 매주 업무와 학습 내용을 회고

## 핵심 기능

### 1. Today

오늘의 일정과 WM 업무를 한눈에 확인한다.

- 오늘 날짜·현재 시간·날씨 표시
- 고객 상담 및 미팅 일정
- 상품교육·세미나 등 업무 일정
- 오늘 처리해야 할 Task
- 고객 Follow-up 업무
- 일정은 시간대별로 표시
- Task 클릭 시 해당 Task 상세 화면으로 이동

업무는 다음과 같은 유형으로 구분할 수 있다.

> Client / Product / Market / Follow-up / Internal

**Task 상세**

- 업무명
- 업무 내용
- 요청자
- 등록일
- 마감일
- 중요도
- 진행 상태
- 체크리스트
- 관련 메모
- 업무 완료 처리

### 2. Quick Note

업무 중 발생한 정보를 즉시 기록할 수 있는 간단한 메모 기능이다.

주요 기록 대상:

- 고객 질문
- 상품 관련 확인사항
- 시장 관련 메모
- 상담 아이디어
- 업무 중 새롭게 알게 된 내용
- 추후 확인해야 할 사항

메모 작성 시 작성 시간이 자동으로 저장되며, 간단하게 주제 범위를 선택하고 작성하는 방식.

예:

> #고객질문 #상품 #시장 #상담 #확인필요 #기타

저장한 Quick Note는 필요에 따라:

- Task로 전환
- Playbook에 저장
- 수정
- 삭제

할 수 있다.

### 3. Calendar

WM 업무와 관련된 주요 일정을 월간 단위로 관리한다.

홈 화면에서는 이번 달 달력을 표시하고, 일정이 있는 날짜에는 일정의 개수만큼 작은 점을 표시한다.

주요 일정 유형:

- 고객 상담
- 고객 Follow-up
- 내부 Meeting
- 상품교육
- 세미나
- 기타 업무 일정

날짜를 클릭하면 해당 날짜의 일정을 확인할 수 있다.

일정은 다음 정보를 포함한다.

- 일정명
- 날짜
- 시간
- 장소
- 일정 유형
- 간단한 메모

새로운 일정을 등록·수정·삭제할 수 있다.

### 4. Client & Team Meeting

고객 상담, 내부 미팅, 상품교육, 세미나 등 WM 업무 과정에서 발생하는 미팅 내용을 기록한다.

Meeting Type은 다음과 같이 구분한다.

> 고객상담 / 내부미팅 / 상품교육 / 세미나

**Before**

미팅 전에 필요한 내용을 정리한다.

- 미팅 목적
- 사전 확인사항
- 준비자료
- 질문할 내용

**After**

미팅이 끝난 뒤 핵심 내용을 정리한다.

- 핵심 내용
- 결정사항
- 추가 확인사항
- Follow-up
- 새롭게 배운 내용
- 데이터 연결

미팅 이후 필요한 업무는 다른 기능과 연결할 수 있다.

**Follow-up → Task로 등록**

예:
> ISA 만기 후 운용방법 추가 확인

→ 새로운 Task 생성

**새롭게 배운 내용 → Playbook에 저장**

예:
> 연금계좌 이전 시 확인해야 할 사항

→ Playbook에 업무 지식으로 저장

MVP에서는 실제 고객 이름, 계좌번호, 자산 규모 등 민감한 개인정보를 저장하지 않는다.

### 5. Weekly Review

한 주 동안 대시보드에 기록된 데이터를 기반으로 업무와 학습 내용을 정리한다.

**자동 표시**

- 이번 주 완료한 Task
- 현재 진행 중인 Task
- 이번 주 Meeting 수
- 고객 관련 업무 수
- 새롭게 저장한 Playbook 수
- 다음 주 예정 일정
- 다음 주 예정 Task

**이번 주 주요 업무**

완료된 Task와 Meeting 기록을 기반으로 이번 주 수행한 주요 업무를 확인한다.

예:

- 연금 상담자료 준비
- 고객 문의사항 확인
- 상품교육 참석
- 세미나 자료 검토

**이번 주 자주 다룬 주제**

Task, Meeting, Quick Note, Playbook 기록을 기준으로 이번 주 자주 다룬 WM 업무 주제를 확인한다.

예:

> 연금 / ISA / 채권 / 고객상담

**직접 기록**

사용자는 한 주를 돌아보며 다음 내용을 직접 작성한다.

- 이번 주 새롭게 배운 것
- 이번 주 어려웠던 것
- 다음 주 더 알아볼 것
- 다음 주 개선할 것

Weekly Review는 단순한 업무 통계가 아니라 신입 WM으로서 업무 경험과 학습 내용을 축적하는 주간 회고 공간으로 활용한다.

### 6. Playbook

업무 과정에서 축적한 금융 및 WM 관련 지식을 검색하고 관리하는 개인 업무 데이터베이스다.

홈 화면에는 검색창을 중심으로 구성한다.

예:

> 🔎 ISA 계좌이전

검색 시 저장된 Playbook뿐만 아니라 관련된 Meeting 및 Quick Note 기록도 함께 확인할 수 있도록 한다.

**주요 카테고리**

- 금융상품
  - 주식
  - ETF
  - 채권
  - 펀드
  - 랩
- 계좌·세금
  - ISA
  - IRP
  - 연금저축
  - CMA
- 시장
  - 금리
  - 환율
  - 주식시장
  - 거시경제
- 상담
  - 고객 질문
  - 상담 표현
  - 니즈 파악
  - Follow-up
- 업무 프로세스
  - 업무 처리 절차
  - 내부 시스템 사용법
  - 확인사항
  - 반복 업무

**검색 결과 예시**

ISA 이전 검색

- Playbook: ISA 계좌 이전 절차
- Client & Team Meeting: 8월 11일 상품교육에서 ISA 이전 관련 기록
- Quick Note: ISA 이전 시 세제 관련 추가 확인 필요

Playbook을 별도의 단순 메모장이 아니라 업무 과정에서 축적된 정보를 다시 찾을 수 있는 개인 WM 지식 데이터베이스로 활용한다.

## 홈 화면 구성

홈 화면에는 총 6개의 영역을 배치한다.

**상단**: Today | Quick Note

- Today: 날짜·시간·날씨·오늘 일정·오늘 Task
- Quick Note: 업무 중 빠르게 메모 작성

**중단**: Calendar | Client & Team Meeting

- Calendar: 이번 달 일정 확인
- Client & Team Meeting: 오늘 또는 가장 가까운 미팅 요약

**하단**: Weekly Review | Playbook

- Weekly Review: 이번 주 업무 및 학습 내용 요약
- Playbook: 업무 지식 검색

## 주요 데이터 구조

### Tasks

- title
- description
- requester
- task_type
- due_date
- priority
- status
- checklist
- memo
- created_at
- completed_at

### Quick Notes

- content
- tag
- created_at
- linked_task
- linked_playbook

### Events

- title
- date
- time
- location
- event_type
- description

### Meetings

- title
- meeting_type
- date
- time
- participants
- purpose
- preparation
- questions
- notes
- key_points
- decisions
- follow_up
- learnings

### Playbook

- title
- category
- keywords
- content
- source
- created_at
- updated_at

### Weekly Reviews

- week
- completed_tasks
- ongoing_tasks
- meeting_count
- client_activity_count
- upcoming_tasks
- learnings
- difficulties
- further_study
- improvements

## 화면 간 연결

- Today의 업무 → Task 상세
- Quick Note → Task 또는 Playbook
- Calendar의 일정 → 일정 상세 또는 Client & Team Meeting
- Client & Team Meeting의 Follow-up → Task
- Client & Team Meeting의 학습 내용 → Playbook
- Task + Calendar + Client & Team Meeting → Weekly Review
- Playbook → Playbook + Client & Team Meeting + Quick Note 통합 검색

## 서비스 핵심 흐름

1. Today → 오늘의 고객 일정과 업무 확인
2. Quick Note / Client & Team Meeting → 업무 과정에서 정보 기록
3. Task → Follow-up 및 실제 업무 수행
4. Playbook → 배운 금융·상품·상담·업무 지식 축적
5. Weekly Review → 한 주의 업무와 WM 역량 성장 회고

## 제외 범위

이번 MVP에서는 다음 기능은 포함하지 않는다.

- 실제 고객 개인정보 및 계좌정보 저장
- 실제 고객 자산관리 기능
- 금융상품 매매 기능
- 실시간 주가·시세 연동
- 회사 내부 시스템 연동
- Outlook 및 사내 Calendar 자동 연동
- 다중 사용자 및 팀 협업
- 모바일 앱
- 복잡한 권한 관리
- AI 기반 투자상품 추천 및 투자 판단

## 기술 구성

- Claude Code를 활용한 바이브 코딩
- GitHub를 통한 소스코드 및 버전 관리
- Supabase를 통한 Task, Meeting, Quick Note, Playbook 등 데이터 저장
- Vercel을 통한 웹 서비스 배포

## 검증 기준

브라우저에서 다음 기능이 정상적으로 동작하면 1차 MVP가 완성된 것으로 판단한다.

1. Today에서 오늘의 일정과 Task를 확인할 수 있다.
2. Task를 등록·수정·완료할 수 있다.
3. Quick Note를 작성하고 저장할 수 있다.
4. Calendar에서 날짜별 일정을 등록하고 확인할 수 있다.
5. Client & Team Meeting을 등록하고 미팅 내용을 기록할 수 있다.
6. Client & Team Meeting에서 발생한 Follow-up을 Task로 전환할 수 있다.
7. 업무 과정에서 배운 내용을 Playbook에 저장할 수 있다.
8. Playbook에서 업무 관련 키워드를 검색할 수 있다.
9. 관련된 Playbook, Client & Team Meeting, Quick Note 기록을 검색 결과에서 확인할 수 있다.
10. 이번 주 Task·Meeting·학습 기록이 Weekly Review에 자동으로 정리된다.
