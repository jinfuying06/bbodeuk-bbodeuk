# AGENTS.md

## 1. 프로젝트 개요

이 프로젝트는 청소 기록 서비스 **“뽀득뽀득”**의 모바일 웹 MVP이다.

이번 프로젝트의 목적은 완성형 서비스를 개발하는 것이 아니라,
핵심 UX를 실제로 조작할 수 있는 **Usability Test용 인터랙티브 프로토타입**을 만드는 것이다.

따라서 기능의 양보다 다음을 우선한다.

* 기존 화면 목업을 최대한 정확하게 구현하는 것
* 핵심 사용자 흐름이 실제로 동작하는 것
* 모바일 환경에서 자연스럽게 사용할 수 있는 것
* GitHub Pages를 통해 실제 URL로 접근할 수 있는 것

---

## 2. 프로젝트 작업 방식

현재 Repository에는 프로젝트의 기본 구조와 참고 자료만 존재할 수 있다.

Codex는 작업 시작 시 반드시 현재 Repository 전체 구조를 먼저 확인한다.

프로젝트가 아직 React/Vite 프로젝트로 초기화되지 않은 경우,
Codex가 필요한 개발 환경을 구성한다.

기존 코드를 무조건 유지하려고 하지 말고,
현재 Repository 상태를 먼저 분석한 뒤 MVP 구현에 필요한 최소한의 구조를 만든다.

단, `/mockups`에 존재하는 화면 코드는 단순 참고자료가 아니라
**현재 UI를 구현하기 위한 가장 중요한 시각적 레퍼런스**로 취급한다.

---

## 3. 기술 스택

기본 기술 스택은 다음과 같다.

* React
* TypeScript
* Vite
* Tailwind CSS
* npm
* GitHub Pages

별도의 서버는 사용하지 않는다.

다른 프레임워크나 라이브러리가 반드시 필요한 경우가 아니라면
임의로 기술 스택을 추가하거나 변경하지 않는다.

특히 다음은 사용하지 않는다.

* Next.js
* 별도의 Backend Framework
* Database
* 외부 상태관리 라이브러리
* 불필요한 UI Framework

간단한 상태 관리는 React state를 우선한다.

필요한 경우에만 localStorage를 사용할 수 있다.

---

## 4. 대상 환경

이 프로젝트는 **모바일 우선 웹 애플리케이션**이다.

기준 화면 크기:

* Width: 390px
* Height: 844px

모바일 브라우저에서 실제 앱처럼 자연스럽게 사용할 수 있어야 한다.

다음 항목을 고려한다.

* Safe Area
* 고정 Header / Bottom Navigation
* 모바일 스크롤
* 터치 인터랙션
* 충분한 터치 영역
* 화면 높이에 따른 레이아웃 변화

터치 가능한 주요 요소는 가능하면 최소 44px 이상의 영역을 확보한다.

데스크톱 환경에서는 모바일 UI가 지나치게 넓어지지 않도록
적절한 최대 너비를 적용하고 중앙 정렬한다.

---

## 5. UI 구현 우선순위

UI를 구현하거나 수정할 때 다음 우선순위를 따른다.

### 1순위: `/mockups`

기존 화면 목업의 레이아웃, 정보 구조, 구성 요소, 시각적 인상을 최대한 유지한다.

### 2순위: `DESIGN.md`

색상, Typography, Spacing, Radius, Component Style 등
공통 디자인 규칙은 DESIGN.md를 따른다.

### 3순위: 기존 구현

이미 React Component 등으로 구현된 요소가 존재하고
목업 및 DESIGN.md와 충돌하지 않는다면 재사용한다.

### 4순위: Codex의 판단

위 자료에서 정의되지 않은 부분에 한해서만
제품의 기존 디자인 언어를 해치지 않는 범위에서 판단한다.

---

## 6. 디자인 변경 원칙

Codex의 목적은 새로운 디자인을 만드는 것이 아니다.

기존 UI를 임의로 다음과 같이 변경하지 않는다.

* 레이아웃 재설계
* 색상 체계 변경
* 새로운 디자인 스타일 적용
* 카드 디자인 변경
* Typography 체계 변경
* Navigation 구조 변경
* 정보 구조 변경

기존 목업과 DESIGN.md가 충돌하는 경우에는
DESIGN.md의 공통 디자인 규칙을 우선한다.

단, 목업의 전체적인 화면 구조와 사용 흐름은 유지한다.

