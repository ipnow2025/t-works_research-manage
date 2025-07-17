# Application 구조

Next.js + Prisma + MySQL 기반의 범용 웹 애플리케이션입니다.  
특정 기능에 종속되지 않고, 다양한 확장에 유연하게 대응할 수 있도록 범용적으로 설계된 웹 애플리케이션입니다.

---

## 핵심 목표

- 회원 기반 태스크 관리 웹서비스 개발
- 확장 가능한 범용 구조로 설계
- 모던 UI + 다크모드 + 모바일 대응

---

## 기술 스택

- Next.js (App Router 기반)
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS (다크모드 지원)
- ESM 모듈 (`"type": "module"`)

---

## 데이터베이스 테이블 스키마 생성 시 유의

> 회원 테이블은 따로 만들지 않으며, 각 테이블에 데이터 소유자를 명기하는 member_idx(varchar) 를 필히 넣는다.
> reg_date, mdy_date 는 timestamp 값을 int 로 변환해서 저장하고 필요 시 number_format 함수를 만들어 어플리케이션에서 사용한다.
> 데이터 조회 시에는 is_flag=0 인 값만 가져오도록 어플리케이션 작성 시 주의한다.
필요한 포멧으로 변경해서 사용한다.
> 기본 테이블 sql_schema
    - 인덱스 : idx (auto increment) not null
    - 인덱스 상태 : is_flag (int) not null default 0 COMMENT '1 삭제 - row를 실제 삭제하지 않고 1로 변경함.'
    - 소유자인덱스 : member_idx(varchar) null default ''
    - 필요한 컬럼 추가
    - 필요한 컬럼 추가
    - row 생성일 : reg_date (int) not null default 0 COMMENT '프로젝트 생성일 - timestamp 값을 int 로 저장해서 필요한 포멧으로 변경해서 사용한다.'
    - row 수정일 : mdy_date (int) not null default 0 COMMENT '프로젝트 수정일 - timestamp 값을 int 로 저장해서 필요한 포멧으로 변경해서 사용한다.'




## 유의사항
- lib/utils.ts는 기존 v0 코드와 충돌이 발생할 수 있으므로 절대 수정하지 않습니다.
→ 대신 lib/func.ts 파일을 만들어 커스텀 유틸 함수를 정의해주세요.
- package.json에는 반드시 "type": "module"을 추가해야 합니다.
→ 해당 파일은 외부 영향으로 초기화될 수 있으므로, 매 작업 시 덮어쓰기 여부를 확인해주세요.

- Prisma 마이그레이션은 CLI 사용 금지, SQL 스키마를 별도로 작성해 수동 실행합니다.

- 기능 추가 중 오류가 발생해도 기존 코드는 절대 삭제하지 않습니다.
→ 기존 코드는 그대로 두고, 수정 로직만 추가하거나 주석으로 구분합니다.

- 기존 코드를 정말 삭제해야 할 경우, 반드시 사전 고지 후 주석 처리하고 삭제해주세요.

- 기능이 많아질 경우, 기능 단위 디렉토리로 리팩토링합니다.
→ 디렉토리 구조 변경 시 기준과 의도를 명확히 주석이나 문서로 설명해주세요.

## 디렉토리 구조
root/
├── app/                  # Next.js App Router 라우트 디렉토리
├── components/           # 공통 UI 컴포넌트
├── lib/                  # Prisma 클라이언트 및 유틸 함수
├── node_modules/         # 의존성 모듈
├── prd/                  # 운영 관련 설정 또는 배포 스크립트 (명확한 용도 명시 권장)
├── public/               # 정적 파일 (favicon, images 등)
├── styles/               # 전역 스타일, Tailwind 설정
├── .env                  # 환경변수 파일
├── .gitignore            # Git 추적 제외 설정
├── components.js         # (단일 파일명: 향후 `components/` 폴더로 이동 권장)
├── eslint.config.mjs     # ESLint 설정 파일 (ESM 형식)