디자인 개선이 필요해 보이더라도
MVP 검증에 필요하지 않다면 임의로 변경하지 않는다.

---

## 7. 목업 코드 사용 원칙

`/mockups` 안의 코드는 기존 화면 디자인을 보여주기 위한 원본 자료이다.

Codex는 목업 파일을 직접 제품 코드로 사용하기보다,
필요한 UI와 인터랙션을 분석하여 React Component로 변환한다.

원본 목업 파일은 가능한 한 수정하지 않는다.

목업 코드에 포함된 다음 요소는 반드시 확인한다.

* Layout
* Typography
* Color
* Spacing
* Icon
* Card 구조
* Header
* Bottom Navigation
* Button
* 상태 표현
* JavaScript Interaction
* Toast
* Selection
* Feedback Animation

목업에 이미 구현된 유효한 인터랙션이 있다면
React로 전환할 때 최대한 동일한 경험을 유지한다.

---

## 8. MVP 범위

이번 프로젝트에서는 지정된 **3개의 핵심 화면만 실제 동작하도록 구현한다.**

Codex는 작업 요청 또는 프로젝트 문서에 명시된
3개의 MVP 화면을 기준으로 구현한다.

화면에 다른 메뉴나 기능이 시각적으로 존재하더라도
MVP 범위에 포함되지 않은 화면까지 구현하지 않는다.

예를 들어 Bottom Navigation에 다음과 같은 메뉴가 존재하더라도

* 홈
* 공간
* 기록
* 히스토리
* 케어

현재 MVP 검증에 사용하지 않는 화면은
실제 기능을 구현하지 않아도 된다.

---

## 9. MVP에서 제외되는 기능

현재 단계에서는 다음 기능을 구현하지 않는다.

* 로그인
* 회원가입
* 실제 사용자 계정
* Backend
* Database
* 실제 API
* 결제
* 구독
* Push Notification
* 실제 알림 시스템
* 계정 관리
* 서버 인증
* 관리자 페이지
* Analytics 연동

목업에 해당 UI가 포함되어 있더라도
MVP 시나리오에 필요하지 않으면 기능을 연결하지 않는다.

---

## 10. 사용자 인터랙션

MVP는 단순한 정적 화면이 아니다.

Usability Test를 위해 핵심 사용자 행동은 실제로 동작해야 한다.

예:

* 버튼 터치
* 화면 이동
* Item 선택
* 상태 변경
* 기록 완료
* 완료 Feedback
* Toast 표시
* 선택 상태 표시
* 필요한 경우 실행 취소
* 이전 화면으로 이동

단, 실제 서버에 저장할 필요는 없다.

React state 또는 mock data를 활용한다.

---

## 11. 상태 관리

MVP에서 필요한 데이터는 mock data로 구성한다.

복잡한 상태관리 시스템을 만들지 않는다.

우선순위:

1. Component state
2. React Context가 정말 필요한 경우에만 Context
3. 필요한 경우 localStorage

Redux, Zustand 등의 외부 상태관리 라이브러리는
명확한 필요성이 없는 한 추가하지 않는다.

---

## 12. Component 구성 원칙

반복되는 UI는 적절하게 Component로 분리한다.

예:

* AppHeader
* BottomNavigation
* SpaceCard
* CleaningItemCard
* StatusBadge
* QuickRecordCard
* Toast

그러나 MVP 규모에 비해 지나치게 복잡한 추상화는 만들지 않는다.

다음과 같은 구조는 피한다.

* 의미 없는 Wrapper Component 증가
* 필요 이상의 Generic Component
* 과도한 Design System 구축
* 작은 MVP에 불필요한 Architecture 패턴

코드는 다른 사람이 쉽게 이해하고 수정할 수 있어야 한다.

---

## 13. 파일 구조

React/Vite 프로젝트를 구성할 경우 기본적으로 다음 구조를 권장한다.

```text
/
├─ mockups/
│  ├─ ...
│
├─ public/
│
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ data/
│  ├─ pages/
│  ├─ styles/
│  ├─ App.tsx
│  └─ main.tsx
│
├─ .github/
│  └─ workflows/
│
├─ AGENTS.md
├─ DESIGN.md
├─ README.md
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

프로젝트 상황에 따라 일부 구조는 조정할 수 있다.

불필요한 빈 폴더를 유지할 필요는 없다.

---

## 14. Routing

세 개의 MVP 화면 간 이동이 필요한 경우 Routing을 구현한다.

GitHub Pages 호환성을 최우선으로 고려한다.

이번 MVP에서는 특별한 이유가 없다면 `HashRouter` 사용을 우선한다.

예:

```text
/#/
/#/quick-record
/#/space
```

GitHub Pages에서 직접 URL 접근 또는 새로고침 시
404 오류가 발생하지 않아야 한다.

---

## 15. GitHub Pages 배포

최종 MVP는 GitHub Pages를 통해 접근 가능해야 한다.

Codex는 GitHub Pages 배포를 위한 설정까지 구현한다.

기본 방식:

* GitHub Actions 사용
* main 브랜치 기준
* Vite build 사용
* `dist` 배포
* Repository 하위 경로 대응

필요한 경우 다음 파일을 생성한다.

```text
.github/workflows/deploy.yml
```

또한 `vite.config.ts`의 `base` 설정이
현재 GitHub Repository 구조와 맞는지 확인한다.

Repository가 다음 형식이라면:

```text
https://github.com/<username>/<repository>
```

GitHub Pages 주소는 일반적으로 다음 구조를 고려한다.

```text
https://<username>.github.io/<repository>/
```

단, 실제 Repository 정보를 확인한 후 설정하며
사용자명이나 Repository 이름을 추측하지 않는다.

---

## 16. GitHub 작업 원칙

Codex는 현재 Git Repository 상태를 먼저 확인한다.

작업 전 확인:

```bash
git status
git branch
git remote -v
```

기존 사용자 작업을 임의로 삭제하거나 덮어쓰지 않는다.

다음 작업은 사용자 요청이 있거나 현재 작업 범위에 포함된 경우에만 수행한다.

* commit
* push
* branch 생성
* merge

강제 push는 하지 않는다.

```bash
git push --force
```

는 사용하지 않는다.

---

## 17. 개발 및 검증

기능 구현 후에는 반드시 실행 가능한 상태인지 확인한다.

최소한 다음을 검증한다.

### 개발 환경

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

`npm run build`가 실패한 상태에서 작업을 완료했다고 판단하지 않는다.

가능한 경우 다음도 확인한다.

* TypeScript Error
* Broken Import
* Missing Asset
* 잘못된 Route
* 모바일 Layout Overflow
* GitHub Pages base path
* 화면 간 Navigation
* 주요 Interaction

---

## 18. 작업 시작 절차

Codex가 처음 이 Repository에서 작업할 경우 다음 순서를 따른다.

1. `AGENTS.md`를 읽는다.
2. `DESIGN.md`를 읽는다.
3. Repository 전체 구조를 확인한다.
4. `/mockups`에 있는 기존 화면 코드를 확인한다.
5. 현재 프로젝트의 기술적 상태를 파악한다.
6. 기존 코드를 수정하기 전에 구현 계획을 세운다.
7. MVP 범위에 필요한 최소한의 작업만 수행한다.

사용자가 별도로 “바로 구현해달라”고 요청하지 않은 경우에는
대규모 수정 전에 간단한 구현 계획을 먼저 제시한다.

---

## 19. 작업 범위 보호

가장 중요한 원칙이다.

**현재 MVP에 필요하지 않은 기능을 추가하지 않는다.**

Codex가 더 좋은 아이디어를 발견했더라도
임의로 범위를 확장하지 않는다.

예:

* 새로운 페이지 추가
* 새로운 Navigation 추가
* 새로운 기능 추가
* 새로운 디자인 시스템 도입
* Backend 도입
* Animation Library 추가
* Analytics 추가

필요성이 있다고 판단되면
구현하지 말고 먼저 제안한다.

---

## 20. 최종 목표

이 프로젝트의 성공 기준은 코드의 규모가 아니다.

다음 조건을 만족하면 된다.

1. 기존 목업과 시각적으로 충분히 유사하다.
2. DESIGN.md의 디자인 규칙을 따른다.
3. 지정된 3개 화면이 정상적으로 표시된다.
4. 핵심 사용자 시나리오가 실제로 동작한다.
5. 모바일 환경에서 자연스럽게 사용할 수 있다.
6. Production Build가 성공한다.
7. GitHub Pages에서 실제 URL로 접속할 수 있다.

**완성형 서비스가 아니라 사용성 검증이 가능한 작은 MVP를 만든다.**